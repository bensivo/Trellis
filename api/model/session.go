package model

type Session struct {
	SessionToken string `json:"sessionToken"`
	UserID       int    `json:"userId"`
	ExpiresAt    int64  `json:"expiresAt"`
}
