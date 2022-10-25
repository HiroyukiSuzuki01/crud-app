package profile

import (
	"backend-app/internal/config"
	"database/sql"
	"fmt"
	"net/http"
	"strings"
)

// SearchProfile is search user_profile.
func SearchProfile(r *http.Request) {
	var profiles []profile
	searchProfiles := map[string]*showProfile{}

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
	name := "test"
	prefectureID := "-1"
	hobbies := []string{"1", "2"}
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
		} else {
			// hobbies only
			queryStr = queryStr + `WHERE hobby_id IN ( ` + repeat + ` )`
			rows, err = config.Db.Query(queryStr, args...)
		}
	}
	fmt.Println(queryStr)

	if rows == nil {
		rows, err = config.Db.Query(queryStr)
	}
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
		exisProfile, ok := searchProfiles[v.UserID]
		if ok {
			if v.Hobby != nil {
				hobbies := append(exisProfile.Hobbies, fmt.Sprintf("%v", v.Hobby))
				searchProfiles[v.UserID].Hobbies = hobbies
			}
		} else {
			hobbies := []string{}
			if v.Hobby != nil {
				hobbies = append(hobbies, fmt.Sprintf("%v", v.Hobby))
			}
			searchProfiles[v.UserID] = &showProfile{
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
