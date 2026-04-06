package main

import (
	"gateway/internal/config"
	"gateway/internal/router"
	"log"
	"net/http"
)

func main() {
	cfg := config.LoadConfig()
	app := config.InitFirebase()

	r := router.New(app, cfg)

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}