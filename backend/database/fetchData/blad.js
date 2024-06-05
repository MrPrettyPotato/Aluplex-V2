const pool = require('../connection');

/**
 * Voert een berekening uit met drie parameters.
 * @constructor
 * @param {String} breedte - De berekende breedte van het rolluikblad.
 * @param {String} typelamel - het type lamel.
 * @param {Number} hoogte - De hoogte van het rolluik.
 */

async function fetchBlad(breedte, typelamel, hoogte) {
    const _breedte = breedte;
    const _typeblad = "blad" + typelamel.toLocaleLowerCase();
    const _hoogte = hoogte;
    const query = 'SELECT ?? FROM ?? WHERE hoogte = ?';

    try {
        const [price] = await pool.promise().query(query, [_breedte, _typeblad, _hoogte]);
        console.log('PRICE BLAD', price);
        return price[0][_breedte];
    } catch (err) {
        console.error(__filename, 'Error', err);
        return null;
    }
}

module.exports = fetchBlad;