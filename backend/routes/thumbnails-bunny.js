// routes/thumbnails-bunny.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// Rota para listar os nomes dos arquivos (thumbnails)
router.get("/", async (req, res) => {
  try {
    const bunnyResponse = await axios.get(
      "https://br.storage.bunnycdn.com/marvelflix-assets/thumbnails/",
      {
        headers: {
          AccessKey: process.env.BUNNY_ACCESS_KEY
        }
      }
    );
    // Extrair apenas os nomes dos arquivos
    const fileNames = bunnyResponse.data.map(item => item.ObjectName);
    return res.json(fileNames);
  } catch (error) {
    console.error("Erro ao buscar arquivos no Bunny:", error);
    return res.status(500).json({ error: "Erro ao buscar arquivos" });
  }
});

// Rota para retornar a imagem (stream) sem expor a AccessKey no frontend
router.get("/image", async (req, res) => {
  const { objectName } = req.query; // ex: ?objectName=Daredevil_Born_Again.jpg
  if (!objectName) {
    return res.status(400).json({ error: "Parâmetro 'objectName' é obrigatório." });
  }

  try {
    const bunnyResponse = await axios.get(
      `https://br.storage.bunnycdn.com/marvelflix-assets/thumbnails/${objectName}`,
      {
        headers: {
          AccessKey: process.env.BUNNY_ACCESS_KEY
        },
        responseType: "arraybuffer"
      }
    );

    // Define o Content-Type adequado (ajuste conforme necessário)
    res.setHeader("Content-Type", "image/jpeg");
    return res.send(bunnyResponse.data);
  } catch (error) {
    console.error("Erro ao obter imagem do Bunny:", error);
    return res.status(500).json({ error: "Não foi possível buscar a imagem." });
  }
});

module.exports = router;
