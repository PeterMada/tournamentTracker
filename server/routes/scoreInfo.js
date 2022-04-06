const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async (req, res) => {
  try {
    const score_id = req.headers['score_id'];

    // Check if user can view/add score

    const score = await pool.query(
      'SELECT *FROM scoreInRounds WHERE sr_id = $1 AND (sr_player_one_id = $2 OR sr_player_two_id = $2)',
      [score_id, req.user]
    );

    if (!score) {
      res.status(500).json('You cann not add score to this match');
    }

    const users = await pool.query(
      'SELECT user_id, user_first_name, user_last_name, user_email FROM users WHERE user_active = true'
    );

    res.json({ scoreGroup: score.rows[0], users: users.rows });
  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
