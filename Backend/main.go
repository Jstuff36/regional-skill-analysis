package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jstuff36/regional-skill-analysis/Backend/log"
)

type Job struct {
	position    string   `json:"position"`
	zipCode     string   `json:"zipCode"`
	skills      []string `json:"skills"`
	description string   `json:"description,omitempty"`
}

func GetJobs(w http.ResponseWriter, r *http.Request) {
	// zipCode := mux.Vars(r)["zipCode"]
	// Make some query to the database for all jobs with given zipCode
	var jobs []Job
	json.NewEncoder(w).Encode(jobs)
}

func GetJob(w http.ResponseWriter, r *http.Request) {}

func CreateJob(w http.ResponseWriter, r *http.Request) {}

func DeleteJob(w http.ResponseWriter, r *http.Request) {}

func main() {
	log.Start()
	router := mux.NewRouter()
	router.HandleFunc("/job/{zipCode}", GetJobs).Methods("GET")
	router.HandleFunc("/job/{id}", GetJob).Methods("GET")
	router.HandleFunc("/job/{id}", CreateJob).Methods("POST")
	router.HandleFunc("/job/{id}", DeleteJob).Methods("DELETE")
	// log.Fatal(http.ListenAndServe(":8080", router))
}
