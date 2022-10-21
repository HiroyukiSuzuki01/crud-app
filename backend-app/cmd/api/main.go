package main

import (
	"backend-app/pkg/config"
	"backend-app/pkg/handlers"
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
	mux.HandleFunc("/masterData", handlers.MasterDataHandler)
	mux.HandleFunc("/regist", handlers.RegistHandler)
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(fmt.Sprintf(":%v", cfg.port), handler)
}