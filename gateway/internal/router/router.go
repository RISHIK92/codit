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

	conn_user, err := grpc.NewClient(cfg.UserServiceUrl, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect to User Service: %v", err)
	}

	userClient := pb.NewUserServiceClient(conn_user)
	userProjectClient := pb.NewUserProjectServiceClient(conn_user)
	projectClient := pb.NewProjectServiceClient(conn_user)
	entranceTestClient := pb.NewEntranceTestServiceClient(conn_user)
	fileClient := pb.NewFileServiceClient(conn_user)
	resourceProgressClient := pb.NewResourceProgressServiceClient(conn_user)

	r.Use(customMiddleware.CORS)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Route("/public", func(r chi.Router) {
		r.Get("/health", healthCheck)
		r.Get("/api/users/health", proxy.HealthCheckProxy(userClient))
		r.Get("/api/projects/get-all", proxy.GetAllProjectsProxy(projectClient))
		r.Get("/api/projects/get", proxy.GetProjectByIdProxy(projectClient))
	})

	r.Group(func(r chi.Router) {
		r.Use(customMiddleware.RequireAuth(app))
		r.Post("/api/users/login", proxy.LoginUserProxy(userClient))
		r.Get("/api/users/profile", proxy.GetUserProfileProxy(userClient))
		r.Post("/api/users/preferences", proxy.UpdateUserPreferencesProxy(userClient))
		r.Post("/api/user-projects/create", proxy.CreateUserProjectProxy(userProjectClient))
		r.Get("/api/user-projects/get", proxy.GetUserProjectByIdProxy(userProjectClient))
		r.Get("/api/user-projects/get-all", proxy.GetAllUserProjectsProxy(userProjectClient))
		r.Get("/api/user-projects/get-by-status", proxy.GetUserProjectsByStatusProxy(userProjectClient))
		r.Get("/api/projects/detail", proxy.GetProjectWithPhasesProxy(projectClient, userProjectClient))
		r.Post("/api/entrance-test/start", proxy.StartEntranceTestProxy(entranceTestClient))
		r.Post("/api/entrance-test/submit", proxy.SubmitEntranceRoundProxy(entranceTestClient))

		// ── File system (relational FS) ─────────────────────────────────────
		r.Put("/api/files/upsert", proxy.UpsertFileProxy(fileClient))
		r.Get("/api/files/get", proxy.GetFileProxy(fileClient))
		r.Get("/api/files/list", proxy.ListFilesProxy(fileClient))
		r.Delete("/api/files/delete", proxy.DeleteFileProxy(fileClient))
		r.Post("/api/files/batch-upsert", proxy.BatchUpsertProxy(fileClient))

		// ── Resource progress ───────────────────────────────────────────────
		r.Get("/api/resources", proxy.GetPhaseResourcesProxy(resourceProgressClient))
		r.Post("/api/resources/progress", proxy.MarkCompletedProxy(resourceProgressClient))
		r.Get("/api/resources/progress", proxy.GetProgressProxy(resourceProgressClient))
	})

	return r
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"ok"}`))
}