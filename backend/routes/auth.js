const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { queryD1 } = require('../d1');
const { encrypt } = require('../cryptoUtils');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const router = express.Router();

console.log("JWT_SECRET em auth.js:", process.env.JWT_SECRET);

// =========== LOGIN ===========
router.post(
  '/login',
  [
    
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
  ],
  async (req, res) => {
    // Verifica se há erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
console.log("JWT_SECRET em auth.js:", process.env.JWT_SECRET);
    try {
      const users = await queryD1('SELECT * FROM users WHERE email = ?', [email]);
      const user = Array.isArray(users) && users.length > 0 ? users[0] : null;
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      console.log("JWT_SECRET em auth.js:", process.env.JWT_SECRET);
      // Criptografa o ID do usuário e gera token, agora incluindo o email no payload
      const encryptedId = encrypt(user.id.toString());
      const token = jwt.sign(
        { id: encryptedId, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Retorna apenas o token
      res.json({ token });
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
      res.status(500).json({ message: 'Erro ao autenticar usuário' });
    }
  }
);


// =========== REGISTER ===========
// Adicionamos validação para os campos e sanitizamos o email
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('A senha deve ter no mínimo 8 caracteres'),
  ],
  async (req, res) => {
    // Verifica se há erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const existingUser = await queryD1('SELECT * FROM users WHERE email = ?', [email]);
      if (Array.isArray(existingUser) && existingUser.length > 0) {
        return res.status(400).json({ message: 'Usuário já existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const createdAt = new Date().toISOString();

      // Insere o usuário com role 'user'
      await queryD1(
        'INSERT INTO users (email, password, role, created_at) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, 'user', createdAt]
      );

      res.json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  }
);

module.exports = router;
