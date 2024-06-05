const express = require('express');
const app = express();
const port = 3000; // or any port you prefer

app.set('view engine', 'ejs');

// Define routes
app.get('/', (req, res) => {
  res.render('index'); // Assuming your EJS file is named index.ejs
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});