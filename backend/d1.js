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

    // Se a resposta for um array, vamos verificar o primeiro elemento
    if (Array.isArray(data)) {
      if (data.length > 0 && data[0].hasOwnProperty("results")) {
        if (!data[0].success) {
          console.error("D1 Query Error:", data[0].errors);
          throw new Error("Erro na consulta ao D1");
        }
        // Retorna diretamente o array de resultados
        return data[0].results;
      }
      return data;
    } else {
      // Se a resposta for um objeto
      if (!data.success) {
        console.error("D1 Query Error:", data.errors);
        throw new Error("Erro na consulta ao D1");
      }
      if (data.hasOwnProperty("result")) {
        return data.result;
      }
      return data;
    }
  } catch (error) {
    console.error("Erro ao executar queryD1:", error);
    throw error;
  }
}

module.exports = { queryD1 };
