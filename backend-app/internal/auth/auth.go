package auth

import (
	"backend-app/internal/config"
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

type auth struct {
	Mail string `json:"mail"`
	Pass string `json:"pass"`
}

type user struct {
	userID string
	email  string
	Pass   string
}

// Login use exist check
func Login(w http.ResponseWriter, r *http.Request) (string, error) {
	var authInfo auth
	err := json.NewDecoder(r.Body).Decode(&authInfo)
	if err != nil {
		return "", err
	}

	query := `
	    SELECT
		    user_id,
			email,
			password
		FROM
		    users
		WHERE
		    email = ?
	`

	var user user
	row := config.Db.QueryRow(query, authInfo.Mail)
	if err := row.Scan(&user.userID, &user.email, &user.Pass); err != nil {
		return "", err
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Pass), []byte(authInfo.Pass))
	if err != nil {
		return "", err
	}

	token, err := user.generateJWT()
	if err != nil {
		return "", err
	}

	return token, nil
}

// SignUp create new user
func SignUp(w http.ResponseWriter, r *http.Request) error {
	var authInfo auth
	err := json.NewDecoder(r.Body).Decode(&authInfo)

	query := `
	    SELECT
	        user_id,
			email,
	        password
        FROM
	        users
        WHERE
	        email = ?
	`

	var user user
	row := config.Db.QueryRow(query, authInfo.Mail)
	err = row.Scan(&user.userID, &user.email, &user.Pass)
	hashed, _ := bcrypt.GenerateFromPassword([]byte(authInfo.Pass), bcrypt.DefaultCost)
	if err == sql.ErrNoRows {
		// user no exist
		_, err := config.Db.Exec(
			`INSERT INTO users(email password) VALUES(?, ?)`,
			authInfo.Mail, hashed)
		if err != nil {
			return err
		}
	}
	// jwt作成

	return nil
}

var sampleSecretKey = []byte("SecretYouShouldHide")

func (u *user) generateJWT() (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["ID"] = u.userID
	claims["exp"] = time.Now().Add(24 * time.Hour).Unix()
	claims["nbf"] = time.Now().Unix()
	claims["authorized"] = true

	tokenString, err := token.SignedString(sampleSecretKey)

	if err != nil {
		return "Signing Error", err
	}

	return tokenString, nil
}

// VerifyJWT verify
func VerifyJWT(endpointHandler func(writer http.ResponseWriter, request *http.Request)) http.HandlerFunc {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if request.Header["Token"] != nil {
			token, err := jwt.Parse(request.Header["Token"][0], func(token *jwt.Token) (interface{}, error) {
				_, ok := token.Method.(*jwt.SigningMethodHMAC)
				if !ok {
					writer.WriteHeader(http.StatusUnauthorized)
					_, err := writer.Write([]byte("You're Unauthorized"))
					if err != nil {
						return nil, err
					}
				}
				return sampleSecretKey, nil
			})
			// parsing errors result
			if err != nil {
				writer.WriteHeader(http.StatusUnauthorized)
				_, err2 := writer.Write([]byte("You're Unauthorized due to error parsing the JWT"))
				if err2 != nil {
					return
				}

			}
			// if there's a token
			if token.Valid {
				endpointHandler(writer, request)
			} else {
				writer.WriteHeader(http.StatusUnauthorized)
				_, err := writer.Write([]byte("You're Unauthorized due to invalid token"))
				if err != nil {
					return
				}
			}
		} else {
			writer.WriteHeader(http.StatusUnauthorized)
			_, err := writer.Write([]byte("You're Unauthorized due to No token in the header"))
			if err != nil {
				return
			}
		}
	})
}
