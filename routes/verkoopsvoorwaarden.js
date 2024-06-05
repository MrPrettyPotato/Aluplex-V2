const express = require('express');
const router = express.Router();

console.log("Verkoopsvoorwaarde router")
router.get('/', function (req, res, ) {

  res.render('verkoopsvoorwaarden', {
    req: req,
    user: req.session.user,
    logged_in: req.isAuthenticated()
  });
});

module.exports = router;