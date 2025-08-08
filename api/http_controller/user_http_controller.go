package http_controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/bensivo/trellis/api/service"
	"github.com/bensivo/trellis/api/util"
)

type UsersHttpController struct {
	UserService service.UserService
}

func NewUsersHttpController(userService service.UserService) *UsersHttpController {
	return &UsersHttpController{
		UserService: userService,
	}
}

func (c *UsersHttpController) RegisterRoutes(mux *http.ServeMux) {
	fmt.Println("Registering route GET /users")
	mux.HandleFunc("GET /users", util.WithLogger(c.onGetUsers))

	fmt.Println("Registering route POST /users")
	mux.HandleFunc("POST /users", util.WithLogger(c.onCreateUser))

	fmt.Println("Registering route GET /users/{userid}")
	mux.HandleFunc("GET /users/{userid}", util.WithLogger(c.onGetUser))

	fmt.Println("Registering route PUT /users/{userid}")
	mux.HandleFunc("PUT /users/{userid}", util.WithLogger(c.onUpdateUser))

	fmt.Println("Registering route DELETE /users/{userid}")
	mux.HandleFunc("DELETE /users/{userid}", util.WithLogger(c.onDeleteUser))
}

func (c *UsersHttpController) onGetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := c.UserService.GetUsers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(users) == 0 {
		// Prevents writing 'null' to as JSON
		util.WriteJson(w, []interface{}{})
	} else {
		util.WriteJson(w, users)
	}
}

func (c *UsersHttpController) onCreateUser(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name string `json:"name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := c.UserService.CreateUser(req.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	util.WriteJson(w, user)
}

func (c *UsersHttpController) onGetUser(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("userid")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	user, err := c.UserService.GetUser(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	util.WriteJson(w, user)
}

func (c *UsersHttpController) onUpdateUser(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("userid")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	var req struct {
		Name string `json:"name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := c.UserService.UpdateUser(id, req.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	util.WriteJson(w, user)
}

func (c *UsersHttpController) onDeleteUser(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("userid")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	err = c.UserService.DeleteUser(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
