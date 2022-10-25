package profile

import (
	"encoding/json"
	"io"
	"net/http"
)

type deleteType struct {
	UserID string `json:"userId"`
}

// DeleteProfile is delete user_profile.
func DeleteProfile(r *http.Request) error {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return err
	}
	defer r.Body.Close()

	var deleteID deleteType
	if err := json.Unmarshal(body, &deleteID); err != nil {
		return err
	}

	// _, err = config.Db.Exec(
	// 	"DELETE FROM user_profiles where user_id = ?", deleteID.UserID)

	// if err != nil {
	// 	return err
	// }
	return nil
}
