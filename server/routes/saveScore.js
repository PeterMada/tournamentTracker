const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const authorization = require('../middleware/authorization');
const validinfo = require('../middleware/validinfo');

router.post('/', validinfo, async (req, res) => {
  try {
    const { playerOneScore, playerTwoScore } = req.body;
    const scoreId = req.headers['scoreid'];
    const firstPlayerId = req.headers['firstplayerid'];
    const secondPlayerId = req.headers['secondplayerid'];

    let scoreForFirstPlayer = 0;
    let scoreForSecondPlayer = 0;

    switch (`${playerOneScore}:${playerTwoScore}`) {
      case '3:0':
        scoreForFirstPlayer = 7;
        scoreForSecondPlayer = 0;
        break;
      case '3:1':
        scoreForFirstPlayer = 6;
        scoreForSecondPlayer = 1;
        break;
      case '3:2':
        scoreForFirstPlayer = 5;
        scoreForSecondPlayer = 2;
        break;
      case '2:3':
        scoreForFirstPlayer = 2;
        scoreForSecondPlayer = 5;
        break;
      case '1:3':
        scoreForFirstPlayer = 1;
        scoreForSecondPlayer = 6;
        break;
      case '0:3':
        scoreForFirstPlayer = 0;
        scoreForSecondPlayer = 7;
        break;
      case 'S:S':
        scoreForFirstPlayer = -2;
        scoreForSecondPlayer = -2;
        break;
      case '3:S':
        scoreForFirstPlayer = 6;
        scoreForSecondPlayer = 0;
        break;
      case 'S:3':
        scoreForFirstPlayer = 0;
        scoreForSecondPlayer = 6;
        break;
    }

    const score = await pool.query(
      'SELECT *FROM scoreInRounds WHERE sr_id = $1 AND (sr_player_one_id = $2 OR sr_player_two_id = $2) AND sr_player_one_score = $3 AND sr_player_two_score = $3',
      [scoreId, req.user, '-']
    );

    if (!score) {
      res.status(500).json('You cann not add score to this match');
    }

    const scoreInsert = await pool.query(
      'UPDATE scoreInRounds SET sr_player_one_score = $2, sr_player_two_score = $3, sr_date_played = $4  WHERE sr_id = $1 RETURNING *',
      [scoreId, playerOneScore, playerTwoScore, new Date().toISOString()]
    );

    const currentRound = await pool.query(
      'SELECT * FROM rounds WHERE round_current = TRUE'
    );

    const playerOneTotalScore = await pool.query(
      'UPDATE playerScore SET score_for_game = $1 WHERE score_player_id = $2 AND score_round_id = $3',
      [playerOneScore, firstPlayerId, currentRound.rows[0].round_id]
    );

    const playerTwoTotalScore = await pool.query(
      'UPDATE playerScore SET score_for_game = $1 WHERE score_player_id = $2 AND score_round_id = $3',
      [playerTwoScore, secondPlayerId, currentRound.rows[0].round_id]
    );

    res.json(scoreInsert.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
