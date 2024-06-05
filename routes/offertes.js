const express = require('express');
require('dotenv').config();
const router = express.Router();
const mysql = require('mysql2')


const ExcelJS = require('exceljs');
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

router.get('/', async (req, res) => {
  console.log('req.session.user', req.session.user)
  const user = req.session.user;
  let connection;

  try {
    connection = await pool.promise().getConnection();

    if (req.session.user) {
      var query;
      if(user.login === 2){

        query = `SELECT DISTINCT offerteRefNr,uref,klant FROM winkelmand WHERE status = "offerte" ORDER by id DESC`;
      } else {
        
      query = `SELECT DISTINCT offerteRefNr,uref FROM winkelmand WHERE status = "offerte" and klant = "${user.bedrijf}" ORDER by id DESC`;
      }
      const [result, fields] = await connection.execute(query);

      const offertesRefNr = result.map(row => row.offerteRefNr);
      const Uref = result.map(row => row.uref);
      const klant = result.map(row => row.klant);

      res.render('user/offertes', {
        offertesRefNr: offertesRefNr,
        uRef: Uref,
        req: req,
        user: req.session.user,
        klant: klant,
        logged_in: req.isAuthenticated()
      });
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

router.get('/ref/:referentie', async (req, res) => {
  const user = req.session.user
  let connection;

  try {
    connection = await pool.promise().getConnection();

    if (req.session.user) {
      const referentie = req.params.referentie;
      console.log('referentie', referentie, typeof referentie);
      var query;
      console.log('user.login', user.login)
      if(user.login === 2){
        query = 'SELECT * FROM winkelmand WHERE status = "offerte" AND offerteRefNr = ?';
        const [result, fields] = await connection.execute(query, [referentie]);
      console.log('Offertes REF results', result)

      // bereken prijs
      // const data = await calculatePrice(result);
      const data = result;
      for (let i = 0; i < data.length; i++) {
        data[i].typekorting = req.session.user.typekorting; //nog aanpassen naar klant korting
        data[i].lakkerijkorting = req.session.user.lakkerijkorting; //nog aanpassen naar klant korting
      }

      console.log("Data na calculatie", data);

      // zet prijs naar constant

      // stuur naar view
      res.render('user/offertesDetail', {
        offertes: data,
        req: req,
        user: req.session.user,
        logged_in: req.isAuthenticated()
      });
      } else {

        query = 'SELECT * FROM winkelmand WHERE status = "offerte" AND offerteRefNr = ? AND klant = ?';
        const [result, fields] = await connection.execute(query, [referentie,user.bedrijf]);
      console.log('Offertes REF results', result)

      // bereken prijs
      // const data = await calculatePrice(result);
      const data = result;
      for (let i = 0; i < data.length; i++) {
        data[i].typekorting = req.session.user.typekorting; //nog aanpassen naar klant korting
        data[i].lakkerijkorting = req.session.user.lakkerijkorting; //nog aanpassen naar klant korting
      }

      console.log("Data na calculatie", data);

      // zet prijs naar constant

      // stuur naar view
      res.render('user/offertesDetail', {
        offertes: data,
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

function prepareDataForParsing(data) {
  // Eerst converteren we de data naar een string indien het nog geen string is
  let dataString = typeof data === 'string' ? data : JSON.stringify(data);

  // Vervolgens vervangen we incorrect geformatteerde delen
  // Let op: Deze aanpak vereist dat je exact weet welke patronen je moet vervangen
  // en kan complex worden als de structuren variabel zijn
  dataString = dataString.replace(/"\{/g, '{').replace(/\}"/g, '}').replace(/\\\\"/g, '\\"');

  // Dit is een eenvoudige vervanging en kan niet alle gevallen afhandelen,
  // vooral als de data complexe of geneste objecten als strings bevat.
  // Je zou dit kunnen uitbreiden met meer specifieke regels indien nodig.
  return dataString;
}
router.post('/removeFromOfferte', async (req, res) => {
  console.log('REmoving from offertes')
  let connection;

  try {
      connection = await pool.promise().getConnection();

      const removeData = req.body.data;
      

      const [result, fields] = await connection.execute(
          'DELETE FROM winkelmand WHERE ID = ?',
          [removeData.ID]
      );
      const query = 'SELECT * FROM winkelmand WHERE offerteRefNr = ?';
      const [result2, fields2] = await connection.execute(query, [removeData.offerteRefNr]);

      

      if (result) {
        if(result2.length > 0){
        console.log('Result removed', result)
        res.send({succes: true,message: 'removed, new found', result: result})
        } else {

          res.send({succes: false,message:'removed , new not found', result: result})
        }
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

function berekenLeverdatum() {
  // Huidige datum
  let vandaag = new Date();

  // Voeg 14 dagen toe aan de huidige datum
  let leverdatum = new Date(vandaag);
  leverdatum.setDate(vandaag.getDate() + 14);

  // Check of de datum in het weekend valt
  while (leverdatum.getDay() === 0 || leverdatum.getDay() === 6) {
      // Als het zaterdag (6) of zondag (0) is, voeg dan een dag toe
      leverdatum.setDate(leverdatum.getDate() + 1);
  }

  // Formatteer de datum als dd/mm/yyyy
  let dag = leverdatum.getDate().toString().padStart(2, '0');
  let maand = (leverdatum.getMonth() + 1).toString().padStart(2, '0'); // Maanden zijn 0-gebaseerd
  let jaar = leverdatum.getFullYear();

  return `${dag}/${maand}/${jaar}`;
}
function convertToDatabaseFormat(inputDate) {
  // Split de datumstring in dag, maand en jaar
  var parts = inputDate.split("/");
  
  // Maak een nieuwe datum met het formaat JJJJ-MM-DD
  var databaseDate = parts[2] + "-" + parts[1] + "-" + parts[0];
  
  return databaseDate;
}


const transporter = require('../backend/js/mailSettings/nodemailer');
router.post('/pdf', async (req, res) => {
 
  const rng = generateNumber();
  const user = req.session.user;
  const klant = req.session.user.bedrijf;
  const klantEmail = req.session.user.email;
  const data = req.body.data
  // const data = await calculatePrice(req.body.data);
  generatePDFfromProvidedData(data, res, req.body.data[0].uref, req.body.data[0].offerteRefNr, klant, klantEmail, user, "offerte");


})
router.post('/bestel', async (req, res) => {
  // readAndWriteExcel(req.body.data);
  console.log('Testing read excel')

  let connection;
  // TODO - aanpassen zodat de prijs word opgeslagen in de database
  // Daarna bij de offerte pagina de prijs uit de database laden.
  // console.log('Prepared Data',preparedData)
  // const _data = JSON.parse(preparedData)
  
  try {
    connection = await pool.promise().getConnection();
    const rng = generateNumber();
    const user = req.session.user;
    const klant = req.session.user.bedrijf;
    const klantEmail = req.session.user.email;
    const uref = req.body.data[0].uref;
    const oref = req.body.data[0].bestellingRefNr
    const bestellingRefNr = rng;
    const leverdatum = convertToDatabaseFormat(berekenLeverdatum())
    console.log('leverdatum', leverdatum)
    
const htmlAdmin =  `
<p style="text-align: center;"><span style="color: #333399;">Er is een bestelling geplaatst door ${user.bedrijf}.<br /></span></p>
<p style="text-align: center;"><span style="color: #333399;">Bestelling O/ref.: ${bestellingRefNr}</span></p>
<p style="text-align: center;"><span style="color: #333399;">Bestelling ref.: ${uref}&nbsp;<br /><br />Ga naar de <a href="http://localhost:3001/bestelling">bestelling pagina</a> als Admin om de bestelling af te handelen.<br /></span></p>
<p>&nbsp;</p>
<div style="text-align: center;"><span style="color: #333399;">Met vriendelijke groeten,</span></div>
<div style="text-align: center;">&nbsp;</div>
<div style="text-align: center;"><span style="color: #333399;">ALUPLEX</span></div>
<div style="text-align: center;">&nbsp;</div>
<div style="text-align: center;"><span style="color: #333399;"><a style="color: #333399;" href="http://www.aluplexpro.com"><img title="Logo-Aluplex" src="https://cms.ice.be/logo/150/aluplex.jpeg" alt="Logo-Aluplex" width="300" height="100" border="0" /></a></span></div>
<div>
<div style="text-align: center;">&nbsp;</div>
<table style="margin-left: auto; margin-right: auto;" border="0">
<tbody>
<tr>
<td><span style="color: #333399;">ALUPLEX Production NV</span></td>
<td><span style="color: #333399;"><a style="color: #333399;" href="mailto:kristof@aluplex.be">Info@aluplex.be</a></span></td>
</tr>
<tr>
<td><span style="color: #333399;">Kontichsesteenweg 60 Bus 2</span></td>
<td><span style="color: #333399;"><a style="color: #333399;" href="http://www.aluplexpro.com">www.aluplexpro.com</a></span></td>
</tr>
<tr>
<td><span style="color: #333399;">B-2630 Aartselaar</span></td>
<td><span style="color: #333399;"><a style="color: #333399;" href="http://www.aluplex.be">www.aluplex.be</a></span></td>
</tr>
<tr>
<td><span style="color: #333399;">BE0466.078.070</span></td>
<td><span style="color: #333399;">03/887.49.00</span></td>
</tr>
</tbody>
</table>
</div>
`
const htmlUser =  `
<!-- Voeg Bootstrap CSS toe voor styling -->
<p style="text-align: center;"><span style="color: #333399;">Beste ${user.voornaam},</span></p>
<p style="text-align: center; color: #000080;"><br />Bedankt voor uw bestelling met U/Ref.: ${uref}.<br />U krijgt zo snel mogelijk een orderbevestiging doorgestuurd met de voorziene afhaal- of leverdatum.</p>
<p>&nbsp;</p>
<div style="text-align: center;"><span style="color: #333399;">Met vriendelijke groeten,</span></div>
<div style="text-align: center;">&nbsp;</div>
<div style="text-align: center;"><span style="color: #333399;">ALUPLEX</span></div>
<div style="text-align: center;">&nbsp;</div>
<div style="text-align: center;"><span style="color: #333399;"><a style="color: #333399;" href="http://www.aluplexpro.com"><img title="Logo-Aluplex" src="https://cms.ice.be/logo/150/aluplex.jpeg" alt="Logo-Aluplex" width="300" height="100" border="0" /></a></span></div>
<div>
<div style="text-align: center;">&nbsp;</div>
<table style="margin-left: auto; margin-right: auto;" border="0">
<tbody>
<tr>
<td><span style="color: #333399;">ALUPLEX Production NV</span></td>
<td><span style="color: #333399;"><a style="color: #333399;" href="mailto:info@aluplex.be">Info@aluplex.be</a></span></td>
</tr>
<tr>
<td><span style="color: #333399;">Kontichsesteenweg 60 Bus 2</span></td>
<td><span style="color: #333399;"><a style="color: #333399;" href="http://www.aluplexpro.com">www.aluplexpro.com</a></span></td>
</tr>
<tr>
<td><span style="color: #333399;">B-2630 Aartselaar</span></td>
<td><span style="color: #333399;"><a style="color: #333399;" href="http://www.aluplex.be">www.aluplex.be</a></span></td>
</tr>
<tr>
<td><span style="color: #333399;">BE0466.078.070</span></td>
<td><span style="color: #333399;">03/887.49.00</span></td>
</tr>
</tbody>
</table>
</div>
`
 

 const mailOptionsUser = {
    from: 'kristof@aluplex.be', // vervang dit door je eigen e-mailadres
    to: `${user.email}`, // vervang dit door het e-mailadres van de ontvanger
    subject: 'Bedankt voor uw bestelling',
    text: ``,
    html: htmlUser // vervang dit door de gewenste HTML
};
const mailOptionsAdmin = {
  from: 'kristof@aluplex.be', // vervang dit door je eigen e-mailadres
  to: `kristof@aluplex.be`, // vervang dit door het e-mailadres van de ontvanger
  subject: `Er is een nieuwe bestelling geplaatst door : ${user.bedrijf} `,
  text: ``,
  html: htmlAdmin // vervang dit door de gewenste HTML
};

    // const data = await calculatePrice(req.body.data);
    const data = req.body.data

    // 

    for (let i = 0; i < data.length; i++) {
      data[i].bestellingRefNr = bestellingRefNr;
      data[i].uref = uref;
      data[i].typekorting = user.typekorting; //nog aanpassen naar klant korting
      data[i].lakkerijkorting = user.lakkerijkorting; //nog aanpassen naar klant korting
      data[i].leverdatum = leverdatum;
        //eventueel extra kortingen toevoegen?
    }



    if (data) {
      let count = data.length;
      for (const element of data) {
        console.log('data to edit', element)
        if (element.type === "Rolluikblad" || element.type === "Tradirolluik" || element.type === "Voorzetrolluik" || element.type === "Screen") {
          // const _data = calculateTotalPrice(element, user);

         


  // const columnsToUpdate = Object.keys(element).filter(key => allowedColumns.includes(key) && key !== 'ID');
  //                   const updateValues = columnsToUpdate.map(key => element[key]);
  //                   //TODO
                    
  //                   //Prijsberekenen en aanpassen
  //                   //dan aanpassen naar offerte
  //                   const updateQuery = `UPDATE winkelmand SET ${columnsToUpdate.map(col => `${col} = ?`).join(', ')} WHERE id = ?`;

          //Prijsberekenen en aanpassen
          //dan aanpassen naar offerte
          element.leverdatum = leverdatum
          const updateQuery = `UPDATE winkelmand SET status = "bestelling",planningStatus = "Nog af te handelen",bestellingRefNr = ? WHERE id = ?`;




          // Aanpassen naar offerte.

          const [result] = await connection.execute(
            updateQuery,
            [bestellingRefNr,element.ID]
          );
        }




        count--;

        if (count === 0) {
            //stuur PDF naar klant
            console.log('Data to send to PDF',data)
            // generatePDFfromProvidedData(data, res, uref, bestellingRefNr, klant, klantEmail, user,"bestelling");
            transporter.sendMail(mailOptionsUser, function (error, info) {
              if (error) {
                  console.log("error",error);
                  res.status(200).json({ success: false, message: 'Er is iets misgegaan tijdens de bestelling.' });
              } else {
                  console.log('E-mail verstuurd: ' + info.response);
                  res.status(200).json({ success: true, message: 'je bestelling is goed aangekomen' });
              }
          });
          transporter.sendMail(mailOptionsAdmin, function (error, info) {
            if (error) {
                console.log("error",error);
                res.status(200).json({ success: false, message: 'Er is iets misgegaan tijdens de bestelling.' });
            } else {
                console.log('E-mail verstuurd: ' + info.response);
                res.status(200).json({ success: true, message: 'je bestelling is goed aangekomen' });
            }
        });
        }
      }


    } else {
      res.json({
        failed: "Data niet aangekregen"
      });
    }
  } catch (err) {
    console.error('Error', err);
    res.status(500).send('Internal Server Error', err);
  } finally {
    if (connection) {
      connection.release();
    }
  }
});


router.post('/bestel2', async (req, res) => {
  readAndWriteExcel(req.body.data);

})


async function readAndWriteExcel(data) {
  console.log('Function started', data)
  console.log('current path', __dirname)
  // Maak een nieuwe workbook aan
  const workbook = new ExcelJS.Workbook();
  console.log('Workbook created', workbook)
  try {
    const data = {breedte:1500,hoogte:2500,aantal:1,typelamel:'a42'}
    console.log('Data', data)
    // Laad een bestaand excel bestand
    //search file in backend folder
    await workbook.xlsx.readFile(path.join(__dirname, '..', 'backend', 'werkbonVoorzet.xlsx'));
    // await workbook.xlsx.readFile('../backend/werkbonVoorzet.xlsx');

    // Selecteer een werkblad bij naam of index
    const worksheet = workbook.getWorksheet('WERKBON') || workbook.getWorksheet(1);

    // Bewerk een cel
    worksheet.getCell('C15').value = data.aantal
    worksheet.getCell('C16').value = data.typelamel
    worksheet.getCell('C17').value = { formula: '=ALS(C16="P42";"WIT";"")', result: "RAL" + data.kleurlamelRAL };
    if(data.kleurkast === "RAL"){
      
      worksheet.getCell('C20').value =  data.kleurkastral + "-"+data.kastuitvoering
    } else {

      worksheet.getCell('C20').value =  "RAL" + data.kleurkastral
    }
    
    worksheet.getCell('C23').value =  "RAL" + data.breedte
    worksheet.getCell('C24').value =  "RAL" + data.hoogte
    if(data.typelintofmotor === "lint"){
      
    worksheet.getCell('C25').value =  40
    } else {

      worksheet.getCell('C25').value =  60
    }

    switch (data.typebediening) {
      case "manueel":
        switch (data.typelintofmotor) {
          case "lint":
            worksheet.getCell('C30').value =  "L"
            case "koord":
              worksheet.getCell('C30').value =  "K"
                case "veeras":
                  worksheet.getCell('C30').value =  "V"
                  case "reductie":
                    worksheet.getCell('C30').value =  "R"
            break;
        
          default:
            worksheet.getCell('C30').value =  "L"
            break;
        }
        case "schakelaar":
          worksheet.getCell('C30').value =  "M"
          case "afstandsbediening":
            worksheet.getCell('C30').value =  "M"
            case "afstandsbedieningsolar":
              worksheet.getCell('C30').value =  "M"
        break;
    
      default:
        break;
    }
    if(worksheet.getCell('C30').value === "M"){
      switch (data.typelintofmotor) {
        case "gaposa":
          worksheet.getCell('C31').value =  "S"
          case "somfysolus":
            worksheet.getCell('C31').value =  "G"
            case "gaposasense":
              case "somfyio":
                case "somfyiosolar":
                  case "gaposasensesolar":
          
          break;
      
        default:
          break;
      }
    }
    
    // Voeg een nieuwe rij toe (bijvoorbeeld op de laatste positie)
    // worksheet.addRow(['Nieuwe', 'Rij', 'Data']);

    // Sla het bestand op
    //save file to backend folder
    await workbook.xlsx.writeFile(path.join(__dirname, '..', 'backend', 'werkbonVoorzetTest.xlsx'));
    // await workbook.xlsx.writeFile('../backend/werkbonVoorzetTest.xlsx');

    console.log('Excel bestand succesvol bewerkt en opgeslagen!');
  } catch (error) {
    console.error('Er is een fout opgetreden:', error);
  }
}

module.exports = router;