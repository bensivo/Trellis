package http_controller

import (
	"fmt"
	"net/http"

	"github.com/bensivo/trellis/api/service"
	"github.com/bensivo/trellis/api/util"
)

type HealthHttpController struct {
	HealthService service.HealthService
}

func NewHealthHttpController(healthService service.HealthService) *HealthHttpController {
	return &HealthHttpController{
		HealthService: healthService,
	}
}

func (c *HealthHttpController) RegisterRoutes(mux *http.ServeMux) {
	fmt.Println("Registering route GET /health")
	mux.HandleFunc("GET /health", util.WithLogger(c.onGetHealth))
}

func (c *HealthHttpController) onGetHealth(w http.ResponseWriter, r *http.Request) {
	health := c.HealthService.GetHealth()
	util.WriteJson(w, http.StatusOK, health)
}
