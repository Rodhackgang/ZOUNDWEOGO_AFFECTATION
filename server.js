const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const indexRouter = require('./route');
const app = express();
const port = 3000;

// Activer CORS
app.use(cors());
app.use('/', indexRouter);
// Configuration de multer pour gérer le téléchargement de fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'dev.xlsx'); // Toujours enregistrer sous le même nom
    }
});

const upload = multer({ storage: storage });

// Route pour uploader le fichier Excel
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier uploadé.');
    }

    const filePath = path.join(__dirname, 'uploads/dev.xlsx');
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        // Le fichier existe déjà, demander confirmation pour le remplacer
        return res.json({ message: 'Un fichier existe déjà. Voulez-vous le remplacer ?', replace: true });
    } else {
        // Aucun fichier n'existe, pas besoin de confirmation
        return res.json({ message: 'Fichier téléchargé avec succès !', replace: false });
    }
});

// Route pour obtenir les données du fichier 'dev'
app.get('/latest-file-data', (req, res) => {
    // Chemin du fichier à lire
    const filePath = path.join(__dirname, 'uploads/dev.xlsx');

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Fichier non trouvé.');
    }

    // Lire le fichier Excel
    const workbook = xlsx.readFile(filePath);
    const sheetNameList = workbook.SheetNames;
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

    // Envoyer les données JSON comme réponse
    res.json(jsonData);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});