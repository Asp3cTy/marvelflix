require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const collectionsRoutes = require("./routes/collections");
const moviesRoutes = require("./routes/movies");
const thumbnailsRoutes = require("./routes/thumbnails");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// 🚀 Express App
const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Credenciais do D1 (do seu `.env`)
const D1_DATABASE_URL = process.env.D1_DATABASE_URL;
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;

if (!D1_DATABASE_URL || !CLOUDFLARE_API_KEY) {
    console.error("❌ Erro: Variáveis de ambiente D1_DATABASE_URL ou CLOUDFLARE_API_KEY não definidas.");
    process.exit(1);
}

// 🔹 Função para executar queries no D1
async function queryD1(query, params = []) {
    try {
        const response = await fetch(D1_DATABASE_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${CLOUDFLARE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, params }), // 🔹 Alterado de "sql" para "query"
        });

        if (!response.ok) {
            const errorText = await response.text(); // 🔹 Captura resposta de erro
            console.error("❌ Erro na consulta D1:", errorText);
            throw new Error(`Erro D1: ${errorText}`);
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error("❌ Erro ao consultar D1:", error.message);
        throw error;
    }
}

// 🏗️ Criar tabelas no banco ao iniciar
async function createTables() {
    try {
        console.log("📂 Criando/verificando tabelas...");

        await queryD1(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
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

// 📌 Executa a criação das tabelas ao iniciar
createTables();

// 🔹 Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/thumbnails", thumbnailsRoutes);

// 🔹 Servindo arquivos estáticos
app.use("/thumbnails", express.static(path.join(__dirname, "assets/thumbnails")));

// 🔥 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
