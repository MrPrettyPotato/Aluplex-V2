const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const pool = require('../backend/database/connection')

router.get('/', async (req, res) => {
    let connection;

    try {
        connection = await pool.promise().getConnection();

        console.log(req.session);

        if (req.session.user && req.session.user.login === 2) {
            console.log("aangemeld");

            // Voer hier eventuele databasebewerkingen uit als dat nodig is voor deze route

            res.render('admin/home', {
                req: req,
                user: req.session.user,
                logged_in: req.isAuthenticated()
            });
        } else {
            console.log("Niet aangemeld");

            // Voer hier eventuele databasebewerkingen uit als dat nodig is voor deze route

            res.render('./home', {
                req: req,
                user: req.session.user,
                logged_in: req.isAuthenticated()
            });
        }
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

const transporter = require('../backend/js/mailSettings/nodemailer');
router.get('/toActivateList', async (req, res) => {
    let connection;
    //laad alle klanten in de database waar login 0 is.
    try {
        connection = await pool.promise().getConnection();
        const query = 'SELECT * FROM klanten WHERE login = 0';
        const [results] = await connection.execute(query);
        console.log('results', results);
        if (req.session.user && req.session.user.login === 2) {
            res.render('admin/toActivate', {
                req: req,
                user: req.session.user,
                logged_in: req.isAuthenticated(),
                usersData: results
            });
        } else {
            res.render('./home', {
                req: req,
                user: req.session.user,
                logged_in: req.isAuthenticated()
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// router.get('/:id', (req, res) => {
//     //een query waar de "login" van de gebruiker op 1 wordt gezet
//     const query = "UPDATE klant SET login = 1 WHERE email = ?";
//     const values = [req.params.id];
//     connection.query(query, values, (error, results) => {
//         if(error) return res.send(error);
//         if(results.affectedRows === 0) return res.send("Geen gebruiker gevonden");
//         if(results.affectedRows === 1) return res.send("Uw account is nu geactiveerd");
//     });

// })
router.post('/activate', async (req, res) => {
    const data = req.body.data

    try {
        console.log('Activate gestart', data);
        const bedrijf = data.bedrijf;
        const voornaam = data.voornaam;
        const achternaam = data.achternaam;
        const email = data.email;
        const facemail = data.facemail;
        const login = data.login;
        const tel = data.tel;
        const land = data.land;
        const taal = data.taal;
        const postcode = data.postcode;
        const stad = data.stad;
        const straatnaam = data.straatnaam;
        const huisnummer = data.huisnummer;
        const bus = data.bus;
        const facpostcode = data.facpostcode;
        const facstad = data.facstad;
        const facstraatnaam = data.facstraatnaam;
        const fachuisnummer = data.fachuisnummer;
        const facbus = data.facbus;
        const rolluikbladkorting = data.rolluikbladkorting;
        const tradirolluikkorting = data.tradirolluikkorting;
        const voorzetrolluikkorting = data.voorzetrolluikkorting;
        const screenkorting = data.screenkorting;
        const lakkerijkorting = data.lakkerijkorting;
        const btwnummer = data.btwnummer;

        const html = `
 <p>&nbsp;</p>
 <p></p>
 <!-- Voeg Bootstrap CSS toe voor styling -->
 <p></p>
 <p></p>
 <p style="text-align: center;"><span style="color: #333399;">Beste,</span></p>
 <p style="text-align: center;"><br /><span style="color: #333399;">Je account is geactiveerd en je kan deze nu gebruiken.</span><br /><span style="color: #333399;">Klik op onderstaande link om recht naar de login te gaan.</span><br /><span style="color: #333399;"><a style="color: #333399;" href="Aluplexpro.com/login">Aluplexpro</a></span></p>
 <p>&nbsp;</p>
 <div style="text-align: center;"><span style="color: #333399;">Met vriendelijke groeten,</span></div>
 <div style="text-align: center;">&nbsp;</div>
 <div style="text-align: center;"><span style="color: #333399;">ALUPLEX</span></div>
 <div style="text-align: center;">&nbsp;</div>
 <div style="text-align: center;"><span style="color: #333399;"><a style="color: #333399;" href="http://www.aluplexpro.com"><img title="Logo-Aluplex" src="https://cms.ice.be/logo/150/aluplex.jpeg" alt="Logo-Aluplex" width="300" height="100" border="0" /></a></span></div>
 <div>
 <div style="text-align: center;">&nbsp;</div>
 <table style="margin-left: auto; margin-right: auto; height: 96px;" border="0">
 <tbody>
 <tr style="height: 24px;">
 <td style="text-align: left; height: 24px; width: 205px;"><span style="color: #333399;">ALUPLEX Production NV</span></td>
 <td style="text-align: right; height: 24px; width: 149.844px;"><span style="color: #333399;"><a style="color: #333399;" href="mailto:kristof@aluplex.be">Info@aluplex.be</a></span></td>
 </tr>
 <tr style="height: 24px;">
 <td style="text-align: left; height: 24px; width: 205px;"><span style="color: #333399;">Kontichsesteenweg 60 Bus 2</span></td>
 <td style="text-align: right; height: 24px; width: 149.844px;"><span style="color: #333399;"><a style="color: #333399;" href="http://www.aluplexpro.com">www.aluplexpro.com</a></span></td>
 </tr>
 <tr style="height: 24px;">
 <td style="text-align: left; height: 24px; width: 205px;"><span style="color: #333399;">B-2630 Aartselaar</span></td>
 <td style="text-align: right; height: 24px; width: 149.844px;"><span style="color: #333399;"><a style="color: #333399;" href="http://www.aluplex.be">www.aluplex.be</a></span></td>
 </tr>
 <tr style="height: 24px;">
 <td style="text-align: left; height: 24px; width: 205px;"><span style="color: #333399;">BE0466.078.070</span></td>
 <td style="height: 24px; width: 149.844px; text-align: right;"><span style="color: #333399;">03/887.49.00</span></td>
 </tr>
 </tbody>
 </table>
 </div>
 <div style="text-align: right;">&nbsp;</div>
 `
        const mailOptions = {
            from: 'kristof@aluplex.be', // vervang dit door je eigen e-mailadres
            to: `${email}`, // vervang dit door het e-mailadres van de ontvanger
            subject: 'U Heeft een nieuw site lid',
            text: `Beste, Je account is geactiveerd en je kan deze nu gebruiken.`,
            html: html // vervang dit door de gewenste HTML
        };


        connection = await pool.promise().getConnection();
        console.log('Activate gestart', data);
        const query = "UPDATE klanten SET login = 1, bedrijf = ?, voornaam = ?, achternaam = ?, email = ?, facemail = ?, tel = ?, land = ?, taal = ?, postcode = ?, stad = ?, straatnaam = ?, huisnummer = ?, bus = ?, facpostcode = ?, facstad = ?, facstraatnaam = ?, fachuisnummer = ?, facbus = ?, rolluikbladkorting = ?, Tradirolluikkorting = ?, voorzetrolluikkorting = ?, screenkorting = ?, lakkerijkorting = ?, btwnummer = ? WHERE email = ?";
        const values = [bedrijf, voornaam, achternaam, email, facemail, tel, land, taal, postcode, stad, straatnaam, huisnummer, bus, facpostcode, facstad, facstraatnaam, fachuisnummer, facbus, rolluikbladkorting, tradirolluikkorting, voorzetrolluikkorting, screenkorting, lakkerijkorting, btwnummer, email];

        const [results] = await connection.execute(query, values);
        console.log('results', results);
        if (results.affectedRows === 0) return res.send("Geen gebruiker gevonden");
        if (results.affectedRows === 1) {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("error", error);
                    res.status(200).json({
                        success: false,
                        message: 'Er is iets misgegaan tijdens het activeren van het account.'
                    });
                } else {
                    console.log('E-mail verstuurd: ' + info.response);
                    res.status(200).json({
                        success: true,
                        message: 'Het activeren is gelukt en de mail is verzonden.'
                    });
                }
            });
        }
        // connection.query(query, values, (error, results) => {
        //     if(error) return res.send(error);
        //     if(results.affectedRows === 0) return res.send("Geen gebruiker gevonden");
        //     if(results.affectedRows === 1) return res.send("Uw account is nu geactiveerd");
        // });
    } catch (error) {
        console.log(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }

})
// Endpoint om gebruikersgegevens op te halen
router.get('/activate/:id', async (req, res) => {
    console.log('Activate gestart', req.params.id);
    const userId = req.params.id;
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const query = 'SELECT * FROM klanten WHERE email = ?';
        //show views/admin/activate.ejs
        const [results] = await connection.execute(query, [userId]);
        console.log('results', results);
        if (req.session.user && req.session.user.login === 2) {

            res.render('admin/activate', {
                req: req,
                user: req.session.user,
                logged_in: req.isAuthenticated(),
                userData: results[0]

            });
        } else {
            res.render('./home', {
                req: req,
                user: req.session.user,
                logged_in: req.isAuthenticated()
            });
        }
    } catch (error) {

    } finally {
        if (connection) connection.release();
    }
    // Voer een query uit om gebruikersgegevens op te halen op basis van de ID
    // Stuur de gegevens terug als JSON naar de frontend
});


router.get('/gebruikersLijst', async (req, res) => {
    // let connection;
    // try {
    //     connection = await pool.promise().getConnection();
    //     const query = 'SELECT * FROM klanten';
    //     const [results] = await connection.execute(query);
    //     console.log('results', results);
    if (req.session.user && req.session.user.login === 2) {
        res.render('admin/gebruikersLijst', {
            req: req,
            user: req.session.user,
            logged_in: req.isAuthenticated(),
        });
    } else {
        res.render('./home', {
            req: req,
            user: req.session.user,
            logged_in: req.isAuthenticated()
        });
    }

    // } catch (error) {

    // }
    // finally {
    //     if (connection) {
    //         connection.release();
    //     }
    // }


})

//gebruikers doosturen naar de frondend
router.post('/gebruikersLijst', async (req, res) => {
    console.log('gebruikersLijst', req.body);
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const query = 'SELECT * FROM klanten';
        const [results] = await connection.execute(query);
        // console.log('results', results);
        if (req.session.user && req.session.user.login === 2) {
            //geef de data terug aan de frondend zonder opnieuw de pagina te laden.
            // console.log('results', results);
            res.send(results);

        } else {
            res.send(false);

        }
    } catch (error) {
        console.log('error', error);

    } finally {
        if (connection) {
            connection.release();
        }
    }
})


router.post('/winkelmandData', async (req, res) => {
    const klant = req.body.data
    // console.log('winkelmandData', klant);
let connection;
try{
    connection = await pool.promise().getConnection();
    const query = 'SELECT * FROM winkelmand WHERE klant = ?';
    const [results] = await connection.execute(query,[klant]);
    // console.log('results', results);
    res.send(results);
} catch(error){
    console.log(error);
}
finally{
    if(connection) connection.release();
}
})

router.post('/gebruikerOpslaan', async (req, res) => {
    console.log('gebruikerOpslaan', req.body);
    const data = req.body.data;
    //krijg alle parameters in een array van dataToUpdate
    const velden = Object.keys(data);
  const waarden = Object.values(data);
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const { query, waarden } = maakUpdateQuery("klanten", data,);
        const [results] = await connection.query(query, waarden);
        console.log('results', results);
        res.send(results);
    } catch (error) {
        console.log(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
})

function maakUpdateQuery(tabel, data,) {
    const { ID, ...dataZonderID } = data;
    const velden = Object.keys(dataZonderID);
    const waarden = Object.values(dataZonderID);
  
    const setClause = velden.map((veld, index) => `${veld} = ?`).join(', ');
  
    const query = `UPDATE ${tabel} SET ${setClause} WHERE ID=${data.ID}`;
    return { query, waarden };
  }


module.exports = router;