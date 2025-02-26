const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// 🔹 Configuração do BunnyCDN
const BUNNY_CDN_STORAGE_URL = "https://br.storage.bunnycdn.com/marvelflix-assets/thumbnails/";
const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY; // 🔹 Pegando do .env

router.get("/", async (req, res) => {
  console.log("✅ Rota `/api/thumbnails` chamada!");

  try {
    console.log("🔑 Chave BunnyCDN:", BUNNY_ACCESS_KEY);
    console.log("🌍 URL chamada:", `${BUNNY_CDN_STORAGE_URL}?accessKey=${BUNNY_ACCESS_KEY}`);

    const response = await axios.get(`${BUNNY_CDN_STORAGE_URL}?accessKey=${BUNNY_ACCESS_KEY}`);

    console.log("✅ Resposta recebida:", response.data);

    if (Array.isArray(response.data)) {
      const images = response.data.map(item => item.ObjectName);
      return res.json(images);
    }

    res.status(500).json({ error: "Formato inesperado da resposta do BunnyCDN" });
  } catch (error) {
    console.error("❌ Erro ao buscar imagens:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Erro ao buscar imagens do BunnyCDN" });
  }
});



module.exports = router;
