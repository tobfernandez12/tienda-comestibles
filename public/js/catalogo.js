const input = document.getElementById("buscar-productos");
    const sugerencias = document.getElementById("sugerencias");
    let temporizador;
    input.addEventListener("input", () => {
        clearTimeout(temporizador);
        const texto = input.value.trim();
        if (texto.length < 2) {
            sugerencias.innerHTML = "";
            sugerencias.style.display = "none";
            return;
        }
        temporizador = setTimeout(async () => {
            try {
                const respuesta = await fetch(
                    `/productos/buscar/sugerencias?buscar=${encodeURIComponent(texto)}`
                );

                const productos = await respuesta.json();
                sugerencias.innerHTML = "";
                if (productos.length === 0) {
                    sugerencias.innerHTML =
                        '<p class="sin-resultados">No se encontraron productos</p>';
                } else {
                    productos.forEach(producto => {
                        const enlace = document.createElement("a");
                        enlace.href = `/productos/${producto.id}`;
                        enlace.className = "sugerencia";
                        const imagen = document.createElement("img");
                        imagen.src = producto.imagen || "/assets/EJS-MARKET-logo.png";
                        imagen.alt = producto.nombre;
                        const informacion = document.createElement("div");
                        const nombre = document.createElement("strong");
                        nombre.textContent = producto.nombre;
                        const marca = document.createElement("span");
                        marca.textContent = producto.marca;
                        const precio = document.createElement("span");
                        precio.textContent = "$" + Number(producto.precio).toLocaleString("es-AR");
                        informacion.append(nombre, marca, precio);
                        enlace.append(imagen, informacion);
                        sugerencias.appendChild(enlace);
                    });
                }

                sugerencias.style.display = "block";
            } catch (error) {
                console.error("Error al buscar sugerencias:", error);
            }

        }, 250);
    });
    document.addEventListener("click", (evento) => {
        if (!evento.target.closest(".busqueda")) {
            sugerencias.style.display = "none";
        }
    });
    input.addEventListener("focus", () => {
        if (input.value.trim().length >= 2 && sugerencias.children.length > 0) {
            sugerencias.style.display = "block";
        }
    });
