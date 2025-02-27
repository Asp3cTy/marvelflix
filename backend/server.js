require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const { queryD1 } = require("./d1");
const authRoutes = require("./routes/auth");
const collectionsRoutes = require("./routes/collections");
const moviesRoutes = require("./routes/movies");
const thumbnailsRoutes = require("./routes/thumbnails");
const usersRoutes = require("./routes/users");
const thumbnailsBunnyRoutes = require("./routes/thumbnails-bunny");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware de segurança com Helmet e CSP configurada
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // Permite carregar recursos do próprio domínio
        defaultSrc: ["'self'"],
        // Scripts podem ser carregados do próprio domínio e de desafios do Cloudflare Turnstile.
        scriptSrc: [
          "'self'",
          "https://challenges.cloudflare.com",
          "'unsafe-eval'" // necessário se o Turnstile ou outros scripts usarem eval
        ],
        // Permite conexões para o seu backend e para o BunnyCDN
        connectSrc: [
          "'self'",
          "https://api.marvelflix.fun",
          "https://marvelflix-krxl.onrender.com",
          "https://br.storage.bunnycdn.com"
        ],
        // Permite imagens do próprio domínio, data URIs, do Imgur e do BunnyCDN
        imgSrc: [
          "'self'",
          "data:",
          "https://i.imgur.com",
          "https://br.storage.bunnycdn.com"
        ],
        // Permite estilos inline e do Google Fonts
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com"
        ],
        // Permite fontes do próprio domínio e do Google Fonts
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        // Permite iframes do Turnstile e do serviço de vídeo (por exemplo, o BunnyStream)
        frameSrc: [
          "'self'",
          "https://challenges.cloudflare.com",
          "https://iframe.mediadelivery.net"
        ],
        // Bloqueia objetos
        objectSrc: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota para teste
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
app.use("/api/thumbnails-bunny", thumbnailsBunnyRoutes);
app.use("/api/bunnycdn", thumbnailsBunnyRoutes);
app.use("/api/users", usersRoutes);
app.use("/admin", adminRoutes);

// Servir arquivos estáticos da pasta "assets/thumbnails"
app.use("/thumbnails", express.static(path.join(__dirname, "assets/thumbnails")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
