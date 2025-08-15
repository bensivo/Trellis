package util

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/rs/cors"
)

func Cors(origins []string) *cors.Cors {
	c := cors.New(cors.Options{
		AllowedOrigins:   origins,
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PATCH", "DELETE"},
		AllowedHeaders:   []string{"authorization", "content-type"},
		Debug:            false,
	})

	return c
}

func GetIntPathParam(r *http.Request, key string) (int, error) {
	// Get the path parameter
	value := r.PathValue(key)

	// Convert the value to an integer
	valueInt, err := strconv.Atoi(value)
	if err != nil {
		return 0, fmt.Errorf("invalid value for parameter %s: %s", key, value)
	}
	return valueInt, nil
}

func ReadJSONRequestBody[T interface{}](r *http.Request, out T) error {
	// Read the request body
	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		return fmt.Errorf("failed to read request body: %w", err)
	}

	// Unmarshal the JSON data
	err = json.Unmarshal(bytes, out)
	if err != nil {
		return fmt.Errorf("failed to unmarshal JSON data: %w", err)
	}
	return nil
}

func WriteJson(w http.ResponseWriter, code int, data interface{}) {
	// Serialize the data to JSON
	bytes, err := json.Marshal(data)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Failed to serialize internal response data to JSON"}`))
		return
	}

	// Set the Content-Type header
	w.Header().Set("Content-Type", "application/json")

	w.WriteHeader(code) // Set the HTTP status code

	// Write the JSON data to the response
	w.Write(bytes)
}

func WithLogger(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("%s HTTP %s %s\n", time.Now().Format(time.RFC3339), r.Method, r.URL.Path)
		handler(w, r)
	}
}
