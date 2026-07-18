package proxy

import (
	"encoding/json"
	"net/http"

	"gateway/pkg/pb"

	"google.golang.org/grpc/status"
)

// ── Chat ──────────────────────────────────────────────────────────────────────

// ChatProxy handles POST /api/ai/chat
// Body: { "projectId": "...", "phaseId": "...", "activeFilePath": "...", "message": "...", "history": [{ "role": "...", "content": "..." }], "mode": "chat" | "explain" }
func ChatProxy(client pb.AiServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")

		var body struct {
			ProjectId      string `json:"projectId"`
			PhaseId        string `json:"phaseId"`
			ActiveFilePath string `json:"activeFilePath"`
			Message        string `json:"message"`
			Mode           string `json:"mode"`
			History        []struct {
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

		res, err := client.Chat(r.Context(), &pb.ChatRequest{
			UserEmail:      email,
			ProjectId:      body.ProjectId,
			PhaseId:        body.PhaseId,
			ActiveFilePath: body.ActiveFilePath,
			Message:        body.Message,
			History:        history,
			Mode:           body.Mode,
		})
		if err != nil {
			st, _ := status.FromError(err)
			http.Error(w, st.Message(), grpcCodeToHTTP(st.Code()))
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
	}
}
