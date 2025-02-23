require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const { queryD1 } = require("./d1");
const { encrypt, decrypt } = require("./cryptoUtils");
const authRoutes = require("./routes/auth");
const collectionsRoutes = require("./routes/collections");
const moviesRoutes = require("./routes/movies");
const thumbnailsRoutes = require("./routes/thumbnails");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API do MarvelFlix está funcionando!");
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


async function createTables() {
  try {
    console.log("📂 Criando/verificando tabelas...");

    await queryD1(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT DEFAULT 'user', created_at TEXT)"
    );

    await queryD1(
      "CREATE TABLE IF NOT EXISTS collections (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL, image TEXT)"
    );

    await queryD1(
      "CREATE TABLE IF NOT EXISTS movies (id INTEGER PRIMARY KEY, title TEXT NOT NULL, collection_id INTEGER, url TEXT NOT NULL, cover_url TEXT NOT NULL, duration TEXT)"
    );

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