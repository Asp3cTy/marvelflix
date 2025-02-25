const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// 🔹 Configuração do BunnyCDN
const BUNNY_CDN_STORAGE_URL = "https://br.storage.bunnycdn.com/marvelflix-assets/thumbnails/";
const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY; // 🔹 Pegando do .env

// ✅ Rota para buscar as imagens do CDN via backend
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${BUNNY_CDN_STORAGE_URL}?accessKey=${BUNNY_ACCESS_KEY}`);

    if (Array.isArray(response.data)) {
      // 🔹 Retorna a lista completa de imagens com os nomes e links diretos
      const images = response.data.map(item => ({
        name: item.ObjectName,
        url: `https://marvelflix.b-cdn.net/thumbnails/${item.ObjectName}`,
      }));

      return res.json(images);
    }

    res.status(500).json({ error: "Formato inesperado da resposta do BunnyCDN" });
  } catch (error) {
    console.error("Erro ao buscar imagens do BunnyCDN:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Erro ao buscar imagens do BunnyCDN" });
  }
});

module.exports = router;
