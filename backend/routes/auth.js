const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { queryD1 } = require("../server"); // ✅ Agora usamos a função do D1
require("dotenv").config();

const router = express.Router();

// Chave secreta para JWT (recomenda-se definir no .env)
const SECRET_KEY = process.env.JWT_SECRET || "secreto_super_forte";

// 🔹 Criar usuário ADMIN
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    try {
        const existingUser = await queryD1("SELECT * FROM users WHERE username = ?", [username]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Usuário já existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await queryD1("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

        res.json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar usuário" });
    }
});

// 🔹 Login do ADMIN
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    try {
        const users = await queryD1("SELECT * FROM users WHERE username = ?", [username]);
        const user = users.length ? users[0] : null;

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // Gerar token JWT
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao autenticar usuário" });
    }
});

// 🔹 Middleware para proteger rotas
const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Acesso negado" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
};

module.exports = router;
module.exports.authenticate = authenticate;
