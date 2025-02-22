require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require("path");
const authRoutes = require("./routes/auth");
const collectionsRoutes = require('./routes/collections');
const moviesRoutes = require('./routes/movies');
const thumbnailsRoutes = require("./routes/thumbnails");

// Cloudflare D1 (Banco de Dados)
import { D1Database } from '@cloudflare/d1';


// Conectar ao Cloudflare D1
const db = new D1Database({
    databaseId: process.env.D1_DATABASE_ID, // Defina no .env
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    apiKey: process.env.CLOUDFLARE_API_KEY
});

const app = express();
app.use(cors());
app.use(express.json());

// Criar tabelas se não existirem
async function createTables() {
    try {
        console.log("📂 Verificando tabelas...");
        
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `).run();

        await db.prepare(`
            CREATE TABLE IF NOT EXISTS collections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                image TEXT
            )
        `).run();

        await db.prepare(`
            CREATE TABLE IF NOT EXISTS movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                collection_id INTEGER,
                url TEXT NOT NULL,
                cover_url TEXT NOT NULL,
                duration TEXT,
                FOREIGN KEY (collection_id) REFERENCES collections (id)
            )
        `).run();

        console.log("✅ Banco de dados pronto!");
    } catch (error) {
        console.error("❌ Erro ao criar tabelas:", error);
    }
}

// Executar criação de tabelas ao iniciar
createTables();

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionsRoutes);
app.use('/api/movies', moviesRoutes);
app.use("/api/thumbnails", thumbnailsRoutes);

// Servindo arquivos estáticos
app.use("/thumbnails", express.static(path.join(__dirname, "assets/thumbnails")));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
