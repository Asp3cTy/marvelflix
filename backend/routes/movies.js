const express = require("express");
const router = express.Router();
const { queryD1 } = require("../d1");

router.post("/add", async (req, res) => {
  const { title, collection_id, url, cover_url, duration } = req.body;

  if (!title || !collection_id || !url || !cover_url || !duration) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
  }

  try {
    const result = await queryD1(
      "INSERT INTO movies (title, collection_id, url, cover_url, duration) VALUES (?, ?, ?, ?, ?)",
      [title, collection_id, url, cover_url, duration]
    );

    res.status(201).json({ message: "Filme adicionado com sucesso!", id: result.lastInsertRowid });
  } catch (error) {
    console.error("Erro ao adicionar filme:", error);
    res.status(500).json({ message: "Erro ao adicionar filme" });
  }
});

router.get("/", async (req, res) => {
  const { collection_id } = req.query;
  if (!collection_id) {
    return res.status(400).json({ message: "O parâmetro collection_id é obrigatório" });
  }

  try {
    const movies = await queryD1(
      "SELECT * FROM movies WHERE collection_id = ?",
      [collection_id]
    );
    if (movies.length === 0) {
      return res.status(404).json({ message: "Nenhum filme encontrado para esta coleção" });
    }
    res.json(movies);
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    res.status(500).json({ message: "Erro ao buscar filmes" });
  }
});

router.get("/:movieId", async (req, res) => {
  const { movieId } = req.params;
  try {
    const result = await queryD1("SELECT * FROM movies WHERE id = ?", [movieId]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Filme não encontrado" });
    }
    res.json(result[0]);
  } catch (error) {
    console.error("Erro ao buscar filme:", error);
    res.status(500).json({ message: "Erro ao buscar filme" });
  }
});

router.get("/secure-video/:movieId", async (req, res) => {
  // Se tiver lógica de gerar URL segura do player, mantenha
  // Se não quiser, pode remover
  return res.json({ secureUrl: "https://exemplo.com" });
});

module.exports = router;
