package profile

import (
	"backend-app/internal/config"
	"database/sql"
)

type profile struct {
	UserID           string         `json:"userId"`
	Name             string         `json:"name"`
	Age              string         `json:"age"`
	Gender           string         `json:"gender"`
	SelefDescription string         `json:"selfDescription"`
	Prefecture       string         `json:"prefecture"`
	Address          string         `json:"address"`
	Hobby            sql.NullString `json:"hobby"`
}

// ShowProfile Type
type ShowProfile struct {
	UserID          string   `json:"userId"`
	Name            string   `json:"name"`
	Age             string   `json:"age"`
	Gender          string   `json:"gender"`
	SelfDescription string   `json:"selfDescription"`
	Hobbies         []string `json:"hobbies"`
	Prefecture      string   `json:"prefecture"`
	Address         string   `json:"address"`
}

// ReadProfile is read profile.
func ReadProfile() ([]ShowProfile, error) {
	var profiles []profile
	var convProfiles []ShowProfile
	showProfiles := map[string]*ShowProfile{}
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
		return convProfiles, err
	}
	defer rows.Close()

	for rows.Next() {
		var profile profile
		if err := rows.Scan(&profile.UserID, &profile.Name, &profile.Age, &profile.Gender,
			&profile.SelefDescription, &profile.Prefecture, &profile.Address, &profile.Hobby); err != nil {
			return convProfiles, err
		}
		profiles = append(profiles, profile)
	}
	for _, v := range profiles {
		exisProfile, ok := showProfiles[v.UserID]
		if ok {
			if v.Hobby.Valid {
				hobbies := append(exisProfile.Hobbies, v.Hobby.String)
				showProfiles[v.UserID].Hobbies = hobbies
			}
		} else {
			hobbies := []string{}
			if v.Hobby.Valid {
				hobbies = append(hobbies, v.Hobby.String)
			}
			showProfiles[v.UserID] = &ShowProfile{
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
	for _, v := range showProfiles {
		convProfiles = append(convProfiles, *v)
	}
	return convProfiles, nil
}
