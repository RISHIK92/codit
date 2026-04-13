package proxy

import (
	"encoding/json"
	"net/http"

	"gateway/pkg/pb"

	"google.golang.org/grpc/status"
)

// ── GetPhaseResources ─────────────────────────────────────────────────────────

// GetPhaseResourcesProxy handles GET /api/resources?phaseId=&projectId=
func GetPhaseResourcesProxy(client pb.ResourceProgressServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")
		phaseId := r.URL.Query().Get("phaseId")
		projectId := r.URL.Query().Get("projectId")
		if phaseId == "" || projectId == "" {
			http.Error(w, "phaseId and projectId query params are required", http.StatusBadRequest)
			return
		}

		res, err := client.GetPhaseResources(r.Context(), &pb.GetPhaseResourcesRequest{
			PhaseId:   phaseId,
			UserEmail: email,
			ProjectId: projectId,
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

// ── MarkCompleted ─────────────────────────────────────────────────────────────

// MarkCompletedProxy handles POST /api/resources/progress
// Body: { "resourceId": "...", "projectId": "...", "completed": true }
func MarkCompletedProxy(client pb.ResourceProgressServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")

		var body struct {
			ResourceId string `json:"resourceId"`
			ProjectId  string `json:"projectId"`
			Completed  bool   `json:"completed"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}
		if body.ResourceId == "" || body.ProjectId == "" {
			http.Error(w, "resourceId and projectId are required", http.StatusBadRequest)
			return
		}

		res, err := client.MarkCompleted(r.Context(), &pb.MarkCompletedRequest{
			ResourceId: body.ResourceId,
			UserEmail:  email,
			ProjectId:  body.ProjectId,
			Completed:  body.Completed,
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

// ── GetProgress ───────────────────────────────────────────────────────────────

// GetProgressProxy handles GET /api/resources/progress?projectId=
func GetProgressProxy(client pb.ResourceProgressServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")
		projectId := r.URL.Query().Get("projectId")
		if projectId == "" {
			http.Error(w, "projectId query param is required", http.StatusBadRequest)
			return
		}

		res, err := client.GetProgress(r.Context(), &pb.GetProgressRequest{
			UserEmail: email,
			ProjectId: projectId,
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
