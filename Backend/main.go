package main

import (
	"log"
	"net/http"

	"github.com/Jstuff36/regional-skill-analysis/Backend/job"
	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()

	jobRouterTearDown := job.AddRoutes(router)
	defer jobRouterTearDown()
	// courses.AddRoutes(router)

	log.Panic(http.ListenAndServe(":8080", router))
}
