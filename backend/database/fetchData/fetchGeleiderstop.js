const pool = require('../connection')

/**
 * Voert een berekening uit met drie parameters.
 * @constructor
 * @param {String} ral - Data vanuit de RAL dropdown.
 */

async function fetchGeleiderstop(data) {
    let connection;
    const query = `SELECT meerprijs FROM geleiderstoppen WHERE omschrijving LIKE ?`
    try {
        connection = await pool.promise().getConnection();
        var [results] = await connection.execute(query, [data]);
        console.log('geleiderstop',results)
        return results[0]
    } catch (err) {

        console.log(__filename, 'Error', err)
        return null
    } finally {
        if(connection){
            connection.release()
        }
    }

}

module.exports = fetchGeleiderstop
