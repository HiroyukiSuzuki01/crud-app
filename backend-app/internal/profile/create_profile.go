package profile

import (
	"backend-app/internal/config"
	"encoding/json"
	"io"
	"net/http"
	"time"
)

type createProfile struct {
	Name            string   `json:"name"`
	Age             string   `json:"age"`
	Gender          string   `json:"gender"`
	SelfDescription string   `json:"selfDescription"`
	Hobbies         []string `json:"hobbies"`
	Prefecture      string   `json:"prefecture"`
	Address         string   `json:"address"`
}

// CreateProfile is insert user_profile.
func CreateProfile(r *http.Request) error {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return err
	}
	defer r.Body.Close()

	var registData createProfile
	if err := json.Unmarshal(body, &registData); err != nil {
		return err
	}

	result, err := config.Db.Exec(
		"INSERT INTO user_profiles(name, age, gender, self_description, prefecture_id, address, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
		registData.Name, registData.Age, registData.Gender, registData.SelfDescription, registData.Prefecture, registData.Address, time.Now(), time.Now())
	if err != nil {
		return err
	}
	UserID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	if len(registData.Hobbies) != 0 {
		for _, hobbyID := range registData.Hobbies {
			_, err := config.Db.Exec(
				"INSERT INTO user_profile_hobby(user_id, hobby_id, created_at, updated_at) VALUES(?, ?, ?, ?)",
				UserID, hobbyID, time.Now(), time.Now())

			if err != nil {
				return err
			}
		}
	}
	return nil
}
