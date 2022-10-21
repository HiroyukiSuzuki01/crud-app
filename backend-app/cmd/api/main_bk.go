package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/go-sql-driver/mysql"
)

var db_test *sql.DB

// Album Type
type Album struct {
	ID     int64
	Title  string
	Artist string
	Price  float32
}

func main_bk() {
	// test := godotenv.Load(fmt.Sprintf("../../.env"))
	// fmt.Println(test)
	// fmt.Println("../../.env")

	cfg := mysql.Config{
		User:   "root",
		Passwd: "root",
		Net:    "tcp",
		Addr:   "dev-db:3306",
		DBName: "recordings",
	}

	var err error
	db_test, err = sql.Open("mysql", cfg.Clone().FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		fmt.Println("Ping")
		log.Fatal(pingErr)
	}
	fmt.Println("connected!")

	albums, err := albumByArtist("John Coltrane")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("albumByArtist")
	fmt.Printf("Albums found: %v\n", albums)

	alb, err := albumByID(2)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("albumByID")
	fmt.Printf("Album found: %v\n", alb)

	// insertAlb := Album{
	// 	Title:  "The Modern Sound of Betty Carter",
	// 	Artist: "Betty Carter",
	// 	Price:  49.99,
	// }
	// albID, err := addAlbum(insertAlb)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// fmt.Printf("ID of added album: %v\n", albID)
}

func albumByArtist(name string) ([]Album, error) {
	var albums []Album
	rows, err := db.Query("SELECT * FROM album WHERE artist = ?", name)
	if err != nil {
		return nil, fmt.Errorf("albumsByArtist %q: %v", name, err)
	}
	defer rows.Close()

	for rows.Next() {
		var alb Album
		if err := rows.Scan(&alb.ID, &alb.Title, &alb.Artist, &alb.Price); err != nil {
			return nil, fmt.Errorf("albumsByArtist %q: %v", name, err)
		}
		albums = append(albums, alb)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("albumsByArtist %q: %v", name, err)
	}
	return albums, nil
}

func albumByID(id int64) (Album, error) {
	var alb Album

	row := db.QueryRow("SELECT * FROM album WHERE id = ?", id)
	if err := row.Scan(&alb.ID, &alb.Title, &alb.Artist, &alb.Price); err != nil {
		if err == sql.ErrNoRows {
			return alb, fmt.Errorf("albumsById %d: no such album", id)
		}
		return alb, fmt.Errorf("albumsById %d: %v", id, err)
	}
	return alb, nil
}

// insert
func addAlbum(alb Album) (int64, error) {
	result, err := db.Exec("INSERT INTO album(title, artist, price) VALUES (?, ?, ?)", alb.Title, alb.Artist, alb.Price)
	if err != nil {
		return 0, fmt.Errorf("addAlbum: %v", err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("addAlbum: %v", err)
	}
	return id, nil
}
