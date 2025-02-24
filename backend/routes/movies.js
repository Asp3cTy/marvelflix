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

// Buscar todos os filmes ou filtrados por coleção
router.get("/", async (req, res) => {
  const { collection_id } = req.query;

  try {
    let sql = "SELECT * FROM movies";
    let params = [];

    if (collection_id && collection_id !== "ALL") {
      sql += " WHERE collection_id = ?";
      params.push(collection_id);
    }

    const movies = await queryD1(sql, params);

    res.json(movies.length > 0 ? movies : []);
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    res.status(500).json({ message: "Erro ao buscar filmes no banco de dados." });
  }
});

// ========================
// ROTA PARA BUSCAR UM FILME PELO ID
// ========================
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await queryD1("SELECT * FROM movies WHERE id = ?", [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Filme não encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar filme por ID:", error);
    res.status(500).json({ message: "Erro ao buscar filme." });
  }
});

// Rota para EDITAR filme
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, collection_id, url, cover_url, duration } = req.body;

  if (!title || !collection_id || !url || !cover_url || !duration) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
  }

  try {
    // Faz update
    await queryD1(
      "UPDATE movies SET title = ?, collection_id = ?, url = ?, cover_url = ?, duration = ? WHERE id = ?",
      [title, collection_id, url, cover_url, duration, id]
    );
    res.json({ message: "Filme atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao editar filme:", error);
    res.status(500).json({ message: "Erro ao editar filme." });
  }
});

router.delete("/:movieId", async (req, res) => {
  const { movieId } = req.params;
  try {
    await queryD1("DELETE FROM movies WHERE id = ?", [movieId]);
    res.json({ message: "Filme excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir filme:", error);
    res.status(500).json({ message: "Erro ao excluir filme." });
  }
});

// No arquivo backend/routes/movies.js
router.get("/secure-video/:movieId", async (req, res) => {
  const { movieId } = req.params;

  try {
    // Exemplo: Buscar a URL segura a partir do banco de dados ou gerar dinamicamente
    // Se você já tem uma lógica para gerar uma URL segura, insira aqui.
    // Vou exemplificar retornando a URL do filme, adaptando se necessário.
    const result = await queryD1("SELECT url FROM movies WHERE id = ?", [movieId]);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Filme não encontrado" });
    }
    // Se precisar gerar uma URL segura, adicione a lógica aqui. Exemplo:
    const videoUrl = result[0].url; // ou uma função para gerar a URL segura
    res.json({ secureUrl: videoUrl });
  } catch (error) {
    console.error("Erro ao buscar informações do filme:", error);
    res.status(500).json({ message: "Erro interno ao buscar o filme" });
  }
});



module.exports = router;
