express = require('express')
app = express()
app.set("view engine", "ejs" )
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

prods=[
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
    ]

app.get("/", (req,res) => {
     res.render("index")
})

app.get("/admin", (req,res) => {
     res.render("admin", {prods})
})

app.get("/catalogo", (req,res) =>{
    
    console.log(prods)
    console.log(prods[0].nombre)
     res.render("catalogo",{prods})
})
app.listen(3000, () =>  {
    console.log("Server funcionando")}
)
