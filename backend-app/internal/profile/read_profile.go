package profile

import (
	"backend-app/internal/config"
	"backend-app/internal/models"
)

// ReadProfile is read profile.
func ReadProfile() ([]models.Profile, error) {
	var readProfiles []models.ReqdProfile
	var profiles []models.Profile
	profilesByID := map[string]*models.Profile{}

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
		return profiles, err
	}
	defer rows.Close()

	for rows.Next() {
		var profile models.ReqdProfile
		if err := rows.Scan(&profile.UserID, &profile.Name, &profile.Age, &profile.Gender,
			&profile.SelefDescription, &profile.Prefecture, &profile.Address, &profile.Hobby); err != nil {
			return profiles, err
		}
		readProfiles = append(readProfiles, profile)
	}
	for _, v := range readProfiles {
		exisProfile, ok := profilesByID[v.UserID]
		if ok {
			if v.Hobby.Valid {
				hobbies := append(exisProfile.Hobbies, v.Hobby.String)
				profilesByID[v.UserID].Hobbies = hobbies
			}
		} else {
			hobbies := []string{}
			if v.Hobby.Valid {
				hobbies = append(hobbies, v.Hobby.String)
			}
			profilesByID[v.UserID] = &models.Profile{
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
	for _, v := range profilesByID {
		profiles = append(profiles, *v)
	}
	return profiles, nil
}
