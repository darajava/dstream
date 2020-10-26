const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../connection.js');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../util.js').authenticateToken;
const findUserByEmail = require('../util.js').findUserByEmail;
const getUserLevel = require('../util.js').getUserLevel;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    
    console.log(req.body);

    connection.query(
      'INSERT INTO users (email, password, stripe_customer_id) VALUES (?, ?, ?)',
      [req.body.email, password, req.body.stripe_customer_id],
      async (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(500).send("User already exists.");
          }
        }

        try {
          const [accessToken, refreshToken] = await generateTokens(req.body.email);
          return res.status(203).json({ accessToken, refreshToken });
        } catch (e) {
          console.log(e);
          return res.status(500).send("Something went wrong while registering.");
        }
      }
    );
  } catch (e) {
    console.log(e)
    return res.sendStatus(500);
  }
});

const authenticateUser = async (req, res, next) => {
  const user = await findUserByEmail(req.body.email)

  if (!user) return res.status(403).send("Incorrect username or password");
  req.body.admin = user.admin;

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      return next();
    } else {
        console.log(user.password);
      console.log(req.body.password);
      return res.status(403).send("Incorrect username or password");
    }
  } catch (e) {
    return res.status(500).send("Something went wrong");
  }
}

const generateTokens = async email => {
  let results;

  try {
    results = await connection.query(
      'SELECT * FROM users WHERE email = (?)',
      [email],
    );
  } catch (e) {
    throw e;
  }

  const user = {...results[0]};

  delete user.password;
  delete user.id;

  return [
    jwt.sign(user, process.env.JWT_ACCESS_TOKEN, { expiresIn: '10m' }),
    jwt.sign(user, process.env.JWT_REFRESH_TOKEN, { expiresIn: '1y' }),
  ];
}

router.post('/login', authenticateUser, async (req, res) => {
  const [accessToken, refreshToken] = await generateTokens(req.body.email);

  connection.query(
    'INSERT INTO refresh_tokens (token) VALUES (?)',
    [refreshToken],
    (err, result) => {
      if (err) return res.status(500).send("Something went wrong during login.");

      res.status(203).json({ accessToken, refreshToken });
    }
  );
});

router.post('/token', (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) return res.sendStatus(401);

  connection.query(`SELECT * FROM refresh_tokens WHERE token = ?`, [refreshToken], (err, results) => {
    if (err) return res.status(500).send("Something went wrong");

    if (!results.length) return res.status(403).send("Token doesn't exist");

    jwt.verify(results[0].token, process.env.JWT_REFRESH_TOKEN, async (err, payload) => {
      if (err) return res.status(403).send("Token doesn't exist");

      const [accessToken, _] = await generateTokens(jwt.decode(refreshToken).email);
      res.json({ accessToken });
    });
  });
});

router.delete('/logout', (req, res) => {
  console.log(req.query);
  connection.query(`DELETE FROM refresh_tokens WHERE token = ?`, [req.query.token], (err, results) => {
    if (err) return res.status(500).send("Something went wrong");

    res.sendStatus(204);
  });
});

router.get('/subscriptions', authenticateToken, (req, res) => {
  res.sendStatus(200);
});

router.get('/can-watch', authenticateToken, async (req, res) => {

  const userLevel = getUserLevel(req);

  if (userLevel === "*" || userLevel === req.query.streamKey) {
    return res.json({authenticated: true});
  }

  try {
    results = await connection.query(
      'SELECT * FROM subscriptions JOIN users WHERE email = ? AND stream_key = ?',
      [req.query.email, req.query.streamKey],
    );

    if (results.length) {
      return res.json({authenticated: true})
    } else {
      return res.json({authenticated: false});
    }
  } catch (e) {
    console.log('here');
    return res.sendStatus(500);
  }
});

module.exports = router;