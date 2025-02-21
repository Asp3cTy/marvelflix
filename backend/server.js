require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

if (!fs.existsSync("./database.sqlite")) {
    console.log("📂 Criando banco de dados...");
    const initSQL = fs.readFileSync("./database.sql", "utf8");
    db.exec(initSQL);
}

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
