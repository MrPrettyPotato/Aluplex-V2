const express = require('express');
const router = express.Router();

console.log("sitemap  router")
router.get('/', function (req, res, ) {

  res.render('sitemap', {
    req: req,
    user: req.session.user,
    logged_in: req.isAuthenticated()
  });
});

module.exports = router;