const express = require('express');
const router = express.Router();
const pool = require('../backend/database/connection')
const fetchKast = require('../backend/database/fetchData/fetchKast')

// VOORZETROLLUIK HOME
router.get('/', (req, res) => {
   if (req.session.user) {
      console.log('req.session.user', req.session.user)
      res.render('voorzetrolluik', {
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

router.post('/typeafwerking', async (req, res) => {
   console.log('zoeken naar afwerking...')
   let connection;
   try {
      // connection
      connection = await pool.promise().getConnection();
      const query = 'SELECT * FROM typeafwerking WHERE type = ?'
      const [results] = await connection.execute(query, [req.body.data]);
      console.log('results?', results)
      res.send(results)


   } catch (err) {
      console.error("Error typeafwerking", err)
      res.status(500).send('Internal Server Error', err);

   } finally {
      if (connection) {
         connection.release();
      }
   }
})

function afrondenop100Tal(value) {
   const _newValue = Math.ceil(value / 100) * 100;
   return _newValue;
}
router.post('/typelintofmotor', async (req, res) => {
   let connection;
   try {
      // connection
      connection = await pool.promise().getConnection();
      const query = "SELECT * FROM vzrtypelintofmotor"
      const [results] = await connection.execute(query)
      console.log('typelintofmotor data', results)
      if (results.length > 0) {
         res.send(results)
      } else {
         res.send("error")
      }

   } catch (err) {
      console.log('typelintofmotor error backend', err)
   } finally {
      if (connection) {
         connection.release();
      }
   }
})
router.post('/typebediening', async (req, res) => {
   let connection;
   console.log('typebediening req data', req.body.data)
   try {
      // connection
      connection = await pool.promise().getConnection();
      const query = `SELECT * FROM vzrbediening WHERE ${pool.escapeId(req.body.data)} = 1`
      const [results] = await connection.execute(query)
      if (results.length > 0) {
         res.send(results)
      } else {
         res.send("error")
      }

   } catch (err) {
      console.log('error typebediening', err)
   } finally {
      if (connection) {
         connection.release();
      }
   }
})

router.post('/zoekbedieningdata', async (req, res) => {
   let connection;
   console.log('zoekbedieningdata req data', req.body.data)
   try {
      // connection
      connection = await pool.promise().getConnection();
      const query = `SELECT * FROM zenders WHERE ${pool.escapeId(req.body.data)} = 1`
      const [results] = await connection.execute(query)
      console.log('results zoekbedieningdata')
      if (results.length > 0) {
         res.send(results)
      } else {
         res.send(JSON.stringify({
            "error": "error"
         }))
      }

   } catch (err) {
      console.log('error zoekbedieningdata', err)
   } finally {
      if (connection) {
         connection.release();
      }
   }
})


router.post('/zoekafwerkingdata', async (req, res) => {
   let connection;
   try {
      // connection
      connection = await pool.promise().getConnection();
      const query = 'SELECT data FROM typeafwerking WHERE type = ? AND benaming = ?'
      const [results] = await connection.execute(query, ["voorzetrolluik", req.body.data])
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



router.post('/zoekkasthoogte', async (req, res) => {
   let connection;
   try {
      // connection
      const _data = req.body.data
      const _afwerkingData = _data.afwerking;
      const _breedte = _data.breedte + _afwerkingData.breedte;
      const _hoogte = _data.hoogte
      const _maxoppervlak = (_breedte * _hoogte) / 1000000
      const _bediening = _data.bediening;
      connection = await pool.promise().getConnection();
      //als type & max maxoppervlakoppervlak <= "maxoppervlak && _breedte >= minbreedte && _breedte <= breedte && _hoogte <= maxhoogte && _hoogte <= hoogte"
      const query = "SELECT * FROM vzrkasthoogte WHERE type = ? AND maxoppervlak <= ? AND minbreedte <= ? AND maxbreedte >= ? AND maxhoogte >= ? AND hoogte >= ?"
      const [results] = await connection.execute(query, [_bediening, _maxoppervlak, _breedte, _breedte, _hoogte, _hoogte])

      console.log('ZOEKLAMEL : result 1', results)
      if (_afwerkingData.hoogte > 0) {
         return
      } else {

         const query2 = "SELECT * FROM vzrkasthoogte WHERE type = ? AND maxoppervlak <= ? AND minbreedte <= ? AND maxbreedte >= ? AND maxhoogte >= ? AND hoogte >= ?"
         const [results2] = await connection.execute(query, [_bediening, _maxoppervlak, _breedte, _breedte, _hoogte, _hoogte])
      }

      if (results.length > 0) {
         res.send(results)
      } else {
         res.send("error")
      }

   } catch (err) {

   } finally {
      if (connection) {
         connection.release();
      }
   }
})

async function getLamellen(breedte, hoogte) {
   let connection;
   const oppervlak = (breedte / 1000) * (hoogte / 1000)
   try {
      connection = await pool.promise().getConnection();
      const query = "SELECT * from typelamel WHERE breedte >= ? AND hoogte >= ? and oppervlak >= ? AND voorzetrolluik = 1"

      const [results] = await connection.execute(query, [breedte, hoogte, oppervlak])
      if (results.length > 0) {
         return results
      } else {
         return "error"
      }
   } catch (err) {
      console.log('Error', err)

   } finally {
      if (connection) {
         connection.release();
      }
   }
}
//functie om breedte en hoogte naar afgewerkte breedte en hoogte te veranderen door middel van de afwerking
function afwerking(breedte, afwerking) {
   const afwerkingdag = JSON.parse(afwerking).afwerkingdag
   var breedteToAdd = 0
   var hoogteToAdd = 0
   for (const [index, data] of afwerkingdag.entries()) {
      if (data.breedte) {
         breedteToAdd += data.breedte
      } else if (data.hoogte) {
         hoogteToAdd = data.hoogte
      }
   }
   const newBreedte = breedte + breedteToAdd

   return {
      "breedte": newBreedte,
      "hoogte": hoogteToAdd
   }
}
async function zoektypedatabase(typebediening) {
   console.log('typebediening', typebediening)
   let connection;
   try {
      connection = await pool.promise().getConnection();
      const query = "SELECT typedatabase FROM vzrbediening WHERE benaming = ?"
      const [results] = await connection.execute(query, [typebediening])
      if (results.length > 0) {
         console.log('results zoektypedatabase', results)
         return results[0].typedatabase
      }
   } catch (err) {
      console.log('Error', err)
   } finally {
      if (connection) {
         connection.release();
      }

   }

}

function afrondenNaar100(value) {
   if (value < 1000) {
      return 1000
   } else {
      return value
   }
}
async function checkKast(breedte, hoogte, afwerkingdagaf, afwerkingdata, typebediening, kleur) {
   console.log('checkKast', breedte, hoogte, afwerkingdagaf, afwerkingdata, typebediening, kleur)
   if (afwerkingdagaf === "dag") {
      const lamelData = await getLamellen(breedte, hoogte)
      const _afwerkingData = afwerking(breedte, afwerkingdata)
      const _typebediening = await zoektypedatabase(typebediening)

      console.log('_afwerkingData', _afwerkingData)
      const newBreedte = _afwerkingData.breedte
      const zoekBreedte = afrondenNaar100(Math.ceil(newBreedte / 100) * 100)
      const zoekHoogte = afrondenNaar100(Math.ceil(hoogte / 100) * 100)
      let connection;
      try {
         if (_afwerkingData.hoogte === "kast") {


            connection = await pool.promise().getConnection();
            var _lamelData = []
            for (const [index, lamel] of lamelData.entries()) {
               if (index === 0) {
                  _lamelData = []; // Reset _lamelData aan het begin van de loop
               }

               const zoektabel = "vzr" + (lamel.benaming).toLowerCase() + _typebediening;
               const query = `SELECT Kastgrootte, ?? FROM ${zoektabel} WHERE hoogte = ${zoekHoogte}`;

               try {
                  const [results] = await connection.query(query, [zoekBreedte]);
                  if (results.length > 0 && results[0][zoekBreedte] && results[0][zoekBreedte] > 0) {
                     // Wanneer de query succesvol is en de resultaten geldig zijn
                     const kastgrootte = await checkKastgrootte(results[0].Kastgrootte, kleur)
                     console.log('kastgrootte', kastgrootte)

                     _lamelData.push({
                        "lamel": lamel,
                        "kastgrootte": kastgrootte,
                        "nieuweHoogte": hoogte + kastgrootte
                     });
                  } else {
                     console.log('Geen waarde gevonden');
                  }
               } catch (error) {
                  // Log de fout en ga door met de volgende iteratie
                  console.log(`Fout bij het opvragen van gegevens uit ${zoektabel}: ${error.message}`);
                  continue; // Gaat door naar de volgende iteratie van de lus
               }
            }
            console.log('lamelData', lamelData)
            console.log('_lamelData', _lamelData)
            var _nieuwelamelData = [];

            for (const [index, data] of _lamelData.entries()) {
               console.log('_lameldata entries', data);
               const _zoekhoogte = afrondenNaar100(Math.ceil(data.nieuweHoogte / 100) * 100);
               if (index === 0) {
                  _nieuwelamelData = [];
               }
               const zoektabel2 = "vzr" + (data.lamel.benaming).toLowerCase() + _typebediening;
               console.log('zoektabel _lamelData', zoektabel2);
               const query2 = `SELECT Kastgrootte, ?? FROM ${zoektabel2} WHERE hoogte = ${_zoekhoogte}`;
               console.log('query _lamelData', query2);

               try {
                  const [results] = await connection.query(query2, [zoekBreedte]);
                  console.log('results _lamelData', results);
                  if (results.length > 0 && results[0][zoekBreedte] && results[0][zoekBreedte] > 0) {
                     const kastgrootte = await checkKastgrootte(results[0].Kastgrootte, kleur)
                     _nieuwelamelData.push({
                        "lamel": data.lamel,
                        "kastgrootte": kastgrootte,
                        "nieuweHoogte": hoogte + kastgrootte
                     });
                  } else {
                     console.log('Geen waarde gevonden');
                  }
               } catch (error) {
                  console.log(`Fout bij het opvragen van gegevens uit ${zoektabel2}: ${error.message}`);
                  continue;
               }
            }

            console.log('_nieuwelamelData', _nieuwelamelData)
            var _nieuwelamelData2 = [];

            for (const [index, data] of _nieuwelamelData.entries()) {
               console.log('');
               const _zoekhoogte = afrondenNaar100(Math.ceil(data.nieuweHoogte / 100) * 100);
               console.log('_zoekHoogte', _zoekhoogte);
               console.log('_zoekbreedte', zoekBreedte);

               if (index === 0) {
                  _nieuwelamelData2 = [];
               }

               const zoektabel3 = "vzr" + (data.lamel.benaming).toLowerCase() + _typebediening;
               console.log('zoektabel _lamelData3', zoektabel3);
               const query3 = `SELECT Kastgrootte, ?? FROM ${zoektabel3} WHERE hoogte = ${_zoekhoogte}`;
               console.log('query _lamelData', query3);

               try {
                  const [results] = await connection.query(query3, [zoekBreedte]);
                  console.log('results _lamelData', results);
                  if (results.length > 0 && results[0][zoekBreedte] && results[0][zoekBreedte] > 0) {
                     const kastgrootte = await checkKastgrootte(results[0].Kastgrootte, kleur)
                     _nieuwelamelData2.push({
                        "lamel": data.lamel,
                        "kastgrootte": kastgrootte,
                        "nieuweHoogte": hoogte + kastgrootte
                     });
                  } else {
                     console.log('Geen waarde gevonden');
                  }
               } catch (error) {
                  // Log de fout en ga door met de volgende iteratie
                  console.log(`Fout bij het opvragen van gegevens uit ${zoektabel3}: ${error.message}`);
                  continue; // Gaat door naar de volgende iteratie van de lus
               }
            }
            console.log('_nieuwelamelData2', _nieuwelamelData2)

            return _nieuwelamelData2
         } else {

            const zoekBreedte = afrondenNaar100(Math.ceil(breedte / 100) * 100)
            const zoekHoogte = afrondenNaar100(Math.ceil(hoogte / 100) * 100)
            connection = await pool.promise().getConnection();
            var _lamelData = [];

            for (const [index, lamel] of lamelData.entries()) {
               if (index === 0) {
                  _lamelData = [];
               }
               const zoektabel = "vzr" + (lamel.benaming).toLowerCase() + _typebediening;
               const query = `SELECT Kastgrootte, ?? FROM ${zoektabel} WHERE hoogte = ${zoekHoogte}`;
               console.log('query _lamelData', query);

               try {
                  const [results] = await connection.query(query, [zoekBreedte]);
                  console.log('results _lamelData', results);
                  if (results.length > 0 && results[0][zoekBreedte] && results[0][zoekBreedte] > 0) {
                     const kastgrootte = await checkKastgrootte(results[0].Kastgrootte, kleur)
                     _lamelData.push({
                        "lamel": lamel,
                        "kastgrootte": kastgrootte,
                        "nieuweHoogte": hoogte
                     });
                  } else {
                     console.log('Geen waarde gevonden');
                  }
               } catch (error) {
                  console.log(`Fout bij het opvragen van gegevens uit ${zoektabel}: ${error.message}`);
                  continue;
               }
            }

            console.log('_lamelData', _lamelData)
            return _lamelData
         }
      } catch (err) {
         console.log('Error', err)

      } finally {
         if (connection) {
            connection.release();
         }
      }
   } else {

      const zoekBreedte = afrondenNaar100(Math.ceil(breedte / 100) * 100)
      const zoekHoogte = afrondenNaar100(Math.ceil(hoogte / 100) * 100)
      const lamelData = await getLamellen(breedte, hoogte)
      const _typebediening = await zoektypedatabase(typebediening)
      connection = await pool.promise().getConnection();
      var _lamelData = [];

      for (const [index, lamel] of lamelData.entries()) {
         if (index === 0) {
            _lamelData = [];
         }
         const zoektabel = "vzr" + (lamel.benaming).toLowerCase() + _typebediening;
         const query = `SELECT Kastgrootte, ?? FROM ${zoektabel} WHERE hoogte = ${zoekHoogte}`;
         console.log('query _lamelData', query);

         try {
            const [results] = await connection.query(query, [zoekBreedte]);
            console.log('results _lamelData', results);
            if (results.length > 0 && results[0][zoekBreedte] && results[0][zoekBreedte] > 0) {
               const kastgrootte = await checkKastgrootte(results[0].Kastgrootte, kleur)
               _lamelData.push({
                  "lamel": lamel,
                  "kastgrootte": kastgrootte,
                  "nieuweHoogte": hoogte
               });
            } else {
               console.log('Geen waarde gevonden');
            }
         } catch (error) {
            console.log(`Fout bij het opvragen van gegevens uit ${zoektabel}: ${error.message}`);
            continue;
         }
      }
      console.log('_lamelData', _lamelData)
      return _lamelData
   }


}
async function checkKastgrootte(kastgrootte, kleur) {
   console.log('checkKastgrootte', kastgrootte, kleur)
   let connection;

   const _data = {
      "kastgrootte": kastgrootte,
      "kleur": kleur
   } // {"kleur":xxx,"kastgrootte":xxx}
   if (!_data.kleur || _data.kleur == "RAL") {
      console.log('checkKastgrootte, return kastgrootte', kastgrootte, _data.kleur)
      return kastgrootte
   } else {
      try {
         connection = await pool.promise().getConnection();
         const query = `SELECT * from kleurminitradi WHERE kleur = ?`
         const [results] = await connection.execute(query, [_data.kleur])
         console.log('results checkKastgroottekleur', results)
         if (results[0][kastgrootte] === 1) {
            console.log('Kastgrootte zelfde als vorige', kastgrootte, results[0][kastgrootte])
            return kastgrootte
         } else {
            switch (_data.kastgrootte) {
               case 137:
                  console.log('Kastgrootte 137 gevonden, 150 voorzien')
                  return 150

               case 150:
                  console.log('Kastgrootte 150 gevonden, 165 voorzien')
                  return 165

               case 165:
                  console.log('Kastgrootte 165 gevonden, 180 voorzien')
                  return 180

               case 180:
                  console.log('Kastgrootte 180 gevonde, 205 voorzien')
                  return 205

               case 205:
                  return 205

               default:
                  return 205
            }
         }

      } catch (err) {
         console.log('checkKastgrootte error', err)

      } finally {
         if (connection) {
            connection.release();
         }
      }
   }
}

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
router.post('/checkKastgroottekleur', async (req, res) => {
   let connection;

   const _data = req.body.data // {"kleur":xxx,"kastgrootte":xxx}
   if (!_data.kastgrootte || !_data.kleur) {
      res.send(null)
   } else {
      try {
         connection = await pool.promise().getConnection();
         const query = `SELECT * from kleurminitradi WHERE kleur  = ?`
         const [results] = await connection.promise().execute(query, [_data.kleur])
         console.log('results checkKastgroottekleur', results)
         if (results[0][_data.kastgrootte] === 1) {
            console.log('Kastgrootte zelfde als vorige', _data.kastgrootte, results[0][_data.kastgrootte])
            res.send({
               "kastgrootte": _data.kastgrootte,
               "success": true
            })
         } else {
            switch (_data.kastgrootte) {
               case 137:
                  console.log('Kastgrootte 137 gevonden, 150 voorzien')
                  res.send({
                     "kastgrootte": 150,
                     "success": false
                  })

               case 150:
                  console.log('Kastgrootte 150 gevonden, 165 voorzien')
                  res.send({
                     "kastgrootte": 165,
                     "success": false
                  })

               case 165:
                  console.log('Kastgrootte 165 gevonden, 180 voorzien')
                  res.send({
                     "kastgrootte": 180,
                     "success": false
                  })

               case 180:
                  console.log('Kastgrootte 180 gevonde, 205 voorzien')
                  res.send({
                     "kastgrootte": 205,
                     "success": false
                  })

               case 205:
                  console.log('Kastgrootte 205 gevonden')
                  res.send({
                     "kastgrootte": 205,
                     "success": false
                  })

               default:
                  console.log('kastgrootte niet gevonden 205 voorzien', )
                  res.send({
                     "kastgrootte": 205,
                     "success": false
                  })
            }
         }

      } catch (err) {
         console.log('checkKastgrootte error', err)

      } finally {
         if (connection) {
            connection.release();
         }
      }
   }
})
router.post('/zoektypelamel', async (req, res) => {
   let connection;
   try {
      console.log('zoektypelamel req data', req.body.data)
      const data = await checkKast(req.body.data.breedte, req.body.data.hoogte, req.body.data.afwerking, req.body.data.afwerkingdata, req.body.data.data, req.body.data.kleurlamel)
      console.log('data checkKast', data)
      var nieuweData = []
      if (data.length > 0) {
         for (const [index, lamel] of data.entries()) {
            nieuweData.push({
               "benaming": lamel.lamel.benaming,
               "omschrijving": lamel.lamel.omschrijving,
               "kastgrootte": lamel.kastgrootte
            })
         }

      } else {
         console.log('geen data gevonden')
      }
      console.log('nieuweData', nieuweData)
      res.send(nieuweData)




      // connection
      //       connection = await pool.promise().getConnection();
      //       const _data = req.body.data

      //       //Zoeken naar de juiste benaming van het typebediening.
      //       const query = "SELECT typedatabase FROM vzrbediening WHERE benaming = ?"
      //       const [results] = await connection.execute(query, [_data.data])
      //       if (results.length > 0) {
      //          const _type = (data) => {
      //             console.log('type zoektypelamel', data)
      //             switch (data) {
      //                case "gaposasensesolar":
      //                case "somfyiosolar":
      //                   return "solar"
      //                case "schakelaar":
      //                case "somfyio":
      //                   return "motor"

      //                default:
      //                   return data
      //             }
      //          }
      //          const _nieuweType = _type(results[0].typedatabase)

      //          //zoeken naar de juiste afwerking data.
      //          const queryafwerking = "SELECT data FROM typeafwerking WHERE benaming = ?"
      //          const [resultafwerking] = await connection.execute(queryafwerking, [_data.afwerking])
      //          console.log('afwerking', resultafwerking)

      //          //oppervlak berekenen met de juiste afwerking.
      //          const _oppervlak = (_data.breedte + resultafwerking.breedte) * _data.hoogte
      //          console.log('zoeklamel type', _type(results[0].typedatabase))
      //          //zoeken naar de juiste kastgrootte & de lamel ervan.
      //          const querykast = `SELECT * FROM vzrkasthoogte WHERE 
      //          type = ? 
      //          AND maxoppervlak >= ? 
      //          AND minbreedte <= ? 
      //          AND maxbreedte >= ?
      //          AND maxhoogte  >= ?
      //          AND hoogte >= ?`
      //          const [resultskast] = await connection.execute(querykast, [_nieuweType, _oppervlak, _data.breedte, _data.breedte, _data.hoogte, _data.hoogte])
      //          console.log('ZOEKTYPELAMEL results2', resultskast)

      //          let smallestKastPerLamel = {};

      //          for (const item of resultskast) {
      //             const currentLamel = item.lamel;
      //             if (!smallestKastPerLamel[currentLamel] || item.kast < smallestKastPerLamel[currentLamel].kast) {
      //                smallestKastPerLamel[currentLamel] = item;
      //             }
      //          }

      //          const filteredResults = Object.values(smallestKastPerLamel);
      //          var nieuweKasthoogte = []
      //          for (const kast of filteredResults) {
      //             const _nieuweHoogte = _data.hoogte + kast.kast
      //             const _nieuwOppervlak = (_data.breedte + resultafwerking.breedte) * _nieuweHoogte
      //             const querykast2 = `SELECT * FROM vzrkasthoogte WHERE 
      //    type = ? 
      //    AND maxoppervlak >= ? 
      //    AND minbreedte <= ? 
      //    AND maxbreedte >= ?
      //    AND maxhoogte  >= ?
      //    AND hoogte >= ?`
      //             const [resultskast2] = await connection.execute(querykast2, [_nieuweType, _nieuwOppervlak, _data.breedte, _data.breedte, _nieuweHoogte, _nieuweHoogte])
      //             console.log('ZOEKTYPELAMEL results2', resultskast2)
      //             resultskast2.forEach((element, index) => {
      //                if (index === 0) {
      //                   nieuweKasthoogte = [element]
      //                } else {
      //                   nieuweKasthoogte.push(element)
      //                }
      //             });

      //          }
      //          let smallestKastPerLamel2 = {};
      //          for (const item of nieuweKasthoogte) {
      //             const currentLamel = item.lamel;
      //             if (!smallestKastPerLamel2[currentLamel] || item.kast < smallestKastPerLamel2[currentLamel].kast) {
      //                smallestKastPerLamel2[currentLamel] = item;
      //             }
      //          }

      //          const filteredResults2 = Object.values(smallestKastPerLamel2);
      //          console.log('filteredresults 2', filteredResults2)


      //          var nieuweKasthoogte2 = []
      //          for (const kast of filteredResults2) {
      //             const _nieuweHoogte2 = _data.hoogte + kast.kast
      //             const _nieuwOppervlak = (_data.breedte + resultafwerking.breedte) * _nieuweHoogte2
      //             const querykast3 = `SELECT * FROM vzrkasthoogte WHERE 
      //     type = ? 
      //     AND maxoppervlak >= ? 
      //     AND minbreedte <= ? 
      //     AND maxbreedte >= ?
      //     AND maxhoogte  >= ?
      //     AND hoogte >= ?`
      //             const [resultskast3] = await connection.execute(querykast3, [_nieuweType, _nieuwOppervlak, _data.breedte, _data.breedte, _nieuweHoogte2, _nieuweHoogte2])
      //             console.log('ZOEKTYPELAMEL results2', resultskast3)
      //             resultskast3.forEach((element, index) => {
      //                if (index === 0) {
      //                   nieuweKasthoogte2 = [element]
      //                } else {
      //                   nieuweKasthoogte2.push(element)
      //                }
      //             });

      //          }
      //          let smallestKastPerLamel3 = {};
      //          for (const item of nieuweKasthoogte2) {
      //             const currentLamel = item.lamel;
      //             if (!smallestKastPerLamel3[currentLamel] || item.kast < smallestKastPerLamel3[currentLamel].kast) {
      //                smallestKastPerLamel3[currentLamel] = item;
      //             }
      //          }

      //          const filteredResults3 = Object.values(smallestKastPerLamel3);
      //          console.log('filteredresults 2', filteredResults3)



      //          console.log("filtered results2", filteredResults2);
      //          if (resultafwerking.hoogte === 0) {
      //             if (filteredResults.length > 0) {
      //                res.send(filteredResults)
      //             } else {
      //                res.send("error")
      //             }
      //          } else {
      //             if (filteredResults3.length > 0) {
      //                res.send(filteredResults3)
      //             } else {
      //                res.send("error")
      //             }
      //          }
      //       } else {
      //          console.log('error')

      //       }



   } catch (err) {
      console.error('Error zoeklamel', err)
   } finally {
      if (connection) {
         connection.release();
      }
   }
})


router.post('/zoekkleurlamel', async (req, res) => {
   let connection;
   try {
      // connection
      console.log("ZOEKKLEURLAMEL", req.body.data)
      connection = await pool.promise().getConnection();
      const query = `SELECT * FROM kleurminitradi WHERE ${req.body.data} = 1`
      const [results] = await connection.execute(query, [req.body.data])
      console.log('query', results)
      if (results.length > 0) {
         res.send(results)
      } else {
         res.send("error")
      }

   } catch (err) {
      console.error('ZOEKLAMEL ERROR', err)
   } finally {
      if (connection) {
         connection.release();
      }
   }
})

router.post('/afwerkingdag', async (req, res) => {
   console.log('afwerkingdag gestart')
   let connection;
   try {
      // connection
      console.log("zoek afwerkingdag", req.body.data)
      connection = await pool.promise().getConnection();
      const query = `SELECT * FROM typeafwerking WHERE voorzet = 1`
      const [results] = await connection.execute(query)
      console.log('query', results)
      if (results.length > 0) {
         res.send(results)
      } else {
         res.send("error")
      }

   } catch (err) {
      console.error('Zoek afwerkingdag ERROR', err)
   } finally {
      if (connection) {
         connection.release();
      }
   }
})


router.post('/zoekgeleiderstoppen', async (req, res) => {
   console.log('zoekgeleiderstoppen gestart')
   let connection;
   try {
      // connection
      connection = await pool.promise().getConnection();
      const query = `SELECT * FROM geleiderstoppen`
      const [results] = await connection.execute(query)
      console.log('query', results)
      if (results.length > 0) {
         res.send(results)
      } else {
         res.send("error")
      }

   } catch (err) {
      console.error('Zoekgeleiderstoppen ERROR', err)
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
      const query = 'SELECT data FROM typeafwerking WHERE benaming = ? AND voorzet = 1'
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


router.post('/zoekkastkleur', async (req, res) => {
   let connection;
   try {
      // connection
      console.log("zoekkastkleur", req.body.data)
      connection = await pool.promise().getConnection();
      const query = `SELECT * FROM kleurminitradi WHERE kastkleur = 1`
      const [results] = await connection.execute(query)
      console.log('query', results)
      if (results.length > 0) {
         res.send(results)
      } else {
         res.send("error")
      }

   } catch (err) {
      console.error('ZOEKKASTKLEUR ERROR', err)
   } finally {
      if (connection) {
         connection.release();
      }
   }
})

router.post('/zoekral', async (req, res) => {
   let connection;
   try {
      // connection
      console.log("zoekral", req.body.data)
      connection = await pool.promise().getConnection();
      const query = `SELECT * FROM rallijst`
      const [results] = await connection.execute(query)
      console.log('query', results)
      if (results.length > 0) {
         res.send(results)
      } else {
         res.send("error")
      }

   } catch (err) {
      console.error('ZOEKKASTKLEUR ERROR', err)
   } finally {
      if (connection) {
         connection.release();
      }
   }
})
router.post('/zoekkastbinnenbuiten', async (req, res) => {
   let connection;
   try {
      // connection
      connection = await pool.promise().getConnection();
      const query = "SELECT * FROM vzrbedieningskant where ?? = 1"
      const [results] = await connection.query(query, [req.body.data])
      console.log('results', results)
      if (results.length > 0) {
         res.send(results)
      } else {
         res.send("error")
      }

   } catch (err) {} finally {
      if (connection) {
         connection.release();
      }
   }

})

router.post('/zoekkastgrootte', async (req, res) => {
   let connection;
   try {
      // connection
      const _data = req.body.data

      const _nieuweKastgrootte = await fetchKast(_data.kastdata, _data.kleurlamel)
      if (results.length > 0) {
         res.send(_nieuweKastgrootte)
      } else {
         res.send("error")
      }

   } catch (err) {

   } finally {
      if (connection) {
         connection.release();
      }
   }
})

router.post('/zoekgeleiders', async (req, res) => {
   let connection;
   try {
      // connection
      connection = await pool.promise().getConnection();
      const query = "SELECT * FROM typevzrgeleiders"
      const [results] = await connection.execute(query)
      console.log('results zoekgeleiders', results)
      if (results.length > 0) {
         res.send(results)
      } else {
         res.send("error")
      }

   } catch (err) {

   } finally {
      if (connection) {
         connection.release();
      }
   }
})
router.post('/zoekbedieningskant', async (req, res) => {
   let connection;
   try {
      console.log('zoekbedieningskant', req.body.data)
      if (req.body.data === "afstandsbedieningsolar") {
         connection = await pool.promise().getConnection();
         const query = "SELECT * FROM vzrbedieningskant WHERE solar = 1"
         const [results] = await connection.execute(query)
         console.log('results zoekbedieningskant', results)
         if (results.length > 0) {
            res.send(results)
         } else {
            res.send("error")
         }
      } else if (req.body.data === "manueel") {
         connection = await pool.promise().getConnection();
         const query = "SELECT * FROM vzrbedieningskant WHERE manueel = 1"
         const [results] = await connection.execute(query)
         console.log('results zoekbedieningskant', results)
         if (results.length > 0) {
            res.send(results)
         } else {
            res.send("error")
         }
      } else {
         connection = await pool.promise().getConnection();
         const query = "SELECT * FROM vzrbedieningskant WHERE motor = 1"
         const [results] = await connection.execute(query)
         console.log('results zoekbedieningskant', results)
         if (results.length > 0) {
            res.send(results)
         } else {
            res.send("error")
         }
      }
      // connection


   } catch (err) {

   } finally {
      if (connection) {
         connection.release();
      }
   }
})


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
         console.log('Query voorzetrolluik -> winkelmand')
         console.log(query)
         console.log(data)
         /*TODO*/
         /* BEKIJKEN OF DE MATEN NIET TE GROOT ZIJN! */
         const newData = await connection.execute(query, values)

         // const [afwerking] = await connection.execute(`SELECT data FROM typeafwerking WHERE benaming = ? AND type = rolluikblad`,[req.body.data.typeafwerking])
         console.log('afwerking', afwerking)

         if (newData.length > 0) {
            console.log('results insertinto winkelmand', newData)
            //stuur het resultaat naar de database
            res.json(data);
         } else {
            console.log("geen waarde 2de query");
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

function returnMogelijkeKastgroottes(kastdata){
switch (kastdata) {
   case 137:
      return [137, 150, 165, 180, 205]
      break;
      case 150:
      return [150, 165, 180, 205]
      break;
      case 165:
       return [165, 180, 205]
      break;
      case 180:
       return [180, 205]
      break;
      case 205:
         return [205]
      break;


   default:
      
      break;
}

}
function returnMogelijkeTypelamel(typelamel){
   switch (typelamel) {
      case "pvc42":
         return ["pvc42", "alu42", "ultra42", "ultra52"]
         break;
      case "alu42":
         return ["alu42", "ultra42", "ultra52"]
         break;
         case "ultra42":
         return ["ultra42", "ultra52"]
         break;
         case "ultra52":
          return ["ultra52"]
         break;
         case 180:
          return [180, 205]
         break;
         case 205:
            return [205]
         break;
   
   
      default:
         
         break;
   }
   
   }
router.post('/berekenMogelijkeKastgroottes', async (req, res) => {
   let connection;
   const _data = req.body.data
   
   try {
      connection = await pool.promise().getConnection();
      //NOTE: Zoek welke database nodig is.
      const typebedieningDBQuery = `SELECT typedatabase FROM vzrbediening WHERE benaming = '${_data.typelintofmotor}'`
      const [typebedieningDBResults] = await connection.execute(typebedieningDBQuery)
      console.log('typebedieningDBResults', typebedieningDBResults)
      //NOTE: Indien de database gevonden is, bereken de mogelijke kastgroottes
      if (typebedieningDBResults && typebedieningDBResults.length > 0) {
         var _breedte = _data.breedte
         var _hoogte = _data.hoogte
         //NOTE: Bereken eerst de juiste breedtes voor de kast
         for (const [index,data] of _data.afwerkingdag.afwerkingdag.entries()) {
            if(data.breedte && data.breedte > 0){
               //Indien breedte gevonden, toevoegen aan de nieuwe breedte.
               nieuweBreedte += data.breedte
            }
            if(data.hoogte && data.hoogte === "kast"){
               //Indien kast gevonden is....
               //TODO: Bereken mogelijke kastgroottes.

            }
         }
         const _typedatabase = "vzr" + _data.typelamel.toLowerCase() + typebedieningDBResults[0].typedatabase
         
         const query = `SELECT ?? FROM ?? WHERE hoogte = ?`;
         const [results] = await connection.query(query,[_breedte, _typedatabase, _hoogte])

         if (results.length > 0) {
            res.send(results)
         } else {
            res.send("error")
         }
      } else {
         res.send("error")
      }


   } catch (err) {
      console.log('error', err)
   } finally {
      if (connection) {
         connection.release();
      }
   }
})
module.exports = router;

/*
BASIS STRUCTUUR

router.post('/**LINK**',async (req,res)=>{
   let connection;
   try{
      // connection
      connection = await pool.promise().getConnection();
      const query = "**QUERY STRING**"
      const [results] = await connection.execute(query,["**DATA**"])
      if(results.length > 0){
         res.send(results)
      } else {
         res.send("error")
      }

   } catch(err){

   } finally {
      if (connection) {
         connection.release();
      }
   }
})






*/