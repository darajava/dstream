var express = require('express');
var router = express.Router();

const connection = require('../connection.js');

router.get('/', function(req, res, next) {
  connection.query('INSERT INTO customers (stream_key, name, theme) VALUES (?, ?)', ["dstream", "DStream", "light"], (err, result) => {
    if (err) {
      res.status(500).send("Something went wrong");
    }
    res.status(200).send();
  });
});

router.get('/customer-details', function(req, res, next) {
  console.log(req.query);
  connection.query('SELECT * FROM customers WHERE stream_key = ?', [req.query.stream_key], (err, result) => {
    if (err) {
      res.status(500).send("Something went wrong");
    }
    console.log(result);
    res.status(200).send(result[0]);
  });
});

module.exports = router;
