const pool = require('../connection')

/**
 * Voert een berekening uit met drie parameters.
 * @constructor
 * @param {String} ral - Data vanuit de RAL dropdown.
 */

async function fetchRal(ral) {
    let connection;
    const _ral = '%' + ral + '%'
    const query = `SELECT * FROM rallijst WHERE alles LIKE ?`
    try {
        connection = await pool.promise().getConnection();
        var [ralData] = await connection.execute(query, [_ral]);
        // console.log(__filename, "Raldata", ralData)
        return ralData[0]
    } catch (err) {

        console.log(__filename, 'Error', err)
        return null
    } finally {
        if(connection){
            connection.release()
        }
    }

}

module.exports = fetchRal



/*
verwijder alles met \r
UPDATE rallijst SET alles = TRIM(TRAILING '\r' FROM alles);
*/