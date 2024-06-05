const pool = require('../connection');

/**
 * Voert een berekening uit met drie parameters.
 * @constructor
 * @param {String} typebediening - De berekende breedte van het rolluikblad.
 */

async function fetchZenderData(zender) {
    const query = 'SELECT * FROM zenders WHERE benaming = ?';

    try {
        console.log('fetchZenderData zender',zender)
        const [zenderData] = await pool.promise().query(query, [zender]);
        console.log('zender', zenderData);
        return zenderData[0];
    } catch (err) {
        console.error(__filename, 'Error', err);
        return null;
    }
}

module.exports = fetchZenderData;