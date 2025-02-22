const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { queryD1 } = require("../server"); // ✅ Função que interage com D1
require("dotenv").config();

const router = express.Router();

// 🔐 Chave secreta para JWT (recomenda-se definir no .env)
const SECRET_KEY = process.env.JWT_SECRET || "secreto_super_forte";

// ✅ Função auxiliar para validar email
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// 🔹 Criar usuário ADMIN
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "E-mail inválido" });
    }

    try {
        console.log("🔍 Verificando se e-mail já existe:", email);
        const existingUser = await queryD1("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            console.log("❌ E-mail já cadastrado:", email);
            return res.status(400).json({ message: "E-mail já cadastrado" });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("✅ Criando usuário no banco...");
        const result = await queryD1(
            "INSERT INTO users (email, password, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
            [email, hashedPassword]
        );

        if (!result || result.length === 0) {
            console.log("❌ Erro ao inserir usuário no banco.");
            return res.status(500).json({ message: "Erro ao criar usuário no banco de dados" });
        }

        console.log("✅ Usuário criado com sucesso:", email);
        res.json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao criar usuário:", error);
        res.status(500).json({ message: "Erro ao criar usuário" });
    }
});

// 🔹 Login do ADMIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }

    try {
        console.log("🔍 Buscando usuário no banco:", email);
        const users = await queryD1("SELECT * FROM users WHERE email = ?", [email]);
        const user = users.length ? users[0] : null;

        if (!user) {
            console.log("❌ Nenhum usuário encontrado!");
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        console.log("✅ Usuário encontrado:", user.email);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("❌ Senha incorreta para:", email);
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // Gerar token JWT
        console.log("🔑 Gerando token para:", email);
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ token });
    } catch (error) {
        console.error("❌ Erro ao autenticar usuário:", error);
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
