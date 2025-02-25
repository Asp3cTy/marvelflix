require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { queryD1 } = require("./d1");
const authRoutes = require("./routes/auth");
const collectionsRoutes = require("./routes/collections");
const moviesRoutes = require("./routes/movies");
const thumbnailsRoutes = require("./routes/thumbnails");
const usersRoutes = require("./routes/users");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");







const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo de 100 requisições por IP
  message: "Muitas requisições. Tente novamente mais tarde.",
});

app.use(limiter);




const app = express();
app.use((req, res, next) => {
  res.cookie("session", "valor", {
    httpOnly: true, // Impede acesso via JavaScript
    secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
    sameSite: "Strict", // Impede envio entre sites
  });
  next();
});
app.use(cors());
app.use(express.json());
app.use(xss());
app.use(helmet());

app.get("/", (req, res) => {
  res.send("API do MarvelFlix está funcionando!");
});

// Criar tabelas automaticamente
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

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/thumbnails", thumbnailsRoutes);
app.use("/api/users", usersRoutes);

// Em vez de "../frontend/public/thumbnails", aponte para "assets/thumbnails"
app.use("/thumbnails", express.static(path.join(__dirname, "../frontend/public/thumbnails"), {
  setHeaders: (res, path) => {
    res.set("X-Content-Type-Options", "nosniff");
  }
}));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
