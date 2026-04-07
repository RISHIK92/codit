package proxy

import (
	"encoding/json"
	"net/http"

	"gateway/pkg/pb"

	"google.golang.org/grpc/status"
)

func CreateUserProjectProxy(grpcClient pb.UserProjectServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")

		var requestBody struct {
			ProjectID    string `json:"projectId"`
			Status       string `json:"status"`
			CurrentPhase int32  `json:"currentPhase"`
		}

		if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}

		grpcReq := &pb.CreateUserProjectRequest{
			ProjectId:    requestBody.ProjectID,
			Email:        email,
			Status:       requestBody.Status,
			CurrentPhase: requestBody.CurrentPhase,
		}

		grpcRes, err := grpcClient.CreateProject(r.Context(), grpcReq)
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

func GetUserProjectByIdProxy(grpcClient pb.UserProjectServiceClient) http.HandlerFunc {
	return func (w http.ResponseWriter, r *http.Request)  {
		projectId := r.URL.Query().Get("projectId")
		if projectId == "" {
			http.Error(w, "Project ID is required", http.StatusBadRequest)
			return
		}

		grpcReq := &pb.GetUserProjectByIdRequest{
			ProjectId: projectId,
		}

		grpcRes, err := grpcClient.GetUserProjectById(r.Context(), grpcReq)
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

func GetAllUserProjectsProxy(grpcClient pb.UserProjectServiceClient) http.HandlerFunc {
	return func (w http.ResponseWriter, r *http.Request)  {
		email := r.Header.Get("X-User-Email")
		if email == "" {
			http.Error(w, "Email is required", http.StatusBadRequest)
			return
		}

		grpcReq := &pb.GetAllUserProjectsRequest{
			Email: email,
		}

		grpcRes, err := grpcClient.GetAllUserProjects(r.Context(), grpcReq)
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