const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database( path.join(__dirname, "tienda.db"),(err) => {
        if (err) {
            console.error("Error al abrir la base de datos:", err.message);
        } else {
            console.log("Base de datos conectada");
        }
    }
);

db.run(`
    CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        marca TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
        precio REAL NOT NULL DEFAULT 0 CHECK (precio >= 0),
        imagen TEXT
    )`, (err) => {
        if (err) {
            console.error("Error al crear la tabla:", err.message);
        } else {
            console.log("Tabla productos lista");
        }
    });

module.exports = db;