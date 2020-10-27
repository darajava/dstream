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
  live_now BOOLEAN NOT NULL DEFAULT FALSE,
  day_pass_price INT,
  monthly_price INT,
  yearly_price INT,
  CONSTRAINT name_unique UNIQUE (stream_key, name),
  PRIMARY KEY (id)
);

CREATE TABLE subscriptions (
  id INT NOT NULL AUTO_INCREMENT,
  stripe_id VARCHAR(150) NOT NULL,
  user_id INT NOT NULL,
  stream_key VARCHAR(50) NOT NULL,
  expired DATETIME,
  PRIMARY KEY (id)
);

CREATE TABLE prices (
  id INT NOT NULL AUTO_INCREMENT,
  period VARCHAR(50) NOT NULL, -- once, monthly, yearly
  stripe_price_id VARCHAR(50) NOT NULL,
  value INT,
  PRIMARY KEY (id)
);

INSERT INTO customers (stream_key, name, theme) VALUES ("dstream", "Lansdowne F.C.", "light");

-- also do for live mode
INSERT INTO prices (period, stripe_price_id, value) VALUES ("yearly", "price_1HgekzDSAAIAD42iDdmR3cIt", 60);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("yearly", "price_1HgekyDSAAIAD42iSl73DFU4", 55);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("yearly", "price_1HgekyDSAAIAD42iO31Hu1ud", 50);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("yearly", "price_1HgekzDSAAIAD42iDT44HODe", 45);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("yearly", "price_1Hgel0DSAAIAD42iloW3z92E", 40);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("yearly", "price_1HgekyDSAAIAD42i4Vb8gl4r", 35);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("yearly", "price_1Hgel0DSAAIAD42i1DTD9s0E", 30);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("yearly", "price_1Hgel0DSAAIAD42iFJpQ0sfh", 25);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("yearly", "price_1HgekyDSAAIAD42izjzBOwj6", 20);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("yearly", "price_1Hgel0DSAAIAD42i9Lo7rioY", 15);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("yearly", "price_1HgekyDSAAIAD42iGIDdksy0", 10);

INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeivDSAAIAD42itDoSa0og", 15);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeiwDSAAIAD42iL37fZ7TG", 14);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeiwDSAAIAD42i9673wPK7", 13);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeizDSAAIAD42iDjKAS9Tl", 12);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeixDSAAIAD42i9wERhSQr", 11);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeizDSAAIAD42i4HBR7sj0", 10);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeiyDSAAIAD42iS9vkhkLO", 9);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeixDSAAIAD42iPDoALu0i", 8);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeixDSAAIAD42ivTYkygIc", 7);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeiwDSAAIAD42i4O19HoP1", 6);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeizDSAAIAD42iXaj46WK1", 5);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeizDSAAIAD42iwGGVGYs2", 4);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeiyDSAAIAD42ibuhsHOl7", 3);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("monthly", "price_1HgeixDSAAIAD42ilpJsfIIS", 2);

INSERT INTO prices (period, stripe_price_id, value) VALUES ("once", "price_1HgehZDSAAIAD42iiAeWyQdx", 10);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("once", "price_1HgehZDSAAIAD42ikePMXLvN", 9);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("once", "price_1HgehZDSAAIAD42iYEb0GqgQ", 8);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("once", "price_1HgehZDSAAIAD42iqKrZngbU", 7);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("once", "price_1HgehYDSAAIAD42iPc9jfy6n", 6);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("once", "price_1HgehZDSAAIAD42iZGfIj1zp", 5);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("once", "price_1HgehYDSAAIAD42i1oeuLL9c", 4);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("once", "price_1HgehZDSAAIAD42idXNDHZh8", 3);
INSERT INTO prices (period, stripe_price_id, value) VALUES ("once", "price_1HgehYDSAAIAD42iLEEuiFN2", 2);
