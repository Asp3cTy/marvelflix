// auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { queryD1 } = require("../d1");  // Atualize a importação
require("dotenv").config();

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    try {
        const users = await queryD1("SELECT * FROM users WHERE email = ?", [email]);
        const user = users.length ? users[0] : null;

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
        console.error(error);
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

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Usuário já existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await queryD1("INSERT INTO users (email, password, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)", [email, hashedPassword]);

        res.json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar usuário" });
    }
});

module.exports = router;