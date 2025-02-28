const express = require("express");
const { queryD1 } = require("../d1");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Listar todos os usuários
router.get("/", async (req, res) => {
  try {
    const users = await queryD1("SELECT id, email FROM users");
    res.json(users.length > 0 ? users : []);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ message: "Erro ao buscar usuários no banco de dados." });
  }
});

// Excluir usuário
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await queryD1("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "Usuário excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ message: "Erro ao excluir usuário." });
  }
});

// Editar usuário
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "O email não pode estar vazio." });
  }

  try {
    let updateQuery = "UPDATE users SET email = ? WHERE id = ?";
    let params = [email, id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery = "UPDATE users SET email = ?, password = ? WHERE id = ?";
      params = [email, hashedPassword, id];
    }

    await queryD1(updateQuery, params);
    res.json({ message: "Usuário atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
});

module.exports = router;
