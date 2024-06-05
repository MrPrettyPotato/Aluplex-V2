const express = require('express');
const multer = require('multer');
const ptp = require('pdf-to-printer')
const fs = require('fs');

const app = express();
const port = 3002;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.post('/print', upload.single('file'), (req, res) => {
  const fileBuffer = req.file.buffer;

  // Genereer een unieke bestandsnaam
  const fileName = `output_${Date.now()}.pdf`;

  // Schrijf de fileBuffer naar een PDF-bestand
  fs.writeFileSync(fileName, fileBuffer);

  // Roep de printfunctie aan met de gegenereerde bestandsnaam
  ptp.print(fileName)
    .then(() => {
      console.log('Printen geslaagd');
      // Optioneel: Verwijder het gegenereerde PDF-bestand als je dat wilt
      fs.unlinkSync(fileName);
      res.send('Printen geslaagd');
    })
    .catch((err) => {
      console.error('Fout tijdens het printen', err);
      res.status(500).send('Fout tijdens het printen');
    });
});

app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});

