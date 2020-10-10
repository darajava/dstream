const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_SECRET,
  database: 'dstream',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Database connection established.');
});

module.exports = connection;