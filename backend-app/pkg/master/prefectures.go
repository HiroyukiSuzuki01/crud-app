package master

import (
	"backend-app/pkg/config"
	"backend-app/pkg/models"
	"fmt"
)

// PrefectureAll get all Prefecture Data
func PrefectureAll() ([]models.Master, error) {
	var prefectures []models.Master
	rows, err := config.Db.Query("SELECT id, name FROM prefectures")
	if err != nil {
		return nil, fmt.Errorf("PrefectureAll: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var prefecture models.Master
		if err := rows.Scan(&prefecture.ID, &prefecture.Name); err != nil {
			return nil, fmt.Errorf("PrefectureAll: %v", err)
		}
		prefectures = append(prefectures, prefecture)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("PrefectureAll: %v", err)
	}

	return prefectures, nil
}
