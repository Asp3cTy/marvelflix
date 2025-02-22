// d1.js
require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function queryD1(sql, params = []) {
  try {
    console.log("🔎 Executando Query:", sql, "com parâmetros:", params);

    const response = await fetch(process.env.D1_DATABASE_URL, {
      method: "POST",
      headers: {
        "X-Auth-Email": process.env.CLOUDFLARE_AUTH_EMAIL,
        "X-Auth-Key": process.env.CLOUDFLARE_API_KEY,
        "Authorization": `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    });

    const data = await response.json();
    console.log("📊 Resposta D1 completa:", JSON.stringify(data, null, 2));

    if (!response.ok || !data.success) {
      console.error("❌ Erro na consulta D1:", data.errors || "Resposta inesperada.");
      throw new Error("Erro na consulta ao banco de dados.");
    }

    // Se a resposta tiver a propriedade "result"
    if (data.hasOwnProperty("result")) {
      const resArr = data.result;
      // Se resArr é um array com pelo menos um elemento que possui a propriedade "results"
      if (Array.isArray(resArr) && resArr.length > 0 && resArr[0] && "results" in resArr[0]) {
        console.log("Desembrulhando resultado interno...");
        return resArr[0].results;
      }
      return resArr;
    }
    return data;
  } catch (error) {
    console.error("❌ Erro ao consultar D1:", error.message);
    throw error;
  }
}

module.exports = { queryD1 };
