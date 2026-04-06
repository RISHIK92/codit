package auth

import (
	"context"
	"net/http"
	"strings"

	firebase "firebase.google.com/go/v4"
)

func RequireAuth(app *firebase.App) func(http.Handler) http.Handler {
	authClient, err := app.Auth(context.Background())
	if err != nil {
		panic("Error initializing Firebase Auth client: " + err.Error())
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
				http.Error(w, "Unauthorized: Missing or invalid token", http.StatusUnauthorized)
				return
			}

			idToken := strings.TrimPrefix(authHeader, "Bearer ")

			token, err := authClient.VerifyIDToken(r.Context(), idToken)
			if err != nil {
				http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
				return
			}

			r.Header.Set("X-User-Id", token.UID)

			if emailClaim, ok := token.Claims["email"]; ok {
				r.Header.Set("X-User-Email", emailClaim.(string))
			}
			if nameClaim, ok := token.Claims["name"]; ok {
				r.Header.Set("X-User-Name", nameClaim.(string))
			}

			next.ServeHTTP(w, r)
		})
	}
}