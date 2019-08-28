.PHONY: up_all down_all auth_test todo_test test

up_all:
	docker-compose -f docker-compose/auth.yml \
								 -f docker-compose/todo.yml \
								 -f docker-compose/mysql.yml \
								 up --build -d
						
down_all:
	docker-compose -f docker-compose/auth.yml \
								 -f docker-compose/todo.yml \
								 -f docker-compose/mysql.yml \
								 down

auth_test:
	docker-compose -f docker-compose/auth.test.yml \
								 -f docker-compose/mysql.test.yml \
								 run auth

todo_test:
	docker-compose -f docker-compose/todo.test.yml \
								 -f docker-compose/mysql.test.yml \
								 run todo

test: auth_test todo_test
