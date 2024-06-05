const transporter = require('../mailSettings/nodemailer')

function activeerMail(bedrijf,bedrijfID, voornaam, achternaam, email, facemail, login, tel, land, taal, postcode, stad, straatnaam, huisnummer, bus, facpostcode, facstad, facstraatnaam, fachuisnummer, facbus, hash, rolluikbladkorting, Tradirolluikkorting, voorzetrolluikkorting, screenkorting, lakkerijkorting, btwnummer, res) {
    const html = `
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gegevens</title>
      <!-- Voeg Bootstrap CSS toe voor styling -->
      <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
      <style>
        /* Optionele aangepaste stijlen */
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        .container {
          max-width: 600px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Gegevens</h2>
        <table class="table">
          <tbody>
            <tr>
              <th scope="row">Voornaam:</th>
              <td>${voornaam}</td>
              <th scope="row">Achternaam:</th>
              <td>${achternaam}</td>
            </tr>
            <tr>
              <th scope="row">Bedrijf:</th>
              <td>${bedrijf}</td>
              <th scope="row">Bedrijf ID:</th>
              <td>${bedrijfID}</td>
              
            </tr>
            <tr>
              <th scope="row">E-Mail:</th>
              <td>${email}</td>
              <th scope="row">Factuur Email:</th>
              <td>${facemail}</td>
            </tr>
            <tr>
            <th scope="row">BTW Nummer:</th>
            <td>${btwnummer}</td>
              <th scope="row">Tel. Nummer:</th>
              <td>${tel}</td>
            </tr>
            <tr>
              <th scope="row">Land:</th>
              <td>${land}</td>
              <th scope="row">Taal:</th>
              <td>${taal}</td>
            </tr>
            <tr>
              <th scope="row">Postcode:</th>
              <td>${postcode}</td>
              <th scope="row">Stad:</th>
              <td>${stad}</td>
            </tr>
            <tr>
              <th scope="row">Straatnaam:</th>
              <td>${straatnaam}</td>
              <th scope="row">Huisnummer:</th>
              <td>${huisnummer}</td>
            </tr>
            <tr>
              <th scope="row">Bus:</th>
              <td>${bus}</td>
              <th scope="row">Fac. Postcode:</th>
              <td>${facpostcode}</td>
            </tr>
            <tr>
              <th scope="row">Fac. Stad:</th>
              <td>${facstad}</td>
              <th scope="row">Fac. Straatnaam:</th>
              <td>${facstraatnaam}</td>
            </tr>
            <tr>
              <th scope="row">Fac. Huisnummer:</th>
              <td>${fachuisnummer}</td>
              <th scope="row">Fac. Bus:</th>
              <td>${facbus}</td>
            </tr>
            <tr>
              
              <th scope="row">Rolluikbladkorting:</th>
              <td>${rolluikbladkorting}</td>
            </tr>
            <tr>
              <th scope="row">Tradirolluikkorting:</th>
              <td>${Tradirolluikkorting}</td>
              <th scope="row">Voorzetrolluikkorting:</th>
              <td>${voorzetrolluikkorting}</td>
            </tr>
            <tr>
              <th scope="row">Screenkorting:</th>
              <td>${screenkorting}</td>
              <th scope="row">Lakkerijkorting:</th>
              <td>${lakkerijkorting}</td>
            </tr>
          </tbody>
        </table>
      </div>
    
      <!-- Optioneel: Voeg Bootstrap JS toe voor interactieve functies -->
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    </body>
    
                <p>&nbsp;</p>
                <div style="font-size: 12pt; font-family: 'Arial'; color: #000080;">
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
                <h1> <a href="http://localhost:3001/admin/activate/${email}">Activeer</a></h1>
                <div>Met vriendelijke groeten,</div>
<div>&nbsp;</div>
<div>ALUPLEX</div>
<div>&nbsp;</div>
<div><a href="http://www.aluplexpro.com"><img style="background-image: none; padding-top: 0px; padding-left: 0px; display: inline; padding-right: 0px; border: 0px;" title="Logo-Aluplex" src="https://cms.ice.be/logo/150/aluplex.jpeg" alt="Logo-Aluplex" width="300" height="100" border="0" /></a></div>
<div>
<div>&nbsp;</div>
<table style="border-collapse: collapse; width: 300px; height: 40px;" border="0">
<tbody>
<tr style="height: 10px;">
<td style="width: 150px; height: 10px;"><span style="font-size: xx-small; color: #000080;">ALUPLEX Production NV</span></td>
<td style="width: 150px; height: 10px; text-align: right;"><a href="mailto:info@aluplex.be"><span style="font-size: xx-small; color: #000080;">info@aluplex.be</span></a></td>
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
</div>`;


    const mailOptions = {
        from: 'kristof@aluplex.be', // vervang dit door je eigen e-mailadres
        to: 'kristof@aluplex.be', // vervang dit door het e-mailadres van de ontvanger
        subject: 'U Heeft een nieuw site lid',
        text: `Gegevens:

        Voornaam: ${voornaam}
        Achternaam: ${achternaam}
        Bedrijf: ${bedrijf}
        BedrijfID: ${bedrijfID}
        BTW Nummer: ${btwnummer}
        E-Mail: ${email}
        Factuur Email: ${facemail}
        Login: ${login}
        Tel. Nummer: ${tel}
        Land: ${land}
        Taal: ${taal}
        Postcode: ${postcode}
        Stad: ${stad}
        Straatnaam: ${straatnaam}
        Huisnummer: ${huisnummer}
        Bus: ${bus}
        Fac. Postcode: ${facpostcode}
        Fac. Stad: ${facstad}
        Fac. Straatnaam: ${facstraatnaam}
        Fac. Huisnummer: ${fachuisnummer}
        Fac. Bus: ${facbus}
        Hash: ${hash}
        Rolluikbladkorting: ${rolluikbladkorting}
        Tradirolluikkorting: ${Tradirolluikkorting}
        Voorzetrolluikkorting: ${voorzetrolluikkorting}
        Screenkorting: ${screenkorting}
        Lakkerijkorting: ${lakkerijkorting}
        BTW Nummer: ${btwnummer}`,
        html: html // vervang dit door de gewenste HTML
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error",error);
            res.status(200).json({ success: false, message: 'Er is een fout opgetreden bij het verzenden van de e-mail.' });
        } else {
            console.log('E-mail verstuurd: ' + info.response);
            res.status(200).json({ success: true, message: 'Je registratie is gelukt, je krijg een e-mail als je account geactiveerd is. Je word zodadelijk terug doorverwezen naar de home pagina.' });
        }
    });

}
module.exports = activeerMail;