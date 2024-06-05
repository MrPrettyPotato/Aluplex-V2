const pool = require('../connection');

/**
 * Voert een berekening uit met drie parameters.
 * @constructor
 * @param {String} breedte - De berekende breedte van het rolluikblad.
 * @param {String} typelamel - het type lamel.
 * @param {Number} hoogte - De hoogte van het rolluik.
 */

async function fetchTradi(breedte, typelamel, hoogte,bediening) {
    console.log('start fetchTradi');
    const _breedte = breedte;
    const _typeblad = typelamel.toLocaleLowerCase() + bediening;
    const _hoogte = hoogte;
    const query = 'SELECT ?? FROM ?? WHERE hoogte = ?';
    console.log('_breedte', _breedte, '_hoogte', _hoogte, '_typeblad', _typeblad)

    try {
        const [price] = await pool.promise().query(query, [_breedte, _typeblad, _hoogte]);
        console.log('PRICE BLAD', price);
        return price[0][_breedte];
    } catch (err) {
        console.error(__filename, 'Error', err);
        return null;
    }
}

module.exports = fetchTradi;