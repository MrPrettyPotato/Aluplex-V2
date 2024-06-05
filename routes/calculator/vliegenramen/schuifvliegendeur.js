const express = require('express');
const router = express.Router();
const pool = require('../../../backend/database/connection')


router.get('/', (req, res) => {

    if (req.session.user) {
        res.render('/vliegenramen/schuifvliegendeur', {
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

})


module.exports = router;