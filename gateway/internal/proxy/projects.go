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

// GetProjectWithPhasesProxy forwards GET /api/projects/detail?projectId=
// to ProjectService.GetProjectWithPhases. Auth-protected — uses X-User-Email
// injected by the auth middleware to compute locked / already_started flags
// by also querying the user's existing projects from UserProjectService.
func GetProjectWithPhasesProxy(
	projectClient pb.ProjectServiceClient,
	userProjectClient pb.UserProjectServiceClient,
) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		projectId := r.URL.Query().Get("projectId")
		if projectId == "" {
			http.Error(w, "projectId query param is required", http.StatusBadRequest)
			return
		}

		email := r.Header.Get("X-User-Email")

		// Fetch project + phases from ProjectService
		grpcRes, err := projectClient.GetProjectWithPhases(r.Context(), &pb.GetProjectWithPhasesRequest{
			ProjectId: projectId,
			Email:     email,
		})
		if err != nil {
			st, _ := status.FromError(err)
			http.Error(w, st.Message(), grpcCodeToHTTP(st.Code()))
			return
		}

		// When the caller is authenticated, enrich with lock state
		if email != "" {
			upRes, upErr := userProjectClient.GetAllUserProjects(r.Context(), &pb.GetAllUserProjectsRequest{
				Email: email,
			})
			if upErr == nil && upRes != nil {
				for _, up := range upRes.UserProjects {
					if up.ProjectId == projectId {
						grpcRes.AlreadyStarted = true
					} else if up.Status == "in_progress" {
						grpcRes.Locked = true
					}
				}
			}
			// If user already has this project, it is never "locked" for them
			if grpcRes.AlreadyStarted {
				grpcRes.Locked = false
			}
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(grpcRes)
	}
}
