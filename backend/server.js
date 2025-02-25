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

// ✅ 1. Criando o `app` antes de usá-lo
const app = express();

// ✅ 2. Configuração do Rate Limiter (proteção contra ataques)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo de 100 requisições por IP
  message: "Muitas requisições. Tente novamente mais tarde.",
});

// ✅ 3. Aplicando middlewares de segurança ANTES das rotas
app.use(limiter);


const allowedOrigins = [
  "https://marvelflix-krxl.onrender.com",
  "https://srv-marvelflix.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Acesso bloqueado por CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(xss());
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],

        // Permitir scripts inline e APIs externas
        scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com"],

        // Permitir estilos inline e Google Fonts
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],

        // Permitir fontes do Google
        fontSrc: ["'self'", "https://fonts.gstatic.com"],

        // Permitir imagens de fontes externas
        imgSrc: [
          "'self'",
          "data:", // Permite imagens embutidas (base64)
          "https://i.imgur.com",
          "https://img.icons8.com"
        ],

        // Permitir conexões externas (API do BunnyStream e outras)
        connectSrc: [
          "'self'",
          "https://srv-marvelflix.onrender.com",
          "https://video.bunnycdn.com"
        ],

        // Permitir iframes do BunnyStream
        frameSrc: ["'self'", "https://iframe.mediadelivery.net"],

        // Permitir carregamento de arquivos de mídia (vídeos, áudios)
        mediaSrc: ["'self'", "https://iframe.mediadelivery.net"],

        // Permitir carregamento de estilos externos específicos
        styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],

        // Permitir embeds e frames de fontes confiáveis
        frameAncestors: ["'self'", "https://iframe.mediadelivery.net"]
      },
    },
  })
);



// ✅ 4. Definindo cookies seguros
app.use((req, res, next) => {
  res.cookie("session", "valor", {
    httpOnly: true, // Impede acesso via JavaScript
    secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
    sameSite: "Strict", // Impede envio entre sites
  });
  next();
});

// ✅ 5. Teste de conexão com a API
app.get("/", (req, res) => {
  res.send("API do MarvelFlix está funcionando!");
});

// ✅ 6. Criar tabelas automaticamente
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

// ✅ 7. Definir as rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/thumbnails", thumbnailsRoutes);
app.use("/api/users", usersRoutes);

// ✅ 8. Servindo arquivos estáticos corretamente
app.use(
  "/thumbnails",
  express.static(path.join(__dirname, "assets/thumbnails"), {
    setHeaders: (res, path) => {
      res.set("X-Content-Type-Options", "nosniff");
    },
  })
);


// ✅ 9. Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
