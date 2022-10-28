package profile

import (
	"backend-app/internal/config"
	"backend-app/internal/models"
	"database/sql"
	"net/http"
	"strings"
)

// SearchProfile is search user_profile.
func SearchProfile(r *http.Request) ([]models.Profile, error) {
	var reaadProfiles []models.ReqdProfile
	profiles := []models.Profile{}

	name := r.URL.Query().Get("name")
	prefID := r.URL.Query().Get("prefID")
	hobbiesStr := r.URL.Query().Get("hobbies")
	hobbies := make([]string, 0)

	if len(hobbiesStr) > 0 {
		hobbies = strings.Split(hobbiesStr, ",")
	}

	queryStr := `
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
	var args []interface{}
	for _, hobby := range hobbies {
		args = append(args, hobby)
	}
	if len(name) > 0 {
		args = append(args, name)
	}
	if prefID != "-1" {
		args = append(args, prefID)
	}

	repeat := "?"
	if len(hobbies) > 0 {
		repeat = strings.Repeat("?,", len(hobbies)-1) + "?"

		queryStr = `
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
			INNER JOIN (
				SELECT user_id, GROUP_CONCAT(hobby_id) AS hobby_ids
				FROM user_profile_hobby AS up
				WHERE up.user_id IN (
					SELECT user_id
					FROM user_profile_hobby AS up2
					WHERE up2.hobby_id IN ( ` + repeat + ` )
				)
				GROUP BY up.user_id
			) AS sub ON u.user_id = sub.user_id
		`
	}

	var rows *sql.Rows
	var err error
	if len(name) > 0 {
		if prefID == "-1" {
			// name only or name and hobby
			queryStr = queryStr + "WHERE name LIKE CONCAT('%', ?, '%')"
			rows, err = config.Db.Query(queryStr, args...)
		} else {
			// name & prefecture or name & prefecture & hobby
			queryStr = queryStr + "WHERE name LIKE CONCAT('%', ?, '%')" + " AND prefecture_id = ?"
			rows, err = config.Db.Query(queryStr, args...)
		}
	} else if prefID != "-1" {
		// prefecture only or prefecutre & hobbies
		queryStr = queryStr + "WHERE prefecture_id = ?"
		rows, err = config.Db.Query(queryStr, args...)
	} else {
		// hobby only
		rows, err = config.Db.Query(queryStr, args...)
	}

	if rows == nil {
		rows, err = config.Db.Query(queryStr)
	}
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
		reaadProfiles = append(reaadProfiles, profile)
	}

	for _, v := range reaadProfiles {
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

	return profiles, nil
}
