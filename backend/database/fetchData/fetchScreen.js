const pool = require('../connection');

const ferynPrijslijsten = ["ferynscreen89somfyio", "ferynscreen103somfyio", "ferynscreen131somfyio","ferynscreen150somfyiosolar"]
/**
 * Voert een berekening uit met vier parameters.
 * @constructor
 * @param {Number} breedte - De berekende zoek breedte.
 * @param {Number} hoogte -  De berekende zoek hoogte.
 * @param {Number} kastgrootte - De grootte van de kast.
 * @param {String} typebediening - Het soort bediening.
 */

async function fetchScreen(breedte, hoogte,kastgrootte,typebediening,user) {
        
            let _db;
            var _feryn = false;
            if(user.toLocaleLowerCase() != "feryn"){

                _db = "screen" + (kastgrootte.toString()) + typebediening;
            } else {
                const tijdelijkePrijslijstnaam = "ferynscreen" + (kastgrootte.toString()) + typebediening;


                if (ferynPrijslijsten.includes(tijdelijkePrijslijstnaam)) {
                    _db = tijdelijkePrijslijstnaam;
                    _feryn = true
                } else {
                    
                    _db = "ferynscreen" + (kastgrootte.toString()) + typebediening;
                }


            }
            let connection;
            try {
                connection = await pool.promise().getConnection();
                const _query = `SELECT ?? FROM ?? WHERE hoogte = ?`;
                const [result] = await connection.query(_query, [breedte,_db,hoogte]);
                console.log('query result screenprijs', result);
                return {"screenprijs": result[0][breedte],"feryn": _feryn}
                
            } catch (err) {
                console.error('Error screenprijs', err);
                return false
            } finally {
                if (connection) {
                    connection.release();
                }
            }
}


module.exports = fetchScreen;