package profile

import (
	"backend-app/internal/config"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type updateProfile struct {
	UserID          string   `json:"userid"`
	Name            string   `json:"name"`
	Age             string   `json:"age"`
	Gender          string   `json:"gender"`
	SelfDescription string   `json:"selfDescription"`
	Hobbies         []string `json:"hobbies"`
	Prefecture      string   `json:"prefecture"`
	Address         string   `json:"address"`
}

// UpdateProfile is update user_profile.
func UpdateProfile(r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println(err)
	}
	defer r.Body.Close()

	var updateData updateProfile
	if err := json.Unmarshal(body, &updateData); err != nil {
		fmt.Println(err)
	}

	upd, err := config.Db.Prepare(`
	    UPDATE user_profiles
		SET
		    name = ?,
			age  = ?,
			gender = ?,
			selfDescription = ?,
			prefecture_id = ?,
			address = ?
		WHERE user_id = ?
	`)
	if err != nil {
		fmt.Println(err)
	}
	upd.Exec(updateData.Name, updateData.Age, updateData.Gender,
		updateData.SelfDescription, updateData.Prefecture, updateData.Address, updateData.UserID)
	defer upd.Close()

	_, err = config.Db.Exec(
		"DELETE FROM user_profile_hobby WHERE user_id = ?", updateData.UserID)
	if err != nil {
		fmt.Println(err)
	}

	for _, v := range updateData.Hobbies {
		_, err := config.Db.Exec(
			"INSERT INTO user_profile_hobby(user_id, hobby_id, created_at, updated_at) VALUES(?, ?, ?, ?)",
			updateData.UserID, v, time.Now(), time.Now())
		if err != nil {
			fmt.Println(err)
		}
	}
}
