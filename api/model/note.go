package model

import "fmt"

type Note struct {
	Id          int                    `json:"id"`
	Name        string                 `json:"name"`
	Fields      map[string]interface{} `json:"fields"`
	ContentPath string                 `json:"contentPath"`
}

func (u Note) String() string {
	return fmt.Sprintf("Note(id=%d, name=%s, ContentPath=%s)", u.Id, u.Name, u.ContentPath)
}
