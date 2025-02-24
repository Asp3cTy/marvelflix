const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { queryD1 } = require("../d1"); 
require("dotenv").config();

const router = express.Router();

// Função para criar um usuário
async function createUser(username, password) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const query = 'INSERT INTO accessPanel (username, password) VALUES (?, ?)';
  const values = [username, hashedPassword];

  try {
    await queryD1(query, values);
    console.log('Usuário criado com sucesso');
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
  }
}

// POST /api/panel/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validação básica
  if (!username || !password) {
    return res.status(400).json({ message: "Informe usuário e senha." });
  }

  try {
    // Busca o registro na tabela 'accessPanel'
    const rows = await queryD1(
      "SELECT * FROM accessPanel WHERE username = ?",
      [username]
    );
    const panelUser = rows && rows.length > 0 ? rows[0] : null;

    if (!panelUser) {
      return res.status(401).json({ message: "Usuário ou senha incorretos." });
    }

    // Verifica a senha com bcrypt (compare a senha pura com a hash do banco)
    const isMatch = await bcrypt.compare(password, panelUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Usuário ou senha incorretos." });
    }

    // Gera um token JWT
    const token = jwt.sign({ panelId: panelUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Responde com o token
    res.json({ token });

  } catch (error) {
    console.error("Erro ao logar:", error);
    res.status(500).json({ message: "Erro interno ao fazer login" });
  }
});

// Chama a função para criar um usuário admin se o arquivo for executado diretamente
if (require.main === module) {
  (async () => {
    const username = 'admin';
    const password = 'password';

    // Cria o usuário admin
    await createUser(username, password);
    console.log(`Usuário admin criado com sucesso: ${username}`);
  })();
}

module.exports = router;
