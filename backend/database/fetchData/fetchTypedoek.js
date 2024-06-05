const pool = require('../connection');

/**
 * Voert een berekening uit met vier parameters.
 * @constructor
 * @param {Number} breedte - De berekende zoek breedte.
 * @param {Number} hoogte -  De berekende zoek hoogte.
 * @param {Number} kastgrootte - De grootte van de kast.
 * @param {String} typebediening - Het soort bediening.
 */

async function fetchTypedoek(typedoek) {
        
          
            let connection;
            try {
                connection = await pool.promise().getConnection();
                const query = 'SELECT * FROM typescreendoeken WHERE benaming = ?'
                const [result] = await connection.execute(query, [typedoek]);
                console.log('query result screenprijs', result);
                return result[0]
            } catch (err) {
                console.error('Error screenprijs', err);
                return false
            } finally {
                if (connection) {
                    connection.release();
                }
            }
}


module.exports = fetchTypedoek;