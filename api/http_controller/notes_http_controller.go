package http_controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/bensivo/trellis/api/service"
	"github.com/bensivo/trellis/api/util"
)

type NotesHttpController struct {
	NoteService service.NoteService
}

func NewNotesHttpController(noteService service.NoteService) *NotesHttpController {
	return &NotesHttpController{
		NoteService: noteService,
	}
}

func (c *NotesHttpController) RegisterRoutes(mux *http.ServeMux) {
	fmt.Println("Registering route GET /notes")
	mux.HandleFunc("GET /notes", util.WithLogger(c.onGetNotes))

	fmt.Println("Registering route POST /notes")
	mux.HandleFunc("POST /notes", util.WithLogger(c.onCreateNote))

	fmt.Println("Registering route GET /notes/{noteid}")
	mux.HandleFunc("GET /notes/{noteid}", util.WithLogger(c.onGetNote))

	fmt.Println("Registering route PUT /notes/{noteid}")
	mux.HandleFunc("PUT /notes/{noteid}", util.WithLogger(c.onUpdateNote))

	fmt.Println("Registering route DELETE /notes/{noteid}")
	mux.HandleFunc("DELETE /notes/{noteid}", util.WithLogger(c.onDeleteNote))
}

func (c *NotesHttpController) onGetNotes(w http.ResponseWriter, r *http.Request) {
	notes, err := c.NoteService.GetNotes()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if len(notes) == 0 {
		util.WriteJson(w, []interface{}{}) // Prevents writing 'null' on empty arr
	} else {
		util.WriteJson(w, notes)
	}
}

func (c *NotesHttpController) onCreateNote(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string                 `json:"name"`
		Fields      map[string]interface{} `json:"fields"`
		ContentPath string                 `json:"contentPath"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	note, err := c.NoteService.CreateNote(req.Name, req.Fields, req.ContentPath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	util.WriteJson(w, note)
}

func (c *NotesHttpController) onGetNote(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("noteid")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid note ID", http.StatusBadRequest)
		return
	}

	note, err := c.NoteService.GetNote(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	util.WriteJson(w, note)
}

func (c *NotesHttpController) onUpdateNote(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("noteid")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid note ID", http.StatusBadRequest)
		return
	}

	var req struct {
		Name        string                 `json:"name"`
		Fields      map[string]interface{} `json:"fields"`
		ContentPath string                 `json:"contentPath"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	note, err := c.NoteService.UpdateNote(id, req.Name, req.Fields, req.ContentPath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	util.WriteJson(w, note)
}

func (c *NotesHttpController) onDeleteNote(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("noteid")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid note ID", http.StatusBadRequest)
		return
	}

	err = c.NoteService.DeleteNote(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
