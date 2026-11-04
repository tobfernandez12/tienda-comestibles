const cantidad = document.getElementById("cantidad");
const stock = Number(cantidad.max);

const restar = document.getElementById("restar");
const sumar = document.getElementById("sumar");
const mensaje = document.getElementById("mensaje");
const agregar = document.getElementById("agregar");

restar.addEventListener("click", () => {
    const valor = Number(cantidad.value);

    if (valor <= 1) {
        alert("Error: la cantidad mínima es 1.");
        return;
    }

    cantidad.value = valor - 1;
});

sumar.addEventListener("click", () => {
    const valor = Number(cantidad.value);

    if (valor >= stock) {
        alert(`Error: no hay más stock disponible. El máximo es ${stock}.`);
        return;
    }

    cantidad.value = valor + 1;
});


cantidad.addEventListener("change", () => {
    const valor = Number(cantidad.value);

    if (!Number.isInteger(valor) || valor < 1) {
        alert("Error: la cantidad mínima es 1.");
        cantidad.value = 1;
    } else if (valor > stock) {
        alert(`Error: superaste el stock disponible. El máximo es ${stock}.`);
        cantidad.value = stock;
    }
});

agregar.addEventListener("click", () => {
    mensaje.textContent = "Todavía falta conectar el carrito.";
});

if (stock <= 0) {
    cantidad.value = 0;
    cantidad.disabled = true;
    restar.disabled = true;
    sumar.disabled = true;
    agregar.disabled = true;
    mensaje.textContent = "Producto sin stock.";
}