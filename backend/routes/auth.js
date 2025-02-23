const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { queryD1 } = require("../d1");
const { encrypt, decrypt } = require("../cryptoUtils");
require("dotenv").config();

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  try {
    const users = await queryD1("SELECT * FROM users WHERE email = ?", [email]);
    const user = Array.isArray(users) && users.length > 0 ? users[0] : null;
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const encryptedId = encrypt(user.id.toString());
    const token = jwt.sign({ id: encryptedId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
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
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    await queryD1(
      "INSERT INTO users (email, password, created_at) VALUES (?, ?, ?)",
      [email, hashedPassword, createdAt]
    );

    res.json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
});

router.get("/check-admin", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decryptedId = decrypt(decoded.id);
    res.json({ isAdmin: decryptedId === "5" });
  } catch (error) {
    console.error("Erro ao verificar administrador:", error);
    res.status(500).json({ message: "Erro ao verificar administrador" });
  }
});

module.exports = router;