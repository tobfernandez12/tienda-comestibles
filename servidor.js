express = require('express')
app = express()
app.use (express.static("public"))
app.set("view engine", "ejs" )

app.get("/", (req,res) => {
     res.render("index")
})

app.get("/productos", (req,res) =>{
    prods=[
        {
            nombre: "Galletas",
            marca: "Saladix",
            stock: 50,
            precio: 1400
        },
        {
            nombre: "Refresco",
            marca: "Coca-Cola",
            stock: 200,
            precio: 5400
        }
    ]
     res.render("catalogo",{prods})
})
app.listen(3000, () =>  {
    console.log("Server funcionando")}
)