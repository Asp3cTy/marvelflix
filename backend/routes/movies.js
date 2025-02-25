const express = require("express");
const router = express.Router();
const generateBunnyToken = require("../config/bunnytoken");
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

// Nova rota para gerar URL segura do BunnyStream
router.get("/secure-video/:movieId", async (req, res) => {
  const { movieId } = req.params;

  try {
    // Busca a URL do vídeo no banco de dados
    const result = await queryD1("SELECT url FROM movies WHERE id = ?", [movieId]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Filme não encontrado" });
    }

    const videoUrl = result[0].url;

    // O ID do vídeo deve ser extraído da URL do BunnyStream
    const videoIdMatch = videoUrl.match(/\/([0-9]+)$/);
    if (!videoIdMatch) {
      return res.status(400).json({ message: "URL do BunnyStream inválida" });
    }

    const videoId = videoIdMatch[1]; // Extrai o ID do vídeo

    // Gera o link seguro usando BunnyStream
    const secureVideoUrl = generateBunnyToken(videoId);

    res.json({ secureUrl: secureVideoUrl });
  } catch (error) {
    console.error("Erro ao gerar link seguro:", error);
    res.status(500).json({ message: "Erro ao gerar link do vídeo" });
  }
});



module.exports = router;
