# To Do Service

[![Build Status](https://travis-ci.org/lizhiquan/todo-service.svg?branch=master)](https://travis-ci.org/lizhiquan/todo-service)
[![codecov](https://codecov.io/gh/lizhiquan/todo-service/branch/master/graph/badge.svg)](https://codecov.io/gh/lizhiquan/todo-service)
[![Greenkeeper badge](https://badges.greenkeeper.io/lizhiquan/todo-service.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io//test/github/lizhiquan/todo-service/badge.svg?targetFile=package.json)](https://snyk.io//test/github/lizhiquan/todo-service?targetFile=package.json)

To-do service is a simple backend-only service which is built to demonstrate handling user authentication, storing persistent data to a relational database and unit testing express routes.

## Contents

- [Quick Start](#quick-start)
- [Technologies](#technologies)
- [Endpoints](#endpoints)
- [Database](#database)

## Quick Start

### Prerequisites

You'll need a few things before we get started.

- NodeJS
- MySQL

Make sure you have these tools installed in your computer (an easy way is through [homebrew](http://brew.sh)), then run `npm install` or `yarn` to install dependencies.

### Create database

After installing MySQL, create a new database and run this [script](./bin/db-script.sql) to create needed tables.

### Environment variables

All needed environment variables are provided in [`.env.example`](./.env.example). Follow that format, create a new `.env` file in the root of your project and provide your own values.

### Scripts

#### Start the server

    npm start

#### Start the server in dev mode

    npm run dev

In this mode, the server is running using `nodemon` and auto restart when changes happen.

#### Run unit tests

    npm test

In order to run test, your have to create another env file named `.env.test` to connect to your test database.

## Technologies

- Routing - [expressjs](https://github.com/expressjs/express/)
- Database - [mysql](https://github.com/sidorares/node-mysql2)
- Authentication - [jwt](https://github.com/auth0/node-jsonwebtoken)
- Password hash - [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- Request validation - [express-validator](http://express-validator.github.io)
- Environment variables - [dotenv](https://github.com/motdotla/dotenv)
- Logging - [morgan](https://github.com/expressjs/morgan) & [winston](https://github.com/winstonjs/winston)
- Linting - [eslint](https://eslint.org)
- Testing framework - [Mocha](https://mochajs.org)
- Assertion library - [Chai](https://www.chaijs.com)
- Test spies, stubs and mocks - [Sinon](https://sinonjs.org)
- Test HTTP servers - [SuperTest](https://github.com/visionmedia/supertest)
- Mock http objects - [node-mocks-http](https://github.com/howardabrams/node-mocks-http)

## Endpoints

### User Endpoints

#### 1. Sign Up

Create a new user with username and password

    POST /user

Body:

| Field      | Description | Optional |
| ---------- | ----------- | -------- |
| `username` | User name   | no       |
| `password` | Password    | no       |

#### 2. Sign In

Authenticate a user with username and password

    POST /user/auth

Body:

| Field      | Description | Optional |
| ---------- | ----------- | -------- |
| `username` | User name   | no       |
| `password` | Password    | no       |

Return:

| Field   | Description                            |
| ------- | -------------------------------------- |
| `token` | A token to access authorized resources |

### To Do Endpoints

#### 1. Get todo items

Get a list of todo items

    GET /todo

Header:

| Field           | Description                                                          | Optional |
| --------------- | -------------------------------------------------------------------- | -------- |
| `Authorization` | Bearer type authentication using the token received after signing in | no       |

Query params:

| Field    | Description                      | Optional         |
| -------- | -------------------------------- | ---------------- |
| `limit`  | Maximum number of returned items | yes (default 20) |
| `offset` | Number of skipped items          | yes (default 0)  |

Return:

| Field  | Description            |
| ------ | ---------------------- |
| `data` | An array of todo items |

To Do Object:

| Field      | Description                          |
| ---------- | ------------------------------------ |
| `id`       | Identify a todo item                 |
| `title`    | The title of a todo item             |
| `done`     | Indicate the item is finished or not |
| `created`  | Created date                         |
| `modified` | Modified date                        |

#### 2. Create todo item

Create a new todo item

    POST /todo

Header:

| Field           | Description                                                          | Optional |
| --------------- | -------------------------------------------------------------------- | -------- |
| `Authorization` | Bearer type authentication using the token received after signing in | no       |

Body:

| Field   | Description              | Optional |
| ------- | ------------------------ | -------- |
| `title` | The title of a todo item | no       |

#### 3. Update todo item

Update an existing todo item

    PUT /todo/:id

Header:

| Field           | Description                                                          | Optional |
| --------------- | -------------------------------------------------------------------- | -------- |
| `Authorization` | Bearer type authentication using the token received after signing in | no       |

Body:

| Field   | Description                       | Optional |
| ------- | --------------------------------- | -------- |
| `title` | The title of a todo item          | no       |
| `done`  | Indicates the item is done or not | no       |

#### 4. Delete todo item

Delete an existing todo item

    DELETE /todo/:id

Header:

| Field           | Description                                                          | Optional |
| --------------- | -------------------------------------------------------------------- | -------- |
| `Authorization` | Bearer type authentication using the token received after signing in | no       |

## Database

### User

```sql
CREATE TABLE user (
  username VARCHAR(20) NOT NULL,
  password VARCHAR(80) NOT NULL,
  PRIMARY KEY (username)
);
```

### To Do

```sql
CREATE TABLE todo_item (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  done BIT NOT NULL,
  created DATETIME NOT NULL,
  modified DATETIME,
  username VARCHAR(20),
  PRIMARY KEY (id),
  FOREIGN KEY (username) REFERENCES user(username)
);
```
