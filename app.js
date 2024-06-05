/*
TO-DO Lijst
- Login check op elke pagina toepassen zoals bij winkelmand (Routes)
- Toevoegen aan offerte & bestellingen (Database & pagina)
- PDF aanmaken en doormailen
- Toevoegen aan planning


*/

const PDFDocument = require('pdfkit');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const path = require('path');
const routes = require('./routes');
const session = require('express-session');
const connection = require('./backend/database/connection');
const poolLOG = require('./backend/database/connectionLOG');





//Importeer public routes
const productfoldersRouter = require('./routes/productfolders');
const rolluikenRoutes = require('./routes/rolluiken');
const rolluikbladRoutes = require('./routes/rolluikblad');
const tradirolluikRoutes = require('./routes/tradirolluik');
const voorzetrolluikRoutes = require('./routes/voorzetrolluik');
const screensRoutes = require('./routes/screens');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');
const frontendRoutes = require('./routes/frontend');
const testRoute = require('./routes/test');
const cartRoutes = require('./routes/cart');
const offertesRouter = require('./routes/offertes');
const planningRouter = require('./routes/planning');
const bestellingRouter = require('./routes/bestelling');
const usersRouter = require('./routes/users/users');
const vliegenraamRouter = require('./routes/calculator/vliegenramen/vliegenraam');
const schuifvliegendeurRouter = require('./routes/calculator/vliegenramen/schuifvliegendeur');
const vliegendraaideurRouter = require('./routes/calculator/vliegenramen/vliegendraaideur');
const deurplisseRouter = require('./routes/calculator/vliegenramen/deurplisse');
const raamplisseRouter = require('./routes/calculator/vliegenramen/raamplisse');
const prijslijstenRouter = require('./routes/prijslijsten');
const bestelbonnenRouter = require('./routes/bestelbonnen');

const verkoopsvoorwaardenRouter = require('./routes/verkoopsvoorwaarden');
const sitemapRouter = require('./routes/sitemap');




//admin routes
const admin = require('./routes/admin');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
//ongeautoriseerde routes
const geoip = require('geoip-lite');
const ipfilter = require('express-ipfilter').IpFilter;
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');



let blockedIps = new Set();

// Functie om geblokkeerde IP-adressen bij te werken
async function updateBlockedIps() {
  let connection = await poolLOG.promise().getConnection()
    try {
        const [rows, fields] = await connection.execute('SELECT ip_adres FROM blocked_ip');
        blockedIps = new Set(rows.map(row => row.ip_adres));
        // console.log('Geblokkeerde IP-adressen bijgewerkt:', blockedIps);
    } catch (err) {
        console.error('Fout bij het bijwerken van geblokkeerde IP-adressen:', err);
    } finally {
      if(connection) {
        connection.release();
      }
    }
}

setInterval(updateBlockedIps, 30000); // Elke halveminuut bijwerken


const limiter = rateLimit({
  windowMs: 20 * 1000, // 20 seconden
  max: 10, // Limiet elk IP tot 10 aanvragen per `window` (hierboven)
  handler: function (req, res, /* next */) {
    const ipAdres = req.ip;
    blockIp(ipAdres); // Blokkeer dit IP-adres
    res.status(429).send('Te veel aanvragen, je bent tijdelijk geblokkeerd.');
  },
  keyGenerator: function (req /*, res */) {
    return req.ip; // Gebruik het IP-adres van de aanvrager als sleutel
  },
  skipSuccessfulRequests: true // Alleen mislukte verzoeken tellen mee voor de limiet
});

async function blockIp(ipAdres) {
  try {
    if(ipAdres !== "::1" || ipAdres !== "127.0.0.1") {
      blockedIps.add(ipAdres);
    const query = 'INSERT INTO blocked_ip (ip_adres, reden) VALUES (?, ?) ON DUPLICATE KEY UPDATE reden = VALUES(reden)';
    await poolLOG.execute(query, [ipAdres, 'Te veel aanvragen in korte tijd']);
    console.log(`IP geblokkeerd: ${ipAdres}`);
    }
  } catch (error) {
    console.error('Fout bij het blokkeren van IP:', error);
  }
}
app.use(limiter);
// app.use(helmet());

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;
// app.use(ipfilter(blockedIps, ipFilterOptions));

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  console.log('payload received', jwt_payload);
  // Fetch the user from the database
  connection.query('SELECT * FROM klanten WHERE id = ?', [jwt_payload.id], (error, results, fields) => {
    if (error) {
      next(error, false);
    }
    if (results.length > 0) {
      const user = results[0];
      next(null, user);
    } else {
      next(null, false);
    }
    connection.end()
  });
});

app.use(morgan('dev'));

passport.use(strategy);

// EJS setup
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Afhankelijk van je behoeften
    maxAge: 24 * 60 * 60 * 1000 // Een dag in milliseconden
  }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(bodyParser.json({limit :'50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));

// Zet de public routes naar de juiste Routes
app.use('/',routes);
app.use('/rolluiken',rolluikenRoutes);
app.use('/rolluikblad',rolluikbladRoutes);
app.use('/tradirolluik',tradirolluikRoutes);
app.use('/voorzetrolluik', voorzetrolluikRoutes);
app.use('/screens',screensRoutes);
app.use('/register',registerRoutes);
app.use('/login',loginRoutes);
app.use('/logout',logoutRoutes);
app.use('/frontend',frontendRoutes);
app.use('/cart',cartRoutes);
app.use('/test',testRoute);
app.use('/offertes', offertesRouter);
app.use('/admin', admin);
app.use('/planning', planningRouter);
app.use('/bestelling', bestellingRouter);
app.use('/users', usersRouter);
app.use('/vliegenraam', vliegenraamRouter);
app.use('/schuifvliegendeur', schuifvliegendeurRouter);
app.use('/vliegendraaideur', vliegendraaideurRouter);
app.use('/deurplisse', deurplisseRouter);
app.use('/raamplisse', raamplisseRouter);
app.use('/productfolders', productfoldersRouter);
app.use('/prijslijsten', prijslijstenRouter);
app.use('/bestelbonnen', bestelbonnenRouter);
app.use('/verkoopsvoorwaarden', verkoopsvoorwaardenRouter);
app.use('/sitemap', sitemapRouter);


app.use(async (req, res, next) => {
  let connection;
  if (!req.session.user) { // Als de gebruiker niet is ingelogd
    // Voer de logica uit om het IP-adres, geolocatie, tijdstip, en de URL te loggen
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);
    const land = geo?.country || 'Onbekend';
    const stad = geo?.city || 'Onbekend';
    const url = req.originalUrl;
    const tijdstip = new Date().toISOString();

    // Verondersteld dat je al een verbinding hebt met je MySQL-database
    try {
      connection = await poolLOG.promise().getConnection();
      if (blockedIps.has(ip)) {
        return res.status(403).send('Jouw toegang is geblokkeerd.');
    }
    if(ip === "::1" || ip === "127.0.0.1"){
      console.log('localhost')
    } else {
      await connection.execute('INSERT INTO toegangspogingen (ip_adres, land, stad, tijdstip, url) VALUES (?, ?, ?, ?, ?)', 
      [ip, land, stad, tijdstip, url]);
      console.log(`Verdachte toegangspoging opgeslagen: IP=${ip}, URL=${url}`);
    }
    } catch (error) {
      console.error('Fout bij het opslaan in de database:', error);
    } finally {
      connection.release();
    }
    
    // Optioneel: Stuur een algemene foutmelding of een 404, afhankelijk van je voorkeur
    res.status(404).send('Deze bron is niet beschikbaar.');
  } else {
    next(); // Als de gebruiker is ingelogd, ga dan verder met de volgende middleware/route
  }
});
//  Handle all other errors
 app.use('*',(err, req, res, next) => {
   res.status(err.status || 500);
   res.send({
     message: err.message,
     error: {}
   });
 });

 

 const PORT = process.env.PORT || 3001;
 app.listen(PORT, () => {
   console.log(`Server is running on PORT ${PORT}`);
   updateBlockedIps();
   
 });


