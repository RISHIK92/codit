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
	return func(w http.ResponseWriter, r *http.Request) {
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

// SetUserProjectArchivedProxy forwards POST /api/user-projects/archive to
// UserProjectService.SetUserProjectArchived. Body: { "projectId": "...", "archived": true|false }
func SetUserProjectArchivedProxy(grpcClient pb.UserProjectServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")

		var requestBody struct {
			ProjectID string `json:"projectId"`
			Archived  bool   `json:"archived"`
		}

		if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}
		if requestBody.ProjectID == "" {
			http.Error(w, "projectId is required", http.StatusBadRequest)
			return
		}

		grpcReq := &pb.SetUserProjectArchivedRequest{
			ProjectId: requestBody.ProjectID,
			Email:     email,
			Archived:  requestBody.Archived,
		}

		grpcRes, err := grpcClient.SetUserProjectArchived(r.Context(), grpcReq)
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

// SubmitPhaseReviewProxy forwards POST /api/user-projects/submit-review to
// UserProjectService.SubmitPhaseReview. Body: { "projectId": "...",
// "activeFilePath": "..." }
//
// There is deliberately no "advance phase" route. Advancement happens only as
// a result of grading, inside this call — an endpoint that advanced on request
// would let any authenticated caller skip the work it exists to verify.
//
// Note that email comes from X-User-Email, which the auth middleware sets from
// the verified Firebase token — never from the body — so a caller can only ever
// submit their own enrollment.
func SubmitPhaseReviewProxy(grpcClient pb.UserProjectServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")
		if email == "" {
			http.Error(w, "Email is required", http.StatusBadRequest)
			return
		}

		var requestBody struct {
			ProjectID      string `json:"projectId"`
			ActiveFilePath string `json:"activeFilePath"`
		}

		if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}
		if requestBody.ProjectID == "" {
			http.Error(w, "projectId is required", http.StatusBadRequest)
			return
		}

		grpcReq := &pb.SubmitPhaseReviewRequest{
			ProjectId:      requestBody.ProjectID,
			Email:          email,
			ActiveFilePath: requestBody.ActiveFilePath,
		}

		grpcRes, err := grpcClient.SubmitPhaseReview(r.Context(), grpcReq)
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

func GetUserProjectsByStatusProxy(grpcClient pb.UserProjectServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")
		if email == "" {
			http.Error(w, "Email is required", http.StatusBadRequest)
			return
		}

		statusParam := r.URL.Query().Get("status")
		if statusParam == "" {
			http.Error(w, "status query param is required", http.StatusBadRequest)
			return
		}

		grpcReq := &pb.GetUserProjectsByStatusRequest{
			Email:  email,
			Status: statusParam,
		}

		grpcRes, err := grpcClient.GetUserProjectsByStatus(r.Context(), grpcReq)
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