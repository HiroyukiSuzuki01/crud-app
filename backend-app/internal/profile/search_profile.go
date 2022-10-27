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
	profilesByID := map[string]*models.Profile{}

	name := r.URL.Query().Get("name")
	prefID := r.URL.Query().Get("prefID")
	hobbiesStr := r.URL.Query().Get("hobbies")
	hobbies := make([]string, 0)
	if len(hobbiesStr) > 0 {
		hobbies = strings.Split(hobbiesStr, ",")
	}

	queryStr := `
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
	var args []interface{}
	if len(name) > 0 {
		args = append(args, name)
	}
	if prefID != "-1" {
		args = append(args, prefID)
	}
	for _, hobby := range hobbies {
		args = append(args, hobby)
	}
	repeat := "?"
	if len(hobbies) > 0 {
		repeat = strings.Repeat("?,", len(hobbies)-1) + "?"
	}

	var rows *sql.Rows
	var err error
	if len(name) > 0 {
		if prefID == "-1" && len(hobbies) == 0 {
			// name only
			queryStr = queryStr + "WHERE name LIKE CONCAT('%', ?, '%')"
			rows, err = config.Db.Query(queryStr, args...)
		} else if prefID != "-1" && len(hobbies) == 0 {
			// name & prefecture
			queryStr = queryStr + "WHERE name LIKE CONCAT('%', ?, '%')" + " AND prefecture_id = ?"
			rows, err = config.Db.Query(queryStr, args...)
		} else if prefID == "-1" && len(hobbies) > 0 {
			// name & hobby
			queryStr = queryStr + "WHERE name LIKE CONCAT('%', ?, '%')" + ` AND hobby_id IN ( ` + repeat + ` )`
			rows, err = config.Db.Query(queryStr, args...)
		} else {
			// name & prefecture & hobby
			queryStr = queryStr + "WHERE name LIKE CONCAT('%', ?, '%')" + " AND prefecture_id = ?" + ` AND hobby_id IN ( ` + repeat + ` )`
			rows, err = config.Db.Query(queryStr, args...)
		}
	} else {
		if prefID != "-1" {
			if len(hobbies) > 0 {
				// prefecutre & hobbies
				queryStr = queryStr + "WHERE prefecture_id = ?" + ` AND hobby_id IN ( ` + repeat + ` )`
				rows, err = config.Db.Query(queryStr, args...)
			} else {
				// prefecture only
				queryStr = queryStr + "WHERE prefecture_id = ?"
				rows, err = config.Db.Query(queryStr, args...)
			}
		} else if len(hobbies) > 0 {
			// hobbies only
			queryStr = queryStr + `WHERE hobby_id IN ( ` + repeat + ` )`
			rows, err = config.Db.Query(queryStr, args...)
		}
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
