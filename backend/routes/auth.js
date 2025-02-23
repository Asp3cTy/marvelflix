// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { queryD1 } = require('../d1');
const { encrypt, decrypt } = require('../cryptoUtils');
require('dotenv').config();

const router = express.Router();

// =========== LOGIN ===========
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos' });
  }

  try {
    // Busca usuário
    const users = await queryD1('SELECT * FROM users WHERE email = ?', [email]);
    const user = Array.isArray(users) && users.length > 0 ? users[0] : null;
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Compara senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Criptografa o ID do usuário e assina o token
    const encryptedId = encrypt(user.id.toString());
    const token = jwt.sign({ id: encryptedId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Em vez de retornar só o token, retornamos também o role e o email
    // (ou, se quiser, pode retornar o objeto user inteiro, mas sem a password)
    res.json({
      token,
      role: user.role,  // "admin" ou "user"
      email: user.email
    });

  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ message: 'Erro ao autenticar usuário' });
  }
});

// =========== REGISTER ===========
// (Pode manter como está; sem alterações)

// =========== CHECK ADMIN ===========
// Se quiser, pode remover completamente essa rota, pois não será mais usada.
// Ou deixe para caso precise em outro lugar.
router.get('/check-admin', async (req, res) => {
  // ... (código antigo) ...
});

module.exports = router;
