const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../connection.js');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../util.js').authenticateToken;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    
    connection.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [req.body.email, password],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(500).send("User already exists.");
          }
            console.log(err);
          return res.status(500).send("Something went wrong while registering.");
        }

        res.sendStatus(203);
      }
    );
  } catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
});


const findUserByEmail = async email => {
  try {
    console.log(email);
    const users = await connection.query("SELECT * FROM users WHERE email = ?", email);

    return users[0];
  } catch (err) {  
    console.log(err);
    return;
  }
}

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

const generateAccessToken = user => {
  return jwt.sign(user, process.env.JWT_ACCESS_TOKEN, { expiresIn: '10m' });
}

router.post('/login', authenticateUser, (req, res) => {
  const user = { email: req.body.email, admin: req.body.admin}
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_TOKEN);

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

    jwt.verify(results[0].token, process.env.JWT_REFRESH_TOKEN, (err, payload) => {
      if (err) return res.status(403).send("Token doesn't exist");

      const accessToken = generateAccessToken({ name: payload.name });
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

module.exports = router;
