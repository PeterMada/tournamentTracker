CREATE DATABASE TournamentTracker;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
  user_id uuid DEFAULT uuid_generate_v4(),
  user_first_name VARCHAR(255) NOT NULL,
  user_last_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_email_verified BOOLEAN,
  user_date_created DATE,
  user_last_login DATE,
  PRIMARY KEY (user_id)
);