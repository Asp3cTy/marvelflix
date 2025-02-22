// d1.js
require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function queryD1(query, params = []) {
    try {
      const response = await fetch(process.env.D1_DATABASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          // Se for necessário, adicione outros headers (ex.: de autorização)
        },
        body: JSON.stringify({ query, params })
      });
  
      const data = await response.json();
  
      if (!data.success) {
        console.error("D1 Query Error:", data.errors);
        throw new Error("Erro na consulta ao D1");
      }
  
      // Retorna apenas o array de resultados
      return data.result;
    } catch (error) {
      console.error("Erro ao executar queryD1:", error);
      throw error;
    }
  }
  
  module.exports = { queryD1 };