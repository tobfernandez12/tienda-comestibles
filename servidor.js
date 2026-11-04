const express = require("express");
const app = express();
const path = require("path");
const database = require("./basedatos");
const multer = require("multer");
const { randomUUID } = require("crypto");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const extensiones = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
};

const almacenamiento = multer.diskStorage({
    destination: path.join(__dirname, "public", "assets", "productos"),

    filename: (req, file, cb) => {
        const nombreArchivo = randomUUID() + extensiones[file.mimetype];
        cb(null, nombreArchivo);
    }
});

const subirImagen = multer({
    storage: almacenamiento,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        if (extensiones[file.mimetype]) { 
            cb(null, true);
        } else {
            cb(new Error("Seleccioná una imagen JPG, PNG o WebP"));
        }
    }
});

app.use(express.urlencoded({ extended: false }));

app.get("/", (req,res) => {
     res.render("index")
})

app.get("/admin", (req, res) => {
    database.all("SELECT * FROM productos", [], (err, productos) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Error al consultar los productos");
        }
        res.render("admin", { prods: productos });
    });
});

app.post("/productos/agregar", subirImagen.single("imagen"), (req, res) => {
    const nombre = (req.body.nombre || "").trim();
    const marca = (req.body.marca || "").trim();
    const stock = Number(req.body.stock);
    const precio = Number(req.body.precio);

    const imagen = req.file ? "/assets/productos/" + req.file.filename : null;

    if (
        !nombre || !marca || !String(req.body.stock ?? "").trim() ||
        !String(req.body.precio ?? "").trim() || !Number.isInteger(stock) ||
        stock < 0 || !Number.isFinite(precio) || precio < 0
    ) {
        return res.status(400).send("Revisá los datos del producto");
    }

    const sql = `INSERT INTO productos (nombre, marca, stock, precio, imagen) VALUES (?, ?, ?, ?, ?)`;

    database.run(sql, [nombre, marca, stock, precio, imagen], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Error al agregar el producto");
        }

        res.redirect("/admin");
    });
});

app.post("/productos/:id/eliminar", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) { return res.status(400).send("ID de producto inválido"); }

    database.run(
        "DELETE FROM productos WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Error al eliminar el producto");
            }
            if (this.changes === 0) {
                return res.status(404).send("El producto no existe");
            }
            res.redirect("/admin");
        }
    );
});

app.post("/productos/:id/editar", subirImagen.single("imagen"), (req, res) => {
    const id = Number(req.params.id);

    const nombre = (req.body.nombre || "").trim();
    const marca = (req.body.marca || "").trim();
    const stock = Number(req.body.stock);
    const precio = Number(req.body.precio);

    if (!Number.isInteger(id) || id <= 0) { return res.status(400).send("ID de producto inválido"); }

    if (!nombre || !marca || !String(req.body.stock ?? "").trim() || !String(req.body.precio ?? "").trim() ||
        !Number.isInteger(stock) || stock < 0 || !Number.isFinite(precio) || precio < 0
    ) {
        return res.status(400).send("Revisá los datos del producto");
    }

    database.get(
        "SELECT imagen FROM productos WHERE id = ?", [id], (err, producto) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Error al consultar el producto");
            }

            if (!producto) { return res.status(404).send("El producto no existe");}

            const imagen = req.file ? "/assets/productos/" + req.file.filename : producto.imagen;

            const sql = `UPDATE productos SET nombre = ?, marca = ?, stock = ?, precio = ?, imagen = ? WHERE id = ?`;

            database.run(sql, [nombre, marca, stock, precio, imagen, id], (err) => {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).send("Error al editar el producto");
                    }

                    res.redirect("/admin");
                }
            );
        }
    );
});

app.get("/catalogo", (req, res) => {
    const buscar = (req.query.buscar || "").trim();

    const sql = `
        SELECT * FROM productos
        WHERE LOWER(nombre) LIKE LOWER(?)
        ORDER BY nombre ASC
    `;

    database.all(sql, [`%${buscar}%`], (err, productos) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Error al consultar los productos");
        }

        res.render("catalogo", {
            prods: productos,
            buscar: buscar
        });
    });
});

app.get("/productos/buscar/sugerencias", (req, res) => {
    const buscar = (req.query.buscar || "").trim();

    if (buscar.length < 2) {
        return res.json([]);
    }

    const sql = `
        SELECT id, nombre, marca, precio, imagen
        FROM productos
        WHERE LOWER(nombre) LIKE LOWER(?)
           OR LOWER(marca) LIKE LOWER(?)
        ORDER BY nombre ASC
        LIMIT 8
    `;

    database.all(
        sql,
        [`%${buscar}%`, `%${buscar}%`],
        (err, productos) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({
                    error: "Error al buscar productos"
                });
            }

            res.json(productos);
        }
    );
});

app.get("/productos/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).send("ID de producto inválido");
    }

    database.get(
        "SELECT * FROM productos WHERE id = ?",
        [id],
        (err, producto) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Error al consultar el producto");
            }

            if (!producto) {
                return res.status(404).send("El producto no existe");
            }

            res.render("detalle", { producto });
        }
    );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
});
