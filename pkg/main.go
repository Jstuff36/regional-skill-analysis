package main

import (
	"log"
	"net/http"

	"github.com/Jstuff36/regional-skill-analysis/pkg/course"
	"github.com/Jstuff36/regional-skill-analysis/pkg/job"

	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()

	jobRouterTearDown := job.AddRoutes(router)
	courseRouterTearDown := course.AddRoutes(router)
	defer jobRouterTearDown()
	defer courseRouterTearDown()

	log.Panic(http.ListenAndServe(":8080", router))
}
