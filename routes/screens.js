const express = require('express');
const router = express.Router();
const pool = require('../backend/database/connection')

router.get('/', (req, res) => {
    if (req.session.user) {
        res.render('screens', {
            req: req,
            user: req.session.user,
            logged_in: req.isAuthenticated
        })
    } else {
        res.render('./home', {
            req: req,
            user: req.session.user,
            logged_in: req.isAuthenticated
        })
    }
})


router.post('/typeafwerkingData', async (req, res) => {
    console.log('typeafwerkingData')

    let connection;
    try{
        connection = await pool.promise().getConnection();
        const query = 'SELECT * FROM typeafwerking WHERE type = "Voorzetrolluik"'
        const [results] = await connection.execute(query);
        console.log('results',results)
        if(results.length > 0){
            res.send(results)
        } else {
            console.log('geen waarde gevonden typeafwerking');
            res.send(false);
        }
    }
    catch(err){
        console.error(err)
    }finally{
        if(connection){
            connection.release();
// console.log(`Aantal actieve verbindingen: ${poolStats.totalConnectionsCount}`);
// console.log(`Aantal vrije verbindingen: ${poolStats.idleConnectionsCount}`);
// console.log(`Grootte van de wachtrij: ${poolStats.queueSize}`);
        }
    }
})


router.post('/afwerkingdag',async (req,res)=>{
    console.log('afwerkingdag gestart')
    let connection;
    try{
       // connection
       console.log("zoek afwerkingdag",req.body.data)
       connection = await pool.promise().getConnection();
       const query = `SELECT * FROM typeafwerking WHERE screen = 1`
       const [results] = await connection.execute(query)
       console.log('query',results)
       if(results.length > 0){
          res.send(results)
       } else {
          res.send("error")
       }
 
    } catch(err){
 console.error('Zoek afwerkingdag ERROR',err)
    } finally {
       if (connection) {
          connection.release();
       }
    }
 })
 
 
 router.post('/zoekafwerkingdagdata', async (req, res) => {
    let connection;
    try {
       // connection
       connection = await pool.promise().getConnection();
       const query = 'SELECT data FROM typeafwerking WHERE benaming = ? AND screen = 1'
       const [results] = await connection.execute(query, [req.body.data])
       console.log('zoekafwerkingdata', results)
       const newResult = results[0].data
 
       if (results.length > 0) {
          res.send(newResult)
       } else {
          res.send(JSON.stringify({
             "error": "error"
          }))
       }
 
    } catch (err) {
       console.log('error', err)
    } finally {
       if (connection) {
          connection.release();
       }
    }
 })
router.post('/zoekbedieningskantData', async (req, res) => {
    let connection;

    try{
        connection = await pool.promise().getConnection();
        let query;
        if(req.body.data == 'somfyiosolar'){
            query = 'SELECT * FROM screenbedieningskant WHERE somfyiosolar = 1'
        } else {
            query = 'SELECT * FROM screenbedieningskant WHERE somfyiosolar = 0'
        }
        const [results] = await connection.execute(query);
        console.log('results',results)
        if(results.length > 0){
            res.send(results)
        } else {
            console.log('geen waarde gevonden zoekbedieningskantData');
            res.send(false);
        }
    }
    catch(err){
        console.error(err)
    } finally{
        if(connection){
            connection.release();
        }
    }
})

router.post('/zoektypebedieningData', async (req, res) => {
    const _data = req.body.data
    if(_data != "feryn"){
        let connection;
        try{
            connection = await pool.promise().getConnection();
            const query = 'SELECT * FROM screentypebediening'
            const [results] = await connection.execute(query);
            console.log('results',results)
            if(results.length > 0){
                res.send(results)
            } else {
                console.log('geen waarde gevonden typeafwerking');
                res.send(false);
            }
        }
        catch(err){
            console.error(err)
        } finally{
            if(connection){
                connection.release();
            }
        }
    } else {
        let connection;
        try{
            connection = await pool.promise().getConnection();
            const query = 'SELECT * FROM screentypebediening WHERE feryn = 1'
            const [results] = await connection.execute(query);
            console.log('results',results)
            if(results.length > 0){
                res.send(results)
            } else {
                console.log('geen waarde gevonden typeafwerking');
                res.send(false);
            }
        }
        catch(err){
            console.error(err)
        } finally{
            if(connection){
                connection.release();
            }
        }
    }
    
})

router.post('/zoekbedieningData', async (req, res) => {

    const _data = req.body.data
    console.log('zoekbedieningData',_data,typeof _data)
    //eerst zoeken met welke data _data overeenkomt in zijn database, en haal daar de waarde van "db" uit.
  if(typeof _data ===  "object"){
    let connection;
    try{
        connection = await pool.promise().getConnection();
        const _dataQuery = `SELECT db FROM screentypebediening WHERE benaming = ?`
        const _zenderQuery = 'SELECT * FROM zenders WHERE ?? = 1 AND (ferynprijs IS NOT NULL AND ferynprijs <> 0)'
        const _dataresult = await connection.execute(_dataQuery, [_data.value]);
        const _newDataResult = _dataresult[0][0].db
        console.log('_dataresult',_newDataResult)
        const [_zenderresult] = await pool.promise().query(_zenderQuery,[_newDataResult]);
        console.log('_zenderresult',_zenderresult)
        if(_zenderresult.length > 0 && _newDataResult.length > 0){
            res.send({data:_zenderresult,db:_newDataResult})
        } else {
            console.log('geen waarde gevonden typeafwerking');
            res.send(false);
        }
    }
    catch(err){
        console.error(err)
    } finally{
        if(connection){
            connection.release();
        }
    }
  } else {
    let connection;
    try{
        connection = await pool.promise().getConnection();
        const _dataQuery = `SELECT db FROM screentypebediening WHERE benaming = ?`
        const _zenderQuery = 'SELECT * FROM zenders WHERE ?? = 1'
        const _dataresult = await connection.execute(_dataQuery, [_data]);
        const _newDataResult = _dataresult[0][0].db
        console.log('_dataresult',_newDataResult)
        const [_zenderresult] = await pool.promise().query(_zenderQuery,[_newDataResult]);
        console.log('_zenderresult',_zenderresult)
        if(_zenderresult.length > 0 && _newDataResult.length > 0){
            res.send({data:_zenderresult,db:_newDataResult})
        } else {
            console.log('geen waarde gevonden typeafwerking');
            res.send(false);
        }
    }
    catch(err){
        console.error(err)
    } finally{
        if(connection){
            connection.release();
        }
    }
  }

    
})


    router.post('/zoektypedoekData', async (req, res) => {

        //eerst zoeken met welke data _data overeenkomt in zijn database, en haal daar de waarde van "db" uit.  
        try{
            connection = await pool.promise().getConnection();
            const _query = `SELECT * FROM typescreendoeken`
            const [_result] = await connection.execute(_query);
            console.log('_result',_result)
            if(_result.length > 0){
                console.log('geen waarde gevonden typeafwerking');
                res.send(_result)

            }
            else{
                console.log('geen waarde gevonden typeafwerking');
                res.send(false);
            }

        }
        catch(err){
            console.error(err)
        }
        finally{
            if(connection){
                connection.release();
            }
        }

    })

    router.post('/zoekdoekData', async (req, res) => {
        const _data = req.body.data
        console.log('zoekdoekData',_data)
        let connection;
        try{
            connection = await pool.promise().getConnection();
            const query = 'SELECT * FROM doeken WHERE type = ?'
            const [results] = await connection.execute(query,[_data]);
            console.log('results',results)
            if(results.length > 0){
                res.send(results)
            } else {
                console.log('geen waarde gevonden typeafwerking');
                res.send(false);
            }
        }
        catch(err){
            console.error(err)
        }
        finally{
            if(connection){
                connection.release();
            }
        }
    })

    router.post('/kastkleurData', async (req, res) => {
        const _data = req.body.data
        console.log('zoekdoekData',_data)
        let connection;
        try{
            connection = await pool.promise().getConnection();
            const query = 'SELECT * FROM screenkastkleur'
            const [results] = await connection.execute(query);
            console.log('results',results)
            if(results.length > 0){
                res.send(results)
            } else {
                console.log('geen waarde gevonden typeafwerking');
                res.send(false);
            }
        }
        catch(err){
            console.error(err)
        }
        finally{
            if(connection){
                connection.release();
            }
        }
    })

    router.post('/zoekral',async (req,res)=>{
        let connection;
        try{
           // connection
           console.log("zoekral",req.body.data)
           connection = await pool.promise().getConnection();
           const query = `SELECT * FROM rallijst`
           const [results] = await connection.execute(query)
           console.log('query',results)
           if(results.length > 0){
              res.send(results)
           } else {
              res.send("error")
           }
     
        } catch(err){
     console.error('ZOEKKASTKLEUR ERROR',err)
        } finally {
           if (connection) {
              connection.release();
           }
        }
     })

     router.post('/checkafmetingen',async (req,res)=>{
        const _data = req.body.data
         let connection;
         try{
             connection = await pool.promise().getConnection();
             const query = `SELECT * FROM typeafwerking WHERE benaming = ?`
             const [result] = await connection.execute(query,[_data])
         }
         catch(err){
             console.error(err)
         }
         finally{
             if(connection){
                 connection.release();
             }
         }
     })

        router.post('/zoekafmetingafwerkingData', async (req, res) => {
            const _data = req.body.data
            let connection;

            try {
                connection = await pool.promise().getConnection();
                const query = `SELECT data FROM typeafwerking WHERE benaming = ?`
                const [result] = await connection.execute(query, [_data]);
                console.log('zoekafmetingafwerkingData', result)
                if(result.length > 0){
                    res.send(result[0].data)
                } else {
                    console.log('geen waarde gevonden typeafwerking');
                    res.send(false);
                }
            } catch (error) {
                
            } finally {
                if(connection){
                    connection.release();
                }
            }


        }
        )


        router.post('/screenprijs', async (req, res) => {
            const _data = req.body.data;
            console.log('data screenprijs', _data);
            const _breedte = req.body.data.afmetingen.zoekbreedte;
            const _hoogte = req.body.data.afmetingen.zoekhoogte;
            const _kastgrootte = req.body.data.afmetingen.kastgrootte;
            const _typebediening = req.body.data.typebediening;
        
            const _db = "screen" + (_kastgrootte.toString()) + _typebediening;
            let connection;
            try {
                connection = await pool.promise().getConnection();
                const _query = `SELECT ?? FROM ?? WHERE hoogte = ?`;
                const [result] = await connection.query(_query, [_breedte,_db,_hoogte]);
                console.log('query result screenprijs', result);
                res.send(result)
            } catch (err) {
                console.error('Error screenprijs', err);
                res.status(500).send(false);
            } finally {
                if (connection) {
                    connection.release();
                }
            }
        });

        router.post('/addtocart', async (req, res) => {
            let connection;
         
            try {
               connection = await pool.promise().getConnection();
         
         
               const query = 'INSERT INTO winkelmand SET ?';
               console.log('addtocart data ', req.body.data)
         
         
               if (req.body.data) {
                  const data = req.body.data;
                  const columns = Object.keys(data);
                  const values = Object.values(data);
                  const placeholders = values.map(() => '?').join(', ');
                  const query = `INSERT INTO winkelmand (${columns.join(', ')}) VALUES (${placeholders})`;
                  console.log('Query screens -> winkelmand')
                  console.log(query)
                  console.log(data)
                  /*TODO*/
                  /* BEKIJKEN OF DE MATEN NIET TE GROOT ZIJN! */
                  const newData = await connection.execute(query, values)
         
                  // const [afwerking] = await connection.execute(`SELECT data FROM typeafwerking WHERE benaming = ? AND type = rolluikblad`,[req.body.data.typeafwerking])
                  // console.log('afwerking', afwerking)
         
                  if (newData.length > 0) {
                     console.log('results insertinto winkelmand', newData)
                     //stuur het resultaat naar de database
                     res.json(data);
                  } else {
                     // console.log("geen waarde 2de query");
                     res.send(false);
                  }
               }
         
         
            } catch (err) {
               console.log('add to cart failed', err);
               res.status(500).send('Internal Server Error');
            } finally {
               if (connection) {
                  connection.release();
               }
            }
         });



module.exports = router;