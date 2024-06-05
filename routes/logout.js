const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Verwijder de gebruiker uit de sessie
  console.log('user destroyed', req.session.user.bedrijf)
  req.session.destroy();

  // Stuur de gebruiker terug naar de homepagina
  res.redirect('/');
});


module.exports = router;