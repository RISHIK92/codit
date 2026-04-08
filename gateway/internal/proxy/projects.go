package proxy

import (
	"encoding/json"
	"net/http"

	"gateway/pkg/pb"

	"google.golang.org/grpc/status"
)

// GetAllProjectsProxy forwards GET /public/api/projects/get-all to the user-service
// ProjectService.GetAllProjects RPC. No auth required — this is a public catalogue.
func GetAllProjectsProxy(grpcClient pb.ProjectServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		grpcRes, err := grpcClient.GetAllProjects(r.Context(), &pb.GetAllProjectsRequest{})
		if err != nil {
			st, _ := status.FromError(err)
			http.Error(w, st.Message(), grpcCodeToHTTP(st.Code()))
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(grpcRes)
	}
}

// GetProjectByIdProxy forwards GET /public/api/projects/get?projectId= to the user-service
// ProjectService.GetProjectById RPC. No auth required.
func GetProjectByIdProxy(grpcClient pb.ProjectServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		projectId := r.URL.Query().Get("projectId")
		if projectId == "" {
			http.Error(w, "projectId query param is required", http.StatusBadRequest)
			return
		}

		grpcRes, err := grpcClient.GetProjectById(r.Context(), &pb.GetProjectByIdRequest{
			ProjectId: projectId,
		})
		if err != nil {
			st, _ := status.FromError(err)
			http.Error(w, st.Message(), grpcCodeToHTTP(st.Code()))
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(grpcRes)
	}
}
