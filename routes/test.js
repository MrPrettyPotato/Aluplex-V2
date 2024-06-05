const express = require('express');
const router = express.Router();

// const PDFDocument = require('pdfkit');
const PDFDocument = require("pdfkit-table");
const fs = require('fs');
const nodemailer = require('nodemailer');
const {
    Readable
} = require('stream');


router.get('/', (req, res) => {
    console.log('test')
    res.render('test', {
        req: req,
        user: req.session.user
    });
});


// Define the route that will handle the POST request from the front-end
router.post('/generate-pdf', async (req, res) => {
    console.log("generate-pdf" + "1")
    // Get the data from the request body
    const data = req.body;

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set the response headers to indicate that a PDF file will be sent
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename=offerte.pdf');
    console.log("generate-pdf" + "2")
    // Pipe the PDF document to the response
    //doc.pipe(res);

    // Set the document title and font
    doc.info.Title = 'Offerte';
    doc.font('Helvetica-Bold');
    console.log("generate-pdf" + "3")
    // Add the header and contact info
    const table = {
        title: "Title",
        subtitle: "Subtitle",
        headers: [
          { label: "Name", property: 'name', width: 60, renderer: null },
          { label: "Description", property: 'description', width: 150, renderer: null }, 
          { label: "Price 1", property: 'price1', width: 100, renderer: null }, 
          { label: "Price 2", property: 'price2', width: 100, renderer: null }, 
          { label: "Price 3", property: 'price3', width: 80, renderer: null }, 
          { label: "Price 4", property: 'price4', width: 43, 
            renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => { return `U$ ${Number(value).toFixed(2)}` } 
          },
        ],
        // complex data
        datas: [
          { 
            name: 'Name 1', 
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ante in laoreet egestas. ', 
            price1: '$1', 
            price3: '$ 3', 
            price2: '$2', 
            price4: '4', 
          },
          { 
            options: { fontSize: 10, separation: true},
            name: 'bold:Name 2', 
            description: 'bold:Lorem ipsum dolor.', 
            price1: 'bold:$1', 
            price3: { 
              label: 'PRICE $3', options: { fontSize: 12 } 
            }, 
            price2: '$2', 
            price4: '4', 
          },
          // {...},
        ],
        // simeple data
        rows: [
          [
            "Apple",
            "Nullam ut facilisis mi. Nunc dignissim ex ac vulputate facilisis.",
            "$ 105,99",
            "$ 105,99",
            "$ 105,99",
            "105.99",
          ],
          // [...],
        ],
      };
      // the magic
      doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font("Helvetica").fontSize(8);
          indexColumn === 0 && doc.addBackground(rectRow, 'blue', 0.15);
        },
      });
    doc.moveDown(0.5);
    console.log("generate-pdf" + "5")
    // Add the table rows
    doc.fontSize(10);
    data.forEach((row, i) => {
        doc.text(row.aantal, {
            align: 'left'
        });
        doc.text(row.type, {
            align: 'left',
            indent: 60
        });
        doc.text(row.lamel, {
            align: 'left',
            indent: 120
        });
        if (i !== data.length - 1) {
            doc.moveDown(0.5);
        }
    });
    doc.end()   
    console.log("generate-pdf" + "6")
    try {
        const buffer = await new Promise((resolve) => {
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
          });
          console.log('Buffer created');

    console.log("generate-pdf" + "7")
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    // Finalize the PDF document and close the response
    console.log("generate-pdf" + "8")
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'kristof@aluplex.be',
            pass: 'Aluplex1887#0000'
        }
    });
    console.log("generate-pdf" + "9")
    // Define the email options, including the PDF attachment
    const message = {
        from: 'kristof@aluplex.be',
        to: "volkaerts.kristof@gmail.com",
        subject: "test PDF table",
        text:'Test Email with PDF attachment',
        html:`<div> Test EMail with PDF attachment</div><div style="font-size: 12pt; font-family: 'Arial'; color: #000080;">
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
            filename: 'document.pdf',
            content: stream,
            contentType: 'application/pdf',
        }]
    };
    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent:', info.response);
        }
    })
} catch (error) {
    console.log('Error creating buffer:', error);
    res.status(500).send('Error creating PDF');
}
});
module.exports = router;