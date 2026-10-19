express = require('express')
app = express()
app.use (express.static("public"))
app.set("view engine", "ejs" )

app.get("/", (req,res) => {
     res.render("index")
})

app.get("/catalogo", (req,res) =>{
    prods=[
        {
            nombre: "Galletas",
            marca: "Saladix",
            stock: 50,
            precio: 2500
        },
        {
            nombre: "Gaseosa",
            marca: "Coca-Cola",
            stock: 200,
            precio: 4900
        },
        {
            nombre: "Aceite de girasol",
            marca: "La Campagnola",
            stock: 20,
            precio: 3200
        },
        {
            nombre: "Leche",
            marca: "La Serenísima",
            stock: 20,
            precio: 1500
        }
    ]
    console.log(prods)
    console.log(prods[0].nombre)
     res.render("catalogo",{prods})
})
app.listen(3000, () =>  {
    console.log("Server funcionando")}
)