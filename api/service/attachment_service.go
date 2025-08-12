package service

import (
	"fmt"
	"path/filepath"

	"github.com/bensivo/trellis/api/model"
	"github.com/google/uuid"
)

type AttachmentService interface {
	UploadAttachment(filename string, content []byte) (*model.Attachment, error)
	GetAttachment(id int) (*model.Attachment, []byte, error)
	DeleteAttachment(id int) error
}

type attachmentService struct {
	db            DbService
	objectStorage ObjectStorageService
}

func NewAttachmentService(db DbService, objectStorage ObjectStorageService) *attachmentService {
	return &attachmentService{
		db:            db,
		objectStorage: objectStorage,
	}
}

func (s *attachmentService) UploadAttachment(filename string, content []byte) (*model.Attachment, error) {
	// Generate unique path using UUID
	id := uuid.New()
	ext := filepath.Ext(filename)
	generatedFilename := id.String() + ext
	path := fmt.Sprintf("attachments/%s", generatedFilename)

	// Upload to object storage first
	err := s.objectStorage.PutObject(path, content)
	if err != nil {
		return nil, err
	}

	// Insert into database
	res, err := s.db.Exec(`
   	INSERT INTO attachments (filename, path, size) VALUES (?, ?, ?);
   `, filename, path, int64(len(content)))
	if err != nil {
		// Cleanup: delete from object storage if DB insert fails
		s.objectStorage.DeleteObject(path)
		return nil, err
	}

	dbId, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}

	return &model.Attachment{
		Id:       int(dbId),
		Filename: filename,
		Path:     path,
		Size:     int64(len(content)),
	}, nil
}

func (s *attachmentService) GetAttachment(id int) (*model.Attachment, []byte, error) {
	// Get metadata from database
	attachment := &model.Attachment{}
	row := s.db.QueryRow("SELECT id, filename, path, size FROM attachments WHERE id = ?", id)
	err := row.Scan(&attachment.Id, &attachment.Filename, &attachment.Path, &attachment.Size)
	if err != nil {
		return nil, nil, err
	}

	// Get file content from object storage
	content, err := s.objectStorage.GetObject(attachment.Path)
	if err != nil {
		return attachment, nil, err
	}

	return attachment, content, nil
}

func (s *attachmentService) DeleteAttachment(id int) error {
	// Get attachment to find path
	attachment := &model.Attachment{}
	row := s.db.QueryRow("SELECT id, filename, path, size FROM attachments WHERE id = ?", id)
	err := row.Scan(&attachment.Id, &attachment.Filename, &attachment.Path, &attachment.Size)
	if err != nil {
		return err
	}

	// Delete from database first
	_, err = s.db.Exec("DELETE FROM attachments WHERE id = ?", id)
	if err != nil {
		return err
	}

	// Delete from object storage
	err = s.objectStorage.DeleteObject(attachment.Path)
	if err != nil {
		// Log error but don't fail - DB record is already deleted
		fmt.Printf("Warning: failed to delete object storage file %s: %v\n", attachment.Path, err)
	}

	return nil
}
