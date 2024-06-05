const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
        res.render('productfolders', {
            req: req,
            user: req.session.user,
            logged_in: req.isAuthenticated()
        });
    
    
})

module.exports = router