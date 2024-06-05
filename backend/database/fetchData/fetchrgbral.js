const pool = require('../connection')



async function fetchrgbral(kleuronderlat,ralonderlat,kleurlamel,kleuronderlatRAL,kleurlamel2) {
    let connection;
    var _kleuronderlat;
    var newKleurlamel;
    console.log("data fetchrgbral",kleuronderlat," - ",ralonderlat," - ",kleurlamel," - ",_kleuronderlat," - ",kleuronderlatRAL)
    console.log("data fetchrgbral",kleuronderlat)

    if(kleuronderlat === "RAL"){
        _kleuronderlat = 'RAL ' + ralonderlat
    } else {
        if(kleuronderlat === "Wit" ||kleuronderlat === "Beige"){

            _kleuronderlat = kleuronderlat
        } else {
            
        _kleuronderlat = 'RAL ' + kleuronderlatRAL
        }
        
    }

    if(kleurlamel2 === "Wit" || kleurlamel2 === "Beige"){
        newKleurlamel = kleurlamel2
    } else {
        newKleurlamel = 'RAL ' + kleurlamel
    }
     
    console.log("data fetchrgbral",kleuronderlat,ralonderlat,kleurlamel,_kleuronderlat)

    const query = `SELECT hex FROM ralrgblijst WHERE ral = ?`
    const query2 = `SELECT hex FROM ralrgblijst WHERE ral = ?`
    try {
        
        connection = await pool.promise().getConnection();
        var [_ralonderlatdata] = await connection.execute(query,[_kleuronderlat]);
        var [_kleurlameldata] = await connection.execute(query2,[newKleurlamel]);
        console.log("ralonderlat & lamel",_ralonderlatdata,_kleurlameldata)
        const newData = {"kleuronderlat":_ralonderlatdata[0].hex,"kleurlamel":_kleurlameldata[0].hex}
        return newData
    } catch (err) {

        console.log(__filename, 'Error', err)
        return null
    } finally {
        if (connection){
            connection.release()
        }
    }

}

module.exports = fetchrgbral