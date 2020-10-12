const jwt = require('jsonwebtoken');
const connection = require('./connection.js');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, payload) => {
    if (err) {
      console.log(err);
      console.log(token);
      return res.sendStatus(401);
    }

    req.payload = payload;
    next();
  });
}

const getUserLevel = (req) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return "";

  return jwt.decode(token).admin;
}

const findUserByEmail = async email => {
  try {
    const users = await connection.query("SELECT * FROM users WHERE email = ?", email);

    return users[0];
  } catch (err) {  
    console.log(err);
    return;
  }
}

module.exports = {
  authenticateToken,
  findUserByEmail,
  getUserLevel,
}