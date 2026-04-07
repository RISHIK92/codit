package proxy

import (
	"encoding/json"
	"io"
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

		if r.Body != nil && r.Body != http.NoBody {
			if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil && err != io.EOF {
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
			http.Error(w, st.Message(), grpcCodeToHTTP(st.Code()))
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

// grpcCodeToHTTP maps gRPC status codes to semantically equivalent HTTP status codes.
func grpcCodeToHTTP(c codes.Code) int {
	switch c {
	case codes.OK:
		return http.StatusOK
	case codes.InvalidArgument:
		return http.StatusBadRequest
	case codes.NotFound:
		return http.StatusNotFound
	case codes.AlreadyExists:
		return http.StatusConflict
	case codes.PermissionDenied:
		return http.StatusForbidden
	case codes.Unauthenticated:
		return http.StatusUnauthorized
	case codes.ResourceExhausted:
		return http.StatusTooManyRequests
	case codes.Unimplemented:
		return http.StatusNotImplemented
	case codes.Unavailable:
		return http.StatusServiceUnavailable
	default:
		return http.StatusInternalServerError
	}
}