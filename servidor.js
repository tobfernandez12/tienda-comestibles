const express = require("express");
const app = express();
const path = require("path");
const database = require("./basedatos");
const multer = require("multer");
const { randomUUID } = require("crypto");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

/* prods=[
        {
            nombre: "Galletas",
            marca: "Saladix",
            stock: 50,
            imagen: "/assets/productos/pepito.jpg",
            precio: 2500
        },
        {
            nombre: "Gaseosa",
            marca: "Coca-Cola",
            stock: 200,
            imagen: "/assets/productos/coca-cola.png",
            precio: 4900
        },
        {
            nombre: "Aceite de girasol",
            marca: "Cañuelas",
            stock: 20,
            imagen:"/assets/productos/aceite.jpg",
            precio: 3200
        },
        {
            nombre: "Leche",
            marca: "La Serenísima",
            stock: 20,
            imagen:"/assets/productos/leche.jpg",
            precio: 1500
        }
    ] */
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

app.get("/catalogo", (req, res) => {
    database.all("SELECT * FROM productos", [], (err, productos) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Error al consultar los productos");
        }
        res.render("catalogo", { prods: productos });
    });
});

app.listen(3000, () =>  {
    console.log("Server funcionando")}
)
