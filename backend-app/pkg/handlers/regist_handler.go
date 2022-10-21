package handlers

import (
	"backend-app/pkg/regist"
	"net/http"
)

// RegistHandler do Regist
func RegistHandler(w http.ResponseWriter, r *http.Request) {
	regist.Regist(r)
	w.WriteHeader(http.StatusOK)
}
