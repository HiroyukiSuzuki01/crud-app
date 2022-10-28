package handlers

import (
	"backend-app/internal/models"
	"backend-app/internal/profile"
	"encoding/json"
	"net/http"
)

type resultType struct {
	Profiles []models.Profile `json:"profiles"`
	Count    int              `json:"count"`
}

// CreateProfileHandler is to crate user_profiles
func CreateProfileHandler(w http.ResponseWriter, r *http.Request) {
	err := profile.CreateProfile(r)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
}

// UpdateProfileHandler is to update user_profiles
func UpdateProfileHandler(w http.ResponseWriter, r *http.Request) {
	err := profile.UpdateProfile(r)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
}

// DeleteProfileHandler is to delete user_profiles
func DeleteProfileHandler(w http.ResponseWriter, r *http.Request) {
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
	profiles, count, err := profile.ReadProfile()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	data := resultType{
		Profiles: profiles,
		Count:    count,
	}
	res, err := json.Marshal(data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}
