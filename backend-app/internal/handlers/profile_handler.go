package handlers

import (
	"backend-app/internal/profile"
	"encoding/json"
	"net/http"
)

// ProfileCreateHandler is to crate user_profiles
func ProfileCreateHandler(w http.ResponseWriter, r *http.Request) {
	err := profile.CreateProfile(r)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
}

// UpdateHandler is to update user_profiles
func UpdateHandler(w http.ResponseWriter, r *http.Request) {
	profile.UpdateProfile(r)
	w.WriteHeader(http.StatusOK)
}

// DeleteHandler is to delete user_profiles
func DeleteHandler(w http.ResponseWriter, r *http.Request) {
	err := profile.DeleteProfile(r)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
}

// SearchHandler is to search user_profiles
func SearchHandler(w http.ResponseWriter, r *http.Request) {
	profiles, err := profile.SearchProfile(r)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	res, err := json.Marshal(profiles)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

// ReadHandler is to fetch user_profiles at init page
func ReadHandler(w http.ResponseWriter, r *http.Request) {
	profiles, err := profile.ReadProfile()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	res, err := json.Marshal(profiles)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}
