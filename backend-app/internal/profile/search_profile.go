package profile

import (
	"backend-app/internal/config"
	"database/sql"
	"net/http"
	"strings"
)

// SearchProfile is search user_profile.
func SearchProfile(r *http.Request) ([]ShowProfile, error) {
	var profiles []profile
	var convProfiles []ShowProfile
	searchProfiles := map[string]*ShowProfile{}

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
	name := ""
	prefectureID := "-1"
	hobbies := []string{}
	var args []interface{}
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
		if prefectureID == "-1" && len(hobbies) == 0 {
			// name only
			queryStr = queryStr + "WHERE name LIKE CONCAT('%', ?, '%')"
			rows, err = config.Db.Query(queryStr, name)
		} else if prefectureID != "-1" && len(hobbies) == 0 {
			// name & prefecture
			queryStr = queryStr + "WHERE name LIKE CONCAT('%', ?, '%')" + " AND prefecture_id = ?"
			rows, err = config.Db.Query(queryStr, name, prefectureID)
		} else if prefectureID == "-1" && len(hobbies) > 0 {
			// name & hobby
			queryStr = queryStr + "WHERE name LIKE CONCAT('%', ?, '%')" + ` AND hobby_id IN ( ` + repeat + ` )`
			rows, err = config.Db.Query(queryStr, name, hobbies)
		} else {
			// name & prefecture & hobby
			queryStr = queryStr + "WHERE name LIKE CONCAT('%', ?, '%')" + " AND prefecture_id = ?" + ` AND hobby_id IN ( ` + repeat + ` )`
			rows, err = config.Db.Query(queryStr, name, prefectureID, hobbies)
		}
	} else {
		if prefectureID != "-1" {
			if len(hobbies) > 0 {
				// prefecutre & hobbies
				queryStr = queryStr + "WHERE prefecture_id = ?" + ` AND hobby_id IN ( ` + repeat + ` )`
				rows, err = config.Db.Query(queryStr, prefectureID, args)
			} else {
				// prefecture only
				queryStr = queryStr + "WHERE prefecture_id = ?"
				rows, err = config.Db.Query(queryStr, prefectureID)
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
		return convProfiles, nil
	}
	defer rows.Close()

	for rows.Next() {
		var profile profile
		if err := rows.Scan(&profile.UserID, &profile.Name, &profile.Age, &profile.Gender,
			&profile.SelefDescription, &profile.Prefecture, &profile.Address, &profile.Hobby); err != nil {
			return convProfiles, nil
		}
		profiles = append(profiles, profile)
	}

	for _, v := range profiles {
		exisProfile, ok := searchProfiles[v.UserID]
		if ok {
			if v.Hobby.Valid {
				hobbies := append(exisProfile.Hobbies, v.Hobby.String)
				searchProfiles[v.UserID].Hobbies = hobbies
			}
		} else {
			hobbies := []string{}
			if v.Hobby.Valid {
				hobbies = append(hobbies, v.Hobby.String)
			}
			searchProfiles[v.UserID] = &ShowProfile{
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
	for _, v := range searchProfiles {
		convProfiles = append(convProfiles, *v)
	}
	return convProfiles, nil
}
