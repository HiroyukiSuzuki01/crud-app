package master

import (
	"backend-app/internal/config"
	"backend-app/internal/models"
	"fmt"
)

// HobbiesAll get all Hobby
func HobbiesAll() ([]models.Master, error) {
	var hobbies []models.Master
	rows, err := config.Db.Query("SELECT id, name FROM hobbies")
	if err != nil {
		return nil, fmt.Errorf("HobbiesAll: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var hobby models.Master
		if err := rows.Scan(&hobby.ID, &hobby.Name); err != nil {
			return nil, fmt.Errorf("HobbyiesAll: %v", err)
		}
		hobbies = append(hobbies, hobby)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("HobbiesAll: %v", err)
	}

	return hobbies, nil
}
