require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routes/auth");

const sqlite3 = require("sqlite3").verbose();

// MEU GIT NO VSCODE TA FUNCIONANDO

// Caminho do banco de dados
const DB_PATH = "./database.sqlite";

// Verifica se o banco de dados existe, se não, cria um novo
if (!fs.existsSync(DB_PATH)) {
    console.log("📂 Criando novo banco de dados...");
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error("Erro ao criar banco de dados:", err.message);
        } else {
            console.log("✅ Banco de dados criado com sucesso!");

            // Criando as tabelas necessárias
            db.serialize(() => {
                db.run(`
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL
                    )
                `);

                db.run(`
                    CREATE TABLE IF NOT EXISTS collections (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT UNIQUE NOT NULL,
                        image TEXT
                    )
                `);

                db.run(`
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

                console.log("🎬 Tabelas criadas!");
            });

            db.close();
        }
    });
} else {
    console.log("✅ Banco de dados encontrado.");
}

module.exports = new sqlite3.Database(DB_PATH);


const app = express();
app.use(cors());
app.use(express.json());


const collectionsRoutes = require('./routes/collections');
const moviesRoutes = require('./routes/movies');

const thumbnailsRoutes = require("./routes/thumbnails");
app.use("/api/thumbnails", thumbnailsRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionsRoutes);
app.use('/api/movies', moviesRoutes);

// Servindo arquivos estáticos da pasta 'assets/thumbnails'
app.use("/thumbnails", express.static(path.join(__dirname, "assets/thumbnails")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
