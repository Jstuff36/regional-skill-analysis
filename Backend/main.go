package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	// "github.com/jstuff36/regional-skill-analysis/Backend/log"
	_ "github.com/lib/pq"
)

const (
	host   = "localhost"
	port   = 5432
	user   = "postgres"
	dbname = "regional_skill_analysis"
)

type Job struct {
	Id          string   `json:"id`
	Position    string   `json:"position"`
	ZipCode     string   `json:"zipCode"`
	Skills      []string `json:"skills"`
	Description string   `json:"description,omitempty"`
}

func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func main() {

	s, err := NewServer()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Successfully connected!")

	// To see how to use packages
	// log.Start()
	router := mux.NewRouter()
	router.HandleFunc("/job/{zipCode}", s.GetJobs).Methods("GET")
	router.HandleFunc("/job/{id}", s.GetJob).Methods("GET")
	router.HandleFunc("/job/{id}", s.CreateJob).Methods("POST")
	router.HandleFunc("/job/{id}", s.DeleteJob).Methods("DELETE")
	err = http.ListenAndServe(":8080", router)
	s.Close()
	if err != nil {
		log.Fatal(err)
	}
}

type Server struct {
	db *sql.DB
}

func (s *Server) Close() {
	s.db.Close()
}

func (s *Server) GetJobs(w http.ResponseWriter, r *http.Request) {
	// zipCode := mux.Vars(r)["zipCode"]
	// Make some query to the database for all jobs with given zipCode
	var jobs []Job
	json.NewEncoder(w).Encode(jobs)
}

func (s *Server) GetJob(w http.ResponseWriter, r *http.Request) {}

func (s *Server) CreateJob(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var job Job
	if err := json.NewDecoder(r.Body).Decode(&job); err != nil {
		log.Fatal(err)
	}
	job.Id = params["id"]
	sqlStatement := `
		INSERT INTO job (id, position, zipcode, description)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`
	id := 0
	if err := s.db.QueryRow(sqlStatement, job.Id, job.Position, job.ZipCode, job.Description).Scan(&id); err != nil {
		log.Fatal(err)
	}
	fmt.Println("success, new id is ", id)
}

func (s *Server) DeleteJob(w http.ResponseWriter, r *http.Request) {}

func NewServer() (*Server, error) {
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

	return &Server{
		db: db,
	}, nil
}
