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
      // Envia a query na propriedade "sql" em uma única linha
      body: JSON.stringify({ sql, params })
    });

    const data = await response.json();

    if (!data.success) {
      console.error("D1 Query Error:", data.errors);
      throw new Error("Erro na consulta ao D1");
    }

    return data.result;
  } catch (error) {
    console.error("Erro ao executar queryD1:", error);
    throw error;
  }
}

module.exports = { queryD1 };
