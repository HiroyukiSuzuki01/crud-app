package config

import (
	"database/sql"
	"log"

	"github.com/go-sql-driver/mysql"
)

// Db sql Connection Config
var Db *sql.DB

// DbConnection create sql Connection
func DbConnection() {
	cfg := mysql.Config{
		User:   "root",
		Passwd: "root",
		Net:    "tcp",
		Addr:   "dev-db:3306",
		DBName: "crud_app",
	}
	var err error
	Db, err = sql.Open("mysql", cfg.Clone().FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := Db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}
}
