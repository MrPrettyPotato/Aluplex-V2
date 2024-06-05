const express = require('express');
const router = express.Router();

// const PDFDocument = require('pdfkit');
const PDFDocument = require("pdfkit-table");
const fs = require('fs');
const nodemailer = require('nodemailer');
const generateTable = require('./generateTablePDF.js')
const calculateTotalPrice = require('./calculateTotalePrice.js')
const {
    Readable
} = require('stream');

require('dotenv').config();

const path = require('path');
const imgPath = path.join(__dirname, '..', '..', 'public', 'img', 'aluplex.jpeg')




/**
 * Voert een berekening uit met drie parameters.
 * @constructor
 * @param {Array.<{}>} data - Array of objects .
 * @param {Express.Response} res - De Express-response waarnaar het PDF-bestand moet worden verzonden.
 * @param {string} ref - De referentie van de bestelling.
 * @param {string} rng - Een soort random number yyyymmdd + rng(4 tekens).
 * @param {string} klant - Een soort random number yyyymmdd + rng(4 tekens).
 */
async function generatePDFfromProvidedData(data, res, ref, rng, klant,klantEmail,user) {    //Zet de data om naar een _data, Dit word alleen gebruikt in deze block
   try {
    var _data = data
    // Create a new PDF document
    const doc = new PDFDocument({
        margin: 10,
        size: 'A4'
    });
    _data.ref = ref

    //Zet alle waardes op 0 voor de totaalprijs van alle rolluiken
    var totaalbruto = 0
    var totaalnetto = 0
    var totaalbtw = 0
    var totaalNettoInclBTW = 0

    //loop door de data
    _data.forEach((item, index) => {
        console.log("data length",data.length)
        //Indien het niet de 1ste pagina is, voeg dan eerst een andere pagina toe
        if (index != 0) {
            doc.addPage()
        } else {

        }
        //Bereken de totaalprijzen Per rolluik
        const _data = calculateTotalPrice(item,user)

        doc.fillColor('white'),
            doc.text('', 0, 200)
        //genereer de table doormiddel van het item van de foreach functie te gebruiken
        const table = generateTable(item,user)
        //indien aantal grooter is dan 1 -> voeg dan een extra regel toe met de totaalprijs
        if (item.aantal > 1) {
            const _tableData = [{
                aantal: '',
                naam: "",
                omschrijving: {
                    label: 'Totaal /St.',
                    options: {
                        fontSize: 12,
                        font: 'Helvetica-Bold',
                        color: 'red'
                    }
                },
                bruto: _data.totalBruto.toFixed(2),
                korting: '',
                netto: _data.totalNetto.toFixed(2),
            }, {
                aantal: '',
                naam: "",
                omschrijving: {
                    label: 'Totaal prijs',
                    options: {
                        fontSize: 12,
                        font: 'Helvetica-Bold',
                        color: 'red'
                    }
                },
                bruto: (_data.totalBruto * item.aantal).toFixed(2),
                korting: '',
                netto: (_data.totalNetto * item.aantal).toFixed(2),
            }]
            _tableData.forEach(element => {
                table.datas.push(element)
            });
        } else {
            _tableData = {
                aantal: '',
                naam: "",
                omschrijving: {
                    label: 'Totaal prijs',
                    options: {
                        fontSize: 12,
                        font: 'Helvetica-Bold',
                        color: 'red'
                    }
                },
                bruto: _data.totalBruto.toFixed(2),
                korting: '',
                netto: _data.totalNetto.toFixed(2),
            }

            table.datas.push(_tableData)
        }

        //Vul de table met de aangemaakte table data en styl deze verder.
        doc.table(table, {
            prepareHeader: () => {

                    doc.font("Helvetica-Bold").fontSize(8)

                    doc.info.Title = 'Bestelling' + 'U/Ref.:' + ref + '';
                    doc.font('Helvetica').fontSize(10);
                    doc.image(imgPath, 10, 15, {
                        width: 300
                    })
                    doc
                        .fontSize(10)
                        .fillColor('#000080')
                    doc
                        .text('ALUPLEX Production NV', 0, 10, {
                            align: 'right'
                        })
                        .text('Kontichsesteenweg 60 bus 2', {
                            align: 'right'
                        })
                        .text('2630 Aartselaar', {
                            align: 'right'
                        })
                        .text('Tel. 03 / 887 49 00', {
                            align: 'right'
                        })
                        .text('Fax 03 / 887 49 05', {
                            align: 'right'
                        })
                        .text('info@aluplex.be', {
                            align: 'right'
                        })
                        .text('BE 0466.078.070', {
                            align: 'right'
                        })
                        .text('IBAN BE05 2930 4079 0575', {
                            align: 'right'
                        })
                        .text('BIC GEBABEBB', {
                            align: 'right'
                        })
                    doc
                        .text('klant: ' + klant , 15, 150)
                        .text('Bestellingnummer: ' + rng.toString())
                        .text('U/Ref.: '+ ref)
                        .fillColor('white')
                }

                ,
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font("Helvetica").fontSize(10);
                if (indexColumn === 0 && indexRow === 0) {
                    doc.fillColor('#000080')
                }
                indexColumn === 0 && doc.addBackground(rectRow, (indexRow % 2 ? '#ffffff' : '#000080'), 0.03);
            }
        });



        //Bereken de totaal prijnze van alle rolluiken
        totaalbruto += parseFloat(_data.totalBruto * _data.aantal)
        totaalnetto += parseFloat(_data.totalNetto * _data.aantal)
        totaalbtw += parseFloat(_data.totalBTW * _data.aantal)
        totaalNettoInclBTW += parseFloat(_data.totaalNettoInclBTW * _data.aantal)
        doc.text('Pagina :' + (index+1) + "/" + data.length, 500, 820, {
            align: 'right'
        })

    })
    //Voeg de totaal prijzen van alle rolluiken toe.
    doc.fillColor('#000080')
    doc.text('Totaal Bruto (€) :', 310, 740, {
        align: 'left'
    })
    doc.text(totaalbruto.toFixed(2).toString(), 390, 740, {
        align: 'left'
    })
    doc.text('      Totaal Netto (€) :', 440, 740, {
        align: 'left'
    })
    doc.text(totaalnetto.toFixed(2).toString(), 535, 740, {
        align: 'left'
    })
    doc.text('         BTW 21% (€) :', 440, 760, {
        align: 'left'
    })
    doc.text(totaalbtw.toFixed(2).toString(), 535, 760, {
        align: 'left'
    })
    doc.text('Netto Incl. BTW (€) : ', 440, 780, {
        align: 'left'
    }).fillColor('red').font('Helvetica-Bold')
    doc.text(totaalNettoInclBTW.toFixed(2).toString(), 535, 780, {
        align: 'left'
    }).fillColor('#000080').font('Helvetica')


    doc.end();

    try {

        const buffer = await new Promise((resolve) => {
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
        });

        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        //Voeg de SMTP gegevens toe om de mail te kunnen versturen
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
        // Define the email options, including the PDF attachment
        const message = {
            from: 'kristof@aluplex.be',
            to: user.email, // klant email toevoegen 
            subject: "Bestelling - U/Ref.: " + ref,
            text: 'Bestelling',
            html: `<div> Bedankt voor je bestelling</div><div style="font-size: 12pt; font-family: 'Arial'; color: #000080;">
      <div style="font-size: small; text-decoration: none; font-family: 'Calibri'; font-weight: normal; color: #000000; font-style: normal; display: inline;">
      <div style="font-size: 12pt; font-family: 'Arial'; color: #000080;">
      <div dir="ltr">
      <div style="font-size: 12pt; font-family: 'Arial'; color: #000080;">
      <div style="font-size: 12pt; font-family: 'Arial'; color: #000080;">
      <div dir="ltr">
      <div style="font-size: 12pt; font-family: 'Arial'; color: #000080;">
      <div dir="ltr">
      <div style="font-size: 12pt; font-family: 'Arial'; color: #000080;">
      <div>&nbsp;</div>
      <div>Met vriendelijke groeten,</div>
      <div>&nbsp;</div>
      <div>Kristof</div>
      <div>&nbsp;</div>
      <div><a href="http://www.aluplexpro.com"><img style="background-image: none; padding-top: 0px; padding-left: 0px; display: inline; padding-right: 0px; border: 0px;" title="Logo-Aluplex" src="https://cms.ice.be/logo/150/aluplex.jpeg" alt="Logo-Aluplex" width="300" height="100" border="0" /></a></div>
      <div>
      <div>&nbsp;</div>
      <table style="border-collapse: collapse; width: 300px; height: 40px;" border="0">
      <tbody>
      <tr style="height: 10px;">
      <td style="width: 150px; height: 10px;"><span style="font-size: xx-small; color: #000080;">ALUPLEX Production NV</span></td>
      <td style="width: 150px; height: 10px; text-align: right;"><a href="mailto:kristof@aluplex.be"><span style="font-size: xx-small; color: #000080;">kristof@aluplex.be</span></a></td>
      </tr>
      <tr style="height: 10px;">
      <td style="width: 150px; height: 10px;"><span style="font-size: xx-small; color: #000080;">Kontichsesteenweg 60 Bus 2</span></td>
      <td style="width: 150px; height: 10px; text-align: right;"><a href="http://www.aluplexpro.com"><span style="font-size: xx-small; color: #000080;">www.aluplexpro.com</span></a></td>
      </tr>
      <tr style="height: 10px;">
      <td style="width: 150px; height: 10px; text-align: left;"><span style="font-size: xx-small; color: #000080;">B-2630 Aartselaar</span></td>
      <td style="width: 150px; height: 10px; text-align: right;"><a href="http://www.aluplex.be"><span style="font-size: xx-small; color: #000080;">www.aluplex.be</span></a></td>
      </tr>
      <tr style="height: 10px;">
      <td style="width: 150px; height: 10px;"><span style="font-size: xx-small; color: #000080;">BE0466.078.070</span></td>
      <td style="width: 150px; height: 10px; text-align: right;"><span style="font-size: xx-small; color: #000080;"> 03/887.49.00 </span></td>
      </tr>
      </tbody>
      </table>
      </div>
      <div>&nbsp;</div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>`,
            attachments: [{
                filename: "Bestelling - URef.: " + ref + ".pdf",
                content: stream,
                contentType: 'application/pdf',
            }]
        };
        // console.log("6")

        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log("_data",_data)
                console.log('Email sent:', info.response);
                console.log('To: ',klantEmail)
            }
        })
    } catch (error) {

        console.log('Error creating buffer:', error);
        res.status(500).send('Error creating bestelling PDF');
    }
} catch (err){
    console.error('location',__filename)
    console.error('error generate bestelling PDF',err)
}
}

module.exports = generatePDFfromProvidedData;