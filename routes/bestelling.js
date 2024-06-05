const express = require('express');
const router = express.Router();
const mysql = require('mysql2')
const fs = require('fs');
require('dotenv').config();
//TODO: 
//FIXME: 
const ExcelJS = require('exceljs');
const path = require('path');
const generatePDFfromProvidedData = require('../backend/js/generatepdf.js')
const calculatePrice = require('../backend/js/calculatePrice.js')
const fetchOfferteDetails = require('../backend/database/fetchData/offerteDetail.js')
//include .env file
require('dotenv').config();

const pool = require('../backend/database/connection')

router.get('/', async (req, res) => {
  const user = req.session.user;
  // console.log('user', user)
  let connection;

  try {
    connection = await pool.promise().getConnection();

    if (req.session.user) {
      if (req.session.user.login !== 2) {
        const query = `SELECT ID, uref,bestellingRefNr, type, leverdatum, status,planningStatus,leverancier,opmerkingKlant,prodnummer,opmerkingPlanning, SUM(aantal) AS aantal FROM winkelmand WHERE klant = ? AND status = "bestelling" GROUP BY bestellingRefNr, type ORDER BY 
        leverdatum ASC;`
        // const query2 = `SELECT leverdatum FROM winkelmand WHERE klant = ?`
        const [results, fields] = await connection.execute(query, [user.bedrijf]);
        // const [results] = await connection.execute(query2, [user.bedrijf]);
        results.forEach((result, index) => {
          // console.log('bestelling result', result)
          if (result.leverdatum) {
            // console.log('result.leverdatum', result.leverdatum, typeof result.leverdatum)
            const datum = result.leverdatum;
            const dag = datum.getDate().toString().padStart(2, '0');
            const maand = (datum.getMonth() + 1).toString().padStart(2, '0'); // Maanden beginnen bij 0 in JavaScript
            const jaar = datum.getFullYear();

            const leverdatum = `${dag}/${maand}/${jaar}`;
            results[index].leverdatum = leverdatum
            // console.log('result.leverdatum', result.leverdatum, typeof result.leverdatum)
          } else {

            // console.log('result.leverdatum', result.leverdatum, typeof result.leverdatum)
            results[index].leverdatum = "Nog te bepalen 2"
          }
        })
        // console.log('results', results)



        res.render('user/bestellingen', {
          bestellingen: results,
          req: req,
          user: req.session.user,
          logged_in: req.isAuthenticated()
        });

      } else {
        // console.log('Admin')

        const query = `SELECT ID, uref,bestellingRefNr, type, leverdatum, status,planningStatus,leverancier,opmerkingKlant,prodnummer,opmerkingPlanning,klant,afhalen, SUM(aantal) AS aantal FROM winkelmand WHERE  status = "bestelling" GROUP BY bestellingRefNr, type ORDER BY 
        leverdatum ASC;`;
        // const query2 = `SELECT leverdatum FROM winkelmand WHERE klant = ?`
        const [results, fields] = await connection.execute(query);
        // const [results] = await connection.execute(query2, [user.bedrijf]);
        results.forEach((result, index) => {
          if (result.leverdatum) {
            const datum = result.leverdatum;
            const dag = datum.getDate().toString().padStart(2, '0');
            const maand = (datum.getMonth() + 1).toString().padStart(2, '0'); // Maanden beginnen bij 0 in JavaScript
            const jaar = datum.getFullYear();

            const leverdatum = `${dag}/${maand}/${jaar}`;
            results[index].leverdatum = leverdatum
            // console.log('result.leverdatum', result.leverdatum, typeof result.leverdatum)
          } else {

            results[index].leverdatum = "Nog te bepalen"
          }
        })
        // console.log('results', results)



        res.render('user/bestellingen', {
          bestellingen: results,
          req: req,
          user: req.session.user,
          logged_in: req.isAuthenticated()
        });
      }
    } else {
      res.render('./home', {
        req: req,
        user: req.session.user,
        logged_in: req.isAuthenticated()
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

function convertToUserFormat(databaseDate) {
  // console.log('databaseDate', databaseDate)
  // Split de datumstring in jaar, maand en dag
  var parts = databaseDate.split("-");

  // Maak een nieuwe datum met het formaat DD/MM/JJJJ
  var userDate = parts[2] + "/" + parts[1] + "/" + parts[0];

  return userDate;
}

router.get('/ref/:referentie/:type', async (req, res) => {
  const user = req.session.user
  let connection;

  try {
    connection = await pool.promise().getConnection();

    if (req.session.user) {
      if (req.session.user.login === 2) {
        const referentie = req.params.referentie;
        const type = req.params.type;
        // console.log('referentie', referentie, typeof referentie);
        const query = 'SELECT * FROM winkelmand WHERE status = "bestelling" AND bestellingRefNr = ? AND type = ?';
        const [result, fields] = await connection.execute(query, [referentie, type]);
        // console.log('bestelling REF results', result)

        // bereken prijs
        // const data = await calculatePrice(result);
        data = result
        for (let i = 0; i < data.length; i++) {
          data[i].typekorting = req.session.user.typekorting; //nog aanpassen naar klant korting
          data[i].lakkerijkorting = req.session.user.lakkerijkorting; //nog aanpassen naar klant korting
        }

        // console.log("Data na calculatie", data);

        // zet prijs naar constant

        // stuur naar view
        res.render('user/bestellingDetail', {
          bestellingen: data,
          req: req,
          user: req.session.user,
          logged_in: req.isAuthenticated()
        });
      } else {
        const referentie = req.params.referentie;
        const type = req.params.type;
        // console.log('referentie', referentie, typeof referentie);
        const query = 'SELECT * FROM winkelmand WHERE status = "bestelling" AND bestellingRefNr = ? AND type = ? AND klant = ?';
        const [result, fields] = await connection.execute(query, [referentie, type, user.bedrijf]);
        // console.log('bestelling REF results', result)

        // bereken prijs
        // const data = await calculatePrice(result);
        data = result
        for (let i = 0; i < data.length; i++) {
          data[i].typekorting = req.session.user.typekorting; //nog aanpassen naar klant korting
          data[i].lakkerijkorting = req.session.user.lakkerijkorting; //nog aanpassen naar klant korting
        }

        // console.log("Data na calculatie", data);

        // zet prijs naar constant

        // stuur naar view
        res.render('user/bestellingDetail', {
          bestellingen: data,
          req: req,
          user: req.session.user,
          logged_in: req.isAuthenticated()
        });
      }

    } else {
      res.render('./home', {
        req: req,
        user: req.session.user,
        logged_in: req.isAuthenticated()
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
router.post('/generateWerkbon', async (req, res) => {
  try {

  } catch (error) {

  }
});

async function getOriginelePlanningStatus(bestellingRefNr, type) {
  var connection;
  try {
    const connection = await pool.promise().getConnection();
    const selectQuery = 'SELECT planningStatus FROM winkelmand WHERE bestellingRefNr = ? AND type = ?';
    // Voer de query uit om de oorspronkelijke planningStatus op te halen
    const [result] = await connection.execute(selectQuery, [bestellingRefNr, type]);

    // Stel dat de oorspronkelijke planningStatus in een variabele genaamd result is opgeslagen
    const originelePlanningStatus = result[0].planningStatus;
    return originelePlanningStatus;
  } catch (error) {
    console.error('Error', error);

  } finally {
    if (connection) {
      connection.release();
    }
  }
}

router.post('/editBestelling', async (req, res) => {
  globalPaths = []
  // console.log('body', req.body)
  const data = req.body.data
  const user = req.session.user;
  const leverdatum = convertToDatabaseFormat(data.leverdatum);
  // const leverdatum = "2025/10/10"
  let connection;
  // console.log('leverdatum', leverdatum, "bestellinRefNr", data.bestellingRefNr, "planningStatus", data.planningStatus, "prodnummer", data.prodnummer, "opmerkingPlanning", data.opmerkingPlanning, "opmerking", data.opmerking, "oldref", data.oldref, "klant", user.bedrijf, "type", data.type)

  try {
    connection = await pool.promise().getConnection();
    const originelePlanningStatus = await getOriginelePlanningStatus(data.bestellingRefNr, data.type);


    if (req.session.user) {
      const loggedUser = req.session.user;
      const query = 'UPDATE winkelmand SET leverdatum = ? ,bestellingRefNr=?,planningStatus = ? ,prodnummer = ? ,opmerkingPlanning = ? ,opmerkingKlant = ? ,afhalen = ? WHERE bestellingRefNr = ? AND type = ?';
      const queryKlant = 'SELECT * from klanten WHERE bedrijfID =?'
      const [result] = await connection.execute(query, [leverdatum, data.bestellingRefNr, data.planningStatus, data.prodnummer, data.opmerkingPlanning, data.opmerking, data.afhalen, data.oldref, data.type]);

      // console.log('leverdatum', leverdatum, "bestellinRefNr", data.bestellingRefNr, "planningStatus", data.planningStatus, "prodnummer", data.prodnummer, "opmerkingPlanning", data.opmerkingPlanning, "opmerking", data.opmerking, "oldref", data.oldref, "klant", user.bedrijf, "type", data.type)
      // console.log('result', result)
      if (result.affectedRows > 0) {
        const getDataQuery = 'SELECT * FROM winkelmand WHERE bestellingRefNr = ? AND type = ?';
        const [getData] = await connection.execute(getDataQuery, [data.bestellingRefNr, data.type]);

        // console.log('getData', getData)
        const [resultKlant] = await connection.execute(queryKlant, [getData[0].klantID]);
        // console.log('resultKlant', resultKlant)
        var files;
        if (getData) {
          if (originelePlanningStatus === "Nog af te handelen" && (data.planningStatus === "In productie" ||data.planningStatus === "In lakkerij") && leverdatum !== "Nog te bepalen") {
            console.log('originelePlanningStatus',)
            // handleOrder(getData, user)
            generatePDFfromProvidedData(getData, res, getData[0].uref, getData[0].bestellingRefNr, resultKlant[0].bedrijf, resultKlant[0].email, resultKlant[0], "orderbevestiging",loggedUser);
            console.log('generatePDFfromProvidedData')


            const [result2] = await connection.execute('SELECT * FROM winkelmand WHERE bestellingRefNr = ? AND type = ?', [data.bestellingRefNr, data.type])
            console.log('result2')
            const user = result2[0].klantID
            console.log('before handleOrder')
            await handleOrder(result2, user)
            console.log('after handleOrder', globalPaths)


            files = globalPaths.map(filepath => ({
              filename: path.basename(filepath),
              path: filepath,
            }));
            console.log('files', files)
            // console.log('files', files)
            // await readandwriterolluikbladexcel(getData,req.session.user)
            // console.log('#TODO - Mail te genereren naar klant met leverdatum & orderbevestiging')
            // console.log('#TODO - Map klanten aanmaken?')
            // console.log('#TODO - Werkbon opslagen in de map van de klanten en ineens afprinten?')
            //Stuur mail naar klant met leverdatum van de bestelling #TODO
          } else if (data.planningStatus === "Klaar voor levering/afhaling") {
            //Stuur mail naar klant dat de bestelling klaar is #TODO
            // console.log('Werkbon al gemaak')
          } else {
            // console.log('Werkbon al gemaak, Geen mail te versturen')
          }

        }
        // console.log('result.affectedRows', result.affectedRows)

        // console.log('result.affectedRows', result)
        //send success
        console.log('verzondenFiles', files)
        res.send({
          files: files,
          succes: true,
          message: 'update gelukt'
        })
      } else {
        res.send({
          succes: false,
          message: 'update mislukt'
        })
      }

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

function convertToDatabaseFormat(inputDate) {
  // Split de datumstring in dag, maand en jaar
  var parts = inputDate.split("/");

  // Maak een nieuwe datum met het formaat JJJJ-MM-DD
  var databaseDate = parts[2] + "-" + parts[1] + "-" + parts[0];
  console.log('databaseDate', databaseDate)

  return databaseDate;
}

router.get('/downloadExcel', async (req, res) => {
  console.log('downloadExcel data', req.body.data)
  const filePath = decodeURIComponent(req.query.path);
  console.log('downloadExcel', filePath)

  // Controleer op het bestaan van het bestand
  if (!fs.existsSync(filePath)) {
    res.status(404).send('Bestand niet gevonden');
    return;
  }

  // Lees het bestand als stream
  const fileStream = fs.createReadStream(filePath, {
    highWaterMark: 16384
  });

  // Stel de juiste headers in
  res.setHeader('Content-Type', 'application/vnd.ms-excel');
  res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);

  // Stuur het bestand als stream naar de client
  fileStream.pipe(res);

  // Vang fouten af
  fileStream.on('error', (err) => {
    console.error('Fout bij het downloaden van bestand:', err);
    res.status(500).send('Fout bij het downloaden van bestand');
  });
});

var globalPaths = []

router.post('/testExcel', async (req, res) => {
  const data = req.body.data
  // console.log('data', data)

  let connection;

  try {
    connection = await pool.promise().getConnection();

    const [result] = await connection.execute('SELECT * FROM winkelmand WHERE bestellingRefNr = ? AND type = ?', [data.bestellingRefNr, data.type])

    const user = result[0].klantID
    console.log('before handleOrder')
    await handleOrder(result, user)
    console.log('after handleOrder', globalPaths)


    const files = globalPaths.map(filepath => ({
      filename: path.basename(filepath),
      path: filepath,
    }));
    // console.log('files', files)
    res.json({
      files
    });
  } catch (err) {
    // console.log(err)
  } finally {
    if (connection) {
      connection.release();
    }
  }

})






async function handleOrder(data, user) {
  console.log('in handleOrder')
  // Definieer de maximale aantallen per type
  const maxItemsPerType = {
    'Rolluikblad': 10,
    'Tradirolluik': 10,
    'Voorzetrolluik': 5
  };

  // Groepeer data per type
  const groupedData = {
    'Rolluikblad': [],
    'Tradirolluik': [],
    'Voorzetrolluik': []
  };

  for (const [index, item] of data.entries()) {
    if (item.type in groupedData) {
      groupedData[item.type].push(item);
    }
  };

  // Verwerk elk type apart
  for (const [index, type] of Object.keys(groupedData).entries()) {


    const items = groupedData[type];
    let fileCount = 0;
    const maxItems = maxItemsPerType[type];


    for (let i = 0; i < items.length; i += maxItems) {
      fileCount++;
      const chunk = items.slice(i, i + maxItems);
      // Bestandsnaam met index en type
      const fileName = `WB${data[0].bestellingRefNr} REF ${data[0].uref.replaceAll('/', '-')} ${type.toLowerCase()} ${String.fromCharCode(96 + fileCount)}.xlsx`;
      await createAndSaveExcel(chunk, type, user, fileName);
    }
  };
}

async function createAndSaveExcel(items, type, user, fileName) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, '..', 'backend/werkbon/1default', `werkbon${type.toLowerCase()}.xlsx`));
  var werkbon = workbook.getWorksheet('WERKBON') || workbook.getWorksheet(1);
  var afleverbon = workbook.getWorksheet('AFLEVERBON') || workbook.getWorksheet(2);
  var lakkerijbon = workbook.getWorksheet('Lakkerij') || workbook.getWorksheet(3);

  fillCustomerData(werkbon, user, items[0]);

  const startColumn = 'B';
  // Vul de gegevens voor elke item in 'items'
  // Afhankelijk van het type rolluik, vul je specifieke cellen
  for (const [index, item] of items.entries()) {
    // items.forEach(async (item, index) => {

    if (item.type === 'Rolluikblad') {
      const column = String.fromCharCode(startColumn.charCodeAt(0) + index); // Bereken de juiste kolom op basis van de huidige index
      // console.log('item', item)
      if (item.aantal && item.aantal > 0) {

        werkbon = await generateWerkbonRolluikblad(item, column, werkbon, workbook, afleverbon, lakkerijbon)
      }

    } else if (item.type === 'Tradirolluik') {
      const column = String.fromCharCode(startColumn.charCodeAt(0) + index); // Bereken de juiste kolom op basis van de huidige index

      if (item.aantal && item.aantal > 0) {
        werkbon = await generateWerkbonTradi(item, column, werkbon, workbook, afleverbon, lakkerijbon)


      }

      // Specifieke logica voor Tradirolluik kan hier toegevoegd worden
    } else if (item.type === 'Voorzetrolluik') {
      const column = String.fromCharCode(startColumn.charCodeAt(0) + (index + 1)); // Bereken de juiste kolom op basis van de huidige index
      if (item.aantal && item.aantal > 0) {
        werkbon = await generateWerkbonVoorzet(item, column, werkbon, workbook, afleverbon, lakkerijbon)
      }
      // Aanpassingen specifiek voor Voorzetrolluik
    }
  };
  const filePath = path.join(__dirname, '..', 'backend/werkbon/', items[0].klant, fileName);

  // Zorg ervoor dat de directory bestaat
  ensureDirectoryExistence(filePath);

  // Sla het bestand op
  console.log('pushing filepath', filePath)
  globalPaths.push(filePath)
  await workbook.xlsx.writeFile(filePath);
  // console.log(`Excel file saved: ${fileName}`);
}

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// // Aanroepen van de hoofdfunctie
// readandwriterolluikbladexcel(data, user).then(() => {
//   // console.log('Order processed successfully.');
// }).catch(err => {
//   console.error('Failed to process order:', err);
// });


async function fillCustomerData(worksheet, userID, orderInfo) {
  let connection;
  try {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    connection = await pool.promise().getConnection();
    const query = `SELECT * FROM klanten WHERE bedrijfID = ?`;
    const [result] = await connection.execute(query, [orderInfo.klantID]);
    const user = result[0];
    // console.log('user', user)
    // console.log('orderInfo', orderInfo)
    worksheet.getCell('B4').value = user.bedrijf ? user.bedrijf.toUpperCase() : ''; // Klant naam
    worksheet.getCell('B5').value = (user.facstraatnaam ? user.facstraatnaam.toUpperCase() : '') + " " + (user.fachuisnummer ? user.fachuisnummer : ''); // Klant adres Deel 1
    worksheet.getCell('B6').value = (user.facstad ? user.facstad.toUpperCase() : '') + " " + (user.facpostcode ? user.facpostcode : ''); // Klant adres Deel 2
    worksheet.getCell('B7').value = user.btwnummer; // Klant BTW nummer
    worksheet.getCell('B8').value = user.tel; // Klant Tel. nummer
    worksheet.getCell('B10').value = user.facemail.toUpperCase(); // Klant email

    // Set order specific details

    worksheet.getCell('B12').value = orderInfo.uref.toUpperCase(); // Referentie
    worksheet.getCell('I8').value = orderInfo.bestellingRefNr; // Onze referentie
    worksheet.getCell('I10').value = (orderInfo.afhalen) ? 'J' : 'N'; // Klant afhaling Ja/nee
    worksheet.getCell('I12').value = orderInfo.leverdatum.toLocaleDateString('nl-BE', options); // Leverdatum
  } catch (err) {
    // console.log(err)
  } finally {
    if (connection) connection.release();
  }
}

function checkString(item) {
  // Gebruik een reguliere expressie om te controleren of de string begint met "R" gevolgd door een cijfer
  const regex = /^R\d/;

  // Controleer of item.positie overeenkomt met het patroon
  if (regex.test(item.positie)) {
      // Doe niets als de string begint met "R" gevolgd door een cijfer
      return false
  } else {
      // Doe iets anders als de string niet begint met "R" gevolgd door een cijfer
      console.log("De string begint niet met 'R' gevolgd door een cijfer.");
      // Hier kun je je eigen actie plaatsen
      return true
  }
}
async function werkbonTypelamel(benamingLamel) {
  var connection;
  try {
    connection = await pool.promise().getConnection();
    var query = `SELECT werkbon FROM typelamel WHERE benaming = ?`;
    const [result] = await connection.execute(query, [benamingLamel]);
    // console.log('result werkbon', result)
    return result[0].werkbon
  } catch (err) {
    // console.log(err)
  } finally {
    if (connection) connection.release();
  }
}

async function werkbonUitvoeringblad(benamingUitvoeringblad) {
  var connection;
  try {
    connection = await pool.promise().getConnection();
    var query = `SELECT werkbon FROM uitvoeringblad WHERE benaming = ?`;
    const [result] = await connection.execute(query, [benamingUitvoeringblad]);
    // console.log('result werkbon', result)
    return result[0].werkbon
  } catch (err) {
    // console.log(err)
  } finally {
    if (connection) connection.release();
  }
}

async function generateWerkbonVoorzet(item, column, werkbon, werkboek, afleverbon, lakkerijbon) {
  const rolluikPos = verkrijgVZRPos(column)
  let connection;
  try {
    connection = await pool.promise().getConnection();
    if(checkString(item.positie)) {
      werkbon.getCell(column+14).value = item.positie;
    }

    const typelamel = await werkbonTypelamel(item.typelamel)
    // console.log('column', column, typelamel)
    werkbon.getCell(column + 15).value = item.aantal;
    werkbon.getCell(column + 16).value = typelamel.toUpperCase();
    if (item.kleurlamel == "Wit" || item.kleurlamel == "Beige") {
      werkbon.getCell(column + 17).value = (item.kleurlamel ? item.kleurlamel.toUpperCase() : item.kleurlamel.toUpperCase());
    } else {
      werkbon.getCell(column + 17).value = "RAL " + (item.kleurlamelRAL ? item.kleurlamelRAL : item.kleurlamel.toUpperCase());

    }

    const uitvoeringblad = await werkbonUitvoeringblad(item.uitvoeringblad)
    werkbon.getCell(column + '18').value = uitvoeringblad; // moet nog worden toegevoegd #TODO


    if (item.kleurkast !== "RAL") {
      if (item.kleurkast == "Wit" || item.kleurkast == "Beige") {
        werkbon.getCell(column + 20).value = (item.kleurkast ? item.kleurkast.toUpperCase() : item.kleurkast.toUpperCase());

      } else {
        werkbon.getCell(column + 20).value = "RAL " + (item.kleurkastral ? item.kleurkastral : item.kleurkast.toUpperCase());

      }
    } else {

      werkbon.getCell(column + 20).value = item.kastral + " " + (item.kastuitvoering.substring(0, 3)).toUpperCase(); // kleur onderlat
      lakkerijbon.getCell("C17").value = item.kastaecode
      lakkerij = true
    }
    //Afgewerkte maten
    werkbon.getCell(column + 23).value = item.afgbreedte;
    werkbon.getCell(column + 24).value = item.afghoogte;

    //Kastgrootte
    werkbon.getCell(column + 27).value = {
      formula: werkbon.getCell(column + 27).formula,
      result: item.kastdata
    };
    var query1 = `SELECT omschrijving FROM typevzrgeleiders WHERE benaming = ?`;
    var query2 = `SELECT omschrijving FROM typevzrgeleiders WHERE benaming = ?`;
    const [result1, result2] = await Promise.all([
      connection.execute(query1, [item.typegeleiderlinks]),
      connection.execute(query2, [item.typegeleiderrechts])
    ]);
    //Geleider LInks
    werkbon.getCell(column + 28).value = {
      formula: werkbon.getCell(column + 28).formula,
      result: result1[0].omschrijving
    };
    //Geleider Rechts
    werkbon.getCell(column + 29).value = {
      formula: werkbon.getCell(column + 29).formula,
      result: result2[0].omschrijving
    };


    if (item.typebediening === "manueel") {
      if (item.typelintofmotor == "veeras") {

        const newImagePath = await returnImagePath("r0")
        await afbeeldingCopyeren(werkbon, werkboek, rolluikPos.bedieningskantpos, newImagePath)
        //As naar 60 zetten
        werkbon.getCell(column + 25).value = 60;
        //Bediening naar V zetten van veeras.
        werkbon.getCell(column + 30).value = "V";
        //Opmerking toevoegen.
        werkbon.getCell(rolluikPos.opmvzr1).value = "Tussenlat, Slot & Handgrepen"
        //kast binnen of buiten.

        werkbon.getCell(rolluikPos.bediening).value = item.kastbinnenbuitenomschrijving.toUpperCase();
      } else {
        //Kijken naar het type bediening.
        var query = `SELECT werkbondata FROM vzrbediening WHERE benaming = ?`;
        const [resultbediening] = await connection.execute(query, [item.typelintofmotor]);
        // console.log('result werkbondata', resultbediening)
        werkbon.getCell(column + 25).value = 40;
        werkbon.getCell(column + 30).value = resultbediening[0].werkbondata.toUpperCase();
        werkbon.getCell(column + 32).value = item.bedieningskant.toUpperCase()
        const newImagePath = await returnImagePath(item.bedieningskant)
        // console.log('newImagePath', newImagePath)
        await afbeeldingCopyeren(werkbon, werkboek, rolluikPos.bedieningskantpos, newImagePath)
        werkbon.getCell(column + 33).value = "O"

        if (item.manueelData) {
          const manueelData = JSON.parse(item.manueelData).manueel
          // console.log('manueelData', manueelData)



          if (manueelData.length > 0) {
            if (manueelData[0].benaming == "geen" && manueelData[0].checked) {

            } else {
              if (manueelData[0].benaming === "reductie" || manueelData[1].benaming === "reductie" || manueelData[2].benaming === "reductie") {
                werkbon.getCell(column + 30).value = "R";
              } else {



              }
            }

          }
        }


      }
    } else {
      const newImagePath = await returnImagePath(item.bedieningskant)
      await afbeeldingCopyeren(werkbon, werkboek, rolluikPos.bedieningskantpos, newImagePath)
      werkbon.getCell(column + 25).value = 60;
      werkbon.getCell(column + 30).value = "M";
      var query = `SELECT werkbondata FROM vzrbediening WHERE benaming = ?`;
      const [resultmotor] = await connection.execute(query, [item.typelintofmotor]);
      // console.log('result vzrbediening werkbondata', resultmotor)

      werkbon.getCell(column + 31).value = resultmotor[0].werkbondata.toUpperCase();

      werkbon.getCell(column + 32).value = item.bedieningskant.toUpperCase()

      if (item.typebediening === "afstandsbediening" || item.typebediening === "afstandsbedieningsolar") {
        const zenderOmschrijvingData = JSON.parse(item.zendersOmschrijving).zenders
        // console.log('zenderOmschrijvingData', zenderOmschrijvingData)
        const zendersData = JSON.parse(item.zenders).zenders;
        if (zendersData[0].benaming == "geen" && zendersData[0].checked === true) {

        } else {
          var count = 0
          for (const [index, zender] of zendersData.entries()) {
            if (zender.benaming != "geen") {
              var query = `SELECT werkbondata FROM zenders WHERE benaming = ?`;
              const [resultzender] = await connection.execute(query, [zender.benaming]);
              // console.log('result zender werkbondata', resultzender)
              if (count === 0) {
                if (zender.aantal > item.aantal) {
                  //opmerking toevoegen
                  werkbon.getCell(column + 35).value = resultzender[0].werkbondata.toUpperCase();
                  werkbon.getCell(rolluikPos.opmvzr1).value = "+" + zenderOmschrijvingData[index - 1].omschrijving.toUpperCase() + " x" + (zender.aantal - item.aantal);
                } else {

                  werkbon.getCell(column + 35).value = resultzender[0].werkbondata.toUpperCase();
                }
              } else {

                if (zender.aantal > item.aantal) {
                  //opmerking toevoegen

                  werkbon.getCell(column + (35 + count)).value = resultzender[0].werkbondata.toUpperCase();
                  werkbon.getCell(rolluikPos.opmvzr1).value = "+" + zenderOmschrijvingData[index - 1].omschrijving.toUpperCase() + " x" + (zender.aantal - item.aantal);
                } else {


                  werkbon.getCell(column + (35 + count)).value = resultzender[0].werkbondata.toUpperCase();
                }

              }
              count++

            }
          }

        }

      } else if (item.typebediening === "schakelaar") {
        if (item.schakelaar == "geen") {

          werkbon.getCell(column + 33).value = "G";
        } else {

          var query = `SELECT werkbondata FROM zenders WHERE benaming = ?`;
          const [resultschakelaar] = await connection.execute(query, [item.schakelaar]);
          // console.log('resultschakelaar werkbondata', resultschakelaar)
          if (resultschakelaar[0].werkbondata === "*") {
            werkbon.getCell(rolluikPos.opmvzr1).value = item.schakelaarOmschrijving.toUpperCase();
          } else {
            werkbon.getCell(column + 33).value = resultschakelaar[0].werkbondata.toUpperCase();
          }
        }
      }





    }


    return werkbon

  } catch (err) {
    // console.log(err)
  }
}

async function afbeeldingCopyeren(werkbon, werkboek, destinationCell, imagePath) {
  // Zoek de afbeelding in de broncel (sourceCell)
  // Lees de afbeelding als een buffer
  const imageBuffer = await fs.promises.readFile(imagePath);

  // Voeg de afbeelding toe aan de werkmap
  const imageId = werkboek.addImage({
    buffer: imageBuffer,
    extension: path.extname(imagePath).substring(1) // Haal de extensie van het bestand
  });
  // Voeg de afbeelding in op de gewenste locatie
  werkbon.addImage(imageId, {
    tl: {
      col: werkbon.getColumn(destinationCell[0]).number - 1,
      row: parseInt(destinationCell.slice(1)) - 1
    },
    ext: {
      width: 200,
      height: 150
    } // Pas de grootte aan indien nodig
  });

}

async function generateWerkbonRolluikblad(item, column, werkbon, werkboek, afleverbon, lakkerijbon) {
  try {
    const typelamel = await werkbonTypelamel(item.typelamel)
    if(checkString(item.positie)) {
      werkbon.getCell(column+14).value = item.positie;
    }
    // console.log('column', column, typelamel)
    werkbon.getCell(column + '15').value = item.aantal;


    
    if (item.kleurlamel == "Wit" || item.kleurlamel == "Beige") {
      werkbon.getCell(column + 16).value = (item.kleurlamel ? item.kleurlamel.toUpperCase() : item.kleurlamel.toUpperCase());
    } else {
      werkbon.getCell(column + 16).value = "RAL " + (item.kleurlamelRAL ? item.kleurlamelRAL : item.kleurlamel.toUpperCase());

    }


    werkbon.getCell(column + '17').value = "RAL " + (item.kleurlamelRAL ? item.kleurlamelRAL : item.kleurlamel.toUpperCase());

    const uitvoeringblad = await werkbonUitvoeringblad(item.uitvoeringblad)
    werkbon.getCell(column + '18').value = uitvoeringblad; // moet nog worden toegevoegd #TODO
    if (item.kleuronderlat !== "RAL") {
/**
 *   if (item.kleurkast == "Wit" || item.kleurkast == "Beige") {
        werkbon.getCell(column + 20).value = (item.kleurkast ? item.kleurkast.toUpperCase() : item.kleurkast.toUpperCase());

      } else {
        werkbon.getCell(column + 20).value = "RAL " + (item.kleurkastral ? item.kleurkastral : item.kleurkast.toUpperCase());

      }
 */

if(item.kleuronderlat == "wit" || item.kleuronderlat == "beige") {
  werkbon.getCell(column + 21).value = (item.kleuronderlat ? item.kleuronderlat.toUpperCase() : item.kleuronderlat.toUpperCase());
} else {
  werkbon.getCell(column + 21).value = "RAL " + (item.kleuronderlatRAL ? item.kleuronderlatRAL : item.kleuronderlat.toUpperCase());

}

    } else {

      werkbon.getCell(column + 21).value = item.odlral + " " + (item.odluitvoering.substring(0, 3)).toUpperCase(); // k kleur onderlat
      lakkerijbon.getCell("C17").value = item.odlaecode
      lakkerij = true
    }
    werkbon.getCell(column + 22).value = item.afgbreedte;
    werkbon.getCell(column + 23).value = item.afghoogte;
    return werkbon
  } catch (err) {
    // console.log(err)
  }
}


async function generateWerkbonTradi(item, column, werkbon, werkboek, afleverbon, lakkerijbon) {
  const rolluikPos = verkrijgRolluikNummer(column)
  let connection;
  try {
    if(checkString(item.positie)) {
      werkbon.getCell(column+14).value = item.positie;
    }
    connection = await pool.promise().getConnection();
    const typelamel = await werkbonTypelamel(item.typelamel)
    werkbon.getCell(column + 15).value = item.aantal;

    werkbon.getCell(column + 16).value = typelamel.toUpperCase();
    if (item.kleurlamel == "Wit" || item.kleurlamel == "Beige") {
      werkbon.getCell(column + 16).value = (item.kleurlamel ? item.kleurlamel.toUpperCase() : item.kleurlamel.toUpperCase());
    } else {
      werkbon.getCell(column + 16).value = "RAL " + (item.kleurlamelRAL ? item.kleurlamelRAL : item.kleurlamel.toUpperCase());

    }
    const uitvoeringblad = await werkbonUitvoeringblad(item.uitvoeringblad)
    werkbon.getCell(column + 18).value = uitvoeringblad; // moet nog worden toegevoegd
    if (item.kleuronderlat !== "RAL") {
      if(item.kleuronderlat)
        if(item.kleuronderlat == "wit" || item.kleuronderlat == "beige") {
          werkbon.getCell(column + 21).value = (item.kleuronderlat ? item.kleuronderlat.toUpperCase() : item.kleuronderlat.toUpperCase());
        } else {
          werkbon.getCell(column + 21).value = "RAL " + (item.kleuronderlatRAL ? item.kleuronderlatRAL : item.kleuronderlat.toUpperCase());
        
        }
    } else {

      werkbon.getCell(column + 21).value = item.odlral + " " + (item.odluitvoering.substring(0, 3)).toUpperCase(); // kleur onderlat
      lakkerijbon.getCell("C17").value = item.odlaecode
      lakkerij = true
    }
    werkbon.getCell(column + 22).value = item.afgbreedte;
    werkbon.getCell(column + 23).value = item.afghoogte;

    if (item.afgbreedte > 3000 && item.bediening !== "manueel") {
      werkbon.getCell(column + 24).value = 70;

    } else {

      werkbon.getCell(column + 24).value = 60;
    }
    if (item.typebediening === "manueel") {
      console.log('Manueel')
      if (item.manueelData && item.manueelData !== "geen") {
        console.log('item.manueelData', item.manueelData)
        const manueelData = JSON.parse(item.manueelData).manueel;
        if (manueelData[0].benaming === "reductie" || manueelData[1].benaming === "reductie" || manueelData[2].benaming === "reductie") {
          werkbon.getCell(column + 26).value = "R";
          var query = `SELECT werkbondata FROM tradibediening WHERE benaming = ?`;
          const [result] = await connection.execute(query, [item.typelintofmotor]);
          // console.log('result werkbondata', result)
          werkbon.getCell(column + 28).value = result[0].werkbondata.toUpperCase();
        } else {
          werkbon.getCell(column + 26).value = "L";
          var query = `SELECT werkbondata FROM tradibediening WHERE benaming = ?`;
          const [result] = await connection.execute(query, [item.typelintofmotor]);
          werkbon.getCell(column + 28).value = result[0].werkbondata.toUpperCase();
          if (manueelData[0].benaming === "muurdoos" || manueelData[1].benaming === "muurdoos" || manueelData[2].benaming === "muurdoos") {
            werkbon.getCell(column + 29).value = "J";
          }
        }
      } else {
        werkbon.getCell(column + 26).value = "L";
        console.log('manueelData not found')    
          var query = `SELECT werkbondata FROM tradibediening WHERE benaming = ?`;
        const [result] = await connection.execute(query, [item.typelintofmotor]);
        werkbon.getCell(column + 28).value = result[0].werkbondata.toUpperCase();
      }
    } else {
      werkbon.getCell(column + 26).value = "M";
      var query = `SELECT werkbondata FROM tradibediening WHERE benaming = ?`;
      const [result] = await connection.execute(query, [item.typelintofmotor]);
      // console.log('result werkbondata', result)

      werkbon.getCell(column + 27).value = result[0].werkbondata.toUpperCase();
      if (item.typebediening === "afstandsbediening" || item.typebediening === "afstandsbedieningsolar") {

        const zendersData = JSON.parse(item.zenders).zenders;
        if (zendersData[0].benaming != "geen" && zendersData[0].checked === false) {
          var count = 0
          for (const [index, zender] of zendersData.entries()) {
            if (zender.benaming != "geen") {
              var query = `SELECT werkbondata FROM zenders WHERE benaming = ?`;
              const [result] = await connection.execute(query, [zender.benaming]);
              if (count === 0) {
                if (zender.aantal > item.aantal) {
                  //opmerking toevoegen
                  werkbon.getCell(column + 29).value = result[0].werkbondata.toUpperCase();
                  werkbon.getCell(rolluikPos.opm1).value = "+" + zender.benaming.toUpperCase() + " x" + (item.aantal);
                } else {

                  werkbon.getCell(column + 29).value = result[0].werkbondata.toUpperCase();
                }
              } else {
                werkbon.getCell(column + 29).value = result[0].werkbondata.toUpperCase();
              }

            }
          }

        }

      } else if (item.typebediening === "schakelaar") {
        if (item.schakelaar == "geen") {

          werkbon.getCell(column + 28).value = "G";
        } else {

          var query = `SELECT werkbondata FROM zenders WHERE benaming = ?`;
          const [result] = await connection.execute(query, [item.schakelaar]);
          // console.log('result werkbondata', result)
          if (result[0] === "*") {
            werkbon.getCell(rolluikPos.opm1).value = item.schakelaarOmschrijving;
          } else {
            werkbon.getCell(column + 28).value = result[0].werkbondata;
          }
        }
      }


    }

    if (item.opmerking) {
      if (werkbon.getCell(rolluikPos.opm1).value === "") {

        werkbon.getCell(rolluikPos.opm1).value = item.opmerking;
      } else {

        werkbon.getCell(rolluikPos.opm2).value = (werkbon.getCell(rolluikPos.opm2).value === "") ? item.opmerking : werkbon.getCell(rolluikPos.opm2).value + " - " + item.opmerking;
      }
    }
    return werkbon
  } catch (err) {
    // console.log(err)
  } finally {
    if (connection) connection.release();
  }

}

function verkrijgRolluikNummer(column) {
  switch (column) {
    case "B":
      return {
        "rolluik": 1, "opm1": "B45", "opm2": "E45", "opmvzr1": "C60", "opmvzr2": "C61", "opmvzr3": "C62", "bediening": "G54", "bedieningskantpos": "J50"
      };
    case "C":
      return {
        "rolluik": 2, "opm1": "B46", "opm2": "E46", "opmvzr1": "C76", "opmvzr2": "C77", "opmvzr3": "C78", "bediening": "G70", "bedieningskantpos": "J66"
      };
    case "D":
      return {
        "rolluik": 3, "opm1": "B47", "opm2": "E47", "opmvzr1": "C92", "opmvzr2": "C93", "opmvzr3": "C94", "bediening": "G86", "bedieningskantpos": "J82"
      };
    case "E":
      return {
        "rolluik": 4, "opm1": "B48", "opm2": "E48", "opmvzr1": "C108", "opmvzr2": "C109", "opmvzr3": "C110", "bediening": "G102", "bedieningskantpos": "J98"
      };
    case "F":
      return {
        "rolluik": 5, "opm1": "B49", "opm2": "E49", "opmvzr1": "C124", "opmvzr2": "C125", "opmvzr3": "C126", "bediening": "G118", "bedieningskantpos": "J114"
      };
    case "G":
      return {
        "rolluik": 6, "opm1": "B50", "opm2": "E50"
      };
    case "H":
      return {
        "rolluik": 7, "opm1": "B51", "opm2": "E51"
      };
    case "B":
      return {
        "rolluik": 8, "opm1": "B52", "opm2": "E52"
      };
    case "B":
      return {
        "rolluik": 9, "opm1": "B53", "opm2": "E53"
      };
    case "B":
      return {
        "rolluik": 10, "opm1": "B54", "opm2": "E54"
      };

    default:
      break;
  }

}

function verkrijgVZRPos(column) {
  switch (column) {
    case "C":
      return {
        "rolluik": 1, "opm1": "B45", "opm2": "E45", "opmvzr1": "C60", "opmvzr2": "C61", "opmvzr3": "C62", "bediening": "G54", "bedieningskantpos": "J50"
      };
    case "D":
      return {
        "rolluik": 2, "opm1": "B46", "opm2": "E46", "opmvzr1": "C76", "opmvzr2": "C77", "opmvzr3": "C78", "bediening": "G70", "bedieningskantpos": "J66"
      };
    case "E":
      return {
        "rolluik": 3, "opm1": "B47", "opm2": "E47", "opmvzr1": "C92", "opmvzr2": "C93", "opmvzr3": "C94", "bediening": "G86", "bedieningskantpos": "J82"
      };
    case "F":
      return {
        "rolluik": 4, "opm1": "B48", "opm2": "E48", "opmvzr1": "C108", "opmvzr2": "C109", "opmvzr3": "C110", "bediening": "G102", "bedieningskantpos": "J98"
      };
    case "G":
      return {
        "rolluik": 5, "opm1": "B49", "opm2": "E49", "opmvzr1": "C124", "opmvzr2": "C125", "opmvzr3": "C126", "bediening": "G118", "bedieningskantpos": "J114"
      };

    default:
      break;
  }

}

async function returnImagePath(bedieningskant) {
  const pathNaarImage = path.join(__dirname, '..', 'public', 'img', 'rolluiken', 'vzrbedieningskant', `${bedieningskant}.png`);
  const defaultImagePath = path.join(__dirname, '..', 'public', 'img', 'rolluiken', 'vzrbedieningskant', 'r0.png');

  try {
    await fs.promises.access(pathNaarImage);
    return pathNaarImage;
  } catch (error) {
    console.warn(`Image not found: ${pathNaarImage}, using default image: ${defaultImagePath}`);
    return defaultImagePath;
  }
}


module.exports = router;