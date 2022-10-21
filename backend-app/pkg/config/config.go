package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

// Db sql Connection Config
var Db *sql.DB

// DbConnection create sql Connection
func DbConnection() {
	var err error
	err = godotenv.Load(fmt.Sprint("/go/src/app/.env"))
	if err != nil {
		log.Fatal(err)
	}
	cfg := mysql.Config{
		User:   os.Getenv("DB_USER"),
		Passwd: os.Getenv("DB_PASS"),
		Net:    os.Getenv("DB_Net"),
		Addr:   os.Getenv("DB_ADDR"),
		DBName: os.Getenv("DB_NAME"),
	}

	Db, err = sql.Open(os.Getenv("DB"), cfg.Clone().FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := Db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}
}
