package profile

import (
	"backend-app/pkg/config"
	"backend-app/pkg/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// CreateProfile is insert user_profile.
func CreateProfile(r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println(err)
	}
	defer r.Body.Close()

	var registData models.Profile
	if err := json.Unmarshal(body, &registData); err != nil {
		fmt.Println(err)
	}

	result, err := config.Db.Exec(
		"INSERT INTO user_profiles(name, age, gender, selfDescription, prefecture_id, address, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
		registData.Name, registData.Age, registData.Gender, registData.SelfDescription, registData.Prefecture, registData.Address, time.Now(), time.Now())
	if err != nil {
		fmt.Println(err)
	}
	UserID, err := result.LastInsertId()
	if err != nil {
		fmt.Println(err)
	}

	if len(registData.Hobbies) != 0 {
		for _, hobbyID := range registData.Hobbies {
			_, err := config.Db.Exec(
				"INSERT INTO user_profile_hobby(user_id, hobby_id, created_at, updated_at) VALUES(?, ?, ?, ?)",
				UserID, hobbyID, time.Now(), time.Now())

			if err != nil {
				fmt.Println(err)
			}
		}
	}

}
