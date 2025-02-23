// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs'); 
const { queryD1 } = require('../d1'); // ou como você acessa o DB
require('dotenv').config();

const router = express.Router();

// ========== LOGIN SEM TOKEN ==========
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha email e senha.' });
  }

  try {
    // Busca o usuário no banco
    const users = await queryD1('SELECT * FROM users WHERE email = ?', [email]);
    const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    // Compara senha (assumindo que está armazenada com bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    // Remove a password do objeto antes de enviar
    delete user.password;

    // Responde com user (contém email, role, etc.)
    return res.json({
      success: true,
      user, 
      message: 'Login bem sucedido!'
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ message: 'Erro interno ao fazer login' });
  }
});


// ========== REGISTER (opcional) ==========
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  // Se quiser um "role", pode mandar no body ou deixar 'user' por padrão
  const role = req.body.role || 'user';

  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha email e senha.' });
  }

  try {
    const existing = await queryD1('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email já registrado.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Insere no DB
    await queryD1('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [
      email,
      hashed,
      role
    ]);
    
    return res.json({ success: true, message: 'Usuário criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    return res.status(500).json({ message: 'Erro interno ao registrar' });
  }
});

module.exports = router;
