const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  //port: process.env.DB_ON_PORT,
  waitForConnections: true,
  connectionLimit: 100,
  maxIdle: 100, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 6000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 100,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});


// Toon het aantal actieve verbindingen
// setInterval(() => {
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Fout bij het verkrijgen van een verbinding:', err);
//     } else {
//       console.log('Aantal actieve verbindingen:', pool._allConnections.length);
//       connection.release();
//     }
//   });
// }, 60000); // elk minuut
module.exports = pool;


