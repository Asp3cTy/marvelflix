// gerarHash.js
const bcrypt = require("bcryptjs");

// Exemplo de senha em texto puro
const plainPassword = "maybe1317";

(async () => {
  try {
    // Gera o hash com fator de custo 10 (pode ajustar se quiser)
    const hashed = await bcrypt.hash(plainPassword, 10);

    console.log("Senha original:", plainPassword);
    console.log("Hash gerada:", hashed);
  } catch (error) {
    console.error("Erro ao gerar hash:", error);
  }
})();
