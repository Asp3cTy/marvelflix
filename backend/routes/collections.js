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
    console.log("Recebendo requisição para adicionar coleção...");
    console.log("Body recebido:", req.body);
    console.log("Arquivo recebido:", req.file);

    const { name } = req.body;
    const imageUrl = req.file ? `/thumbnails/${req.file.filename}` : null;

    if (!name || !imageUrl) {
        console.error("Erro: Nome ou imagem ausente.");
        return res.status(400).json({ message: "Nome e imagem são obrigatórios" });
    }

    db.run("INSERT INTO collections (name, image) VALUES (?, ?)", [name, imageUrl], function (err) {
        if (err) {
            console.error("Erro ao adicionar coleção no banco:", err);
            return res.status(500).json({ message: "Erro ao adicionar coleção" });
        }
        console.log("Coleção adicionada com sucesso!");
        res.json({ id: this.lastID, name, imageUrl });
    });
});


module.exports = router;

