//*****TODO*****
// Functies toevoegen voor verschillende types.
// Elk type moet zijn eigen functie krijgen. -> Als er een fout is bij voorzet dat


const express = require('express');
require('dotenv').config();
const router = express.Router();
const mysql = require('mysql2')
// const PDFDocument = require('pdfkit');
const PDFDocument = require("pdfkit-table");
const fs = require('fs');
const nodemailer = require('nodemailer');
const {
    Readable
} = require('stream');

const path = require('path');
const imgPath = path.join(__dirname, '..', 'public', 'img', 'aluplex.jpeg')


const generatePDFfromProvidedData = require('../backend/js/generatepdf.js')
const calculatePrice = require('../backend/js/calculatePrice.js')

const calculateTotalPrice = require('../backend/js/calculateTotalePrice.js')

const pool = require('../backend/database/connection')

function fetchKlanten(){
    let connection = pool.promise().getConnection();
}

router.get('/', async (req, res) => {
    let connection;

    try {
        connection = await pool.promise().getConnection();



        if (req.session.user) {
            if(req.session.user.login === 2){
                const query = 'SELECT bedrijf,bedrijfID FROM klanten';
                const [results] = await connection.execute(query);
                console.log('results klantelijst', results);
                res.render('user/cart', {
                    req: req,
                    user: req.session.user,
                    logged_in: req.isAuthenticated(),
                    klanten:results

                });
            } else {
                res.render('user/cart', {
                    req: req,
                    user: req.session.user,
                    logged_in: req.isAuthenticated()
                });
            }


            // Voer hier eventuele databasebewerkingen uit als dat nodig is voor deze route

           
        } else {


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

router.post('/klantenlijst', async (req, res) => {
    let connection;

    try {
        connection = await pool.promise().getConnection();

        const query = 'SELECT bedrijf,bedrijfID,voornaam FROM klanten';
        const [results] = await connection.execute(query);
        console.log('results klantelijst', results);
        res.send(results);

    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            connection.release();
        }
    }

});

router.post('/winkelmand', async (req, res) => {
    console.log("user", req.session.user)
    const data = req.body
    console.log('data', data)
    let connection;

    try {
        connection = await pool.promise().getConnection();



        const [results, fields] = await connection.execute(
            'SELECT * FROM winkelmand WHERE status = "winkelmand" AND klantID = ?',
            [req.session.user.bedrijfID]
        );



        if (results && results.length > 0) {
            const winkelmand = results;

            res.send(winkelmand);
        } else {

            res.send(false);
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

router.post('/cartRemove', async (req, res) => {
    let connection;

    try {
        connection = await pool.promise().getConnection();

        const removeData = req.body.data;


        const [result, fields] = await connection.execute(
            'DELETE FROM winkelmand WHERE ID = ?',
            [removeData.ID]
        );



        if (result) {
            res.render('user/cart', {
                req: req,
                user: req.session.user,
                logged_in: req.isAuthenticated()
            });
        } else {

            res.send(false);
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            connection.release();
        }
    }
});
router.post('/cartRemoveall', async (req, res) => {
    let connection;

    try {
        connection = await pool.promise().getConnection();

        const removeData = req.body.data;
        console.log('Data to be removed', removeData)
        var checked = false
        for (const [index, data] of removeData.entries()){
            console.log('count removing', index,removeData.length)
            const [result, fields] = await connection.execute(
                'DELETE FROM winkelmand WHERE ID = ?',
                [data.ID]
            );
            if ((index+1) === removeData.length) {
                checked = true
            }


        }

        if (checked) {
            console.log('removing')
            res.render('user/cart', {
                req: req,
                user: req.session.user,
                logged_in: req.isAuthenticated()
            });
        } else {

            res.send(false);
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            connection.release();
        }
    }
});





router.post('/RBafwerking', async (req, res) => {
    let connection;

    try {

        connection = await pool.promise().getConnection();
        const [afwerking] = await connection.execute('SELECT data,omschrijving FROM typeafwerking WHERE benaming = ?', [req.body.data])

        if (afwerking) {
            res.send(afwerking[0])

        } else {

        }

    } catch (err) {

        console.error('Error', err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            connection.release();
        }
    }
})

router.post('/RBtypelamelomschrijving', async (req, res) => {
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const lamel = await connection.execute('SELECT omschrijving FROM typelamel WHERE benaming = ?', [req.body.data])

        if (lamel) {

            res.send(lamel[0])

        } else {

        }
    } catch (err) {
        console.error('Error', err);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            connection.release()
        }
    }
})

router.post('/RBkleurlamelomschrijving', async (req, res) => {
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const [kleur] = await connection.execute('SELECT kleur,RAL FROM kleurminitradi WHERE kleur = ?', [req.body.data])
        console.log('RBkleurlamelomschrijving', kleur)
        if (kleur) {

            res.send(kleur[0])

        } else {

        }
    } catch (err) {
        console.error('Error', err);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            connection.release()
        }
    }
})
//TRzenderOmschrijving

router.post('/TRzenderOmschrijving', async (req, res) => {
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const [omschrijving] = await connection.execute('SELECT omschrijving FROM zenders WHERE benaming = ?', [req.body.data])

        if (omschrijving) {

            res.send(omschrijving[0])

        } else {

        }
    } catch (err) {
        console.error('Error', err);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            connection.release()
        }
    }
})
router.post('/VZRzenderOmschrijving', async (req, res) => {
    let connection;
    try {
        console.log('Verkregen data vzrzenderomschrijving', req.body.data)
        connection = await pool.promise().getConnection();
        const [omschrijving] = await connection.execute('SELECT omschrijving FROM zenders WHERE benaming = ?', [req.body.data])

        if (omschrijving) {

            res.send(omschrijving[0])

        } else {

        }
    } catch (err) {
        console.error('Error', err);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            connection.release()
        }
    }
})
router.post('/VZRmanuelOmschrijving', async (req, res) => {
    let connection;
    try {
        const _data = req.body.data.manueel[0].benaming
        if (_data === "geen") {
            res.send({
                omschrijving: "geen"
            })
        }
        console.log('Verkregen data vzrzenderomschrijving', _data)
        connection = await pool.promise().getConnection();
        const [omschrijving] = await connection.execute('SELECT omschrijving FROM zenders WHERE benaming = ?', [_data])

        if (omschrijving) {

            res.send(omschrijving[0])

        } else {

        }
    } catch (err) {
        console.error('Error', err);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            connection.release()
        }
    }
})
router.post('/TRmanueelOmschrijving', async (req, res) => {
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const [omschrijving] = await connection.execute('SELECT omschrijving FROM zenders WHERE benaming = ?', [req.body.data])

        if (omschrijving) {

            res.send(omschrijving[0])

        } else {

        }
    } catch (err) {
        console.error('Error', err);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            connection.release()
        }
    }
})
router.post('/VZRmanueelOmschrijving', async (req, res) => {
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const [omschrijving] = await connection.execute('SELECT omschrijving FROM zenders WHERE benaming = ?', [req.body.data])

        if (omschrijving) {

            res.send(omschrijving[0])

        } else {

        }
    } catch (err) {
        console.error('Error', err);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            connection.release()
        }
    }
})

router.post('/TRbedieningOmschrijving', async (req, res) => {
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const [omschrijving] = await connection.execute('SELECT omschrijving FROM tradibediening WHERE benaming = ?', [req.body.data])

        if (omschrijving) {

            res.send(omschrijving[0])

        } else {

        }
    } catch (err) {
        console.error('Error', err);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            connection.release()
        }
    }
})
router.post('/VZRbedieningOmschrijving', async (req, res) => {
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const [omschrijving] = await connection.execute('SELECT omschrijving FROM vzrbediening WHERE benaming = ?', [req.body.data])

        if (omschrijving) {

            res.send(omschrijving[0])

        } else {

        }
    } catch (err) {
        console.error('Error', err);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            connection.release()
        }
    }
})
router.post('/kleurRAL', async (req, res) => {
    let connection;
    try {

        connection = await pool.promise().getConnection();
        const [kleur] = await connection.execute('SELECT RAL,aecode FROM kleurminitradi WHERE kleur = ?', [req.body.data])

        if (kleur) {

            res.send(kleur[0])

        } else {

        }
    } catch (err) {
        console.error('Error', err);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            connection.release()
        }
    }
})
router.post('/screenkleurRAL', async (req, res) => {
    let connection;
    try {

        connection = await pool.promise().getConnection();
        const [kleur] = await connection.execute('SELECT RAL,aecode,uitvoering,kleur FROM screenkastkleur WHERE aecode = ?', [req.body.data])
        console.log('screenkleurRAL', kleur)

        if (kleur) {

            res.send(kleur[0])

        } else {

        }
    } catch (err) {
        console.error('Error', err);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            connection.release()
        }
    }
})


router.post('/getomschrijving', async (req, res) => {
    let connection;
    try {
        const _data = req.body.data

        const _query = 'SELECT omschrijving FROM ?? WHERE ?? = ?'

        const [omschrijving] = await pool.promise().query(_query, [_data.db, _data.kolom, _data.data]);

        if (omschrijving) {

            res.send(omschrijving)

        } else {

        }
    } catch (err) {
        console.error('Error', err);
        res.status(500).send('Internal Server Error');

    } finally {
        if (connection) {
            connection.release()
        }
    }
})

async function getKlant(klantID){
let connection;
try{

    connection = await pool.promise().getConnection();

    const [klant] = await connection.execute('SELECT * FROM klanten WHERE bedrijfID = ?', [klantID]);
    return klant[0]
} catch(err){
    console.log('error', err)
} finally {
    if(connection){
        connection.release();
    }
}
}

router.post('/offerte', async (req, res) => {
            let connection;
            // TODO - aanpassen zodat de prijs word opgeslagen in de database
            // Daarna bij de offerte pagina de prijs uit de database laden.


            try {
                console.log('data', req.body.data)
                const newUser = await getKlant(req.body.data.winkelData[0].klantID);
                console.log('newUser', newUser);
                connection = await pool.promise().getConnection();

                const rng = generateNumber();
                const user = req.session.user;
                const klant = newUser.bedrijf;
                const klantEmail = newUser.email;

                const offerteRefNr = rng
                var newRef = ""
                if (req.body.ref === "") {
                    newRef = offerteRefNr;
                } else {
                    newRef = req.body.ref;
                }

                const uref = newRef;
                var _newBody = JSON.parse(JSON.stringify(req.body.data.winkelData));
                // 

                const data = await calculatePrice(req.body.data.winkelData);



                for (let i = 0; i < data.length; i++) {
                    data[i].offerteRefNr = offerteRefNr;
                    if(req.body.data.bestelofferte === "bestelling"){
                        data[i].bestellingRefNr = offerteRefNr;
                    }
                    data[i].uref = uref;
                    data[i].typekorting = user.typekorting; //nog aanpassen naar klant korting
                    data[i].lakkerijkorting = newUser.lakkerijkorting; //nog aanpassen naar klant korting
                    //eventueel extra kortingen toevoegen?
                }



                if (req.body) {
                    let count = data.length;
                    var [result] = ""
                    for (const element of data) {
                        console.log('User in offerte aanvraag', newUser)


                        element.PVC42Rolluikbladkorting = newUser.PVC42Rolluikbladkorting
                        element.ALU42Rolluikbladkorting = newUser.ALU42Rolluikbladkorting
                        element.ULTRA42Rolluikbladkorting = newUser.ULTRA42Rolluikbladkorting
                        element.ULTRA52Rolluikbladkorting = newUser.ULTRA52Rolluikbladkorting
                        element.PVC55Rolluikbladkorting = newUser.PVC55Rolluikbladkorting
                        element.ALU55Rolluikbladkorting = newUser.ALU55Rolluikbladkorting
                        element.PVC42schakelaarTradirolluikkorting = newUser.PVC42schakelaarTradirolluikkorting
                        element.ALU42schakelaarTradirolluikkorting = newUser.ALU42schakelaarTradirolluikkorting
                        element.ULTRA42schakelaarTradirolluikkorting = newUser.ULTRA42schakelaarTradirolluikkorting
                        element.ULTRA52schakelaarTradirolluikkorting = newUser.ULTRA52schakelaarTradirolluikkorting
                        element.PVC55schakelaarTradirolluikkorting = newUser.PVC55schakelaarTradirolluikkorting
                        element.ALU55schakelaarTradirolluikkorting = newUser.ALU55schakelaarTradirolluikkorting
                        element.PVC42afstandsbedieningTradirolluikkorting = newUser.PVC42afstandsbedieningTradirolluikkorting
                        element.ALU42afstandsbedieningTradirolluikkorting = newUser.ALU42afstandsbedieningTradirolluikkorting
                        element.ULTRA42afstandsbedieningTradirolluikkorting = newUser.ULTRA42afstandsbedieningTradirolluikkorting
                        element.ULTRA52afstandsbedieningTradirolluikkorting = newUser.ULTRA52afstandsbedieningTradirolluikkorting
                        element.PVC55afstandsbedieningTradirolluikkorting = newUser.PVC55afstandsbedieningTradirolluikkorting
                        element.ALU55afstandsbedieningTradirolluikkorting = newUser.ALU55afstandsbedieningTradirolluikkorting
                        element.PVC42manueelTradirolluikkorting = newUser.PVC42manueelTradirolluikkorting
                        element.ALU42manueelTradirolluikkorting = newUser.ALU42manueelTradirolluikkorting
                        element.ULTRA42manueelTradirolluikkorting = newUser.ULTRA42manueelTradirolluikkorting
                        element.ULTRA52manueelTradirolluikkorting = newUser.ULTRA52manueelTradirolluikkorting
                        element.PVC55manueelTradirolluikkorting = newUser.PVC55manueelTradirolluikkorting
                        element.ALU55manueelTradirolluikkorting = newUser.ALU55manueelTradirolluikkorting
                        element.PVC42manueelVoorzetrolluikkorting = newUser.PVC42manueelVoorzetrolluikkorting
                        element.ALU42manueelVoorzetrolluikkorting = newUser.ALU42manueelVoorzetrolluikkorting
                        element.ULTRA42manueelVoorzetrolluikkorting = newUser.ULTRA42manueelVoorzetrolluikkorting
                        element.ULTRA52manueelVoorzetrolluikkorting = newUser.ULTRA52manueelVoorzetrolluikkorting
                        element.PVC42schakelaarVoorzetrolluikkorting = newUser.PVC42schakelaarVoorzetrolluikkorting
                        element.ALU42schakelaarVoorzetrolluikkorting = newUser.ALU42schakelaarVoorzetrolluikkorting
                        element.ULTRA42schakelaarVoorzetrolluikkorting = newUser.ULTRA42schakelaarVoorzetrolluikkorting
                        element.ULTRA52schakelaarVoorzetrolluikkorting = newUser.ULTRA52schakelaarVoorzetrolluikkorting
                        element.PVC42afstandsbedieningVoorzetrolluikkorting = newUser.PVC42afstandsbedieningVoorzetrolluikkorting
                        element.ALU42afstandsbedieningVoorzetrolluikkorting = newUser.ALU42afstandsbedieningVoorzetrolluikkorting
                        element.ULTRA42afstandsbedieningVoorzetrolluikkorting = newUser.ULTRA42afstandsbedieningVoorzetrolluikkorting
                        element.ULTRA52afstandsbedieningVoorzetrolluikkorting = newUser.ULTRA52afstandsbedieningVoorzetrolluikkorting
                        element.PVC42afstandsbedieningsolarVoorzetrolluikkorting = newUser.PVC42afstandsbedieningsolarVoorzetrolluikkorting
                        element.ALU42afstandsbedieningsolarVoorzetrolluikkorting = newUser.ALU42afstandsbedieningsolarVoorzetrolluikkorting
                        element.ULTRA42afstandsbedieningsolarVoorzetrolluikkorting = newUser.ULTRA42afstandsbedieningsolarVoorzetrolluikkorting
                        element.ULTRA52afstandsbedieningsolarVoorzetrolluikkorting = newUser.ULTRA52afstandsbedieningsolarVoorzetrolluikkorting
                        element.Tradibedieningkorting = newUser.Tradibedieningkorting
                        element.Tradizenderkorting = newUser.Tradizenderkorting
                        element.Tradischakelaarkorting = newUser.Tradischakelaarkorting
                        element.Tradimanueelkorting = newUser.Tradimanueelkorting
                        element.VZRbedieningkorting = newUser.VZRbedieningkorting
                        element.VZRmanueelkorting = newUser.VZRmanueelkorting
                        element.VZRschakelaarkorting = newUser.VZRschakelaarkorting
                        element.VZRzenderkorting = newUser.VZRzenderkorting
                        element.bladlakkerijkorting = newUser.bladlakkerijkorting
                        element.tradilakkerijkorting = newUser.tradilakkerijkorting
                        element.vzrlakkerijkorting = newUser.vzrlakkerijkorting
                        element.screendoekkorting = newUser.screendoekkorting
                        element.screenschakelaarkorting = newUser.screenschakelaarkorting
                        element.screenzenderkorting = newUser.screenzenderkorting
                        element.screenlakkerijkorting = newUser.screenlakkerijkorting
                        element.screen89schakelaar = newUser.screen89schakelaar
                        element.screen89somfyio = newUser.screen89somfyio
                        element.screen103schakelaar = newUser.screen103schakelaar
                        element.screen103somfyio = newUser.screen103somfyio
                        element.screen131schakelaar = newUser.screen131schakelaar
                        element.screen131somfyio = newUser.screen131somfyio
                        element.screen150somfyiosolar = newUser.screen150somfyiosolar
                        

                        if (element.type === "Rolluikblad" || element.type === "Tradirolluik" || element.type === "Voorzetrolluik" || element.type === "Screen") {
                            // const _data = calculateTotalPrice(element, user);
                            console.log('data voor allowCollumns', element)
                            element.status = req.body.data.bestelofferte
                            element.planningStatus = "Nog af te handelen"
                            const allowedColumns = [
                                'status',
                                'opmerking',
                                'ref',
                                'uref',
                                'offerteRefNr',
                                'bestellingRefNr',
                                'positie',
                                'klant',
                                'klantID',
                                'type',
                                'aantal',
                                'breedte',
                                'afgbreedte',
                                'zoekbreedte',
                                'hoogte',
                                'afghoogte',
                                'zoekhoogte',
                                'typeafwerking',
                                'typeafwerkingOmschrijving',
                                'typeafwerkingdagdata',
                                'afwerkingdata',
                                'typelamel',
                                'typelamelomschrijving',
                                'kleurlamel',
                                'kleurlamelRAL',
                                'typedoek',
                                'doek',
                                'typedoekOmschrijving',
                                'doekOmschrijving',
                                'confectie',
                                'kleuronderlat',
                                'ralonderlat',
                                'typeophangveer',
                                'aanslagtop',
                                'RBbladprijs',
                                'RBlakprijs',
                                'RBophangveerprijs',
                                'odlral',
                                'odlaecode',
                                'odluitvoering',
                                'odlomschrijving',
                                'typekorting',
                                'lakkerijkorting',
                                'typebediening',
                                'typebedieningPrijs',
                                'typebedieningOmschrijving',
                                'manueel',
                                'manueelData',
                                'schakelaar',
                                'kleurkast',
                                'kleurkastral',
                                'kastral',
                                'kastaecode',
                                'kastuitvoering',
                                'kastomschrijving',
                                'zenders',
                                'zender',
                                'kastdata',
                                'typegeleiderlinks',
                                'typegeleiderlinksOmschrijving',
                                'typegeleiderrechts',
                                'typegeleiderrechtsOmschrijving',
                                'bedieningskant',
                                'screenprijs',
                                'typebedieningskantOmschrijving',
                                'schakelaarOmschrijving',
                                'schakelaarprijs',
                                'zendersOmschrijving',
                                'kastgrootte',
                                'typelintofmotor',
                                'screenlakprijs',
                                'typedoekprijs',
                                'kastkleur',
                                'vzrprijs',
                                'vzrlakprijs',
                                'PVC42Rolluikbladkorting',
                                'ALU42Rolluikbladkorting',
                                'ULTRA42Rolluikbladkorting',
                                'ULTRA52Rolluikbladkorting',
                                'PVC55Rolluikbladkorting',
                                'ALU55Rolluikbladkorting',
                                'PVC42schakelaarTradirolluikkorting',
                                'ALU42schakelaarTradirolluikkorting',
                                'ULTRA42schakelaarTradirolluikkorting',
                                'ULTRA52schakelaarTradirolluikkorting',
                                'PVC55schakelaarTradirolluikkorting',
                                'ALU55schakelaarTradirolluikkorting',
                                'PVC42afstandsbedieningTradirolluikkorting',
                                'ALU42afstandsbedieningTradirolluikkorting',
                                'ULTRA42afstandsbedieningTradirolluikkorting',
                                'ULTRA52afstandsbedieningTradirolluikkorting',
                                'PVC55afstandsbedieningTradirolluikkorting',
                                'ALU55afstandsbedieningTradirolluikkorting',
                                'PVC42manueelTradirolluikkorting',
                                'ALU42manueelTradirolluikkorting',
                                'ULTRA42manueelTradirolluikkorting',
                                'ULTRA52manueelTradirolluikkorting',
                                'PVC55manueelTradirolluikkorting',
                                'ALU55manueelTradirolluikkorting',
                                'PVC42manueelVoorzetrolluikkorting',
                                'ALU42manueelVoorzetrolluikkorting',
                                'ULTRA42manueelVoorzetrolluikkorting',
                                'ULTRA52manueelVoorzetrolluikkorting',
                                'PVC42schakelaarVoorzetrolluikkorting',
                                'ALU42schakelaarVoorzetrolluikkorting',
                                'ULTRA42schakelaarVoorzetrolluikkorting',
                                'ULTRA52schakelaarVoorzetrolluikkorting',
                                'PVC42afstandsbedieningVoorzetrolluikkorting',
                                'ALU42afstandsbedieningVoorzetrolluikkorting',
                                'ULTRA42afstandsbedieningVoorzetrolluikkorting',
                                'ULTRA52afstandsbedieningVoorzetrolluikkorting',
                                'PVC42afstandsbedieningsolarVoorzetrolluikkorting',
                                'ALU42afstandsbedieningsolarVoorzetrolluikkorting',
                                'ULTRA42afstandsbedieningsolarVoorzetrolluikkorting',
                                'ULTRA52afstandsbedieningsolarVoorzetrolluikkorting',
                                'Tradibedieningkorting',
                                'Tradizenderkorting',
                                'Tradischakelaarkorting',
                                'Tradimanueelkorting',
                                'VZRbedieningkorting',
                                'VZRmanueelkorting',
                                'VZRzenderkorting',
                                'bladlakkerijkorting',
                                'tradilakkerijkorting',
                                'vzrlakkerijkorting',
                                'screendoekkorting',
                                'screenschakelaarkorting',
                                'screenzenderkorting',
                                'screenlakkerijkorting',
                                'screen89schakelaar',
                                'screen89somfyio',
                                'screen103schakelaar',
                                'screen103somfyio',
                                'screen131schakelaar',
                                'screen131somfyio',
                                'screen150somfyiosolar',
                                'uitvoeringblad',
                                'uitvoeringbladomschrijving',
                                'kastbinnenbuiten',
                                'kastbinnenbuitenomschrijving',
                                'feryndb',
                                'ferynzenderdb',
                                'geleiderstoppen',
                                'geleiderstopprijs',
                                'leverancier',
                                'planningStatus'
                            ]


                                const columnsToUpdate = Object.keys(element).filter(key => allowedColumns.includes(key) && key !== 'ID');
                                const updateValues = columnsToUpdate.map(key => element[key]);
                                //TODO

                                //Prijsberekenen en aanpassen
                                //dan aanpassen naar offerte
                                const updateQuery = `UPDATE winkelmand SET ${columnsToUpdate.map(col => `${col} = ?`).join(', ')} WHERE id = ?`;

                                //                     console.log(columnsToUpdate); // Controleer de kolommen die worden bijgewerkt
                                // console.log(updateValues); // Controleer de waarden die worden ingevoegd
                                // console.log(updateQuery); // Controleer de uiteindelijke query


                                // Aanpassen naar offerte.
                            try{
                                [result] = await connection.execute(
                                    updateQuery,
                                    [...updateValues, element.ID]
                                );
                            } catch(err){
                               console.log('Error', err);
                            }
                        }

                            count--;

                            if (count === 0) {
                                //stuur PDF naar klant
                                console.log('Data to send to PDF', data)
                                generatePDFfromProvidedData(data, res, uref, offerteRefNr, klant, klantEmail, user, req.body.data.bestelofferte);
                                res.send({success: true, message: 'Updated', result: result});
                            }
                        }


                    } else {
                        res.send({succes:false,
                            error: "Data niet aangekregen"
                        });
                    }
                } catch (err) {
                    console.error('Error', err);
                    res.status(500).send('Internal Server Error');
                } finally {
                    if (connection) {
                        connection.release();
                    }
                }
            });


        // Nog te verplaatsen naar aparte module
        function generateNumber() {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const randomNumber = Math.floor(Math.random() * 9999) + 1;
            const formattedRandomNumber = randomNumber.toString().padStart(4, '0');
            return `${year}${month}${day}-${formattedRandomNumber}`;
        }





        module.exports = router;