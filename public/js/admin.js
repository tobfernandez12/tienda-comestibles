const modal = document.getElementById("modal-producto");
const abrirModal = document.getElementById("abrir-modal");
const cerrarModal = document.getElementById("cerrar-modal");

abrirModal.addEventListener("click", () => { modal.showModal(); });

cerrarModal.addEventListener("click", () => { modal.close(); });

const modalEditar = document.getElementById("modal-editar");
const formEditar = document.getElementById("form-editar");

const editarNombre = document.getElementById("editar-nombre");
const editarMarca = document.getElementById("editar-marca");
const editarPrecio = document.getElementById("editar-precio");
const editarStock = document.getElementById("editar-stock");

const editarImagen = document.getElementById("editar-imagen");
const vistaImagen = document.getElementById("editar-vista-imagen");
const sinImagen = document.getElementById("editar-sin-imagen");

let imagenTemporal = null;

function liberarImagenTemporal() {
    if (imagenTemporal) {
        URL.revokeObjectURL(imagenTemporal);
        imagenTemporal = null;
    }
}

document.querySelectorAll(".editar-producto").forEach((boton) => {
    boton.addEventListener("click", () => {
        formEditar.reset();
        liberarImagenTemporal();

        const producto = boton.dataset;

        formEditar.action = `/productos/${producto.id}/editar`;

        editarNombre.value = producto.nombre;
        editarMarca.value = producto.marca;
        editarPrecio.value = producto.precio;
        editarStock.value = producto.stock;

        if (producto.imagen) {
            vistaImagen.src = producto.imagen;
            vistaImagen.hidden = false;
            sinImagen.hidden = true;
        } else {
            vistaImagen.removeAttribute("src");
            vistaImagen.hidden = true;
            sinImagen.hidden = false;
        }

        modalEditar.showModal();
    });
});

document.getElementById("cambiar-imagen").addEventListener("click", () => { editarImagen.click(); });

editarImagen.addEventListener("change", () => { 
    const archivo = editarImagen.files[0];

    if (!archivo) {
        return;
    }

    liberarImagenTemporal();
    imagenTemporal = URL.createObjectURL(archivo);

    vistaImagen.src = imagenTemporal;
    vistaImagen.hidden = false;
    sinImagen.hidden = true;
});

document.getElementById("cancelar-edicion").addEventListener("click", () => { modalEditar.close(); });
//tobi, lo que me haces hacer.
modalEditar.addEventListener("close", () => { liberarImagenTemporal(); });

//parte de la barra de busqueda

const buscadorProductos = document.getElementById("buscar-productos");
const resultadoBusqueda = document.getElementById("resultado-busqueda");

const filasProductos = Array.from( document.querySelectorAll("#tabla-productos > tr"));

function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function filtrarProductos() {
    const busqueda = normalizarTexto(buscadorProductos.value);

    const coincidencias = filasProductos.filter((fila) => {
        const nombre = normalizarTexto(fila.dataset.nombre);
        const marca = normalizarTexto(fila.dataset.marca);

        return nombre.includes(busqueda) || marca.includes(busqueda);
    });

    filasProductos.forEach((fila) => {fila.hidden = true;});

    coincidencias.forEach((fila) => {fila.hidden = false;});

buscadorProductos.addEventListener("input", filtrarProductos);}

filtrarProductos();