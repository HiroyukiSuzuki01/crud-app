package main

import (
	"backend-app/pkg/config"
	"backend-app/pkg/handlers"
	"net/http"

	"github.com/rs/cors"
)

func main() {
	// init DbConnection
	config.DbConnection()
	defer config.Db.Close()

	mux := http.NewServeMux()
	mux.HandleFunc("/masterData", handlers.MasterDataHandler)
	mux.HandleFunc("/regist", handlers.RegistHandler)
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":8080", handler)

	// mux := http.NewServeMux()
	// mux.HandleFunc("/masterData", masterDataHandler)
	// mux.HandleFunc("/regist", registHandler)
	// handler := cors.Default().Handler(mux)
	// http.ListenAndServe(":8080", handler)
}

// func registHandler(w http.ResponseWriter, r *http.Request) {
// 	// 処理
// 	regist(r)
// 	w.WriteHeader(http.StatusOK)
// }

// func regist(r *http.Request) {
// 	body, err := io.ReadAll(r.Body)
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// 	defer r.Body.Close()

// 	var registData registData
// 	if err := json.Unmarshal(body, &registData); err != nil {
// 		fmt.Println(err)
// 	}

// 	result, err := db.Exec(
// 		"INSERT INTO user_profiles(name, age, gender, selfDescription, prefecture_id, address, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
// 		registData.Name, registData.Age, registData.Gender, registData.SelfDescription, registData.Prefecture, registData.Address, time.Now(), time.Now())
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// 	UserID, err := result.LastInsertId()
// 	if err != nil {
// 		fmt.Println(err)
// 	}

// 	if len(registData.Hobbies) != 0 {
// 		for _, hobbyID := range registData.Hobbies {
// 			_, err := db.Exec("INSERT INTO user_profile_hobby(user_id, hobby_id, created_at, updated_at) VALUES(?, ?, ?, ?)",
// 				UserID, hobbyID, time.Now(), time.Now())

// 			if err != nil {
// 				fmt.Println(err)
// 			}
// 		}
// 	}
// }
