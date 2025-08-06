package main

import (
	"fmt"
	"net/http"

	"github.com/bensivo/trellis/api/http_controller"
	"github.com/bensivo/trellis/api/service"
	"github.com/rs/cors"
)

var port = 3000

func main() {

	// Services
	healthSvc := service.NewHealthService()

	// HTTP Controllers
	healthHttpController := http_controller.NewHealthHttpController(healthSvc)

	// HTTP Mux
	mux := &http.ServeMux{}
	healthHttpController.RegisterRoutes(mux)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4200"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PATCH", "DELETE"},
		AllowedHeaders:   []string{"authorization", "content-type"},
		Debug:            true,
	})
	handler := c.Handler(mux)

	fmt.Printf("Listening on http://localhost:%d\n", port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), handler)
	if err != nil {
		panic(err)
	}
}
