CREATE DATABASE TournamentTracker;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE posibleScore AS ENUM ('S', '0', '1', '2', '3');

CREATE TABLE users(
  user_id uuid DEFAULT uuid_generate_v4(),
  user_first_name VARCHAR(255) NOT NULL,
  user_last_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_email_verified BOOLEAN,
  user_active BOOLEAN DEFAULT FALSE,
  user_date_created DATE,
  user_last_login DATE,
  user_deleted BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id)
);

CREATE TABLE rounds(
  round_id SERIAL PRIMARY KEY,
  round_month SMALLINT NOT NULL,
  round_year SMALLINT NOT NULL,
  round_current BOOLEAN DEFAULT FALSE, 
);


CREATE TABLE scoreInRounds (
  sr_id SERIAL PRIMARY KEY,
  sr_player_one_id uuid,
  sr_player_two_id uuid,
  sr_player_one_score posibleScore,
  sr_player_two_score posibleScore,
  sr_date_played DATE,
  sr_round_id SERIAL,
  sr_group_id SMALLINT,

  CONSTRAINT fk_player_one FOREIGN KEY(sr_player_one_id) REFERENCES users(user_id),
  CONSTRAINT fk_player_two FOREIGN KEY(sr_player_two_id) REFERENCES users(user_id)
);


CREATE TABLE playerScore(
  score_id SERIAL PRIMARY KEY,
  score_player_id uuid,
  score_total_score SMALLINT NOT NULL,
  score_for_game SMALLINT NOT NULL,
  score_for_rank  SMALLINT NOT NULL,
  score_round_id SERIAL,

  CONSTRAINT fk_player FOREIGN KEY(score_player_id) REFERENCES users(user_id)
);

CREATE TABLE groups(
  group_id SERIAL PRIMARY KEY,
  group_number SMALLINT NOT NULL,
  group_round_id SERIAL,
  group_user_id uuid, 
  
  CONSTRAINT fk_player FOREIGN KEY(group_user_id) REFERENCES users(user_id),
  CONSTRAINT fk_round FOREIGN KEY(group_round_id) REFERENCES rounds(round_id)
)
