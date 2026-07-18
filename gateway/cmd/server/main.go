package main

import (
	"gateway/internal/config"
	"gateway/internal/health"
	"gateway/internal/router"
	"log"
	"net/http"
)

func main() {
	cfg := config.LoadConfig()
	app := config.InitFirebase()

	r := router.New(app, cfg)
	health.CheckDependencies(cfg)

	address := ":" + cfg.Port
	log.Printf("Starting server on %s", address)
	if err := http.ListenAndServe(address, r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
