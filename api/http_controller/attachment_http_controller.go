package http_controller

import (
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/bensivo/trellis/api/service"
	"github.com/bensivo/trellis/api/util"
)

type AttachmentsHttpController struct {
	AttachmentService service.AttachmentService
}

func NewAttachmentsHttpController(attachmentService service.AttachmentService) *AttachmentsHttpController {
	return &AttachmentsHttpController{
		AttachmentService: attachmentService,
	}
}

func (c *AttachmentsHttpController) RegisterRoutes(mux *http.ServeMux) {
	fmt.Println("Registering route POST /attachments")
	mux.HandleFunc("POST /attachments", util.WithLogger(c.onUploadAttachment))

	fmt.Println("Registering route GET /attachments/{id}")
	mux.HandleFunc("GET /attachments/{id}", util.WithLogger(c.onGetAttachment))

	fmt.Println("Registering route DELETE /attachments/{id}")
	mux.HandleFunc("DELETE /attachments/{id}", util.WithLogger(c.onDeleteAttachment))
}

func (c *AttachmentsHttpController) onUploadAttachment(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form
	err := r.ParseMultipartForm(64 << 20) // 64MB max
	if err != nil {
		util.WriteJson(w, http.StatusBadRequest, map[string]string{
			"error": "Failed to parse multipart form",
		})
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		util.WriteJson(w, http.StatusBadRequest, map[string]string{
			"error": "No file provided",
		})
		return
	}
	defer file.Close()

	// Read file content into byte arr
	content, err := io.ReadAll(file)
	if err != nil {
		util.WriteJson(w, http.StatusInternalServerError, map[string]string{
			"error": "Failed to read file",
		})
		return
	}

	// Upload file
	attachment, err := c.AttachmentService.UploadAttachment(header.Filename, content)
	if err != nil {
		util.WriteJson(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	util.WriteJson(w, http.StatusCreated, attachment)
}

func (c *AttachmentsHttpController) onGetAttachment(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		util.WriteJson(w, http.StatusBadRequest, map[string]string{
			"error": "Invalid attachment ID",
		})
		return
	}

	attachment, content, err := c.AttachmentService.GetAttachment(id)
	if err != nil {
		util.WriteJson(w, http.StatusNotFound, map[string]string{
			"error": err.Error(),
		})
		return
	}

	// Set content type based on file extension
	ext := filepath.Ext(attachment.Filename)
	contentType := "application/octet-stream"
	switch ext {
	case ".jpg", ".jpeg":
		contentType = "image/jpeg"
	case ".png":
		contentType = "image/png"
	case ".pdf":
		contentType = "application/pdf"
	case ".txt":
		contentType = "text/plain"
	}

	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", attachment.Filename))
	w.Write(content)
}

func (c *AttachmentsHttpController) onDeleteAttachment(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		util.WriteJson(w, http.StatusBadRequest, map[string]string{
			"error": "Invalid attachment ID",
		})
		return
	}

	err = c.AttachmentService.DeleteAttachment(id)
	if err != nil {
		util.WriteJson(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
