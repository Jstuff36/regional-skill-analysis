package course

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

const (
	host   = "localhost"
	port   = 5432
	user   = "postgres"
	dbname = "regional_skill_analysis"
)

type Course struct {
	ID          int      `json:"id"`
	Name        string   `json:"name"`
	ZipCode     string   `json:"zipcode"`
	Skills      []string `json:"skills"`
	Description string   `json:"description,omitempty"`
}

func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func AddRoutes(router *mux.Router) func() {
	courseRouter, err := newCourseRouter()
	if err != nil {
		log.Fatal(err)
	}
	router.HandleFunc("/api/v1/courses/{id}", courseRouter.getCourse).Methods("GET")
	router.HandleFunc("/api/v1/courses/{id}", courseRouter.createCourse).Methods("POST")
	router.HandleFunc("/api/v1/courses/{id}", courseRouter.deleteCourse).Methods("DELETE")

	return func() {
		courseRouter.close()
	}
}

func (courseRouter *CourseRouter) getCourse(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	ID, err := strconv.Atoi(params["id"])
	if err != nil {
		log.Fatal(err)
	}
	var course Course
	err = courseRouter.db.QueryRow("SELECT * FROM course WHERE id = $1", ID).Scan(&course.ID, &course.Name, &course.ZipCode, &course.Description)
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(course)
}

func (courseRouter *CourseRouter) createCourse(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var course Course
	if err := json.NewDecoder(r.Body).Decode(&course); err != nil {
		log.Fatal(err)
	}
	var err error
	course.ID, err = strconv.Atoi(params["id"])
	if err != nil {
		log.Fatal(err)
	}
	sqlStatement := `
		INSERT INTO course (id, name, zipcode, description)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`
	id := 0
	// TODO: May be best to change this to an exec per http://go-database-sql.org/modifying.html
	if err := courseRouter.db.QueryRow(sqlStatement, course.ID, course.Name, course.ZipCode, course.Description).Scan(&id); err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(course)
}

func (courseRouter *CourseRouter) deleteCourse(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	ID, err := strconv.Atoi(params["id"])
	if err != nil {
		log.Fatal(err)
	}
	_, err = courseRouter.db.Exec("DELETE FROM course WHERE id = $1", ID)
	if err != nil {
		log.Fatal(err)
	}
}

func (courseRouter *CourseRouter) close() {
	courseRouter.db.Close()
}

type CourseRouter struct {
	db *sql.DB
}

func newCourseRouter() (*CourseRouter, error) {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"dbname=%s sslmode=disable",
		host, port, user, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	return &CourseRouter{
		db: db,
	}, nil
}
