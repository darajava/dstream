DROP DATABASE IF EXISTS dstream;

CREATE DATABASE dstream;

USE dstream;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(500) NOT NULL,
  password VARCHAR(1000) NOT NULL,
  stripe_customer_id VARCHAR(500),
  admin VARCHAR(50) DEFAULT "", -- admin will be the stream key for the Customer he has access to, or "*" for su access
  CONSTRAINT name_unique UNIQUE (email),
  PRIMARY KEY (id)
);

CREATE TABLE refresh_tokens (
  id INT NOT NULL AUTO_INCREMENT,
  token VARCHAR(1000) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE customers (
  id INT NOT NULL AUTO_INCREMENT,
  stream_key VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  theme VARCHAR(100) DEFAULT "light",
  CONSTRAINT name_unique UNIQUE (stream_key, name),
  PRIMARY KEY (id)
);

CREATE TABLE subscriptions (
  id INT NOT NULL AUTO_INCREMENT,
  stripe_id VARCHAR(150) NOT NULL,
  user_id INT NOT NULL,
  stream_key VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);


INSERT INTO customers (stream_key, name, theme) VALUES ("dstream", "DStream", "light");