const express = require("express");
const { queryD1 } = require("../d1");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Configuração do storage para imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/thumbnails");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const collections = await queryD1("SELECT * FROM collections");
    res.json(collections);
  } catch (error) {
    console.error("Erro ao buscar coleções:", error);
    res.status(500).json({ message: "Erro ao buscar coleções" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await queryD1("SELECT * FROM collections WHERE id = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Coleção não encontrada" });
    }
    res.json(result[0]);
  } catch (error) {
    console.error("Erro ao buscar coleção:", error);
    res.status(500).json({ message: "Erro ao buscar coleção" });
  }
});

router.post("/add", upload.single("image"), async (req, res) => {
  const { name } = req.body;
  const imageUrl = req.file ? `/thumbnails/${req.file.filename}` : null;

  if (!name || !imageUrl) {
    return res.status(400).json({ message: "Nome e imagem são obrigatórios" });
  }

  try {
    const result = await queryD1(
      "INSERT INTO collections (name, image) VALUES (?, ?)",
      [name, imageUrl]
    );
    res.json({ id: result.lastInsertRowid, name, imageUrl });
  } catch (error) {
    console.error("Erro ao adicionar coleção:", error);
    res.status(500).json({ message: "Erro ao adicionar coleção" });
  }
});

module.exports = router;
