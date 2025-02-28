const jwt = require('jsonwebtoken');
console.log("JWT_SECRET em auth.js:", process.env.JWT_SECRET);
function adminOnly(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Não há token no header");
    return res.status(401).json({ redirect: "/" });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Payload do token:", payload);
    // Verifica se o email é exatamente o admin autorizado
    if (payload.email && payload.email.toLowerCase() === "zulinn@marvelflix.com") {
      return next();
    } else {
      console.error("Usuário autenticado, mas não é admin:", payload.email);
      return res.status(403).json({ redirect: "/home" });
    }
  } catch (error) {
    console.error("Token inválido ou expirado:", error.message);
    return res.status(401).json({ redirect: "/" });
  }
}

module.exports = adminOnly;
