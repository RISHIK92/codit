package proxy

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"gateway/pkg/pb"

	"google.golang.org/grpc/status"
)

// ── Chat ──────────────────────────────────────────────────────────────────────

// ChatProxy handles POST /api/ai/chat
// Body: { "projectId": "...", "phaseId": "...", "activeFilePath": "...", "message": "...", "history": [{ "role": "...", "content": "..." }], "mode": "chat" | "explain" | "review", "currentTask": "...", "snapshotPhaseNumber": 0 }
// Streams the reply back as it's generated — the response body is plain text,
// one chunk per flush, not a single JSON object.
func ChatProxy(client pb.AiServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")

		var body struct {
			ProjectId           string `json:"projectId"`
			PhaseId             string `json:"phaseId"`
			ActiveFilePath      string `json:"activeFilePath"`
			Message             string `json:"message"`
			Mode                string `json:"mode"`
			CurrentTask         string `json:"currentTask"`
			SnapshotPhaseNumber int32  `json:"snapshotPhaseNumber"`
			History             []struct {
				Role    string `json:"role"`
				Content string `json:"content"`
			} `json:"history"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}
		if body.ProjectId == "" || body.Message == "" {
			http.Error(w, "projectId and message are required", http.StatusBadRequest)
			return
		}

		history := make([]*pb.ChatMessage, 0, len(body.History))
		for _, h := range body.History {
			history = append(history, &pb.ChatMessage{Role: h.Role, Content: h.Content})
		}

		stream, err := client.Chat(withRequestID(r.Context()), &pb.ChatRequest{
			UserEmail:           email,
			ProjectId:           body.ProjectId,
			PhaseId:             body.PhaseId,
			ActiveFilePath:      body.ActiveFilePath,
			Message:             body.Message,
			History:             history,
			Mode:                body.Mode,
			CurrentTask:         body.CurrentTask,
			SnapshotPhaseNumber: body.SnapshotPhaseNumber,
		})
		if err != nil {
			st, _ := status.FromError(err)
			http.Error(w, st.Message(), grpcCodeToHTTP(st.Code()))
			return
		}

		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.Header().Set("X-Content-Type-Options", "nosniff")

		flusher, canFlush := w.(http.Flusher)
		startedBody := false

		for {
			chunk, err := stream.Recv()
			if errors.Is(err, io.EOF) {
				return
			}
			if err != nil {
				if !startedBody {
					st, _ := status.FromError(err)
					http.Error(w, st.Message(), grpcCodeToHTTP(st.Code()))
				}
				// Headers (and possibly some body) already sent — nothing more
				// we can do but stop; the client sees a truncated stream.
				return
			}
			startedBody = true
			w.Write([]byte(chunk.Reply))
			if canFlush {
				flusher.Flush()
			}
		}
	}
}
