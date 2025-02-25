const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

const BUNNY_STORAGE_URL = "https://br.storage.bunnycdn.com/marvelflix-assets/thumbnails/";
const BUNNY_ACCESS_KEY = "b2f191fc-22f3-4f2b-8836e5bd8b4d-f718-4270"; // 🔒 API Key

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${BUNNY_STORAGE_URL}?accessKey=${BUNNY_ACCESS_KEY}`);
    
    if (!response.data || !Array.isArray(response.data)) {
      return res.status(500).json({ message: "Erro ao obter as imagens do BunnyCDN" });
    }

    // 🔹 Filtra apenas os nomes dos arquivos (ObjectName)
    const images = response.data.map((item) => ({
      filename: item.ObjectName,
      url: `${BUNNY_STORAGE_URL}${item.ObjectName}?accessKey=${BUNNY_ACCESS_KEY}`,
    }));

    res.json(images);
  } catch (error) {
    console.error("Erro ao buscar imagens do BunnyCDN:", error);
    res.status(500).json({ message: "Erro ao buscar imagens" });
  }
});

module.exports = router;
