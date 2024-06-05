const express = require('express');
const router = express.Router();
const pool = require('../../../backend/database/connection')


router.get('/', (req, res) => {
    console.log('vliegenraam')

    if (req.session.user) {
        res.render('vliegenramen/vliegenraam', {
            req: req,
            user: req.session.user,
            logged_in: req.isAuthenticated()
        });
    } else {
        res.render('./home', {
            req: req,
            user: req.session.user,
            logged_in: req.isAuthenticated()
        });
    }

})
//mugafwerking

router.post('/mugafwerking', async (req, res) => {

    let connection;
    try{
        connection = await pool.promise().getConnection();
        const query = `SELECT * from typeafwerking WHERE type = "vliegenraam"`
        const [results] = await connection.execute(query);
        console.log('results', results);
        if(results.length > 0){
            res.send(results)

        }
        else{
            console.error('geen waarde gevonden mugtypes');
            res.send("error")
        }
    }
    catch(err){
        console.log('error',err)
    }
    finally{
        if(connection){
            connection.release();
        }
    }
    })
    

router.post('/mugtypes', async (req, res) => {

    let connection;
    try{
        connection = await pool.promise().getConnection();
        const query = `SELECT * from mugtype`
        const [results] = await connection.execute(query);
        console.log('results', results);
        if(results.length > 0){
            res.send(results)

        }
        else{
            console.error('geen waarde gevonden mugtypes');
            res.send("error")
        }
    }
    catch(err){
        console.log('error',err)
    }
    finally{
        if(connection){
            connection.release();
        }
    }
    })
    
    router.post('/mugtypegaas', async (req, res) => {

        let connection;
        try{
            connection = await pool.promise().getConnection();
            const query = `SELECT * from muggaas`
            const [results] = await connection.execute(query);
            console.log('results', results);
            if(results.length > 0){
                res.send(results)
    
            }
            else{
                console.error('geen waarde gevonden mugtypes');
                res.send("error")
            }
        }
        catch(err){
            console.log('error',err)
        }
        finally{
            if(connection){
                connection.release();
            }
        }
        })
router.post('/zoekKleuren', async (req, res) => {
    console.log('zoekKleuren - mugkleuren table')
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const query = 'SELECT * FROM mugkleuren';
        const [results] = await connection.execute(query);
        console.log('results', results);
        if(results.length > 0){
            res.send(results)
        } else {
            console.error('geen waarde gevonden zoekKleuren');
            res.send("error")
        }

    } catch(err){
        console.error("Error zoekKleuren Vliegenraam",err)
    }
    finally{
        if(connection){
            connection.release();
        }
    }
})


router.post('/zoekRalKleuren', async (req, res) => {
    console.log('zoekRalKleuren - rallijst table')
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const query = 'SELECT * FROM rallijst';
        const [results] = await connection.execute(query);
        console.log('results', results);
        if(results.length > 0){
            res.send(results)
        } else {
            console.error('geen waarde gevonden zoekRalKleuren');
            res.send("error")
        }
        

    } catch(err){
        console.error("Error zoekRalKleuren Vliegenraam",err)
    }
    finally{
        if(connection){
            connection.release();
        }
    }
})

router.post('/zoekTypeClips', async (req, res) => {
    console.log('zoekTypeClips - mugtypeclips table')
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const query = 'SELECT * FROM mugtypeclips';
        const [results] = await connection.execute(query);
        console.log('results', results);
        if(results.length > 0){
            res.send(results)

        }
        else{
            console.error('geen waarde gevonden zoekTypeClips');
            res.send("error")
        }

    } catch(err){
        console.error("Error zoekTypeClips Vliegenraam",err)
    }
    finally{
        if(connection){
            connection.release();
        }
    }


})

router.post('/zoekGrootteClips', async (req, res) => {
    console.log('zoekGrootteClips - muggrootteclips table')
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const query = 'SELECT * FROM muggrootteclips';
        const [results] = await connection.execute(query);
        console.log('results', results);
        if(results.length > 0){
            res.send(results)
        }
        else{
            console.error('geen waarde gevonden zoekGrootteClips');
            res.send("error")
        }

    } catch(err){
        console.error("Error zoekGrootteClips Vliegenraam",err)
    }
    finally{
        if(connection){
            connection.release();
        }
    }
})

router.post('/addtocart', async (req, res) => {
    const winkelmand = req.body.data;
    let connection;
    console.log('winkelmand', winkelmand)
    
    try {
        connection = await pool.promise().getConnection();
        const query = 'INSERT INTO winkelmand SET ?';
        const [results] = await connection.execute(query, [winkelmand]);
        if (results.affectedRows > 0) {
            res.send({ message: 'Toegevoegd aan winkelmand' });
        } else {
            res.status(400).send({ error: 'Geen item toegevoegd aan winkelmand' });
        }
    } catch (err) {
        console.error("Error toevoegenAanWinkelmand Vliegenraam", err);
        res.status(500).send({ error: 'Server error bij het toevoegen aan de winkelmand' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


module.exports = router;