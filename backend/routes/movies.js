const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bunnyApi = require("../config/bunnystream");
const generateBunnyToken = require("../config/bunnytoken");

// ✅ Criar um novo filme
router.post("/", (req, res) => {
    const { title, collection_id, url, cover_url } = req.body;

    if (!title || !collection_id || !url || !cover_url) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    db.run(
        `INSERT INTO movies (title, collection_id, url, cover_url) VALUES (?, ?, ?, ?)`,
        [title, collection_id, url, cover_url],
        function (err) {
            if (err) return res.status(500).json({ message: "Erro ao adicionar filme" });
            res.status(201).json({ message: "Filme adicionado!", id: this.lastID });
        }
    );
});

// ✅ Buscar todos os filmes de uma coleção corretamente
router.get("/", (req, res) => {
    const { collection_id } = req.query; // Agora busca corretamente via query

    if (!collection_id) {
        return res.status(400).json({ message: "O parâmetro collection_id é obrigatório" });
    }

    db.all(`SELECT * FROM movies WHERE collection_id = ?`, [collection_id], (err, rows) => {
        if (err) return res.status(500).json({ message: "Erro ao buscar filmes" });
        if (rows.length === 0) {
            return res.status(404).json({ message: "Nenhum filme encontrado para esta coleção" });
        }
        res.json(rows);
    });
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
router.get("/:movieId", (req, res) => {
    const { movieId } = req.params;

    db.get("SELECT * FROM movies WHERE id = ?", [movieId], (err, row) => {
        if (err) return res.status(500).json({ message: "Erro ao buscar filme" });
        if (!row) return res.status(404).json({ message: "Filme não encontrado" });

        res.json(row);
    });
});


// ✅ Gerar URL segura para assistir ao vídeo
router.get("/secure-video/:movieId", async (req, res) => {
    const { movieId } = req.params;


    if (!movieId) {
        return res.status(400).json({ message: "ID do filme é obrigatório" });
    }

    try {
        // Buscar o verdadeiro videoId no banco de dados
        const query = "SELECT url FROM movies WHERE id = ?";
        const row = await new Promise((resolve, reject) => {
            db.get(query, [movieId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!row) {
            return res.status(404).json({ message: "Filme não encontrado" });
        }

        let videoId = row.url; // Agora usamos o videoId correto do banco


        // Se a URL estiver completa, extrair apenas o ID do vídeo
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

router.post("/add", (req, res) => {
    const { title, collection_id, url, cover_url, duration } = req.body;

    if (!title || !collection_id || !url || !cover_url || !duration) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    db.run(`INSERT INTO movies (title, collection_id, url, cover_url, duration) VALUES (?, ?, ?, ?, ?)`,
        [title, collection_id, url, cover_url, duration],
        function (err) {
            if (err) return res.status(500).json({ message: "Erro ao adicionar filme" });
            res.status(201).json({ message: "Filme adicionado com sucesso!", id: this.lastID });
        }
    );
});


module.exports = router;
