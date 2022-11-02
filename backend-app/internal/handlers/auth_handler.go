package handlers

import (
	"backend-app/internal/auth"
	"encoding/json"
	"fmt"
	"net/http"
)

// LoginHandler crud_app
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	token, err := auth.Login(w, r)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	}

	data := map[string]string{"response": token}
	res, err := json.Marshal(data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

// LogoutHandler crud_app
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("aa")
	w.WriteHeader(http.StatusOK)
}

// SignUpHandler create new user
func SignUpHandler(w http.ResponseWriter, r *http.Request) {
	err := auth.SignUp(w, r)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
}
