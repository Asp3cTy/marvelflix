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


// Buscar UMA coleção específica por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await queryD1("SELECT * FROM collections WHERE id = ?", [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Coleção não encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar coleção:", error);
    res.status(500).json({ message: "Erro ao buscar coleção." });
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

// Rota para EDITAR coleção
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, image } = req.body;

  if (!name || !image) {
    return res.status(400).json({ message: "Nome e imagem são obrigatórios." });
  }

  try {
    // Faz update
    await queryD1("UPDATE collections SET name = ?, image = ? WHERE id = ?", [name, image, id]);
    res.json({ message: "Coleção atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao editar coleção:", error);
    res.status(500).json({ message: "Erro ao editar coleção." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await queryD1("DELETE FROM collections WHERE id = ?", [id]);
    res.json({ message: "Coleção excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir coleção:", error);
    res.status(500).json({ message: "Erro ao excluir coleção." });
  }
});



module.exports = router;
