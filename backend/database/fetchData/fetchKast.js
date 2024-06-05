const { error } = require('console');
const pool = require('../connection');

/**
 * Voert een berekening uit met drie parameters.
 * @constructor
 * @param {String} breedte - De berekende breedte van het rolluikblad.
 * @param {String} typelamel - het type lamel.
 * @param {Number} hoogte - De hoogte van het rolluik.
 */

async function fetchKast(kastdata, kleurlamel) {
var allowed = false
var _nieuweKast;
const _data = await zoekKast(kastdata,kleurlamel)
console.log('data kastdata',_data[0],"data",_data)
    if (!_data[0]) {
        allowed = false
        
while (!allowed) {
    console.log('In while loop')
        const nieuweKast = returnBigger(kastdata)
        const _nieuwedata = await zoekKast(nieuweKast,kleurlamel)
        if(_nieuwedata[0]){
            if(_nieuwedata[0].length < 1){
                allowed = false
            } else {
                allowed = true
                _nieuweKast = nieuweKast
            }
        }
        
}
console.log('Na while loop')
if(_nieuweKast){
console.log('Nieuwe kast gevonden',_nieuweKast)
    return _nieuweKast
} else {
    console.log('Nieuwe kast NIET gevonden')
    return error
}
    } else {
        
        console.log('data gevonden, geen nieuwe kast nodig',_data)
        return kastdata
    }
}




function returnBigger(kastdata) {
    switch (kastdata) {
        case 137:
            return 150
        case 150:
            return 165
        case 165:
            return 180
        case 180:
            return 205


        default:
            return 205
    }

}

async function zoekKast(kastdata,kleurlamel){
    const query = `SELECT * FROM kleurminitradi WHERE ?? = 1 AND kleur = ?`;

    try {
        const [data] = await pool.promise().query(query, [kastdata, kleurlamel]);
        console.log('kastdata data', data);
        return data
       
        // return price[0][_breedte];
    } catch (err) {
        console.error(__filename, 'Error', err);
        // return null;
    }
}
module.exports = fetchKast;