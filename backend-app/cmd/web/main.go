package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-sql-driver/mysql"
	"github.com/rs/cors"
)

var db *sql.DB

// Prefecture Type
type Prefecture struct {
	ID   string
	Name string
}

func main() {
	// todo: envに持たせる
	// todo: db接続情報をパッケージ化
	cfg := mysql.Config{
		User:   "root",
		Passwd: "root",
		Net:    "tcp",
		Addr:   "dev-db:3306",
		DBName: "crud_app",
	}

	var err error
	db, err = sql.Open("mysql", cfg.Clone().FormatDSN())
	defer db.Close()

	if err != nil {
		log.Fatal(err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}

	// http.HandleFunc("/prefectures", prefectureHandler)
	// http.ListenAndServe(":8080", nil)
	mux := http.NewServeMux()
	mux.HandleFunc("/prefectures", prefectureHandler)
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":8080", handler)
}

func prefectureHandler(w http.ResponseWriter, r *http.Request) {
	prefectures, err := prefectureAll()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		// w.Write(err)
		return
	}
	res, err := json.Marshal(prefectures)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		// w.Write([]byte(err))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

// get All prefecutres
func prefectureAll() ([]Prefecture, error) {
	var prefectures []Prefecture
	rows, err := db.Query("SELECT id, name FROM prefectures")
	if err != nil {
		return nil, fmt.Errorf("prefecutreAll: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var prefecture Prefecture
		if err := rows.Scan(&prefecture.ID, &prefecture.Name); err != nil {
			return nil, fmt.Errorf("prefecutreAll: %v", err)
		}
		prefectures = append(prefectures, prefecture)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("prefecutreAll: %v", err)
	}
	return prefectures, nil
}
