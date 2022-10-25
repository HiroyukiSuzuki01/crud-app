package main

import (
	"backend-app/internal/config"
	"backend-app/internal/handlers"
	"flag"
	"fmt"
	"net/http"

	"github.com/rs/cors"
)

type cfg struct {
	port        string
	environment string
}

func main() {
	var cfg cfg
	flag.StringVar(&cfg.port, "port", "8080", "port Number")
	flag.StringVar(&cfg.environment, "environment", "development", "development | production")
	flag.Parse()

	// init DbConnection
	config.DbConnection()
	defer config.Db.Close()

	mux := http.NewServeMux()

	cors := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{
			http.MethodPost,
			http.MethodGet,
			http.MethodPatch,
			http.MethodPut,
			http.MethodDelete,
		},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: false,
	})

	mux.HandleFunc("/masterData", handlers.MasterDataHandler)
	mux.HandleFunc("/profile/create", handlers.ProfileCreateHandler)
	mux.HandleFunc("/profile/update", handlers.UpdateHandler)
	mux.HandleFunc("/profile/delete", handlers.DeleteHandler)
	mux.HandleFunc("/profile/search", handlers.SearchHandler)
	mux.HandleFunc("/profile/", handlers.ReadHandler)

	handler := cors.Handler(mux)
	http.ListenAndServe(fmt.Sprintf(":%v", cfg.port), handler)
}
