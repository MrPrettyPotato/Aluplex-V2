const bcrypt = require('bcrypt')
require('dotenv').config();
const pool = require('../../database/connection')
const activeerMail = require('./activeermail')


async function registreer(req, res) {
    const data = req.body.data
console.log("post ontvangen.", data)
let connection;
try {
    connection = await pool.promise().getConnection();

    const login = 0;
    const bedrijf = data.bedrijf;
    const voornaam = data.voornaam;
    const achternaam = data.achternaam;
    const email = data.email;
    const facemail = data.facemail;
    const tel = data.tel;
    const land = data.land;
    const taal = data.taal;
    const postcode = data.postcode;
    const stad = data.stad;
    const straatnaam = data.straatnaam;
    const huisnummer = data.huisnummer;
    const bus = data.bus;
    const password = data.password;

    let facpostcode;
    let facstad;
    let facaddress;
    let fachuisnummer;
    let facbus;
    let bedrijfID = bedrijf + "0";

    //alle data van data opslaan naar variable, indien faccheckbox 'on", dan factuur data ook opslaan, andres gewoon adres naar factuur adres.
    const faccheckbox = data.faccheckbox;
    if (faccheckbox == 'on') {
        facpostcode = data.factuur_postcode;
        facstad = data.factuur_stad;
        facstraatnaam = data.straatnaam;
        fachuisnummer = data.factuur_huisnummer;
        facbus = data.factuur_bus;
    } else {
        facpostcode = data.postcode;
        facstad = data.stad;
        facstraatnaam = data.straatnaam;
        fachuisnummer = data.huisnummer;
        facbus = data.bus;
    }
    const btwnummer = data.vat_number;
    // KORTINGEN
    const typekorting = 40
    const rolluikbladkorting = 40
    const Tradirolluikkorting = 40
    const voorzetrolluikkorting = 40
    const screenkorting = 30
    const lakkerijkorting = 40
    const query = (`SELECT * FROM klanten`)
    const [results] = await pool.promise().query(query)

    let klantenlijst = results
    let count = 0
    for (let i = 0; i < klantenlijst.length; i++) {
        if (klantenlijst[i].email == email) {
            return res.send('email bestaat al')
        }
        if (klantenlijst[i].bedrijf == bedrijf) {
            count++
            bedrijfID = bedrijf + count.toString()

        }
    }
    //klantenlijst bekijken en checken


    bcrypt.hash(password, 10, async (err, hash) => {
        //gebruik de nieuwe vatiables om te inserten in de database.
        if (err) {
            console.error(err);
            return res.send(err);
        } else {
            const sql = `INSERT INTO klanten (bedrijf,bedrijfID,voornaam,achternaam,email,facemail,login,tel,land,taal,postcode,stad,straatnaam,huisnummer,bus,facpostcode,facstad,facstraatnaam,fachuisnummer,facbus,password,rolluikbladkorting,Tradirolluikkorting,voorzetrolluikkorting,screenkorting,lakkerijkorting,btwnummer) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            const values = [bedrijf,bedrijfID, voornaam, achternaam, email, facemail, login, tel, land, taal, postcode, stad, straatnaam, huisnummer, bus, facpostcode, facstad, facstraatnaam, fachuisnummer, facbus, hash, rolluikbladkorting, Tradirolluikkorting, voorzetrolluikkorting, screenkorting, lakkerijkorting, btwnummer];
            
            const insertResults = await pool.promise().query(sql, values);
            console.log('Insert results', insertResults)
           //indien de insert gelukt is, activeer de mail.
           if(insertResults) {

               console.log('Succesvol toegevoegd', insertResults)
               activeerMail(bedrijf,bedrijfID, voornaam, achternaam, email, facemail, login, tel, land, taal, postcode, stad, straatnaam, huisnummer, bus, facpostcode, facstad, facstraatnaam, fachuisnummer, facbus, hash, rolluikbladkorting, Tradirolluikkorting, voorzetrolluikkorting, screenkorting, lakkerijkorting, btwnummer, res)
                

           } else {
            console.log('Fout bij toeveogen.')
           }

           //anders error

        }
    })
}
catch(err){
    console.log(err)
} 
finally{
    if(connection){
        connection.release()
    }
}


}

module.exports = registreer;