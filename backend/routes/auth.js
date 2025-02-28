// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { queryD1 } = require('../d1');
const { encrypt } = require('../cryptoUtils');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// =========== LOGIN ===========
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { email, password } = req.body;
      const users = await queryD1('SELECT * FROM users WHERE email = ?', [email]);
      const user = Array.isArray(users) && users.length > 0 ? users[0] : null;
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      
      const encryptedId = encrypt(user.id.toString());
      const token = jwt.sign({ id: encryptedId, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      
      return res.json({ token, email: user.email });
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
      return res.status(500).json({ message: 'Erro ao autenticar usuário', error: error.message });
    }
  }
);

// =========== REGISTER ===========
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('A senha deve ter no mínimo 8 caracteres'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { email, password } = req.body;
      
      // Verifica se o usuário já existe
      const existingUser = await queryD1('SELECT * FROM users WHERE email = ?', [email]);
      if (Array.isArray(existingUser) && existingUser.length > 0) {
        return res.status(400).json({ message: 'Usuário já existe' });
      }
      
      // Cria o usuário com senha criptografada
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdAt = new Date().toISOString();
      
      const result = await queryD1(
        'INSERT INTO users (email, password, role, created_at) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, 'user', createdAt]
      );
      
      return res.json({ message: 'Usuário criado com sucesso!', result });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
    }
  }
);

module.exports = router;
    
