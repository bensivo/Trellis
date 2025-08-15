package service

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"github.com/bensivo/trellis/api/model"
)

/**
 * SessionService provides methods for managing user sessions.
 * Sessions should be created upon user login, and all other service requests should validate the session before proceeding.
 *
 * Browsers shoudld store session tokens in secure, HttpOnly Cookies to prevent XSS attacks.
 */
type SessionService interface {
	CreateSession(userID int, duration time.Duration) (*model.Session, error)
	ValidateSession(token string) (*model.User, error)
	DeleteSession(token string) error
	CleanupExpiredSessions() error
}

var ErrUserNotFound = errors.New("user not found")
var ErrSessionNotFound = errors.New("session not found")

type sessionService struct {
	dbSvc   DbService
	userSvc UserService
}

var _ SessionService = (*sessionService)(nil)

func NewSessionService(dbSvc DbService, userSvc UserService) *sessionService {
	return &sessionService{
		dbSvc:   dbSvc,
		userSvc: userSvc,
	}
}

func (s *sessionService) CreateSession(userID int, duration time.Duration) (*model.Session, error) {
	// Validate user exists
	_, err := s.userSvc.GetUser(userID)
	if err != nil {
		return nil, ErrUserNotFound
	}

	token, err := generateSecureToken(32)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	expiresAt := time.Now().Add(duration).Unix()

	_, err = s.dbSvc.Exec(`
   	INSERT INTO sessions (session_token, user_id, expires_at) 
   	VALUES (?, ?, ?)
   `, token, userID, expiresAt)
	if err != nil {
		return nil, err
	}

	return &model.Session{
		SessionToken: token,
		UserID:       userID,
		ExpiresAt:    expiresAt,
	}, nil
}

func (s *sessionService) ValidateSession(token string) (*model.User, error) {
	// Get the session
	session := &model.Session{}
	row := s.dbSvc.QueryRow(`
      SELECT session_token, user_id, expires_at FROM sessions 
      WHERE session_token = ? AND expires_at > ?
   `, token, time.Now().Unix())
	err := row.Scan(&session.SessionToken, &session.UserID, &session.ExpiresAt)
	if err == sql.ErrNoRows {
		return nil, ErrSessionNotFound
	}
	if err != nil {
		return nil, err
	}

	// Get user by session's UserID
	user, err := s.userSvc.GetUser(session.UserID)
	if err != nil {
		return nil, err // ErrUserNotFound or other error
	}

	return user, nil
}

func (s *sessionService) DeleteSession(token string) error {
	_, err := s.dbSvc.Exec("DELETE FROM sessions WHERE session_token = ?", token)
	return err
}

func (s *sessionService) CleanupExpiredSessions() error {
	_, err := s.dbSvc.Exec("DELETE FROM sessions WHERE expires_at <= ?", time.Now().Unix())
	return err
}

func generateSecureToken(length int) (string, error) {
	bytes := make([]byte, length)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
