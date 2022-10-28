package profile

import (
	"backend-app/internal/config"
	"backend-app/internal/models"
)

const limitPerPage = 10

// ReadProfile is read profile.
func ReadProfile() ([]models.Profile, int, error) {
	var readProfiles []models.ReqdProfile
	var profiles []models.Profile
	profilesByID := map[string]*models.Profile{}

	cntQuery := `
	    SELECT
		    COUNT(*)
		FROM user_profiles AS u
		LEFT JOIN (
			SELECT user_id, GROUP_CONCAT(hobby_id) AS hobby_ids
			FROM user_profile_hobby AS up
			GROUP BY up.user_id
		) AS sub ON u.user_id = sub.user_id
	`

	count := 0
	row := config.Db.QueryRow(cntQuery)
	if err := row.Scan(&count); err != nil {
		return profiles, 0, err
	}

	sqlStr := `
	    SELECT
		    u.user_id,
			u.name,
			u.age,
			u.gender,
			u.self_description,
			u.prefecture_id,
			u.address,
			sub.hobby_ids
		FROM user_profiles as u
		LEFT JOIN (
			SELECT user_id, GROUP_CONCAT(hobby_id) AS hobby_ids
			FROM user_profile_hobby AS up
			GROUP BY up.user_id
		) AS sub ON u.user_id = sub.user_id
	`

	rows, err := config.Db.Query(sqlStr)
	if err != nil {
		return profiles, count, err
	}
	defer rows.Close()

	for rows.Next() {
		var profile models.ReqdProfile
		if err := rows.Scan(&profile.UserID, &profile.Name, &profile.Age, &profile.Gender,
			&profile.SelefDescription, &profile.Prefecture, &profile.Address, &profile.Hobby); err != nil {
			return profiles, count, err
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
	return profiles, count, nil
}
