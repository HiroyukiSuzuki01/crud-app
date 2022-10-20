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

// Master Type
type Master struct {
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

	mux := http.NewServeMux()
	mux.HandleFunc("/masterData", masterDataHandler)
	// mux.HandleFunc("/regist", registHandler)
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":8080", handler)
}

func masterDataHandler(w http.ResponseWriter, r *http.Request) {
	prefectures, err := prefectureAll()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		// w.Write(err)
		return
	}

	hobbies, err := hobbiesAll()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		// w.Write(err)
		return
	}
	masterData := map[string][]Master{"prefectures": prefectures, "hobbies": hobbies}
	res, err := json.Marshal(masterData)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		// w.Write([]byte(err))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

// get All prefecutres
func prefectureAll() ([]Master, error) {
	var prefectures []Master
	rows, err := db.Query("SELECT id, name FROM prefectures")
	if err != nil {
		return nil, fmt.Errorf("prefecutreAll: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var prefecture Master
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

func hobbiesAll() ([]Master, error) {
	var hobbies []Master
	rows, err := db.Query("SELECT id, name FROM hobbies")
	if err != nil {
		return nil, fmt.Errorf("prefecutreAll: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var hobby Master
		if err := rows.Scan(&hobby.ID, &hobby.Name); err != nil {
			return nil, fmt.Errorf("prefecutreAll: %v", err)
		}
		hobbies = append(hobbies, hobby)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("prefecutreAll: %v", err)
	}
	return hobbies, nil
}

// func registHandler(w http.ResponseWriter, r *http.Request) {
// 	// 処理
// 	regist(r)
// 	fmt.Fprintf(w, "testaa")
// 	w.WriteHeader(http.StatusOK)
// }

// func regist(r *http.Request) {
// 	body, err := io.ReadAll(r.Body)
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// 	defer r.Body.Close()

// 	fmt.Println(body)
// }
