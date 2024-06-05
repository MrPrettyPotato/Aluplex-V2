const pool = require('../connection');

/**
 * Voert een berekening uit met drie parameters.
 * @constructor
 * @param {String} typebediening - De berekende breedte van het rolluikblad.
 */

async function fetchTradiBediening(typebediening) {
    const query = 'SELECT * FROM tradibediening WHERE benaming = ?';

    try {
        const [bediening] = await pool.promise().query(query, [typebediening]);
        console.log('bediening', bediening);
        return bediening[0];
    } catch (err) {
        console.error(__filename, 'Error', err);
        return null;
    }
}

module.exports = fetchTradiBediening;