package job

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

const (
	host   = "localhost"
	port   = 5432
	user   = "postgres"
	dbname = "regional_skill_analysis"
)

type Job struct {
	ID          int      `json:"id`
	Position    string   `json:"position"`
	ZipCode     string   `json:"zipCode"`
	Skills      []string `json:"skills"`
	Description string   `json:"description,omitempty"`
}

func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func AddRoutes(router *mux.Router) func() {
	jobRouter, err := newJobRouter()
	if err != nil {
		log.Fatal(err)
	}
	router.HandleFunc("/job/all-by-zipCode/{zipCode}", jobRouter.getJobs).Methods("GET")
	router.HandleFunc("/job/{id}", jobRouter.getJob).Methods("GET")
	router.HandleFunc("/job/{id}", jobRouter.createJob).Methods("POST")
	router.HandleFunc("/job/{id}", jobRouter.deleteJob).Methods("DELETE")

	return func() {
		jobRouter.close()
	}
}

func (s *JobRouter) getJobs(w http.ResponseWriter, r *http.Request) {
	zipCode := mux.Vars(r)["zipCode"]
	var jobs []Job
	rows, err := s.db.Query("SELECT * FROM job WHERE zipcode = $1", zipCode)
	if err != nil {
		log.Fatal(err)
	}
	// json.NewEncoder(w).Encode(jobs)
}

func (s *JobRouter) getJob(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	ID, err := strconv.Atoi(params["id"])
	if err != nil {
		log.Fatal(err)
	}
	var job Job
	err = s.db.QueryRow("SELECT * FROM job WHERE id = $1", ID).Scan(&job.ID, &job.Position, &job.ZipCode, &job.Description)
	if err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(job)
}

func (s *JobRouter) createJob(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var job Job
	if err := json.NewDecoder(r.Body).Decode(&job); err != nil {
		log.Fatal(err)
	}
	var err error
	job.ID, err = strconv.Atoi(params["id"])
	if err != nil {
		log.Fatal(err)
	}
	sqlStatement := `
		INSERT INTO job (id, position, zipcode, description)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`
	id := 0
	// TODO: May be best to change this to an exec per http://go-database-sql.org/modifying.html
	if err = s.db.QueryRow(sqlStatement, job.ID, job.Position, job.ZipCode, job.Description).Scan(&id); err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(job)
}

func (s *JobRouter) deleteJob(w http.ResponseWriter, r *http.Request) {}

type JobRouter struct {
	db *sql.DB
}

func (jobRouter *JobRouter) close() {
	jobRouter.db.Close()
}

func newJobRouter() (*JobRouter, error) {
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

	return &JobRouter{
		db: db,
	}, nil
}