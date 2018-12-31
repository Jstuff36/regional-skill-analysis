package course

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

const (
	host   = "localhost"
	port   = 5432
	user   = "postgres"
	dbname = "regional_skill_analysis"
)

func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func AddRoutes(router *mux.Router) func() {
	courseRouter, err := newCourseRouter()
	if err != nil {
		log.Fatal(err)
	}
	router.HandleFunc("/course/{id}", courseRouter.getCourse).Methods("GET")
	router.HandleFunc("/course/{id}", courseRouter.createCourse).Methods("POST")
	router.HandleFunc("/course/{id}", courseRouter.deleteCourse).Methods("DELETE")

	return func() {
		courseRouter.close()
	}
}

func (s *CourseRouter) getCourse(w http.ResponseWriter, r *http.Request) {

}

func (s *CourseRouter) createCourse(w http.ResponseWriter, r *http.Request) {

}

func (s *CourseRouter) deleteCourse(w http.ResponseWriter, r *http.Request) {

}

func (s *CourseRouter) close() {
	s.db.Close()
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
