// d1.js
require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function queryD1(sql, params = []) {
  try {
    const response = await fetch(process.env.D1_DATABASE_URL, {
      method: "POST",
      headers: {
        "X-Auth-Email": process.env.CLOUDFLARE_AUTH_EMAIL,
        "X-Auth-Key": process.env.CLOUDFLARE_API_KEY,
        "Authorization": `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
    },
      body: JSON.stringify({ sql, params })
    });
    
    const data = await response.json();

    // Se a API retornar um array com um objeto que possui a propriedade "results",
    // vamos retornar essa propriedade.
    if (Array.isArray(data) && data[0] && data[0].hasOwnProperty("results")) {
      // Se a query for um SELECT, retornamos o array de resultados
      return data[0].results;
    }

    // Caso contrário, retornamos o objeto completo
    return data;
  } catch (error) {
    console.error("Erro ao executar queryD1:", error);
    throw error;
  }
}

module.exports = { queryD1 };
