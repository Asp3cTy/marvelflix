// routes/auth.js
const express = require('express');
const fetch = require('node-fetch'); // ou use axios
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { queryD1 } = require('../d1');
const { encrypt } = require('../cryptoUtils');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const router = express.Router();

// Pegue suas keys do .env
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

// =========== LOGIN ===========
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
  ],
  async (req, res) => {
    // 1. Validar campos email e password
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // 2. Validar Turnstile token
      const turnstileToken = req.body['cf-turnstile-response'];
      if (!turnstileToken) {
        return res.status(400).json({ message: 'Turnstile token ausente.' });
      }

      const verifyURL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
      const formData = new URLSearchParams();
      formData.append('secret', TURNSTILE_SECRET_KEY);
      formData.append('response', turnstileToken);

      const verifyRes = await fetch(verifyURL, {
        method: 'POST',
        body: formData,
      });
      const outcome = await verifyRes.json();

      if (!outcome.success) {
        return res.status(400).json({
          message: 'Falha na verificação do Turnstile.',
          'error-codes': outcome['error-codes'],
        });
      }

      // 3. Se Turnstile aprovou, verificar email/senha
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

      // 4. Gera token JWT
      const encryptedId = encrypt(user.id.toString());
      const token = jwt.sign({ id: encryptedId, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      // 5. Retorna token e email
      return res.json({ token, email: user.email });
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
      return res.status(500).json({ message: 'Erro ao autenticar usuário' });
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
    // 1. Validar campos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // 2. Validar Turnstile token
      const turnstileToken = req.body['cf-turnstile-response'];
      if (!turnstileToken) {
        return res.status(400).json({ message: 'Turnstile token ausente.' });
      }

      const verifyURL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
      const formData = new URLSearchParams();
      formData.append('secret', TURNSTILE_SECRET_KEY);
      formData.append('response', turnstileToken);

      const verifyRes = await fetch(verifyURL, {
        method: 'POST',
        body: formData,
      });
      const outcome = await verifyRes.json();

      if (!outcome.success) {
        return res.status(400).json({
          message: 'Falha na verificação do Turnstile.',
          'error-codes': outcome['error-codes'],
        });
      }

      // 3. Se Turnstile aprovou, verifica se email já existe
      const { email, password } = req.body;
      const existingUser = await queryD1('SELECT * FROM users WHERE email = ?', [email]);
      if (Array.isArray(existingUser) && existingUser.length > 0) {
        return res.status(400).json({ message: 'Usuário já existe' });
      }

      // 4. Cria usuário
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdAt = new Date().toISOString();
      await queryD1(
        'INSERT INTO users (email, password, role, created_at) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, 'user', createdAt]
      );

      return res.json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  }
);

module.exports = router;
