package proxy

import (
	"encoding/json"
	"net/http"

	"gateway/pkg/pb"

	"google.golang.org/grpc/status"
)

// ── UpsertFile ────────────────────────────────────────────────────────────────

// UpsertFileProxy handles PUT /api/files/upsert
// Body: { "filePath": "/src/index.js", "content": "...", "isDirectory": false }
// Query params: projectId
func UpsertFileProxy(client pb.FileServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")
		projectId := r.URL.Query().Get("projectId")
		if projectId == "" {
			http.Error(w, "projectId query param is required", http.StatusBadRequest)
			return
		}

		var body struct {
			FilePath    string `json:"filePath"`
			Content     string `json:"content"`
			IsDirectory bool   `json:"isDirectory"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}

		res, err := client.UpsertFile(r.Context(), &pb.UpsertFileRequest{
			ProjectId:   projectId,
			UserEmail:   email,
			FilePath:    body.FilePath,
			Content:     body.Content,
			IsDirectory: body.IsDirectory,
		})
		if err != nil {
			st, _ := status.FromError(err)
			http.Error(w, st.Message(), grpcCodeToHTTP(st.Code()))
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
	}
}

// ── GetFile ───────────────────────────────────────────────────────────────────

// GetFileProxy handles GET /api/files/get
// Query params: projectId, filePath
func GetFileProxy(client pb.FileServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")
		projectId := r.URL.Query().Get("projectId")
		filePath := r.URL.Query().Get("filePath")
		if projectId == "" || filePath == "" {
			http.Error(w, "projectId and filePath query params are required", http.StatusBadRequest)
			return
		}

		res, err := client.GetFile(r.Context(), &pb.GetFileRequest{
			ProjectId: projectId,
			UserEmail: email,
			FilePath:  filePath,
		})
		if err != nil {
			st, _ := status.FromError(err)
			http.Error(w, st.Message(), grpcCodeToHTTP(st.Code()))
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
	}
}

// ── ListFiles ─────────────────────────────────────────────────────────────────

// ListFilesProxy handles GET /api/files/list
// Query params: projectId
func ListFilesProxy(client pb.FileServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")
		projectId := r.URL.Query().Get("projectId")
		if projectId == "" {
			http.Error(w, "projectId query param is required", http.StatusBadRequest)
			return
		}

		res, err := client.ListFiles(r.Context(), &pb.ListFilesRequest{
			ProjectId: projectId,
			UserEmail: email,
		})
		if err != nil {
			st, _ := status.FromError(err)
			http.Error(w, st.Message(), grpcCodeToHTTP(st.Code()))
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
	}
}

// ── DeleteFile ────────────────────────────────────────────────────────────────

// DeleteFileProxy handles DELETE /api/files/delete
// Query params: projectId, filePath
func DeleteFileProxy(client pb.FileServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")
		projectId := r.URL.Query().Get("projectId")
		filePath := r.URL.Query().Get("filePath")
		if projectId == "" || filePath == "" {
			http.Error(w, "projectId and filePath query params are required", http.StatusBadRequest)
			return
		}

		res, err := client.DeleteFile(r.Context(), &pb.DeleteFileRequest{
			ProjectId: projectId,
			UserEmail: email,
			FilePath:  filePath,
		})
		if err != nil {
			st, _ := status.FromError(err)
			http.Error(w, st.Message(), grpcCodeToHTTP(st.Code()))
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
	}
}

// ── BatchUpsert ───────────────────────────────────────────────────────────────

// BatchUpsertProxy handles POST /api/files/batch-upsert
// Body: { "entries": [{ "filePath": "...", "content": "...", "isDirectory": false }] }
// Query params: projectId
func BatchUpsertProxy(client pb.FileServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")
		projectId := r.URL.Query().Get("projectId")
		if projectId == "" {
			http.Error(w, "projectId query param is required", http.StatusBadRequest)
			return
		}

		var body struct {
			Entries []struct {
				FilePath    string `json:"filePath"`
				Content     string `json:"content"`
				IsDirectory bool   `json:"isDirectory"`
			} `json:"entries"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid JSON body", http.StatusBadRequest)
			return
		}

		pbEntries := make([]*pb.UpsertEntry, 0, len(body.Entries))
		for _, e := range body.Entries {
			pbEntries = append(pbEntries, &pb.UpsertEntry{
				FilePath:    e.FilePath,
				Content:     e.Content,
				IsDirectory: e.IsDirectory,
			})
		}

		res, err := client.BatchUpsert(r.Context(), &pb.BatchUpsertRequest{
			ProjectId: projectId,
			UserEmail: email,
			Entries:   pbEntries,
		})
		if err != nil {
			st, _ := status.FromError(err)
			http.Error(w, st.Message(), grpcCodeToHTTP(st.Code()))
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
	}
}
