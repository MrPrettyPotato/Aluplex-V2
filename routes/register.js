//packages
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

//module imports
const registreer = require('../backend/js/register/registreer');

//config data
require('dotenv').config();
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

console.log("Register routes")
//register Page
router.get('/', (req, res) => {
    res.render('register', {
        req: req,
        user: req.session.user,
        logged_in: req.isAuthenticated()
    });
});

const connection = require('../backend/database/connection')

const bcrypt = require('bcrypt');
//register Post
router.post('/register', (req, res) => {
    console.log('register post', req.body);
    registreer(req, res)
});

module.exports = router;







