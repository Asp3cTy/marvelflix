// createPanelUser.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { queryD1 } = require("./d1"); // Ajuste o caminho se precisar

(async () => {
  try {
    const username = "zulinn";
    const plainPass = "Maybe1317!";

    // Criptografa a senha
    const hashed = await bcrypt.hash(plainPass, 10);

    // Insere na tabela accessPanel
    await queryD1(
      "INSERT INTO accessPanel (username, password) VALUES (?, ?)",
      [username, hashed]
    );

    console.log("Usuário de painel criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar usuário de painel:", error);
  }
})();
