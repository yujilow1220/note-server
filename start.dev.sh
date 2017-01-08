#!/bin/bash

docker-compose -f dev.docker-compose.yaml restart app
docker-compose -f dev.docker-compose.yaml logs -f app
