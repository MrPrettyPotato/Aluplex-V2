const pool = require('../connection')
const checkType = require('../../js/rolluiken/lakkerijType')

async function fetchRalPrice(type, uitvoering,klant) {
    let connection;
    console.log('location',__filename)
    console.log('type',type)
    console.log('uitvoering',uitvoering)
    const priceType = checkType(type)
    const _type = '%' + priceType + '%'
    const _uitvoering = '%' + uitvoering + '%'
    let query;
    if(klant && klant==='feryn'){

        query = `SELECT ferynprijs,eenheid FROM lakkerij WHERE type LIKE ? AND uitvoering LIKE ?`
    } else {

        query = `SELECT prijs,eenheid FROM lakkerij WHERE type LIKE ? AND uitvoering LIKE ?`
    }
    try {
        connection = await pool.promise().getConnection();
        console.log('type,uitvoering',type,uitvoering,_type,_uitvoering)
        const [ralData] = await connection.execute(query, [_type, _uitvoering]);
        console.log("ralData",ralData)
        return ralData[0]
    } catch (err) {
        console.log(__filename, "error", err)
        return null
    } finally {
        if(connection){
            connection.release()
        }
    }

}

module.exports = fetchRalPrice