// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { queryD1 } = require("./d1");  // Atualize a importação
const authRoutes = require("./routes/auth");
const collectionsRoutes = require("./routes/collections");
const moviesRoutes = require("./routes/movies");
const thumbnailsRoutes = require("./routes/thumbnails");

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API do MarvelFlix está funcionando!');
});

const D1_DATABASE_URL = process.env.D1_DATABASE_URL;
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;

if (!D1_DATABASE_URL || !CLOUDFLARE_API_KEY) {
    console.error("❌ Erro: Variáveis de ambiente D1_DATABASE_URL ou CLOUDFLARE_API_KEY não definidas.");
    process.exit(1);
}

async function createTables() {
    try {
        console.log("📂 Criando/verificando tabelas...");

        await queryD1(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await queryD1(`
            CREATE TABLE IF NOT EXISTS collections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                image TEXT
            )
        `);

        await queryD1(`
            CREATE TABLE IF NOT EXISTS movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                collection_id INTEGER,
                url TEXT NOT NULL,
                cover_url TEXT NOT NULL,
                duration TEXT,
                FOREIGN KEY (collection_id) REFERENCES collections (id)
            )
        `);

        console.log("✅ Banco de dados D1 pronto!");
    } catch (error) {
        console.error("❌ Erro ao criar tabelas:", error);
    }
}

createTables();

app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/thumbnails", thumbnailsRoutes);

app.use("/thumbnails", express.static(path.join(__dirname, "assets/thumbnails")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando na porta ${PORT}`);
});

module.exports = { queryD1 };