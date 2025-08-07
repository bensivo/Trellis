package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/bensivo/trellis/api/http_controller"
	"github.com/bensivo/trellis/api/service"
	"github.com/bensivo/trellis/api/util"
	_ "github.com/mattn/go-sqlite3"
)

var port = 3000
var dbDriver = "sqlite3"
var dbPath = "./trellis-api.db"

func main() {
	// DB
	db, err := sql.Open(dbDriver, dbPath)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Services
	dbSvc := service.NewDbService(db)
	healthSvc := service.NewHealthService()
	userSvc := service.NewUserService(dbSvc)

	err = dbSvc.RunMigrations()
	if err != nil {
		log.Fatal(err)
	}

	// HTTP Controllers
	healthHttpController := http_controller.NewHealthHttpController(healthSvc)
	userHttpController := http_controller.NewUsersHttpController(userSvc)

	// HTTP Mux
	mux := &http.ServeMux{}
	healthHttpController.RegisterRoutes(mux)
	userHttpController.RegisterRoutes(mux)

	// CORS
	cors := util.Cors([]string{
		"http://localhost:4200",
	})
	handler := cors.Handler(mux)

	fmt.Printf("Listening on http://localhost:%d\n", port)
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), handler)
	if err != nil {
		panic(err)
	}
}
