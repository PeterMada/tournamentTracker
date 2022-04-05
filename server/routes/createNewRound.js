const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async (req, res) => {
  const currentLogedUser = req.user;

  try {
    const currentRound = await pool.query(
      'SELECT * FROM rounds WHERE round_current = TRUE'
    );

    // Active all users
    const activeAllUsers = await pool.query(
      'UPDATE users SET user_active = true RETURNING user_id'
    );
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
    // Add match score + table score to sum score
    const allUsersScores = await pool.query(
      'SELECT * FROM playerScore WHERE score_round_id = $1',
      [currentRound.rows[0].round_id]
    );

    const promiseScore = allUsersScores.rows.map(async (userScore) => {
      const totalPlayerScore =
        userScore.score_total_score +
        userScore.score_for_game +
        userScore.score_for_rank;
      let score = await pool.query(
        'UPDATE playerScore SET score_for_game = 0, score_for_rank = 0, score_total_score = $1 WHERE score_id = $2',
        [totalPlayerScore, userScore.score_id]
      );
    });

    const promiseScoreResult = await Promise.all(promiseScore);

    // generate groups for this round
    const allUsers = await pool.query(
      'SELECT user_id, user_first_name, user_last_name, user_active, playerScore.*  FROM users LEFT JOIN playerScore ON users.user_id = playerScore.score_player_id ORDER BY playerScore.score_total_score'
    );

    let group_level = 0;
    const promises = allUsers.rows.map(async (user, i) => {
      if (i % 5 === 0) {
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

    const numberOfGroups =
      allUsers.rows.length > 5 ? ~~(allUsers.rows.length / 5) : 1;
    const numberOfPlayersInLastGroup = allUsers.rows.length % 5;

    // create score table for group
    const currentRoundId = target.rows[0].round_id;
    for (let k = 1; k <= numberOfGroups; k++) {
      const currentGroups = await pool.query(
        'SELECT group_user_id, group_id, group_round_id FROM groups WHERE group_round_id = $1 AND group_number = $2',
        [target.rows[0].round_id, k]
      );

      const currentGroupLength = currentGroups.rows.length;

      let j = 0;

      for (let i = 0; i < currentGroupLength; i++) {
        j = i + 1;
        for (j; j < currentGroupLength; j++) {
          if (i !== j) {
            let group = await pool.query(
              'INSERT INTO scoreInRounds (sr_player_one_id, sr_player_two_id, sr_player_one_score, sr_player_two_score, sr_round_id, sr_group_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
              [
                currentGroups.rows[i].group_user_id,
                currentGroups.rows[j].group_user_id,
                '-',
                '-',
                currentRoundId,
                i,
              ]
            );
          }
        }
      }
    }

    // Create new score table for round
    const newScoreTableForRound = activeAllUsers.rows.map(
      async (user, i) => {
        const playerTotalScore = await pool.query(
          'SELECT score_total_score FROM playerScore WHERE score_player_id = $1 AND score_round_id = $2',
          [user.user_id, currentRound.rows[0].round_id]
        );

        const playerTotalScoreValue =
          playerTotalScore.rows.length > 0
            ? playerTotalScore.rows[0].score_total_score
            : 0;

        let score = await pool.query(
          'INSERT INTO playerScore (score_player_id, score_total_score, score_for_game, score_for_rank, score_round_id) VALUES ($1, $2, $3, $4, $5)',
          [
            user.user_id,
            playerTotalScoreValue,
            0,
            0,
            target.rows[0].round_id,
          ]
        );
      }
    );

    const resultNewScoreTables = await Promise.all(newScoreTableForRound);

    res.json(target.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
