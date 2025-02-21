const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    console.log('🗄️ Conectado ao banco de dados SQLite');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        collection_id INTEGER,
        url TEXT NOT NULL,
        cover_url TEXT NOT NULL,
        FOREIGN KEY (collection_id) REFERENCES collections(id)
    )`);
});

module.exports = db;
