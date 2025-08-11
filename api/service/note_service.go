package service

import (
	"encoding/json"
	"fmt"

	"github.com/bensivo/trellis/api/model"
)

// CRUD Service for notes
type NoteService interface {
	CreateNote(name string, fields map[string]interface{}, contentPath string) (*model.Note, error)
	GetNotes() ([]*model.Note, error)
	GetNote(id int) (*model.Note, error)
	UpdateNote(id int, name *string, fields *map[string]interface{}, contentPath *string) (*model.Note, error)
	DeleteNote(id int) error
}

type noteService struct {
	db DbService
}

var _ NoteService = (*noteService)(nil)

func NewNoteService(db DbService) *noteService {
	return &noteService{
		db: db,
	}
}

func (s *noteService) CreateNote(name string, fields map[string]interface{}, contentPath string) (*model.Note, error) {
	fieldsJSON, err := json.Marshal(fields)
	if err != nil {
		return nil, err
	}

	res, err := s.db.Exec(`
   	INSERT INTO notes (name, fields, content_path) VALUES (?, ?, ?);
   `, name, string(fieldsJSON), contentPath)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}

	return &model.Note{
		Id:          int(id),
		Name:        name,
		Fields:      fields,
		ContentPath: contentPath,
	}, nil
}

func (s *noteService) GetNotes() ([]*model.Note, error) {
	rows, err := s.db.Query("SELECT id, name, fields, content_path FROM notes")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []*model.Note
	for rows.Next() {
		note := &model.Note{}
		var fieldsJSON string
		err := rows.Scan(&note.Id, &note.Name, &fieldsJSON, &note.ContentPath)
		if err != nil {
			return nil, err
		}

		if err := json.Unmarshal([]byte(fieldsJSON), &note.Fields); err != nil {
			return nil, err
		}

		notes = append(notes, note)
	}
	return notes, rows.Err()
}

func (s *noteService) GetNote(id int) (*model.Note, error) {
	note := &model.Note{}
	var fieldsJSON string
	row := s.db.QueryRow("SELECT id, name, fields, content_path FROM notes WHERE id = ?", id)
	err := row.Scan(&note.Id, &note.Name, &fieldsJSON, &note.ContentPath)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal([]byte(fieldsJSON), &note.Fields); err != nil {
		return nil, err
	}

	return note, nil
}

func (s *noteService) UpdateNote(id int, name *string, fields *map[string]interface{}, contentPath *string) (*model.Note, error) {
	// Get existing note first
	existingNote, err := s.GetNote(id)
	if err != nil {
		return nil, err
	}

	// Use existing values if new ones are empty/nil
	updatedName := existingNote.Name
	if name != nil {
		updatedName = *name
	}

	updatedFields := existingNote.Fields
	if fields != nil {
		updatedFields = *fields
	}
	updatedFieldsJSON, err := json.Marshal(updatedFields)
	if err != nil {
		return nil, err
	}

	updatedContentPath := existingNote.ContentPath
	if contentPath != nil {
		updatedContentPath = *contentPath
	}

	_, err = s.db.Exec(
		"UPDATE notes SET name = ?, fields = ?, content_path = ? WHERE id = ?",
		updatedName, string(updatedFieldsJSON), updatedContentPath, id,
	)
	if err != nil {
		return nil, err
	}

	return &model.Note{
		Id:          id,
		Name:        updatedName,
		Fields:      updatedFields,
		ContentPath: updatedContentPath,
	}, nil
}

func (s *noteService) DeleteNote(id int) error {
	_, err := s.db.Exec("DELETE FROM notes WHERE id = ?", id)
	return err
}
