const pool = require('../connection');
const ferynPrijslijsten = ["ferynvzralu42somfyiosolar", "ferynvzrultra42somfyio", "ferynvzralu52somfyiosolar"]

/**
 * Voert een berekening uit met drie parameters.
 * @constructor
 * @param {String} breedte - De berekende breedte van het rolluikblad.
 * @param {String} typelamel - het type lamel.
 * @param {Number} hoogte - De hoogte van het rolluik.
 */

async function fetchVoorzet(typelamel, breedte, hoogte, typelintofmotor, user) {

    console.log('starte')
    const _breedte = breedte;
    //zoek in database vzrbediening naar benaming gelijk aan typelintofmotor -> return typedatabase & pijrs(is de meerprijs)
    const _type = await fethcDatabaseName(typelintofmotor)
    console.log("fetchVoorzet - fetchDatabaseName - _type", _type)
    let _typevoorzet;
    let _feryn = false
    if (user.toLocaleLowerCase() != "feryn") {
        "vzr" + typelamel.toLocaleLowerCase() + _type.db;
        _typevoorzet = "vzr" + typelamel.toLocaleLowerCase() + _type.db;
    } else {
        const tijdelijkePrijslijstnaam = "ferynvzr" + typelamel.toLocaleLowerCase() + _type.db;


        if (ferynPrijslijsten.includes(tijdelijkePrijslijstnaam)) {
            _typevoorzet = tijdelijkePrijslijstnaam;
            _feryn = true
        } else {
            _typevoorzet = "vzr" + typelamel.toLocaleLowerCase() + _type.db;
        }
    }
    const _hoogte = hoogte;
    const query = 'SELECT ?? FROM ?? WHERE hoogte = ?';
    console.log('_breedte', _breedte, '_hoogte', _hoogte, '_typevoorzet', _typevoorzet)

    try {
        const [price] = await pool.promise().query(query, [_breedte, _typevoorzet, _hoogte]);
        console.log('PRICE VOORZET', price);
        return {
            'vzrprijs': price[0][_breedte],
            'meerprijs': _type.prijs,
            'omschrijving': _type.omschrijving,
            'feryn': _feryn
        }
    } catch (err) {
        console.error(__filename, 'Error', err);
        return null;
    }
}

async function fethcDatabaseName(data) {
    const _query = 'SELECT typedatabase,prijs,omschrijving FROM vzrbediening WHERE benaming = ?'

    const [name] = await pool.promise().query(_query, [data]);
    console.log('databasenaam', name)
    return {
        'db': name[0].typedatabase,
        'prijs': name[0].prijs,
        'omschrijving': name[0].omschrijving
    }
}

module.exports = fetchVoorzet;