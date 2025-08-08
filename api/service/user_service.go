package service

import (
	"fmt"

	"github.com/bensivo/trellis/api/model"
)

// CRUD Service for users
type UserService interface {
	CreateUser(name string) (*model.User, error)
	GetUsers() ([]*model.User, error)
	GetUser(id int) (*model.User, error)
	UpdateUser(id int, name string) (*model.User, error)
	DeleteUser(id int) error
}

type userService struct {
	db DbService
}

var _ UserService = (*userService)(nil)

func NewUserService(db DbService) *userService {
	return &userService{
		db: db,
	}
}

func (s *userService) CreateUser(name string) (*model.User, error) {
	res, err := s.db.Exec(`
		INSERT INTO users (name) VALUES (?);
	`, name)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	id, err := res.LastInsertId()
	return &model.User{
		Id:   int(id),
		Name: name,
	}, nil
}

func (s *userService) GetUsers() ([]*model.User, error) {
	rows, err := s.db.Query("SELECT id, name FROM users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*model.User
	for rows.Next() {
		user := &model.User{}
		err := rows.Scan(&user.Id, &user.Name)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, rows.Err()
}

func (s *userService) GetUser(id int) (*model.User, error) {
	user := &model.User{}
	row := s.db.QueryRow("SELECT id, name FROM users WHERE id = ?", id)
	err := row.Scan(&user.Id, &user.Name)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *userService) UpdateUser(id int, name string) (*model.User, error) {
	_, err := s.db.Exec("UPDATE users SET name = ? WHERE id = ?", name, id)
	if err != nil {
		return nil, err
	}
	return &model.User{Id: id, Name: name}, nil
}

func (s *userService) DeleteUser(id int) error {
	_, err := s.db.Exec("DELETE FROM users WHERE id = ?", id)
	return err
}
