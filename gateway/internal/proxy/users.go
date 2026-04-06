package proxy

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gateway/pkg/pb"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func LoginUserProxy(grpcClient pb.UserServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		uid := r.Header.Get("X-User-Id")
		email := r.Header.Get("X-User-Email")
		name := r.Header.Get("X-User-Name")

		var requestBody struct {
			Bio string `json:"bio"`
		}
		
		if r.Body != nil {
			if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
				http.Error(w, "Invalid JSON body", http.StatusBadRequest)
				return
			}
		}

		grpcReq := &pb.LoginUserRequest{
			Uid:   uid,
			Email: email,
			Name:  name,
			Bio:   requestBody.Bio,
		}
		grpcRes, err := grpcClient.LoginUser(r.Context(), grpcReq)
		if err != nil {
			st, _ := status.FromError(err)
			if st.Code() == codes.AlreadyExists {
				http.Error(w, st.Message(), http.StatusConflict)
				return
			}
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(grpcRes)
	}
}

func HealthCheckProxy(grpcClient pb.UserServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		grpcRes, err := grpcClient.HealthCheck(r.Context(), &pb.HealthCheckRequest{})
		if err!=nil {
			st, _ := status.FromError(err)
			if st.Code() == codes.Unimplemented {
				http.Error(w, st.Message(), http.StatusNotImplemented)
				return
			}
			fmt.Println(err, "error")
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(grpcRes)
	}
}