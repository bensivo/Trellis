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

	fmt.Println("Registering route PATCH /notes/{noteid}")
	mux.HandleFunc("PATCH /notes/{noteid}", util.WithLogger(c.onUpdateNote))

	fmt.Println("Registering route DELETE /notes/{noteid}")
	mux.HandleFunc("DELETE /notes/{noteid}", util.WithLogger(c.onDeleteNote))
}

func (c *NotesHttpController) onGetNotes(w http.ResponseWriter, r *http.Request) {
	notes, err := c.NoteService.GetNotes()
	if err != nil {
		util.WriteJson(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}
	if len(notes) == 0 {
		util.WriteJson(w, http.StatusOK, []interface{}{}) // Prevents writing 'null' on empty arr
	} else {
		util.WriteJson(w, http.StatusOK, notes)
	}
}

func (c *NotesHttpController) onCreateNote(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string                 `json:"name"`
		Fields      map[string]interface{} `json:"fields"`
		ContentPath string                 `json:"contentPath"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.WriteJson(w, http.StatusBadRequest, map[string]string{
			"error": "Invalid JSON Input",
		})
		return
	}

	note, err := c.NoteService.CreateNote(req.Name, req.Fields, req.ContentPath)
	if err != nil {
		util.WriteJson(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}

	util.WriteJson(w, http.StatusCreated, note)
}

func (c *NotesHttpController) onGetNote(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("noteid")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		util.WriteJson(w, http.StatusBadRequest, map[string]string{
			"error": "Invalid note ID",
		})
		return
	}

	note, err := c.NoteService.GetNote(id)
	if err != nil {
		util.WriteJson(w, http.StatusNotFound, map[string]string{
			"error": err.Error(),
		})
		return
	}

	util.WriteJson(w, http.StatusOK, note)
}

func (c *NotesHttpController) onUpdateNote(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("noteid")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		util.WriteJson(w, http.StatusBadRequest, map[string]string{
			"error": "Invalid note ID",
		})
		return
	}

	var req struct {
		Name        *string                 `json:"name,omitempty"`
		Fields      *map[string]interface{} `json:"fields,omitempty"`
		ContentPath *string                 `json:"contentPath,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.WriteJson(w, http.StatusBadRequest, map[string]string{
			"error": "Invalid JSON Input",
		})
		return
	}

	note, err := c.NoteService.UpdateNote(id, req.Name, req.Fields, req.ContentPath)
	if err != nil {
		util.WriteJson(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}

	util.WriteJson(w, http.StatusOK, note)
}

func (c *NotesHttpController) onDeleteNote(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("noteid")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		util.WriteJson(w, http.StatusBadRequest, map[string]string{
			"error": "Invalid note ID",
		})
		return
	}

	err = c.NoteService.DeleteNote(id)
	if err != nil {
		util.WriteJson(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
