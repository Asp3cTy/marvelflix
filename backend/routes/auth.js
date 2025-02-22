const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { queryD1 } = require("../server");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "secreto_super_forte";

// 🔹 Criar usuário
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    try {
        const existingUser = await queryD1("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "E-mail já cadastrado." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await queryD1("INSERT INTO users (email, password, created_at) VALUES (?, ?, datetime('now'))", 
                      [email, hashedPassword]);

        res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ message: "Erro ao criar usuário" });
    }
});

// 🔹 Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    try {
        const users = await queryD1("SELECT * FROM users WHERE email = ?", [email]);
        if (!users.length) {
            return res.status(401).json({ message: "E-mail ou senha incorretos." });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "E-mail ou senha incorretos." });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, message: "Login realizado com sucesso!" });

    } catch (error) {
        console.error("Erro ao autenticar usuário:", error);
        res.status(500).json({ message: "Erro ao autenticar usuário" });
    }
});

module.exports = router;
