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
  user_date_created DATE,
  user_last_login DATE,
  user_group SMALLINT,
  PRIMARY KEY (user_id)
);

CREATE TABLE playerScore(
  score_id SERIAL PRIMARY KEY,
  score_player_id uuid,
  score_total_socre SMALLINT NOT NULL,
  score_for_game SMALLINT NOT NULL,
  score_for_rank  SMALLINT NOT NULL,
);

CREATE TABLE rounds(
  round_id SERIAL PRIMARY KEY,
  round_month SMALLINT NOT NULL,
  round_year SMALLINT NOT NULL,
  round_current BOOLEAN DEFAULT FALSE, 
);

CREATE TABLE groups(
  group_id SERIAL PRIMARY KEY,
  round_id SERIAL,
  user_one_id uuid,
  user_two_id uuid,
  user_three_id uuid,
  user_four_id uuid,
)


CREATE TABLE scoreInRounds (
  sr_id SERIAL PRIMARY KEY,
  sr_player_one_id uuid,
  sr_player_two_id uuid,
  sr_player_one_score posibleScore,
  sr_player_two_score posibleScore,
  sr_date_played DATE,
  sr_round_id SERIAL,
  sr_group_id SMALLINT
)