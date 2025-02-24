const express = require("express");
const { queryD1 } = require("../d1");
const router = express.Router();

// Buscar TODAS as coleções
router.get("/", async (req, res) => {
  try {
    const collections = await queryD1("SELECT * FROM collections");
    if (!collections || collections.length === 0) {
      return res.status(404).json({ message: "Nenhuma coleção encontrada" });
    }
    res.json(collections);
  } catch (error) {
    console.error("Erro ao buscar coleções:", error);
    res.status(500).json({ message: "Erro ao buscar coleções no banco de dados." });
  }
});

// Buscar coleção por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await queryD1("SELECT * FROM collections WHERE id = ?", [id]);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Coleção não encontrada" });
    }
    res.json(result[0]);
  } catch (error) {
    console.error("Erro ao buscar coleção:", error);
    res.status(500).json({ message: "Erro ao buscar coleção." });
  }
});

module.exports = router;
