package profile

import (
	"backend-app/internal/config"
	"backend-app/internal/models"
	"encoding/json"
	"io"
	"net/http"
	"time"
)

// UpdateProfile is update user_profile.
func UpdateProfile(r *http.Request) error {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return err
	}
	defer r.Body.Close()

	var updateData models.Profile
	if err := json.Unmarshal(body, &updateData); err != nil {
		return err
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
		return err
	}
	upd.Exec(updateData.Name, updateData.Age, updateData.Gender,
		updateData.SelfDescription, updateData.Prefecture, updateData.Address, updateData.UserID)
	defer upd.Close()

	_, err = config.Db.Exec(
		"DELETE FROM user_profile_hobby WHERE user_id = ?", updateData.UserID)
	if err != nil {
		return err
	}

	for _, v := range updateData.Hobbies {
		_, err := config.Db.Exec(
			"INSERT INTO user_profile_hobby(user_id, hobby_id, created_at, updated_at) VALUES(?, ?, ?, ?)",
			updateData.UserID, v, time.Now(), time.Now())
		if err != nil {
			return err
		}
	}
	return nil
}
