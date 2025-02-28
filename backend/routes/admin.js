// routes/admin.js
const express = require('express');
const adminOnly = require('../middlewares/adminonly');

const router = express.Router();

// Aplica o middleware a todas as rotas definidas abaixo
router.use(adminOnly);

router.get('/', (req, res) => {
  // Se o middleware passou, é porque o usuário é admin
  res.json({ message: "Bem-vindo ao painel administrativo!" });
});

// Outras rotas administrativas...
module.exports = router;
