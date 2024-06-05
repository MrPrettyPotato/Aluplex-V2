const express = require('express');
const router = express.Router();

router.get('/',isLoggedIn, (req, res) => {
   console.log('rolluiken')
   
   res.render('rolluiken', { req:req,user: req.session.user });
});
function isLoggedIn(req, res, next) {
   if (req.session.user) {
     return next();
   }
   res.redirect('/login');
 }


 router.get('/pdf', (req, res) => {
   if(req.session.user){
  const PDFDocument = require('pdfkit');
  console.log('PDF')
  // Create a new PDF document
  const doc = new PDFDocument();

  // Set the response headers to indicate that we are sending a PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=test.pdf');

  // Pipe the PDF document to the response
  doc.pipe(res);

  // Add some text to the PDF document
  doc.fontSize(20)
     .text('Hello, World!', 100, 100);

  // Finalize the PDF document and end the response
  doc.end();
   }else{
      res.render('./home', {
         req: req,
         user: req.session.user,
         logged_in: req.isAuthenticated()
      })
   }
});
module.exports = router;