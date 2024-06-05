const express = require('express');
const router = express.Router();
// const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();
router.get('/', (req, res) => {
  res.render('login', {
    user: req.user,
    logged_in: req.isAuthenticated()
  });
});

const pool = require('../backend/database/connection');

router.post('/login', async (req, res) => {
  let connection;

  try {
    connection = await pool.promise().getConnection();
    

    const email = req.body.email;
    const password = req.body.password;

    const [results, fields] = await connection.execute(
      'SELECT * FROM klanten WHERE email = ?',
      [email]
    );
    
    console.log('login results',results)
    console.log('Connection started, looking for the data...');


    if (results && results.length > 0) {
      console.log('result is langer dan 0')
      const user = results[0];
      const userPassword = user.password ? user.password : "";
      console.log('userPassword', userPassword)
      const isMatch = await bcrypt.compare(password, userPassword);

      if (isMatch) {
        console.log('Password is correct');
        
        if (user.login == 0) {
          return res.send('Uw account is nog niet geactiveerd, We bekijken dit zo snel mogelijk. U ontvangt een mail hierover!');
        }

        const payload = {
          id: user.id,
          email: user.email
        };

        const secret = process.env.JWT_SECRET;
        const options = {
          expiresIn: '1d'
        };

        const token = jwt.sign(payload, secret, options);
        req.session.user = user;
        console.log("User logged in", req.session.user.bedrijf)
        res.redirect(process.env.STARTPAGE);
      } else if(userPassword == null || userPassword == "") {
        console.log('Nieuw wachtwoord ingeven')
        // Doorverwijzen naar een pagina voor een nieuw wachtwoord in te geven, met de gebruikers-ID als queryparameter
        return res.redirect(`/login/nieuw-wachtwoord?email=${email}`);
      } else {
        console.log('Password is incorrect');
        return res.send('Verkeerde inloggegevens, probeer opnieuw!');
      }
    } else {
      res.send('Verkeerde inloggegevens, probeer opnieuw!');
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  } finally {
    if (connection) {
      console.log('Releasing connection in finally block');
      connection.release();
    }
  }
});

router.get('/nieuw-wachtwoord', (req, res) => {
  console.log('nieuwwachtwoord', req.query.email);
  const email = req.query.email; // Haal de gebruikers-ID op uit de queryparameters
  // Render een formulier voor het instellen van een nieuw wachtwoord voor de gebruiker met de bijbehorende ID
  res.render('user/nieuw-wachtwoord-formulier', { email:email,
    req: req,
    user: req.session.user,
    logged_in: req.isAuthenticated() });
});
router.post('/nieuw-wachtwoord', async (req, res) => {
  console.log('request', req.body);
  const email = req.body.email; // Haal de gebruikers-ID op uit het POST-verzoek
  const newPassword = req.body.password; // Haal het nieuwe wachtwoord op uit het POST-verzoek

  try {
    // Voer de logica uit om het wachtwoord bij te werken in de database
    const connection = await pool.promise().getConnection();
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash het nieuwe wachtwoord voordat het wordt opgeslagen
    const [results, fields] = await connection.execute(
      'UPDATE klanten SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );
    connection.release();

    // Stuur een melding naar de gebruiker dat het wachtwoord succesvol is bijgewerkt
    // req.session.message = 'Wachtwoord succesvol bijgewerkt!';

    // Voeg een vertraging (delay) toe voordat je de gebruiker doorstuurt naar de homepagina
    res.json({ success: true, message: 'Wachtwoord succesvol bijgewerkt!' });
  } catch (error) {
    console.error('Er is een fout opgetreden bij het bijwerken van het wachtwoord:', error);
    res.status(500).send('Er is een interne fout opgetreden. Probeer het later opnieuw.');
  }
});

module.exports = router;