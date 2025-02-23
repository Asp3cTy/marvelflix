// backend/routes/panel.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { queryD1 } = require("../d1");
require("dotenv").config();

const router = express.Router();

// POST /api/panel/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Informe usuário e senha." });
  }

  try {
    // Busca na tabela accessPanel
    const rows = await queryD1(
      "SELECT * FROM accessPanel WHERE username = ?",
      [username]
    );
    const panelUser = rows && rows.length > 0 ? rows[0] : null;

    if (!panelUser) {
      return res.status(401).json({ message: "Usuário ou senha incorretos." });
    }

    // Compara a senha com bcrypt
    const isMatch = await bcrypt.compare(password, panelUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Usuário ou senha incorretos." });
    }

    // Se bateu, gera token JWT (pode usar "adminSecret" ou o JWT_SECRET normal)
    const token = jwt.sign(
      { panelId: panelUser.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Retorna o token
    res.json({ token });
  } catch (error) {
    console.error("Erro ao logar no painel:", error);
    res.status(500).json({ message: "Erro interno ao acessar o painel." });
  }
});

module.exports = router;
