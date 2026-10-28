const modal = document.getElementById("modal-producto");
const abrirModal = document.getElementById("abrir-modal");
const cerrarModal = document.getElementById("cerrar-modal");

abrirModal.addEventListener("click", () => { modal.showModal(); });

cerrarModal.addEventListener("click", () => { modal.close(); });