const express = require('express');
const router = express.Router();

// const PDFDocument = require('pdfkit');
const PDFDocument = require("pdfkit-table");
const fs = require('fs');
const nodemailer = require('nodemailer');

const transporter = require('./mailSettings/nodemailer');
const generateTable = require('./generateTablePDF')
const calculateTotalPrice = require('./calculateTotalePrice.js')
const fetchrgbral = require("../database/fetchData/fetchrgbral")
const {
    Readable
} = require('stream');

require('dotenv').config();
const sendemail = process.env.SEND_MAIL
const bestelemail = process.env.BESTELLING_EMAIL

const path = require('path');
const imgPath = path.join(__dirname, '..', '..', 'public', 'img', 'aluplex.jpeg')

function formaatGetal(input) {
    // Zet het getal om naar een getal met twee decimalen
    var afgerondGetal = input;
    // Scheid het getal in het gehele deel en het decimale deel
    var delen = afgerondGetal.toString().split('.');

    // Voeg nullen toe aan het decimale deel indien nodig
    var decimaalDeel = delen[1] ? delen[1].padEnd(2, '0') : '00';

    // Gebruik toLocaleString om het gehele deel te formatteren
    var geheelDeel = parseFloat(delen[0]).toLocaleString('nl-NL');

    // Combineer het gehele deel en het decimale deel met een komma ertussen
    var geformatteerdGetal = geheelDeel + ',' + decimaalDeel;

    return geformatteerdGetal;
}

function getRGBkleur(kleuronderlat, ralonderlat, kleurlamel, kleuronderlatRAL, kleurlamel2) {

    return fetchrgbral(kleuronderlat, ralonderlat, kleurlamel, kleuronderlatRAL, kleurlamel2)
        .then((data) => {
            // console.log('rgbkleur', data)
            return data
        })
}
function sendEmail(message) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(message, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info.response);
            }
        });
    });
}
/**
 * Voert een berekening uit met drie parameters.
 * @constructor
 * @param {Array.<{}>} data - Array of objects .
 * @param {Express.Response} res - De Express-response waarnaar het PDF-bestand moet worden verzonden.
 * @param {string} uref - De referentie van de bestelling.
 * @param {string} offertebestelRefNr - Een soort random number yyyymmdd + rng(4 tekens).
 * @param {string} klant - Een soort random number yyyymmdd + rng(4 tekens).
 */
async function generatePDFfromProvidedData(data, res, uref, offertebestelRefNr, klant, klantEmail, user, type,loggedUser = "") { //Zet de data om naar een _data, Dit word alleen gebruikt in deze block
    try {


        var _data = data
        // console.log('ref', uref)
        // console.log('data', data)

        // Create a new PDF document
        const doc = new PDFDocument({
            margin: 10,
            size: 'A4'
        });
        _data.ref = uref

        //Zet alle waardes op 0 voor de totaalprijs van alle rolluiken
        var totaalbruto = 0
        var totaalnetto = 0
        var totaalbtw = 0
        var totaalNettoInclBTW = 0

        //loop door de data
        for (const [index, item] of _data.entries()) {

            var kleuronderlat; //vb: Zwart of RAL
            var kleuronderlatRAL; //vb: Aecode - 3005 AE03053300520 Structuur WIJNROOD AXALTA
            var ralonderlat;
            var kleurkast;
            var kleurkastral;
            var ralkast;
            var kleurlamel;

            if (item.type === "Rolluikblad" || item.type === "Tradirolluik" || item.type === "Voorzetrolluik") {

                kleuronderlat = item.kleuronderlat //vb: Zwart of RAL
                kleuronderlatRAL = item.ralonderlat //vb: Aecode - 3005 AE03053300520 Structuur WIJNROOD AXALTA
                ralonderlat = item.odlral
                kleurkast = item.kleurkast
                kleurkastral = item.kleurkastral
                ralkast = item.kastral
                kleurlamel = item.kleurlamelRAL
            } else if (item.type === "Voorzetrolluik" || item.type === "Screen") {

                kleurkast = item.kleurkast
                kleurkastral = item.kleurkastral
            }

            var rgbData;
            if (item.type === "Rolluikblad" || item.type === "Tradirolluik") {
                // console.log('Rolluikblad/tradi')
                rgbData = await getRGBkleur(kleuronderlat, ralonderlat, kleurlamel, kleuronderlatRAL, item.kleurlamel)
            } else if (item.type === "Voorzetrolluik") {
                // console.log('Voorzetrolluik')
                rgbData = await getRGBkleur(kleurkast, ralkast, kleurlamel, kleurkastral, item.kleurlamel)

            } else if (item.type === "Screen") {
                // console.log('Screen')
            } else {
                console.error('Geen type gevonden dat overeenkomt')
            }


            // console.log("data length", data.length)
            //Indien het niet de 1ste pagina is, voeg dan eerst een andere pagina toe
            if (index != 0) {
                doc.addPage()
            } else {

            }
            //Bereken de totaalprijzen Per rolluik
            const _data = calculateTotalPrice(item, user)
            const imageData = generateImage(item.afgbreedte, item.afghoogte, item.type)

            doc.fillColor('white'),
                doc.text('', 0, 200)
            //genereer de table doormiddel van het item van de foreach functie te gebruiken
            const table = generateTable(item, user, type)
            //indien aantal grooter is dan 1 -> voeg dan een extra regel toe met de totaalprijs


            const _tableData = [{
                aantal: '',
                naam: "",
                omschrijving: {
                    label: '',

                },
                options: {
                    fontSize: 5
                },
                bruto: "",
                korting: '',
                netto: "",
            }, {
                aantal: '',
                naam: "",
                omschrijving: {
                    label: 'Totaal',
                    options: {
                        fontSize: 12,
                        font: 'Helvetica-Bold',
                        color: 'red'
                    }
                },
                bruto: formaatGetal(Number(_data.totalBruto).toFixed(2)),
                korting: '',
                netto: formaatGetal(Number(_data.totalNetto).toFixed(2)),
            }]

            _tableData.forEach(element => {
                if (element.omschrijving.label) {

                    element.omschrijving.label = "Totaal - Positie : " + table.datas[0].omschrijving
                } else {

                }
                table.datas.push(element)
            });


            //Vul de table met de aangemaakte table data en styl deze verder.
            doc.table(table, {
                prepareHeader: () => {
                        if (type === "offerte") {

                            doc.font("Helvetica-Bold").fontSize(8)

                            doc.info.Title = 'Offerte' + 'U/Ref.:' + uref + '';
                            doc.font('Helvetica').fontSize(10);
                            doc.image(imgPath, 10, 15, {
                                width: 300
                            })
                        } else if (type === "bestelling") {
                            doc.font("Helvetica-Bold").fontSize(8)

                            doc.info.Title = 'Bestelling' + 'U/Ref.:' + uref + '';
                            doc.font('Helvetica').fontSize(10);
                            doc.image(imgPath, 10, 15, {
                                width: 300
                            })
                        } else if (type === "orderbevestiging") {
                            doc.font("Helvetica-Bold").fontSize(8)

                            doc.info.Title = 'Orderbevestiging' + 'U/Ref.:' + uref + '';
                            doc.font('Helvetica').fontSize(10);
                            doc.image(imgPath, 10, 15, {
                                width: 300
                            })
                        }
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
                            .text('info@aluplex.be', {
                                align: 'right'
                            })
                            .text('www.aluplexpro.com', {
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
                        if (type === "offerte") {
                            doc
                                .text('Klant: ' + data[0].klant, 15, 150)

                                .text('Offertenummer: ' + offertebestelRefNr.toString())
                                .text('U/Ref.: ' + uref)
                                .fillColor('#000080')
                                .fontSize(25)
                                .text('Offerte', 0, 140, {
                                    align: 'right'
                                })
                                .fontSize(10)
                                .fillColor('white')
                        } else if (type === "bestelling") {
                            doc
                                .text('Klant: ' + data[0].klant, 15, 150)

                                .text('Bestelnummer: ' + offertebestelRefNr.toString())
                                .text('U/Ref.: ' + uref)
                                .fillColor('white')
                                .text('Bestelling', 0, 140, {
                                    align: 'right'
                                })
                        } else if (type === "orderbevestiging") {
                            doc
                                .text('Klant: ' + data[0].klant, 15, 150)

                                .text('Bestelnummer: ' + offertebestelRefNr.toString())
                                .text('U/Ref.: ' + uref)
                                .fontSize(25)
                                .text('Orderbevestiging', 0, 140, {
                                    align: 'right'
                                })
                                .fontSize(10)
                            if (data[0].afhalen === 1) {
                                doc
                                    .text('Leverdatum : ' + formatDatum(data[0].leverdatum), 0, 175, {
                                        align: 'right'
                                    })
                            } else if (data[0].afhalen === 0) {
                                doc
                                    .text('Afhaaldatum : ' + formatDatum(data[0].leverdatum), 0, 175, {
                                        align: 'right'
                                    })
                            }
                            doc
                                .fillColor('white')
                        }

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
            totaalbruto += Number(_data.totalBruto)
            totaalnetto += Number(_data.totalNetto)
            // totaalbtw += Number(_data.totalBTW )
            // totaalNettoInclBTW += Number(_data.totaalNettoInclBTW)
            doc.text('Pagina :' + (index + 1) + "/" + data.length, 500, 820, {
                align: 'right'
            })

            //draw image
            drawImage(doc, imageData, item, rgbData)



        }
        totaalNettoInclBTW = (+totaalnetto.toFixed(2) + (+totaalnetto.toFixed(2) * 21 / 100))
        totaalbtw = totaalNettoInclBTW - +totaalnetto.toFixed(2)
        //Voeg de totaal prijzen van alle rolluiken toe.
        doc.fillColor('#000080')
        doc.text('Totaal Bruto (€) :', 310, 740, {
            align: 'left'
        })
        doc.text(formaatGetal(totaalbruto.toFixed(2)).toString(), 390, 740, {
            align: 'left'
        })
        doc.text('      Totaal Netto (€) :', 440, 740, {
            align: 'left'
        })
        doc.text(formaatGetal(totaalnetto.toFixed(2)).toString(), 535, 740, {
            align: 'left'
        })
        doc.text('         BTW 21% (€) :', 440, 760, {
            align: 'left'
        })
        doc.text(formaatGetal(totaalbtw.toFixed(2)).toString(), 535, 760, {
            align: 'left'
        })
        doc.text('Netto Incl. BTW (€) : ', 440, 780, {
            align: 'left'
        }).fillColor('red').font('Helvetica-Bold')
        doc.text(formaatGetal(totaalNettoInclBTW.toFixed(2)).toString(), 535, 780, {
            align: 'left'
        }).fillColor('#000080').font('Helvetica')

        doc.lineWidth(1);
        const boxWidth = 280;
        const boxHeight = 75
        doc.rect(300, 730, boxWidth, boxHeight).stroke();


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

            // Define the email options, including the PDF attachment
            var subjecttype;
            var subjecttypeAdmin;
            var mailAdressen;
            var htmlBestelling;
            var htmlBestellingAdmin;
            if (type === "offerte") {
                subjecttype = `Offerte U/Ref.: `
                mailAdressen = sendemail + ',' + loggedUser.email //klantEmail toevoegen sendemail+','+klantEmail
                htmlBestelling = `
               
                <p style="text-align: center;"><span style="color: #000080;">Beste <strong>${user.voornaam}</strong>,</span></p>
                <p style="text-align: center;">&nbsp;</p>
                <div>
                <div style="text-align: center;"><span style="color: #000080;">Bedankt voor uw intresse in onze producten!</span></div>
                </div>
                <div>
                <div style="text-align: center;"><span style="color: #000080;">Gelieve in bijlage uw offerte terug te vinden.</span></div>
                </div>
                <p style="text-align: center;">&nbsp;</p>
                <div style="text-align: center;"><span style="color: #000080;">Met vriendelijke groeten,</span></div>
                <div style="text-align: center;">&nbsp;</div>
                <div style="text-align: center;"><span style="color: #000080;">ALUPLEX</span></div>
                <div>&nbsp;</div>
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
                </div>`
            } else if (type === "bestelling") {
                subjecttypeAdmin = "Bestelling"
                mailAdressenAdmin = sendemail
                htmlBestellingAdmin = `
                <p style="text-align: center;"><span style="color: #333399;">Er is een bestelling geplaatst door ${user.bedrijf}.<br /></span></p>
                <p style="text-align: center;"><span style="color: #333399;">Bestelling O/ref.: ${offertebestelRefNr}</span></p>
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
                subjecttype = "Bedankt voor uw bestelling!"
                mailAdressen = loggedUser.email
                htmlBestelling = `
                <!-- Voeg Bootstrap CSS toe voor styling -->
                <p style="text-align: center;"><span style="color: #000080;">Beste ${user.voornaam},</span></p>
                <p style="text-align: center; color: #000080;"><br />Bedankt voor uw bestelling met U/Ref.: ${uref}.<br />U krijgt zo snel mogelijk een orderbevestiging doorgestuurd met de voorziene afhaal- of leverdatum.</p>
                <p>&nbsp;</p>
                <div style="text-align: center;"><span style="color: #000080;">Met vriendelijke groeten,</span></div>
                <div style="text-align: center;">&nbsp;</div>
                <div style="text-align: center;"><span style="color: #000080;">ALUPLEX</span></div>
                <div style="text-align: center;">&nbsp;</div>
                <div style="text-align: center;"><span style="color: #000080;"><a style="color: #000080;" href="http://www.aluplexpro.com"><img title="Logo-Aluplex" src="https://cms.ice.be/logo/150/aluplex.jpeg" alt="Logo-Aluplex" width="300" height="100" border="0" /></a></span></div>
                <div>
                <div style="text-align: center;">&nbsp;</div>
                <table style="margin-left: auto; margin-right: auto;" border="0">
                <tbody>
                <tr>
                <td><span style="color: #000080;">ALUPLEX Production NV</span></td>
                <td><span style="color: #000080;"><a style="color: #000080;" href="mailto:info@aluplex.be">Info@aluplex.be</a></span></td>
                </tr>
                <tr>
                <td><span style="color: #000080;">Kontichsesteenweg 60 Bus 2</span></td>
                <td><span style="color: #000080;"><a style="color: #000080;" href="http://www.aluplexpro.com">www.aluplexpro.com</a></span></td>
                </tr>
                <tr>
                <td><span style="color: #000080;">B-2630 Aartselaar</span></td>
                <td><span style="color: #333399;"><a style="color: #000080;" href="http://www.aluplex.be">www.aluplex.be</a></span></td>
                </tr>
                <tr>
                <td><span style="color: #000080;">BE0466.078.070</span></td>
                <td><span style="color: #000080;">03/887.49.00</span></td>
                </tr>
                </tbody>
                </table>
                </div>
                `
            } else if (type === "orderbevestiging") {
                subjecttype = `Orderbevestiging U/Ref.:`
                mailAdressen = `${sendemail},${loggedUser.email}` // klantEmail toevoegen ${klantEmail},${sendemail}
                htmlBestelling = `<!-- Voeg Bootstrap CSS toe voor styling -->
                <p style="text-align: center;"><span style="color: #000080;">Beste ${user.voornaam},</span></p>
                <p style="text-align: center;"><br /><span style="color: #000080;">Gelieve in bijlage onze orderbevestiging met U/Ref.: <strong>${offertebestelRefNr} REF ${uref} </strong>&nbsp;terug te vinden.</span></p>
                <p style="text-align: center;"><span style="color: #000080;">De voorziene afhaal-/leverdatum is: <strong>${formatDatum(data[0].leverdatum)}</strong></span></p>
                <p style="text-align: center;"><span style="color: #000080;">Graag vragen wij u om deze te controleren en eventuele aanpassingen zo snel mogelijk aan ons door te geven.</span></p>
                <p style="text-align: center;"><span style="color: #000080;">Indien wij na 24 uur geen reactie hebben ontvangen beschouwen wij de bestelling als correct en gaat deze in productie.</span></p>
                <p style="text-align: center;">&nbsp;</p>
                <div style="text-align: center;"><span style="color: #000080;">Met vriendelijke groeten,</span></div>
                <div style="text-align: center;">&nbsp;</div>
                <div style="text-align: center;"><span style="color: #000080;">ALUPLEX</span></div>
                <div>&nbsp;</div>
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
                </div>`
            }

            if (type === "bestelling") {
                const messageUser = {
                    from: bestelemail,
                    to: mailAdressen,
                    subject: subjecttype,
                    text: '',
                    html: htmlBestelling
                };
                const messageAdmin = {
                    from: bestelemail,
                    to: mailAdressenAdmin,
                    subject: subjecttypeAdmin,
                    text: '',
                    html: htmlBestellingAdmin
                };
            
                Promise.all([sendEmail(messageUser), sendEmail(messageAdmin)])
                    .then(results => {
                        console.log('User Email sent:', results[0]);
                        console.log('Admin Email sent:', results[1]);
                        if (!res.headersSent) {
                            res.status(200).json({ success: true, message: 'Je bestelling is goed aangekomen.' });
                        }
                    })
                    .catch(error => {
                        console.error('Error sending emails:', error);
                        if (!res.headersSent) {
                            res.status(500).json({ success: false, message: 'Er is iets misgegaan tijdens de bestelling.' });
                        }
                    });
            } else {
                const message = {
                    from: bestelemail,
                    to: mailAdressen,
                    subject: subjecttype + offertebestelRefNr + " REF " + uref,
                    text: 'In bijlage kan je de aangevraagde offerte terugvinden.',
                    html: htmlBestelling,
                    attachments: [{
                        filename: offertebestelRefNr + " REF " + uref.toUpperCase() + ".pdf",
                        content: stream,
                        contentType: 'application/pdf',
                    }]
                };
            
                sendEmail(message)
                    .then(result => {
                        console.log('Email sent:', result);
                        if (!res.headersSent) {
                            res.status(200).json({ success: true, message: 'E-mail met bijlage is succesvol verzonden.' });
                        }
                    })
                    .catch(error => {
                        console.error('Error sending email:', error);
                        if (!res.headersSent) {
                            res.status(500).json({ success: false, message: 'Er is iets misgegaan tijdens het verzenden van de e-mail met bijlage.' });
                        }
                    });
            }
            




        }  catch (error) {
            console.error('Error creating buffer:', error);
            if (!res.headersSent) {
                res.status(500).send('Error creating PDF');
            }
        }
    } catch (err) {
        console.error('location', __filename)
        console.error('error generate PDF', err)
    }
}



function generateImage(breedte, hoogte, type) {
    const baseSize = 250
    if (type === "Rolluikblad" || type === "Tradirolluik") {
        //1500 x 2500
        if (breedte > hoogte) {
            const newBreedte = baseSize
            const newHoogte = hoogte / breedte * baseSize

            const width = newBreedte
            const height = newHoogte
            const slats = height / 10

            return {
                breedte: width,
                hoogte: height,
                aantal: slats
            }

        } else {
            const newBreedte = breedte / hoogte * baseSize
            const newHoogte = baseSize

            const width = newBreedte
            const height = newHoogte
            const slats = (height / 10)

            return {
                breedte: width,
                hoogte: height,
                aantal: slats
            }

        }
    } else if (type === "Voorzetrolluik") {
        if (breedte > hoogte) {
            const newBreedte = baseSize
            const newHoogte = hoogte / breedte * baseSize

            const width = newBreedte
            const height = newHoogte
            const slats = height / 10

            return {
                breedte: width,
                hoogte: height,
                aantal: slats
            }

        } else {
            const newBreedte = breedte / hoogte * baseSize
            const newHoogte = baseSize

            const width = newBreedte
            const height = newHoogte
            const slats = (height / 10)

            return {
                breedte: width,
                hoogte: height,
                aantal: slats
            }

        }


    }



}

function formatDatum(datumString) {
    // Zet de datumstring om naar een Date object
    const datum = new Date(datumString);

    // Stel een formatter in voor Nederlandse datum weergave
    const formatter = new Intl.DateTimeFormat('nl-NL', {
        day: '2-digit', // dag van de maand, 2 cijfers
        month: '2-digit', // maand, 2 cijfers
        year: 'numeric' // volledig jaar
    });

    // Formatteer de datum en vervang de standaard spaties met slashes
    return formatter.format(datum).replace(/-/g, '/');
}

function drawImage(doc, imageData, item, rgbData) {
    //returns image in pdf

    return //verwijdere als image terug moet gemaakt worden.
    if (item.type === "Rolluikblad" || item.type === "Tradirolluik") {

        const startImgX = (600 - imageData.breedte) / 2
        const startImgY = 700 - imageData.hoogte
        // console.log('start coords pdfkit', startImgX, startImgY)
        doc.lineWidth(1.5);
        doc.rect(startImgX, startImgY, imageData.breedte, imageData.hoogte).stroke()
        doc.rect(startImgX, startImgY, imageData.breedte, imageData.hoogte - 10).fillAndStroke(rgbData.kleurlamel, "#000")
        doc.lineWidth(1);
        for (let index = 0; index < imageData.aantal; index++) {
            if (index === (imageData.aantal - 1)) {

                doc.lineWidth(1.5);
                doc.rect(startImgX, startImgY + (10 * index), imageData.breedte, 10).fillAndStroke(rgbData.kleuronderlat, "#000")
            }
            doc.moveTo(startImgX, startImgY + (10 * index))
                .lineTo(startImgX + imageData.breedte, startImgY + (10 * index))
                .stroke();

        }
        doc.fillColor('#000')

        doc.lineWidth(1);
        //maataanduiding lijntje rechts boven
        doc.moveTo(startImgX + imageData.breedte + 5, startImgY)
            .lineTo(startImgX + imageData.breedte + 12, startImgY)
            .stroke();
        doc
            .text(item.afghoogte + " mm", startImgX + imageData.breedte + 5, startImgY + (imageData.hoogte / 2))
        //maataanduiding lijntje rechts onder
        doc.moveTo(startImgX + imageData.breedte + 5, startImgY + imageData.hoogte)
            .lineTo(startImgX + imageData.breedte + 12, startImgY + imageData.hoogte)
            .stroke();
        //maataanduiding lijntje boven rechts
        doc.moveTo(startImgX + imageData.breedte, startImgY - 5)
            .lineTo(startImgX + imageData.breedte, startImgY - 12)
            .stroke();
        // console.log('item')
        doc.text(item.afgbreedte + " mm", startImgX + (imageData.breedte / 2) - ((item.afgbreedte.toString().length * 4)), startImgY - 12)
        //maataanduiding lijntje boven Links
        doc.moveTo(startImgX, startImgY - 5)
            .lineTo(startImgX, startImgY - 12)
            .stroke();
    } else if (item.type === "Voorzetrolluik") {
        // console.log('Draw voorzetrolluik')
    }
}

module.exports = generatePDFfromProvidedData;