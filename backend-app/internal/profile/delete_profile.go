package profile

import (
	"backend-app/internal/config"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type deleteType struct {
	UserID string `json:"userid"`
}

// DeleteProfile is delete user_profile.
func DeleteProfile(r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println(err)
	}
	defer r.Body.Close()

	var deleteID deleteType
	if err := json.Unmarshal(body, &deleteID); err != nil {
		fmt.Println(err)
	}

	_, err = config.Db.Exec(
		"DELETE FROM user_profiles where user_id = ?", deleteID.UserID)

	if err != nil {
		fmt.Println(err)
	}
}
