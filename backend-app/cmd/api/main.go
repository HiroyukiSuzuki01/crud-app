package main

import (
	"backend-app/pkg/config"
	"backend-app/pkg/handlers"
	"net/http"

	"github.com/rs/cors"
)

func main() {
	// init DbConnection
	config.DbConnection()
	defer config.Db.Close()

	mux := http.NewServeMux()
	mux.HandleFunc("/masterData", handlers.MasterDataHandler)
	mux.HandleFunc("/regist", handlers.RegistHandler)
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":8080", handler)
}
