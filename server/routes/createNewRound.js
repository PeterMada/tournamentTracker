const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async (req, res) => {
  const currentLogedUser = req.user;

  try {
    const currentRound = await pool.query(
      'SELECT * FROM rounds WHERE round_current = TRUE'
    );

    /*
    const activeAllUsers = await pool.query(
      'UPDATE users SET user_active = TRUE WHERE user_active = FALSE'
    );
    */

    // No rounds
    let target;
    if (currentRound.rows.length === 0) {
      target = await pool.query(
        'INSERT INTO rounds (round_month, round_year, round_current) VALUES ($1, $2, $3) RETURNING *',
        [4, 2022, true]
      );
    } else {
      const roundUpdate = await pool.query(
        'UPDATE rounds SET round_current = FALSE WHERE round_current = TRUE'
      );

      let month = 1;
      let year = currentRound.rows[0].round_year;

      if (currentRound.rows[0].round_month >= 12) {
        year = year + 1;
      } else {
        month = currentRound.rows[0].round_month + 1;
      }

      target = await pool.query(
        'INSERT INTO rounds (round_month, round_year, round_current) VALUES ($1, $2, $3) RETURNING *',
        [month, year, true]
      );
    }

    // generate groups for this round
    const allUsers = await pool.query(
      'SELECT user_id, user_first_name, user_last_name, user_active, playerScore.*  FROM users LEFT JOIN playerScore ON users.user_id = playerScore.score_player_id ORDER BY playerScore.score_total_score'
    );

    let group_level = 0;
    const promises = allUsers.rows.map(async (user, i) => {
      if (i % 4 === 0) {
        group_level++;
      }

      let group = await pool.query(
        'INSERT INTO groups (group_round_id, group_number, group_user_id) VALUES ($1, $2, $3)',
        [target.rows[0].round_id, group_level, user.user_id]
      );
    });

    const result = await Promise.all(promises);

    const currentGroups = await pool.query(
      'SELECT group_round_id FROM groups WHERE group_round_id = $1 GROUP BY group_round_id',
      [target.rows[0].round_id]
    );

    const numberOfGroups = ~~(allUsers.rows.length / 4);
    const numberOfPlayersInLastGroup = allUsers.rows.length % 4;

    for (let i = 1; i <= numberOfGroups; i++) {
      // get all players from this group
      const currentGroups = await pool.query(
        'SELECT group_user_id, group_id FROM groups WHERE group_round_id = $1 AND group_number = $2',
        [target.rows[0].round_id, i]
      );

      // create score table for group
      if (currentGroups.rows.length === 4) {
        const returnPromise = currentGroups.rows.map(async (user, j) => {
          console.log(j);
          switch (j + 1) {
            case 1:
              let group01 = await pool.query(
                'INSERT INTO scoreInRounds (sr_player_one_id, sr_player_two_id, sr_player_one_score, sr_player_two_score, sr_round_id, sr_group_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [
                  currentGroups.rows[0].group_user_id,
                  currentGroups.rows[1].group_user_id,
                  '-',
                  '-',
                  target.rows[0].round_id,
                  i,
                ]
              );
              let group02 = await pool.query(
                'INSERT INTO scoreInRounds (sr_player_one_id, sr_player_two_id, sr_player_one_score, sr_player_two_score, sr_round_id, sr_group_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [
                  currentGroups.rows[0].group_user_id,
                  currentGroups.rows[2].group_user_id,
                  '-',
                  '-',
                  target.rows[0].round_id,
                  i,
                ]
              );
              let group03 = await pool.query(
                'INSERT INTO scoreInRounds (sr_player_one_id, sr_player_two_id, sr_player_one_score, sr_player_two_score, sr_round_id, sr_group_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [
                  currentGroups.rows[0].group_user_id,
                  currentGroups.rows[3].group_user_id,
                  '-',
                  '-',
                  target.rows[0].round_id,
                  i,
                ]
              );

              break;
            case 2:
              let group12 = await pool.query(
                'INSERT INTO scoreInRounds (sr_player_one_id, sr_player_two_id, sr_player_one_score, sr_player_two_score, sr_round_id, sr_group_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [
                  currentGroups.rows[1].group_user_id,
                  currentGroups.rows[2].group_user_id,
                  '-',
                  '-',
                  target.rows[0].round_id,
                  i,
                ]
              );
              let group13 = await pool.query(
                'INSERT INTO scoreInRounds (sr_player_one_id, sr_player_two_id, sr_player_one_score, sr_player_two_score, sr_round_id, sr_group_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [
                  currentGroups.rows[1].group_user_id,
                  currentGroups.rows[3].group_user_id,
                  '-',
                  '-',
                  target.rows[0].round_id,
                  i,
                ]
              );
              break;
            case 3:
              let group23 = await pool.query(
                'INSERT INTO scoreInRounds (sr_player_one_id, sr_player_two_id, sr_player_one_score, sr_player_two_score, sr_round_id, sr_group_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [
                  currentGroups.rows[2].group_user_id,
                  currentGroups.rows[3].group_user_id,
                  '-',
                  '-',
                  target.rows[0].round_id,
                  i,
                ]
              );
              break;
          }
        });

        const scoreTable = await Promise.all(returnPromise);
      }
    }

    // Reset all game scores
    let score = await pool.query(
      'UPDATE playerScore SET score_for_game = 0'
    );

    res.json(target.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
