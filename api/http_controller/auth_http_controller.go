package http_controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/bensivo/trellis/api/service"
	"github.com/bensivo/trellis/api/util"
)

type AuthHttpController struct {
	SessionService service.SessionService
	UserService    service.UserService // assuming you have this
}

func NewAuthHttpController(sessionService service.SessionService, userService service.UserService) *AuthHttpController {
	return &AuthHttpController{
		SessionService: sessionService,
		UserService:    userService,
	}
}

func (c *AuthHttpController) RegisterRoutes(mux *http.ServeMux) {
	fmt.Println("Registering route POST /auth/login")
	fmt.Println("Registering route GET /auth/me")
	mux.HandleFunc("POST /auth/login", util.WithLogger(c.onLogin))
	mux.HandleFunc("GET /auth/me", util.WithLogger(c.onMe))
}

func (c *AuthHttpController) onLogin(w http.ResponseWriter, r *http.Request) {
	var req struct {
		UserID int `json:"userId"` // In real OAuth flow, this would come from token validation
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.WriteJson(w, http.StatusBadRequest, map[string]string{
			"error": "Invalid JSON body",
		})
		return
	}

	session, err := c.SessionService.CreateSession(req.UserID, 24*time.Hour)
	if err != nil {
		if err == service.ErrUserNotFound {
			util.WriteJson(w, http.StatusNotFound, map[string]string{
				"error": "User not found",
			})
			return
		}
		util.WriteJson(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}

	// Set httpOnly cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    session.SessionToken,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Now().Add(24 * time.Hour),
		Path:     "/",
	})

	w.WriteHeader(http.StatusCreated)
}

func (c *AuthHttpController) onMe(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_token")
	if err != nil {
		util.WriteJson(w, http.StatusUnauthorized, map[string]string{
			"error": "Not authenticated",
		})
		return
	}

	user, err := c.SessionService.ValidateSession(cookie.Value)
	if err != nil {
		if err == service.ErrSessionNotFound {
			util.WriteJson(w, http.StatusUnauthorized, map[string]string{
				"error": "Not authenticated",
			})
			return
		}
		util.WriteJson(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}

	util.WriteJson(w, http.StatusOK, user)
}
