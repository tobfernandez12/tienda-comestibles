app.use (express.static("public"))

app.get("/", (req,res) => {
     req.render("index")
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
     req.render("catalogo",{prods})
})