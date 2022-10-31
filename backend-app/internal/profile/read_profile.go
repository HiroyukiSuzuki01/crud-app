package profile

import (
	"backend-app/internal/config"
	"backend-app/internal/models"
	"math"
	"net/http"
	"strconv"
)

const limitPerPage = 5

// ReadProfile is read profile.
func ReadProfile(r *http.Request) ([]models.Profile, int, error) {
	var readProfiles []models.ReqdProfile
	var profiles []models.Profile

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
	totalPage := 0
	row := config.Db.QueryRow(cntQuery)
	if err := row.Scan(&count); err != nil {
		return profiles, totalPage, err
	}
	var i int
	page := r.URL.Query().Get("page")
	i, _ = strconv.Atoi(page)
	offsetCoefficient := i - 1
	offset := limitPerPage * offsetCoefficient

	totalPage = int(math.Ceil(float64(count) / float64(limitPerPage)))

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
		LIMIT ?
		OFFSET ?
	`

	rows, err := config.Db.Query(sqlStr, limitPerPage, offset)
	if err != nil {
		return profiles, totalPage, err
	}
	defer rows.Close()

	for rows.Next() {
		var profile models.ReqdProfile
		if err := rows.Scan(&profile.UserID, &profile.Name, &profile.Age, &profile.Gender,
			&profile.SelefDescription, &profile.Prefecture, &profile.Address, &profile.Hobby); err != nil {
			return profiles, totalPage, err
		}
		readProfiles = append(readProfiles, profile)
	}
	for _, v := range readProfiles {
		hobbies := []string{}
		if v.Hobby.Valid {
			hobbies = append(hobbies, v.Hobby.String)
		}
		profile := &models.Profile{
			UserID:          v.UserID,
			Name:            v.Name,
			Age:             v.Age,
			Gender:          v.Gender,
			SelfDescription: v.SelefDescription,
			Hobbies:         hobbies,
			Prefecture:      v.Prefecture,
			Address:         v.Address,
		}

		profiles = append(profiles, *profile)
	}

	return profiles, totalPage, nil
}
