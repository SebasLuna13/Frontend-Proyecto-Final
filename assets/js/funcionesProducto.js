import {cargarProductos, modal} from "./script.js"

const form = document.querySelector("form")

window.editarProducto = function(id) {
    fetch("http://localhost:3000/producto/" + id)
    .then(response => response.json())
    .then(data => {
        const form = document.querySelector("form");

        const { editar, name, price, imagen, description } = form.elements;

        // Asignar los valores al formulario
        editar.value = data.id;
        name.value = data.name;
        price.value = data.price;
        imagen.value = data.imagen;
        description.value = data.description;

        modal.show();
    })
};

window.eliminarProducto = function (id) {
    Swal.fire({
        title: "Estas seguro?",
        text: "No podras revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, borrar!",
        cancelButtonText: "Cancelar",
    }).then(function (result) {
        if (result.isConfirmed) {
            fetch(`http://localhost:3000/producto/${id}`, {
            method: "DELETE",
            })
            .then((response) => response.json())
            .then((data) => {
                Swal.fire("Eliminado!", data.message, "success");
                cargarProductos();
            });
        }
    });
};

window.LimpiarFormulario = function() {
    form.reset()
}