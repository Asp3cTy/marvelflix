// auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { queryD1 } = require("../d1");
require("dotenv").config();

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  try {
    const users = await queryD1("SELECT * FROM users WHERE email = ?", [email]);
    console.log("Resultado da query de login:", users);
    const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Erro no endpoint /login:", error);
    res.status(500).json({ message: "Erro ao autenticar usuário" });
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  try {
    const existingUser = await queryD1("SELECT * FROM users WHERE email = ?", [email]);
    console.log("Resultado da query de registro:", existingUser);
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const result = await queryD1(
      "INSERT INTO users (email, password, created_at) VALUES (?, ?, ?)",
      [email, hashedPassword, createdAt]
    );
    console.log("Resultado da query de inserção:", result);
    res.json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error("Erro no endpoint /register:", error);
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
});

module.exports = router;
