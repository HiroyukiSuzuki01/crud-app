package models

import "database/sql"

// Master Type
type Master struct {
	ID   string
	Name string
}

// Profile type
type Profile struct {
	UserID          string   `json:"userid"`
	Name            string   `json:"name"`
	Age             string   `json:"age"`
	Gender          string   `json:"gender"`
	SelfDescription string   `json:"selfDescription"`
	Hobbies         []string `json:"hobbies"`
	Prefecture      string   `json:"prefecture"`
	Address         string   `json:"address"`
}

// ReqdProfile type
type ReqdProfile struct {
	UserID           string         `json:"userId"`
	Name             string         `json:"name"`
	Age              string         `json:"age"`
	Gender           string         `json:"gender"`
	SelefDescription string         `json:"selfDescription"`
	Prefecture       string         `json:"prefecture"`
	Address          string         `json:"address"`
	Hobby            sql.NullString `json:"hobby"`
}
