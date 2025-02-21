const crypto = require("crypto");

const generateBunnyToken = (videoId) => {
    const securityKey = process.env.BUNNY_STREAM_SECURITY_KEY; // Chave de autenticação
    const libraryId = process.env.BUNNY_LIBRARY_ID; // ID da biblioteca
    const expiration = Math.floor(Date.now() / 1000) + 3600; // Expiração de 1 hora

    // Gera o hash SHA256 baseado na chave + videoId + expiração
    const tokenString = `${securityKey}${videoId}${expiration}`;
    const token = crypto.createHash("sha256").update(tokenString).digest("hex");

    return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expiration}`;
};

module.exports = generateBunnyToken;
