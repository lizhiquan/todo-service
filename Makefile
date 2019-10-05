.PHONY: up_all down_all auth_test todo_test test_all

docker-compose-all=-f docker-compose/auth.yml \
                   -f docker-compose/todo.yml \
                   -f docker-compose/mysql.yml

## Start all services
up_all:
	@docker-compose $(docker-compose-all) up --build -d

## Stop all services
down_all:
	@docker-compose $(docker-compose-all) down

## Unit test auth service
auth_test:
	@docker-compose -f docker-compose/auth.test.yml \
                    -f docker-compose/mysql.test.yml \
                    run auth

## Unit test todo service
todo_test:
	@docker-compose -f docker-compose/todo.test.yml \
                    -f docker-compose/mysql.test.yml \
                    run todo

## Unit test all services
test_all: auth_test todo_test
