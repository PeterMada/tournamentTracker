const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async (req, res) => {
  const currentLogedUser = req.user;

  try {
    const currentRound = await pool.query(
      'SELECT * FROM rounds WHERE round_current = TRUE'
    );

    const currentUser = await pool.query(
      'SELECT * FROM users WHERE  user_id = $1',
      [currentLogedUser]
    );

    const myGroup = await pool.query(
      'SELECT * FROM scoreInRounds WHERE sr_round_id != $1 AND (sr_player_one_id = $2 OR sr_player_two_id = $3)',
      [currentRound.rows[0].round_id, currentLogedUser, currentLogedUser]
    );

    res.json(myGroup.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
