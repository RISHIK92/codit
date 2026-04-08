package router

import (
	"gateway/internal/config"
	customMiddleware "gateway/internal/middleware"
	"gateway/internal/proxy"
	"gateway/pkg/pb"
	"log"
	"net/http"

	firebase "firebase.google.com/go/v4"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func New(app *firebase.App, cfg *config.Config) *chi.Mux {
	r := chi.NewMux()

	conn, err := grpc.NewClient(cfg.UserServiceUrl, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect to User Service: %v", err)
	}

	userClient := pb.NewUserServiceClient(conn)
	userProjectClient := pb.NewUserProjectServiceClient(conn)

	r.Use(customMiddleware.CORS)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Route("/public", func(r chi.Router) {
		r.Get("/health", healthCheck)
		r.Get("/api/users/health", proxy.HealthCheckProxy(userClient))
	})

	r.Group(func(r chi.Router) {
		r.Use(customMiddleware.RequireAuth(app))
		r.Post("/api/users/login", proxy.LoginUserProxy(userClient))
		r.Post("/api/user-projects/create", proxy.CreateUserProjectProxy(userProjectClient))
		r.Get("/api/user-projects/get", proxy.GetUserProjectByIdProxy(userProjectClient))
		r.Get("/api/user-projects/get-all", proxy.GetAllUserProjectsProxy(userProjectClient))
	})

	return r
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"ok"}`))
}