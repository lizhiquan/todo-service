DROP DATABASE todo;
CREATE DATABASE todo;
USE todo;

CREATE TABLE user (
  username VARCHAR(20) NOT NULL,
  password VARCHAR(80) NOT NULL,
  PRIMARY KEY (username)
);

CREATE TABLE todo_item (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(50),
  done BIT NOT NULL,
  created DATETIME NOT NULL,
  modified DATETIME,
  username VARCHAR(20),
  PRIMARY KEY (id),
  FOREIGN KEY (username) REFERENCES user(username)
);