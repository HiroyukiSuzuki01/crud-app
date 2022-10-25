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
		// w.Write(err)
		return
	}

	hobbies, err := master.HobbiesAll()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		// w.Write(err)
		return
	}

	masterData := map[string][]models.Master{"allPrefectures": prefectures, "allHobbies": hobbies}
	res, err := json.Marshal(masterData)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		// w.Write(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(res)
}
