package service

import (
	"database/sql"
	"errors"
	"fmt"
	"time"
)

// Service exposing basic SQL DB functions
type DbService interface {
	RunMigrations() error

	// Functions re-exposed from the core database/sql.DB interface (but with logging)
	Exec(query string, args ...any) (sql.Result, error)
	Query(query string, args ...any) (*sql.Rows, error)
	QueryRow(query string, args ...any) *sql.Row
}

type dbService struct {
	db *sql.DB
}

var _ DbService = (*dbService)(nil)

func NewDbService(db *sql.DB) *dbService {
	return &dbService{
		db: db,
	}
}

type Migration struct {
	Name string
	SQL  string
}

func (svc *dbService) RunMigrations() error {
	_, err := svc.db.Exec(`
		CREATE TABLE IF NOT EXISTS migrations (
			name TEXT PRIMARY KEY,
			ts INTEGER
		);
	`)
	fmt.Println("Migrations table initialized")

	migrations := []Migration{
		{
			Name: "create_users",
			SQL: `
				CREATE TABLE IF NOT EXISTS users (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT NOT NULL
				);
			`,
		},
		{
			Name: "create_notes",
			SQL: `
				CREATE TABLE IF NOT EXISTS notes (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT NOT NULL,
					fields TEXT,
					content_path TEXT
				);
			`,
		},
		{
			Name: "create_attachments",
			SQL: `
				CREATE TABLE IF NOT EXISTS attachments (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					filename TEXT NOT NULL,
					path TEXT NOT NULL,
					size INTEGER NOT NULL
				);
			`,
		},
	}

	for _, migration := range migrations {
		err := RunMigration(svc.db, migration)
		if err != nil {
			return fmt.Errorf("failed to run migration: %w", err)
		}
	}
	return err
}

func RunMigration(db *sql.DB, migration Migration) error {
	row := db.QueryRow("SELECT count(*) as count FROM migrations WHERE name = $1;", migration.Name)
	var rowData struct {
		Count int
	}
	err := row.Scan(&rowData.Count)
	if err != nil {
		return fmt.Errorf("failed to query migrations table: %w", err)
	}

	if rowData.Count > 0 {
		fmt.Printf("Migration %s already run\n", migration.Name)
		return nil
	}

	fmt.Printf("Running migration: %s\n\t%s\n", migration.Name, migration.SQL)
	return WithTx(db, func(tx *sql.Tx) error {
		_, err = tx.Exec(migration.SQL)
		if err != nil {
			return fmt.Errorf("failed to execute migration: %w", err)
		}

		_, err = tx.Exec(
			"INSERT INTO migrations (name, ts) VALUES ($1, $2);",
			migration.Name,
			time.Now().Unix(),
		)

		return err
	})
}

// Source: https://www.reddit.com/r/golang/comments/18flz7z/defer_rollback_and_committing_a_transaction_in_a/
func WithTx(db *sql.DB, fn func(tx *sql.Tx) error) error {
	txn, err := db.Begin()
	if err != nil {
		return err
	}
	err = fn(txn)
	if err != nil {
		err2 := txn.Rollback()
		return errors.Join(err, err2)
	}
	return txn.Commit()
}

func (svc *dbService) Exec(query string, args ...any) (sql.Result, error) {
	fmt.Printf("SQL> %s\n", query)
	return svc.db.Exec(query, args...)
}

func (svc *dbService) Query(query string, args ...any) (*sql.Rows, error) {
	fmt.Printf("SQL> %s\n", query)
	return svc.db.Query(query, args...)
}

func (svc *dbService) QueryRow(query string, args ...any) *sql.Row {
	fmt.Printf("SQL> %s\n", query)
	return svc.db.QueryRow(query, args...)
}
