// routes/thumbnails-bunny.js (exemplo)
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const bunnyResponse = await axios.get("https://br.storage.bunnycdn.com/marvelflix-assets/thumbnails/", {
      headers: {
        AccessKey: process.env.BUNNY_ACCESS_KEY
      }
    });
    // Extrair apenas os nomes
    const fileNames = bunnyResponse.data.map(item => item.ObjectName);
    return res.json(fileNames);
  } catch (error) {
    console.error("Erro ao buscar arquivos no Bunny:", error);
    return res.status(500).json({ error: "Erro ao buscar arquivos" });
  }
});

module.exports = router;
