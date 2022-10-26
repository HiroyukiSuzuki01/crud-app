package main

import (
	"backend-app/internal/handlers"
	"net/http"
)

func routes() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/masterData", handlers.MasterDataHandler)
	mux.HandleFunc("/profile/create", handlers.ProfileCreateHandler)
	mux.HandleFunc("/profile/update", handlers.UpdateHandler)
	mux.HandleFunc("/profile/delete", handlers.DeleteHandler)
	mux.HandleFunc("/profile/search", handlers.SearchHandler)
	mux.HandleFunc("/profile/", handlers.ReadHandler)

	return mux
}
