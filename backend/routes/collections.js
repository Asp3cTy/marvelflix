const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const db = require("../config/db");

// 🗂️ Configuração do armazenamento para salvar as imagens das coleções
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "assets/thumbnails"); // Pasta onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renomeia o arquivo com timestamp
    }
});
const upload = multer({ storage });

// 🚀 Rota para listar todas as coleções
router.get("/", (req, res) => {
    db.all("SELECT * FROM collections", [], (err, rows) => {
        if (err) return res.status(500).json({ message: "Erro ao buscar coleções" });
        res.json(rows);
    });
});

// 🚀 Rota para buscar uma coleção específica por ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM collections WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ message: "Erro ao buscar coleção" });
        if (!row) return res.status(404).json({ message: "Coleção não encontrada" });
        res.json(row);
    });
});

// 🚀 Rota para criar coleção (com ou sem imagem)
router.post("/add", upload.single("image"), (req, res) => {
    const { name } = req.body;
    const imageUrl = req.file ? `/thumbnails/${req.file.filename}` : null; // Caminho da imagem no servidor

    if (!name) {
        return res.status(400).json({ message: "O nome da coleção é obrigatório!" });
    }

    db.run(
        "INSERT INTO collections (name, image_url) VALUES (?, ?)",
        [name, imageUrl],
        function (err) {
            if (err) return res.status(500).json({ message: "Erro ao adicionar coleção" });

            res.json({ id: this.lastID, name, image_url: imageUrl });
        }
    );
});

module.exports = router;

