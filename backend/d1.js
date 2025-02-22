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
      // A API do D1 espera a propriedade "query"
      body: JSON.stringify({ query: sql, params })
    });
    
    const data = await response.json();

    // Se a resposta for um array com um objeto que tem a propriedade "results", retorne-a
    if (Array.isArray(data) && data[0] && data[0].hasOwnProperty("results")) {
      return data[0].results;
    }
    return data;
  } catch (error) {
    console.error("Erro ao executar queryD1:", error);
    throw error;
  }
}

module.exports = { queryD1 };
