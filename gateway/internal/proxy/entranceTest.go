package proxy

import (
	"encoding/json"
	"io"
	"net/http"

	"gateway/pkg/pb"
)

// POST /api/entrance-test/start
func StartEntranceTestProxy(client pb.EntranceTestServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")
		if email == "" {
			http.Error(w, "missing X-User-Email header", http.StatusUnauthorized)
			return
		}

		resp, err := client.StartTest(r.Context(), &pb.StartTestRequest{Email: email})
		if err != nil {
			http.Error(w, "failed to start entrance test: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}
}

// POST /api/entrance-test/submit
func SubmitEntranceRoundProxy(client pb.EntranceTestServiceClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.Header.Get("X-User-Email")
		if email == "" {
			http.Error(w, "missing X-User-Email header", http.StatusUnauthorized)
			return
		}

		var body struct {
			Answers []struct {
				QuestionId     string `json:"question_id"`
				SelectedOption int32  `json:"selected_option"`
			} `json:"answers"`
		}

		bodyBytes, err := io.ReadAll(r.Body)
		if err != nil || len(bodyBytes) == 0 {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}
		if err := json.Unmarshal(bodyBytes, &body); err != nil {
			http.Error(w, "invalid JSON: "+err.Error(), http.StatusBadRequest)
			return
		}

		answers := make([]*pb.AnswerDTO, 0, len(body.Answers))
		for _, a := range body.Answers {
			answers = append(answers, &pb.AnswerDTO{
				QuestionId:     a.QuestionId,
				SelectedOption: a.SelectedOption,
			})
		}

		resp, err := client.SubmitRound(r.Context(), &pb.SubmitRoundRequest{
			Email:   email,
			Answers: answers,
		})
		if err != nil {
			http.Error(w, "failed to submit round: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}
}
