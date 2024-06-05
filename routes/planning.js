const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
//include .env file
require('dotenv').config();


const connection = require('../backend/database/connection')

//render de planning pagina
router.get('/', (req, res) => {
    const query = `SELECT * FROM planning WHERE klant = ?`;
    connection.query(query, [req.session.user.bedrijf], (err, result) => {
        console.log("result", result)
        if (err) throw err;
        //stuur de gevonden data naar de planning pagina
        res.render('planning/main', {
            req: req,
            user: req.session.user,
            logged_in: req.isAuthenticated(),
            planning: result
        })
})
router.get('/planninginput', (req, res) => {
    res.render('planning/planning-input', {
        req: req,
        user: req.session.user,
        logged_in: req.isAuthenticated()
    })
})




})
//wat als de planning pagina in realtime aangepast moet worden?
//dan moet er een post request gedaan worden naar de server
router.post('/planning', (req, res) => {
            //verkrijg de data van de planning pagina
            const data = req.body;
            console.log("invoer planning data",data)
            //maak een query die de data in de database stuurt met de volgende gegevens
            //leverdatum,klant,aantal,producttype,referentie,orderstatus
            const query = `INSERT INTO planning (leverdatum,klant,aantal,producttype,referentie,orderstatus) VALUES (?,?,?,?,?,?)`;
            //voer de query uit met de data die van de planning pagina komt
            connection.query(query, [data.leverdatum, req.session.user.bedrijf, data.aantal, data.producttype, data.referentie, data.orderstatus], (err, result) => {
                if (err) throw err;
                //stuur de data terug naar de planning pagina
                res.json(data);
            })

})

module.exports = router;