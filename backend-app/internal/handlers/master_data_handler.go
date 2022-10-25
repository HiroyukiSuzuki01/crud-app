package handlers

import (
	"backend-app/internal/master"
	"backend-app/internal/models"
	"encoding/json"
	"net/http"
)

// MasterDataHandler get MasterData
func MasterDataHandler(w http.ResponseWriter, r *http.Request) {
	prefectures, err := master.PrefectureAll()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	hobbies, err := master.HobbiesAll()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	masterData := map[string][]models.Master{"allPrefectures": prefectures, "allHobbies": hobbies}
	res, err := json.Marshal(masterData)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(res)
}
