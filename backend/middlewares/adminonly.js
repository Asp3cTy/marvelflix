// middlewares/adminOnly.js
const jwt = require('jsonwebtoken');

function adminOnly(req, res, next) {
  const authHeader = req.headers.authorization;
  
  // Se não houver token, consideramos usuário deslogado e redirecionamos para a landing page
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ redirect: "/" });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verifica se o token possui o email e se é o autorizado
    if (payload.email && payload.email.toLowerCase() === "zulinn@marvelflix.com") {
      return next();
    } else {
      // Usuário logado, mas não é admin – redireciona para /home
      return res.status(403).json({ redirect: "/home" });
    }
  } catch (error) {
    // Token inválido ou expirado
    return res.status(401).json({ redirect: "/" });
  }
}

module.exports = adminOnly;
