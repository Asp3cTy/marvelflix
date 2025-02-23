const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from('SUA_CHAVE_BASE64', 'base64'); // Substitua 'SUA_CHAVE_BASE64' pela chave gerada
const iv = crypto.randomBytes(16);

if (key.length !== 32) {
  throw new Error('Chave de criptografia inválida. A chave deve ter 32 bytes.');
}

const encrypt = (text) => {
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (text) => {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = { encrypt, decrypt };