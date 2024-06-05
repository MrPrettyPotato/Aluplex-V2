const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const pool = require('../../backend/database/connection')

router.get('/', (req, res) => {

    if (req.session.user) {
        res.render('user/account/profiel', {
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

router.post('/loadUser', async (req, res) => {
    console.log("loadUser")
    const user = req.session.user;

    res.send(JSON.stringify(user))
})


router.post('/updateUser', async (req, res) => {
    const user = req.session.user;
    if (!user || !user.email) {
        return res.status(400).send('Geen gebruiker in sessie gevonden of e-mailadres ontbreekt.');
    }
    
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const gebruiker = req.body.gebruiker
    
        // Dynamisch genereren van de SET clausule
        
        const query = `UPDATE klanten SET email = ?,tel=?,straatnaam=?,huisnummer=?,bus=?,postcode=?,stad=?,bedrijf=?,facemail=?,btwnummer=?,facstraatnaam=?,fachuisnummer=?,facbus=?,facpostcode=?,facstad=? WHERE email = ?`;
        
    
        const [results] = await connection.execute(query, [gebruiker.email,gebruiker.tel,gebruiker.straatnaam,gebruiker.huisnummer,gebruiker.bus,gebruiker.postcode,gebruiker.stad,gebruiker.bedrijf,gebruiker.facemail,gebruiker.btwnummer,gebruiker.facstraatnaam,gebruiker.fachuisnummer,gebruiker.facbus,gebruiker.facpostcode,gebruiker.facstad, user.email]);
    if (results.affectedRows > 0) {
        res.status(200).json({ success: true, message: 'De gegevens zijn succesvol geüpdatet, de nieuwe gegevens zijn pas zichtbaar na het inloggen.' });

    } else {
        return res.status(400).send('Gebruiker kon niet worden geüpdatet.');
    }
        // Verdere afhandeling...
    } catch (error) {
        // Foutafhandeling...
    } finally {
        if (connection) {
            console.log('Releasing connection in finally block');
            connection.release();
        }
    }
});

router.get('/wachtwoord', (req, res) => {

    if (req.session.user) {
        res.render('user/account/wachtwoord', {
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

router.post('/updateUserPassword', async (req, res) => {
    console.log('updatePassword')

let connection;
try {

    connection = await pool.promise().getConnection();
    console.log('req.boy', req.body)
    const email = req.session.user.email;
    const password = req.body.data.password.currentPassword // Haal de gebruikers-ID op uit het POST-verzoek
    const newPassword = req.body.data.password.password; // Haal het nieuwe wachtwoord op uit het POST-verzoek
    const confirmPassword = req.body.data.password.confirmPassword
if(newPassword !== confirmPassword) {
    console.log('passwords dont match', newPassword, confirmPassword)
    res.status(400).json({ success: false, message: 'Wachtwoorden komen niet overeen. Probeer het opnieuw.' });
    return
} else if(newPassword === confirmPassword && newPassword === password){
    
    res.status(400).json({ success: true, message: 'Het wachtwoord dat je hebt ingegeven is hetzelfde als je oud wachtwoord' });
    return
} else {
    console.log('passwords match', newPassword, confirmPassword)
}
    // Voer de logica uit om het wachtwoord bij te werken in de database
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash het nieuwe wachtwoord voordat het wordt opgeslagen

    const [results, fields] = await connection.execute(
        'SELECT * FROM klanten WHERE email = ?',
        [email]
      );
      
      connection.release();
      console.log('login results',results)
  
      console.log('Connection started, looking for the data...');
  
  
      if (results && results.length > 0) {
        console.log('result is langer dan 0')
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (isMatch) {
            console.log('Password is correct');
            if(user.login == 0) {
                return res.send('Uw account is nog niet geactiveerd, We bekijken dit zo snel mogelijk. U ontvangt een mail hierover!');
            } else {
                const [results1, fields] = await connection.execute(
                    'UPDATE klanten SET password = ? WHERE email = ?',
                    [hashedPassword, email]
                );
            if(results1.affectedRows > 0) {
                res.status(200).json({ success: true, message: 'Wachtwoord succesvol bijgewerkt!' });
            } else {
                res.status(400).json({ success: false, message: 'Wachtwoord kon niet worden bijgewerkt. Probeer het opnieuw.' });
            }
            }
        } else {
            
            res.status(200).json({ success: true, message: 'het huidige wachtwoord klopt niet.' });
        }
    } else {
        console.log('geen data terug gevonden')
    }
   
    
} catch (error) {
    console.log('error', error)
} finally {
    if (connection) {
        console.log('Releasing connection in finally block');
        connection.release();
    }
    
}

})


router.get('/planning', (req, res) => {

    if (req.session.user) {
        res.render('user/account/planning', {
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

router.post('/planning', async (req, res) => {
    const user = req.session.user

    console.log('planning', req.body)
    let connection;
    try {

        connection = await pool.promise().getConnection();
        const query = 'SELECT ref, type, leverdatum, status, SUM(aantal) AS aantal FROM winkelmand WHERE klant = ? GROUP BY ref, type, leverdatum, status;'
        const [result, fields] = await connection.execute(query,[user.bedrijf]);
        console.log('planning results',result)
        
    res.send(JSON.stringify(result))
        // console.log('req.boy', req.body)
    } catch (error) {
        console.log('error', error)

    } finally {
        if (connection) {
            console.log('Releasing connection in finally block');
            connection.release();
        }
    }
})











module.exports = router;