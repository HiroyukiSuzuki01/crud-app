package profile

import (
	"backend-app/pkg/config"
	"fmt"
)

type profile struct {
	UserID           string `json:"userid"`
	Name             string `json:"name"`
	Age              string `json:"age"`
	Gender           string `json:"gender"`
	SelefDescription string `json:"selfDescription"`
	Prefecture       string `json:"prefecture"`
	Address          string `json:"address"`
	Hobby            string `json:"hobby"`
}

type showProfile struct {
	UserID          string   `json:"userid"`
	Name            string   `json:"name"`
	Age             string   `json:"age"`
	Gender          string   `json:"gender"`
	SelfDescription string   `json:"selfDescription"`
	Hobbies         []string `json:"hobbies"`
	Prefecture      string   `json:"prefecture"`
	Address         string   `json:"address"`
}

// ReadProfile is read profile.
func ReadProfile() {
	var profiles []profile
	showProfiles := map[string]*showProfile{}
	sqlStr := `
	    SELECT
		    user_profiles.user_id,
			user_profiles.name,
			user_profiles.age,
			user_profiles.gender,
			user_profiles.selfDescription,
			user_profiles.prefecture_id,
			user_profiles.address,
			user_profile_hobby.hobby_id
		FROM user_profiles
		LEFT JOIN user_profile_hobby ON user_profiles.user_id = user_profile_hobby.user_id
	`
	rows, err := config.Db.Query(sqlStr)
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()

	for rows.Next() {
		var profile profile
		if err := rows.Scan(&profile.UserID, &profile.Name, &profile.Age, &profile.Gender,
			&profile.SelefDescription, &profile.Prefecture, &profile.Address, &profile.Hobby); err != nil {
			fmt.Println(err)
		}
		profiles = append(profiles, profile)
	}
	for _, v := range profiles {
		exisProfile, ok := showProfiles[v.UserID]
		if ok {
			hobbies := append(exisProfile.Hobbies, v.Hobby)
			showProfiles[v.UserID].Hobbies = hobbies
		} else {
			hobbies := []string{v.Hobby}
			showProfiles[v.UserID] = &showProfile{
				UserID:          v.UserID,
				Name:            v.Name,
				Age:             v.Age,
				Gender:          v.Gender,
				SelfDescription: v.SelefDescription,
				Hobbies:         hobbies,
				Prefecture:      v.Prefecture,
				Address:         v.Address,
			}
		}
	}
}
