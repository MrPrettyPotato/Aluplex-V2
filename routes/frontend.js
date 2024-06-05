const express = require('express');
const router = express.Router();
const mysql = require('mysql2')
require('dotenv').config();

router.post('/getData', (req, res) => {
    // Haal de waarde op uit het verzoek
    console.log("fronted getdata")
    const hoogte = req.body.hoogte;

    const connectionData = JSON.parse(process.env.DB_CONNECTION_DATA);
    const connection = mysql.createConnection(connectionData);

    connection.query('SELECT * FROM klanten WHERE id = ?', [jwt_payload.id], (error, results, fields) => {
        if (error) {
            next(error, false);
        }
        if (results.length > 0) {
            const user = results[0];
            next(null, user);
        } else {
            next(null, false);
        }
    });
})

module.exports = router;