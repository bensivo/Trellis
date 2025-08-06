package service

type HealthService interface {
	GetHealth() Health
}

type Health struct {
	Status string `json:"status"`
}

type healthService struct{}

func NewHealthService() *healthService {
	return &healthService{}
}

func (svc *healthService) GetHealth() Health {
	return Health{
		Status: "ok",
	}
}
