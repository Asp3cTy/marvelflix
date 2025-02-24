const express = require("express");
const router = express.Router();
const { queryD1 } = require("../d1");

// Adicionar filme
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
    res.status(500).json({ message: "Erro ao adicionar filme no banco de dados." });
  }
});

// Buscar filmes (TODOS ou por coleção)
router.get("/", async (req, res) => {
  const { collection_id } = req.query;

  try {
    let sql = "SELECT * FROM movies";
    let params = [];

    if (collection_id) {
      sql += " WHERE collection_id = ?";
      params.push(collection_id);
    }

    const movies = await queryD1(sql, params);

    if (!movies || movies.length === 0) {
      return res.status(200).json([]); // Retorna array vazio ao invés de erro
    }

    res.json(movies);
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    res.status(500).json({ message: "Erro ao buscar filmes no banco de dados." });
  }
});

// Buscar filme por ID
router.get("/:movieId", async (req, res) => {
  const { movieId } = req.params;
  try {
    const result = await queryD1("SELECT * FROM movies WHERE id = ?", [movieId]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Filme não encontrado" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Erro ao buscar filme:", error);
    res.status(500).json({ message: "Erro ao buscar filme." });
  }
});

module.exports = router;
