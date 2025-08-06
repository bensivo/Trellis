package http_controller

import (
	"fmt"
	"net/http"

	"github.com/bensivo/trellis/api/util"
)

type HealthHttpController struct {
}

func NewHealthHttpController() *HealthHttpController {
	return &HealthHttpController{}
}

func (c *HealthHttpController) RegisterRoutes(mux *http.ServeMux) {
	fmt.Println("Registering route GET /health")
	mux.HandleFunc("GET /health", util.WithLogger(c.onGetHealth))
}

func (c *HealthHttpController) onGetHealth(w http.ResponseWriter, r *http.Request) {
	util.WriteJSON(w, map[string]interface{}{
		"status": "OK",
	})
}
