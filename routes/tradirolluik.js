const express = require('express');
const router = express.Router();
const pool = require('../backend/database/connection')

// console.log("rolluikblad routes")
router.get('/', (req, res) => {
   if (req.session.user) {
      res.render('tradirolluik', {
         req: req,
         user: req.session.user,
         logged_in: req.isAuthenticated()
      });
   } else {
      res.render('./home', {
         req: req,
         user: req.session.user,
         logged_in: req.isAuthenticated()
      });
   }
});

router.post('/getData', async (req, res) => {
   let connection; // Declareer de variabele buiten de try-blok om deze in de finally-blok te kunnen gebruiken
   console.log('req.body', req.body)
   try {

      connection = await pool.promise().getConnection();

      const _breedte = req.body.data.breedte;
      const _hoogte = req.body.data.hoogte;
      const _afwerking = req.body.data.afwerking;
      const [afwerkingResult] = await connection.execute(`SELECT data FROM typeafwerking WHERE benaming = ? AND type = 'rolluikblad'`, [_afwerking])
      console.log('afwerkingResult', afwerkingResult,typeof afwerkingResult)
      const afwerkingData = JSON.parse(afwerkingResult[0].data)
      const _afgwerkteBreedte = Number(_breedte) + Number(afwerkingData.breedte)
      const _afgewerkteHoogte = Number(_hoogte) + Number(afwerkingData.hoogte)
      console.log('_afgwerkteBreedte', _afgwerkteBreedte)
      console.log('_afgewerkteHoogte', _afgewerkteHoogte)
      const _oppervlak = (Number(_afgwerkteBreedte) * Number(_afgewerkteHoogte)) / 1000000;

      const [results, fields] = await connection.execute(
         'SELECT * FROM typelamel WHERE breedte >= ? AND hoogte >= ? AND oppervlak >= ? AND traditioneel = 1',
         [_afgwerkteBreedte, _afgewerkteHoogte, _oppervlak]
      );

      // console.log('Connection started, looking for the data...');

      if (results.length > 0) {
         const lamel = results;
         // console.log('lamel', lamel);
         res.send(lamel);
      } else {
         // console.log('geen waarde gevonden');
         res.send(false);
      }
   } catch (err) {
      console.error('Error:', err.message);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connection) {
         connection.release();
      }
   }
});




router.post('/kleurlamel', async (req, res) => {
   let connection;

   try {
      connection = await pool.promise().getConnection();

      // console.log('body', req.body);

      const _lamel = req.body.data.lamel;
      // console.log('type lamel', _lamel);

      const [results, fields] = await connection.execute(`SELECT * FROM kleurminitradi WHERE ${_lamel} = 1`);

      // console.log('Connection started, looking for the data...');

      if (results.length > 0) {
         const _data = results;
         // console.log('lamel', _data);
         res.send(_data);
      } else {
         // console.log('geen waarde gevonden');
         res.send(false);
      }
   } catch (error) {
      // console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connection) {
         connection.release();
      }
   }
});

router.post('/minitradi', async (req, res) => {
   let connection;

   try {
      connection = await pool.promise().getConnection();

      // Haal de waarde op uit het verzoek
      const _lamel = req.body.data;
      // console.log("Lamel minitradi", _lamel);

      const [results, fields] = await connection.execute(`SELECT * FROM typelamel WHERE benaming LIKE ?`, [_lamel]);

      // console.log('Connection started, looking for the data...');
      // console.log('result minitradi', results);

      if (results.length > 0) {
         const _data = results[0];

         if (_data.mini === 1) {
            // console.log('mini');
            res.json({
               minitradi: "mini"
            });
         } else if (_data.tradi === 1) {
            // console.log("Tradi");
            res.json({
               minitradi: "tradi"
            });
         }
      } else {
         // console.log('geen waarde gevonden');
         res.send(false);
      }
   } catch (error) {
      // console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connection) {
         connection.release();
      }
   }
});

router.post('/kleurOnderlat', async (req, res) => {
   let connection;

   try {
      connection = await pool.promise().getConnection();

      // Haal de waarde op uit het verzoek
      const _type = req.body.data;
      // console.log("Lamel minitradi", _type.minitradi);
      const query = `SELECT * FROM kleurminitradi WHERE ${pool.escapeId(_type.minitradi)} = 1`;
      const [results, fields] = await connection.execute(query);

      // console.log('Connection started, looking for the data...');
      // console.log('result minitradi', results);

      if (results.length > 0) {
         const _data = results;
         // console.log("kleuronderlat Sended", _data);
         res.json(_data);
      } else {
         // console.log('geen waarde gevonden');
         res.send(false);
      }
   } catch (error) {
      // console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connection) {
         connection.release();
      }
   }
});

router.post('/uitvoeringblad', async (req, res) => {
   let connection;
   try {
      connection = await pool.promise().getConnection();
      const query = "SELECT * FROM uitvoeringblad"
      const [results] = await connection.execute(query)
      console.log('uitvoeringblad data', results)
      if (results.length > 0) {
         res.send(results)
      } else {
         res.send("error")
      }
   } catch (err) {}
})
router.post('/kleurOnderlatRAL', async (req, res) => {
   let connection;

   try {
      connection = await pool.promise().getConnection();

      // Haal de waarde op uit het verzoek
      // console.log("kleurOnderlatRAL");

      const [results, fields] = await connection.execute(`SELECT alles FROM rallijst`);

      if (results.length > 0) {
         // console.log("Result gevonden");
         const _data = results;

         res.json(_data);
      } else {
         // console.log('geen waarde gevonden');
         res.send(false);
      }
   } catch (error) {
      // console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connection) {
         connection.release();
      }
   }
});

router.post('/typeafwerking', async (req, res) => {
   let connection;
   try {
      // connection
      connection = await pool.promise().getConnection();
      //results van de database
      const [results1] = await connection.execute(`SELECT * FROM typeafwerking WHERE type = ?`, ["rolluikblad"]);
      if (results1.length > 0) {
         console.log('results afwerking', results1)
         //stuur het resultaat naar de database
         res.json(results1);
      } else {
         // console.log("geen waarde 2de query");
         res.send(false);
      }


   } catch (error) {
      // console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connection) {
         connection.release();
      }
   }
})

router.post('/typeophangveer', async (req, res) => {
   let connection;

   try {
      connection = await pool.promise().getConnection();

      var _minitradi;
      // console.log('data typeophangveer minitradi', req.body.data);

      if (req.body.data.minitradi === "mini") {
         _minitradi = "miniophangveer";
      } else {
         _minitradi = "tradiophangveer";
      }

      const [results1, fields1] = await connection.execute(`SELECT * FROM ophangveren WHERE type = ?`, [_minitradi]);
      console.log('results1',results1)
      if (results1.length > 0) {
         res.json(results1)
      } else {
         // console.log('geen waarde gevonden');
         res.send(false);
      }
   } catch (error) {
      // console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
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
         /*TODO*/
         /* BEKIJKEN OF DE MATEN NIET TE GROOT ZIJN! */
         const newData = await connection.execute(query, values)
         console.log('NewData', newData)

         // const [afwerking] = await connection.execute(`SELECT data FROM typeafwerking WHERE benaming = ? AND type = rolluikblad`,[req.body.data.typeafwerking])
         // console.log('afwerking', afwerking)

         if (newData.length > 0) {
            console.log('results afwerking', newData)
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


router.post('/getbediening', async (req, res) => {
   let connection;

   try {
      connection = await pool.promise().getConnection();
      const _data = req.body.data
      console.log('bediening Data',_data)



      const [results, fields1] = await connection.execute(`SELECT * FROM tradibediening WHERE ${_data}`);
      console.log("result getbediening",results)

      if (results.length > 0) {

         res.json(results);

      } else {
         // console.log('geen waarde gevonden');
         res.send(false);
      }
   } catch (error) {
      // console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connection) {
         connection.release();
      }
   }
});


// router.post('/getzender', async (req, res) => {
//    let connection;

//    try {
//       connection = await pool.promise().getConnection();
//       const _data = req.body.data
//       console.log('bediening Data',_data)



//       const [results, fields1] = await connection.execute(`SELECT * FROM zenders WHERE ${_data}`);
//       console.log("result getbediening",results)

//       if (results.length > 0) {

//          res.json(results);

//       } else {
//          // console.log('geen waarde gevonden');
//          res.send(false);
//       }
//    } catch (error) {
//       // console.error('Error:', error.message);
//       res.status(500).send('Internal Server Error');
//    } finally {
//       if (connection) {
//          connection.release();
//       }
//    }
// });

router.post('/getzender', async (req, res) => {
   let connection;

   try {
      connection = await pool.promise().getConnection();
      const _data = req.body.data
      console.log('bediening Data',_data)



      const [results, fields1] = await connection.execute(`SELECT ${_data.select} FROM ${_data.FROM} WHERE ${_data.WHERE}`);
      console.log("result getbediening",results)

      if (results.length > 0) {

         res.json(results);

      } else {
         // console.log('geen waarde gevonden');
         res.send(false);
      }
   } catch (error) {
      // console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
   } finally {
      if (connection) {
         connection.release();
      }
   }
});
module.exports = router;