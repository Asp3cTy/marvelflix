const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// Chave secreta para o JWT (use uma variável de ambiente no Render)
const SECRET_KEY = process.env.JWT_SECRET || "secreto_super_forte";


// Criar usuário ADMIN
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (user) {
            return res.status(400).json({ message: "Usuário já existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
            if (err) return res.status(500).json({ message: "Erro ao criar usuário" });
            res.json({ message: "Usuário criado com sucesso!" });
        });
    });
});

// Login do ADMIN
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao buscar usuário" });
        }

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // Gerando o token JWT após validar o usuário
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ token });
    });
});



// Middleware para proteger rotas
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

