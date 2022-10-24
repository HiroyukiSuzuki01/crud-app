package handlers

import (
	"backend-app/pkg/profile"
	"net/http"
)

// ProfileCreateHandler is to crate user_profiles
func ProfileCreateHandler(w http.ResponseWriter, r *http.Request) {
	profile.CreateProfile(r)
	w.WriteHeader(http.StatusOK)
}

// UpdateHandler is to update user_profiles
func UpdateHandler(w http.ResponseWriter, r *http.Request) {
	profile.UpdateProfile(r)
	w.WriteHeader(http.StatusOK)
}

// DeleteHandler is to delete user_profiles
func DeleteHandler(w http.ResponseWriter, r *http.Request) {
	profile.DeleteProfile(r)
	w.WriteHeader(http.StatusOK)
}

// SearchHandler is to search user_profiles
func SearchHandler(w http.ResponseWriter, r *http.Request) {
	profile.SearchProfile(r)
	w.WriteHeader(http.StatusOK)
}

// ReadHandler is to fetch user_profiles at init page
func ReadHandler(w http.ResponseWriter, r *http.Request) {
	profile.ReadProfile()
	w.WriteHeader(http.StatusOK)
}
