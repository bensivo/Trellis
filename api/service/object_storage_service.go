package service

import (
	"bytes"
	"context"
	"io"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type ObjectStorageService interface {
	PutObject(path string, content []byte) error
	GetObject(path string) ([]byte, error)
}

type objectStorageService struct {
	client *minio.Client
	bucket string
}

type ObjectStorageServiceConfig struct {
	Endpoint  string
	AccessKey string
	SecretKey string
	Bucket    string
	UseSSL    bool
}

func NewObjectStorageService(config ObjectStorageServiceConfig) (*objectStorageService, error) {
	client, err := minio.New(config.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(config.AccessKey, config.SecretKey, ""),
		Secure: config.UseSSL,
	})
	if err != nil {
		return nil, err
	}

	return &objectStorageService{
		client: client,
		bucket: config.Bucket,
	}, nil
}

func (s *objectStorageService) PutObject(path string, content []byte) error {
	reader := bytes.NewReader(content)

	_, err := s.client.PutObject(
		context.Background(),
		s.bucket,
		path,
		reader,
		int64(len(content)),
		minio.PutObjectOptions{
			ContentType: "application/octet-stream",
		},
	)

	return err
}

func (s *objectStorageService) GetObject(path string) ([]byte, error) {
	object, err := s.client.GetObject(
		context.Background(),
		s.bucket,
		path,
		minio.GetObjectOptions{},
	)
	if err != nil {
		return nil, err
	}
	defer object.Close()

	return io.ReadAll(object)
}
