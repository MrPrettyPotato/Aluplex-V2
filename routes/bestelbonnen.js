const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.user) {

        res.render('bestelbons', {
            req: req,
            user: req.session.user,
            logged_in: req.isAuthenticated()
        });
    } else {
        res.render('./home', {
            req: req,
            user: req.session.user,
            logged_in: req.isAuthenticated()

        })
    }


})

module.exports = router