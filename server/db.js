var mysql = require('mysql');

var con = mysql.createConnection({
  host: process.env.PIXELECT_STAGING_HOST,
  port: process.env.PIXELECT_STAGING_PORT,
  user: process.env.PIXELECT_STAGING_USER,
  password: process.env.PIXELECT_STAGING_PASSWORD,
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});