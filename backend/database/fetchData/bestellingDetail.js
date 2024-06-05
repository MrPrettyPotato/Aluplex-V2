const pool = require('../connection')

/**
 * Haalt bestellingdetails op basis van referentie uit de database.
 * @param {String} referentie - De referentie van de bestelling.
 * @returns {Promise<Array>} - Een array met bestellingdetails.
 */
async function fetchBestellingDetails(referentie) {
    try {
      const query = 'SELECT * FROM winkelmand WHERE status = "bestelling" AND ref LIKE ?';
      const [result] = await pool.promise().query(query, [`%${referentie}%`]);
      return result;
    } catch (err) {
      console.error(__filename, 'Error', err);
      throw err; // Rethrow de fout om het bovenliggende niveau te informeren.
    }
  }
  
  module.exports = fetchBestellingDetails;