package profile

import (
	"backend-app/internal/config"
	"backend-app/internal/models"
	"database/sql"
	"fmt"
	"math"
	"net/http"
	"strconv"
	"strings"
)

// SearchProfile is search user_profile.
func SearchProfile(r *http.Request) ([]models.Profile, int, error) {
	var reaadProfiles []models.ReqdProfile
	profiles := []models.Profile{}

	name := r.URL.Query().Get("name")
	prefID := r.URL.Query().Get("prefID")
	hobbiesStr := r.URL.Query().Get("hobbies")
	hobbies := make([]string, 0)

	if len(hobbiesStr) > 0 {
		hobbies = strings.Split(hobbiesStr, ",")
	}

	cntQuery := `
	    SELECT
			count(*)
        FROM user_profiles as u
		LEFT JOIN (
			SELECT user_id, GROUP_CONCAT(hobby_id) AS hobby_ids
			FROM user_profile_hobby AS up
			GROUP BY up.user_id
		) AS sub ON u.user_id = sub.user_id
	`

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
	var i int
	page := r.URL.Query().Get("page")
	i, _ = strconv.Atoi(page)
	offsetCoefficient := i - 1
	offset := limitPerPage * offsetCoefficient

	var args []interface{}
	var argsCnt []interface{}
	for _, hobby := range hobbies {
		args = append(args, hobby)
		argsCnt = append(argsCnt, hobby)
	}
	if len(name) > 0 {
		args = append(args, name)
		argsCnt = append(argsCnt, name)
	}
	if prefID != "-1" {
		args = append(args, prefID)
		argsCnt = append(argsCnt, prefID)
	}
	args = append(args, limitPerPage)
	args = append(args, offset)
	fmt.Println(args)

	repeat := "?"
	if len(hobbies) > 0 {
		repeat = strings.Repeat("?,", len(hobbies)-1) + "?"

		cntQuery = `
		    SELECT
				count(*)
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
	var row *sql.Row
	var err error
	totalPage := 0
	if len(name) > 0 {
		if prefID == "-1" {
			// name only or name and hobby
			cntQuery = cntQuery + "WHERE name LIKE CONCAT('%', ?, '%')"
			queryStr = queryStr + "WHERE name LIKE CONCAT('%', ?, '%')" + " LIMIT ?" + " OFFSET ?"
			row = config.Db.QueryRow(cntQuery, argsCnt...)
			rows, err = config.Db.Query(queryStr, args...)
		} else {
			// name & prefecture or name & prefecture & hobby
			cntQuery = cntQuery + "WHERE name LIKE CONCAT('%', ?, '%')" + " AND prefecture_id = ?"
			queryStr = queryStr + "WHERE name LIKE CONCAT('%', ?, '%')" + " AND prefecture_id = ?" + " LIMIT ?" + " OFFSET ?"
			row = config.Db.QueryRow(cntQuery, argsCnt...)
			rows, err = config.Db.Query(queryStr, args...)
		}
	} else if prefID != "-1" {
		// prefecture only or prefecutre & hobbies
		cntQuery = cntQuery + "WHERE prefecture_id = ?"
		queryStr = queryStr + "WHERE prefecture_id = ?" + " LIMIT ?" + " OFFSET ?"
		row = config.Db.QueryRow(cntQuery, argsCnt...)
		rows, err = config.Db.Query(queryStr, args...)
	} else {
		// hobby only
		row = config.Db.QueryRow(cntQuery, argsCnt...)
		rows, err = config.Db.Query(queryStr, args...)
	}

	if rows == nil {
		queryStr = queryStr + " LIMIT ?" + " OFFSET ?"
		row = config.Db.QueryRow(cntQuery, argsCnt...)
		rows, err = config.Db.Query(queryStr, args...)
	}

	if err != nil {
		return profiles, totalPage, err
	}
	defer rows.Close()

	count := 0
	if err := row.Scan(&count); err != nil {
		return profiles, totalPage, err
	}
	totalPage = int(math.Ceil(float64(count) / float64(limitPerPage)))

	for rows.Next() {
		var profile models.ReqdProfile
		if err := rows.Scan(&profile.UserID, &profile.Name, &profile.Age, &profile.Gender,
			&profile.SelefDescription, &profile.Prefecture, &profile.Address, &profile.Hobby); err != nil {
			return profiles, totalPage, err
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

	return profiles, totalPage, nil
}
