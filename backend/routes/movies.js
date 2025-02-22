const express = require("express");
const router = express.Router();
const { queryD1 } = require("../server");
const bunnyApi = require("../config/bunnystream");
const generateBunnyToken = require("../config/bunnytoken");

// ✅ Criar um novo filme
router.post("/", async (req, res) => {
    const { title, collection_id, url, cover_url } = req.body;

    if (!title || !collection_id || !url || !cover_url) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    try {
        const result = await queryD1(
            "INSERT INTO movies (title, collection_id, url, cover_url) VALUES (?, ?, ?, ?)", 
            [title, collection_id, url, cover_url]
        );

        res.status(201).json({ message: "Filme adicionado!", id: result.lastInsertRowid });
    } catch (error) {
        console.error("Erro ao adicionar filme:", error);
        res.status(500).json({ message: "Erro ao adicionar filme" });
    }
});

// ✅ Buscar todos os filmes de uma coleção
router.get("/", async (req, res) => {
    const { collection_id } = req.query;

    if (!collection_id) {
        return res.status(400).json({ message: "O parâmetro collection_id é obrigatório" });
    }

    try {
        const movies = await queryD1("SELECT * FROM movies WHERE collection_id = ?", [collection_id]);

        if (movies.length === 0) {
            return res.status(404).json({ message: "Nenhum filme encontrado para esta coleção" });
        }

        res.json(movies);
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        res.status(500).json({ message: "Erro ao buscar filmes" });
    }
});

// ✅ Buscar detalhes do vídeo no BunnyStream
router.get("/bunnystream/:movieId", async (req, res) => {
    const { movieId } = req.params;

    try {
        const response = await bunnyApi.get(`/${movieId}`);
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao buscar vídeo no BunnyStream:", error);
        res.status(500).json({ message: "Erro ao buscar vídeo" });
    }
});

// ✅ Buscar informações do filme pelo ID
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

// ✅ Gerar URL segura para assistir ao vídeo
router.get("/secure-video/:movieId", async (req, res) => {
    const { movieId } = req.params;

    if (!movieId) {
        return res.status(400).json({ message: "ID do filme é obrigatório" });
    }

    try {
        const result = await queryD1("SELECT url FROM movies WHERE id = ?", [movieId]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Filme não encontrado" });
        }

        let videoId = result[0].url;

        // Se a URL for completa, extrair apenas o ID do vídeo
        if (videoId.includes("iframe.mediadelivery.net")) {
            const regex = /\/([a-f0-9\-]+)\?/;
            const match = videoId.match(regex);
            if (match) {
                videoId = match[1]; // Extrai apenas o ID
            }
        }

        const secureUrl = generateBunnyToken(videoId);
        res.json({ secureUrl });
    } catch (error) {
        console.error("Erro ao buscar vídeo:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
});

// ✅ Adicionar um novo filme
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

module.exports = router;
