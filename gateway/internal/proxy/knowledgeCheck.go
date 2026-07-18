package proxy

import (
	"encoding/json"
	"net/http"

	"gateway/pkg/pb"

	"google.golang.org/grpc/status"
)

// ── GetPhaseKnowledgeChecks ────────────────────────────────────────────────────

// GetPhaseKnowledgeChecksProxy handles GET /api/knowledge-checks?phaseId=
func GetPhaseKnowledgeChecksProxy(client pb.KnowledgeCheckServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")
		phaseId := r.URL.Query().Get("phaseId")
		if phaseId == "" {
			http.Error(w, "phaseId query param is required", http.StatusBadRequest)
			return
		}

		res, err := client.GetPhaseKnowledgeChecks(r.Context(), &pb.GetPhaseKnowledgeChecksRequest{
			PhaseId:   phaseId,
			UserEmail: email,
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

// ── SubmitAnswer ──────────────────────────────────────────────────────────────

// SubmitAnswerProxy handles POST /api/knowledge-checks/submit
// Body: { "knowledgeCheckId": "...", "projectId": "...", "answer": "..." }
func SubmitAnswerProxy(client pb.KnowledgeCheckServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")

		var body struct {
			KnowledgeCheckId string `json:"knowledgeCheckId"`
			ProjectId        string `json:"projectId"`
			Answer           string `json:"answer"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}
		if body.KnowledgeCheckId == "" || body.ProjectId == "" {
			http.Error(w, "knowledgeCheckId and projectId are required", http.StatusBadRequest)
			return
		}

		res, err := client.SubmitAnswer(r.Context(), &pb.SubmitAnswerRequest{
			KnowledgeCheckId: body.KnowledgeCheckId,
			UserEmail:        email,
			ProjectId:        body.ProjectId,
			Answer:           body.Answer,
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

// ── GetQuizAverages ───────────────────────────────────────────────────────────

// GetQuizAveragesProxy handles GET /api/knowledge-checks/quiz-averages
func GetQuizAveragesProxy(client pb.KnowledgeCheckServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")

		res, err := client.GetQuizAverages(r.Context(), &pb.GetQuizAveragesRequest{
			UserEmail: email,
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
