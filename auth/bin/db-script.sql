DROP TABLE IF EXISTS users;

CREATE TABLE users (
  username VARCHAR(20) NOT NULL,
  password VARCHAR(80) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (username)
);