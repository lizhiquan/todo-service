DROP TABLE IF EXISTS todo;

CREATE TABLE todo (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  done BIT NOT NULL,
  created DATETIME NOT NULL,
  modified DATETIME,
  username VARCHAR(20),
  PRIMARY KEY (id)
  -- FOREIGN KEY (username) REFERENCES user(username)
);