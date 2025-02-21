const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Caminho da pasta onde estão as thumbnails
const thumbnailsPath = path.join(__dirname, "../assets/thumbnails");

// Rota para listar os arquivos da pasta thumbnails
router.get("/", (req, res) => {
    fs.readdir(thumbnailsPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao listar thumbnails" });
        }
        res.json(files);
    });
});

module.exports = router;
