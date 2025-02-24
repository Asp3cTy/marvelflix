const express = require("express");
const { queryD1 } = require("../d1");

const router = express.Router();

// Listar todos os usuários
router.get("/", async (req, res) => {
  try {
    const users = await queryD1("SELECT id, email FROM users");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Nenhum usuário encontrado." });
    }

    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ message: "Erro ao buscar usuários no banco de dados." });
  }
});

module.exports = router;
