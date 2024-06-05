const pool = require('../connection');

/**
 * Voert een berekening uit met drie parameters.
 * @constructor
 * @param {String} db - In welke database gaan we het ophalen.
 * @param {String} kolom - Wat is de naam van de kolom waarvan wij de data al hebben? vb: benaming.
 * @param {String} data - Wat is de waarde van de kolom waarvan wij de data al hebben?
 */

async function fetchOmschrijving(db, kolom, data) {
    let connection;
    try {
        
        const _query = 'SELECT omschrijving FROM ?? WHERE ?? = ?'
        
        const [omschrijving] = await pool.promise().query(_query, [db, kolom,data]);
        console.log('omschrijving',omschrijving)
        if(omschrijving){
            
           return omschrijving[0].omschrijving

        } else {
            return "error"
        }
    } catch (err) {
        console.error('Error', err);
        return err
        
    } finally{
        if(connection){
            connection.release()
        }
    }
}

module.exports = fetchOmschrijving;


