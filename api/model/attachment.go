package model

import "fmt"

type Attachment struct {
	Id       int    `json:"id"`
	Filename string `json:"filename"`
	Path     string `json:"path"`
	Size     int64  `json:"size"`
}

func (a Attachment) String() string {
	return fmt.Sprintf("Attachment(id=%d, filename=%s, path=%s, size=%d)", a.Id, a.Filename, a.Path, a.Size)
}
