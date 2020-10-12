const jwt = require('jsonwebtoken');

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

module.exports = {
  authenticateToken,
}