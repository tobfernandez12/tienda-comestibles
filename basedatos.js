const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tienda.db', (err) => {
    if (err) {
        console.error('Error al crear la base de datos:', err.message);
    } else {
        console.log('Base de datos creada correctamente');
    }
});




db.run(`
    CREATE TABLE IF NOT EXISTS productos (
       id INTEGER PRIMARY KEY AUTO_INCREMENT,
       nombre VARCHAR(20) NOT NULL,
       marca VARCHAR(20) NOT NUL,
       stock INTEGER NOT NULL DEFAULT 0,
       CONSTRAINT stock_no_negativo CHECK (stock >= 0),
       precio DECIMAL(10, 2) NOT NULL DEFAULT 0.00)`
)

function obtenerProductos(){
    return db.run("SELECT * FROM productos")
}

module.exports = db;