package main

import (
	"backend-app/internal/handlers"
	"net/http"
)

func routes() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/masterData", handlers.MasterDataHandler)

	mux.HandleFunc("/profile/", handlers.ReadHandler)
	mux.HandleFunc("/profile/create", handlers.CreateProfileHandler)
	mux.HandleFunc("/profile/update", handlers.UpdateProfileHandler)
	mux.HandleFunc("/profile/delete", handlers.DeleteProfileHandler)
	mux.HandleFunc("/profile/search", handlers.SearchHandler)

	mux.HandleFunc("/login/", handlers.LoginHandler)
	mux.HandleFunc("/logout/", handlers.LogoutHandler)
	mux.HandleFunc("/signup/", handlers.SignUpHandler)

	return mux
}
