const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// 🔹 Configuração do BunnyCDN
const BUNNY_CDN_STORAGE_URL = "https://br.storage.bunnycdn.com/marvelflix-assets/thumbnails";
const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY; // 🔹 Pegando do .env

// ✅ Rota para buscar as imagens do CDN via backend
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(BUNNY_CDN_STORAGE_URL, {
      headers: { AccessKey: BUNNY_ACCESS_KEY }, // 🔹 A chave é enviada pelo cabeçalho
    });

    if (Array.isArray(response.data)) {
      // 🔹 Filtra e retorna apenas os nomes das imagens
      const images = response.data.map(item => item.ObjectName);
      return res.json(images);
    }

    res.status(500).json({ error: "Formato inesperado da resposta do BunnyCDN" });
  } catch (error) {
    console.error("Erro ao buscar imagens do BunnyCDN:", error);
    res.status(500).json({ error: "Erro ao buscar imagens do BunnyCDN" });
  }
});

module.exports = router;
