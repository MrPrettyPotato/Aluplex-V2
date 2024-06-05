const pool = require('../connection')

/**
 * Voert een berekening uit met drie parameters.
 * @constructor
 * @param {String} ral - Data vanuit de RAL dropdown.
 */

async function fetchOphangveer(ophangveer,breedte) {
    let connection;
    const query = `SELECT artikelnummer FROM productlijst WHERE benaming LIKE ?`
    const query2 = `SELECT prijs FROM ophangveren WHERE artikelnummer = ?`
    try {
        connection = await pool.promise().getConnection();
        var [ophangveernummer] = await connection.execute(query, [ophangveer]);
        console.log('ophangveernummer',ophangveernummer[0].artikelnummer)
        var [ophangveerprijs] = await connection.execute(query2, [ophangveernummer[0].artikelnummer]);
        console.log('ophangveerprijs',ophangveerprijs)
        const aantal = Math.round(Number(breedte) / 500)
        const prijs = ophangveerprijs[0].prijs * aantal
        return prijs
    } catch (err) {

        console.log(__filename, 'Error', err)
        return null
    } finally {
        if(connection){
            connection.release()
        }
    }

}

module.exports = fetchOphangveer
