package config

import (
	"context"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

type Config struct {
	Port				string
	UserServiceUrl		string
	ResourceServiceUrl 	string
}

func LoadConfig() (*Config) {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, falling back to system environment variables")
	}
	return &Config{
		Port: getEnv("PORT", "8081"),
		UserServiceUrl: getEnv("USER_SERVICE_URL", "localhost:50051"),
		ResourceServiceUrl: getEnv("RESOURCE_SERVICE_URL", "localhost:50052"),
	}
}

func InitFirebase() *firebase.App {
	credentialsFile := getEnv("FIREBASE_CREDENTIALS", "serviceAccountKey.json")
	opt := option.WithCredentialsFile(credentialsFile)

	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err!=nil {
		log.Fatalf("Failed to initialize Firebase: %v", err)
	}
	return app
}

func getEnv(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}