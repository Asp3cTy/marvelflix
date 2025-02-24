const express = require("express");
const { queryD1 } = require("../d1");
const router = express.Router();

// Listar todas as coleções
router.get("/", async (req, res) => {
  try {
    const collections = await queryD1("SELECT * FROM collections");
    res.json(collections.length > 0 ? collections : []);
  } catch (error) {
    console.error("Erro ao buscar coleções:", error);
    res.status(500).json({ message: "Erro ao buscar coleções no banco de dados." });
  }
});

// Adicionar nova coleção (suporta /api/collections e /api/collections/add)
router.post(["/", "/add"], async (req, res) => { 
  const { name, image } = req.body;

  if (!name || !image) {
    return res.status(400).json({ message: "Nome e imagem são obrigatórios." });
  }

  try {
    const result = await queryD1(
      "INSERT INTO collections (name, image) VALUES (?, ?)",
      [name, image]
    );
    res.status(201).json({ message: "Coleção adicionada com sucesso!", id: result.lastInsertRowid });
  } catch (error) {
    console.error("Erro ao adicionar coleção:", error);
    res.status(500).json({ message: "Erro ao adicionar coleção." });
  }
});

module.exports = router;
