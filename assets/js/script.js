import { api } from "./utils.js";

import "./funcionesProducto.js"

export const modal = new bootstrap.Modal("#modalCrear", {
    keyboard: false,
    });

document.addEventListener("DOMContentLoaded", function () {
    cargarProductos();

    const form = document.querySelector("form");
    const { name, price, imagen, description, editar} = form.elements;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const data = {
            name: name.value,
            price: price.value,
            imagen: imagen.value,
            description: description.value,
        };

        //enviar datos
        api({
            method: editar.value ? "PUT" : "POST",
            url: editar.value ? `/producto/${editar.value}` : "/producto",
            data,
        })
            .then(({data})=> {
                console.log(data);
                Swal.fire("Exito!", data.mensage, "success");
                cargarProductos();
                form.reset(); // limpia los valores del formulario al enviar los datos
                modal.hide();
        })
            .catch((err) => 
                Swal.fire("Error! ", err?.response?.data?.message, "error")
        )
    })
})

export function cargarProductos() {
    const container = document.querySelector(".container .row");
    container.innerHTML = ""; 

    api.get("/productos").then(({ data }) => {

        for (const producto of data) {
            const precioFormateado = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0
            }).format(producto.price);

            container.innerHTML += `
            <div class="col-12 col-md-4 mb-3">
                <div class="modal-content rounded-4 border" style="border: 2px solid #ddd; overflow: hidden; padding: 15px;">
                    <div class="modal-header text-center p-2 rounded" style="background-color: #7400bb; border-radius: 0; border-width: 2px;">
                        <h5 class="modal-title text-white w-100">Producto: ${producto.name}</h5>
                    </div>
                    <div class="card-body text-center">
                        <div class="d-grid gap-2">
                            <div class="card-text-container"><br>
                                <img src="${producto.imagen}" alt="Imagen del producto" class="img-fluid rounded mx-auto d-block mb-3" style="max-height: 200px; object-fit: contain;">
                                <div>
                                    <p class="card-text" style="font-family: sans-serif; color: black;">
                                        <span class="font-weight-bold">Precio:</span> 
                                        <span style="color: red;">${precioFormateado}</span>
                                    </p>
                                </div>
                                <div class="mb-2 mt-1 p-2">
                                    <p class="card-text" style="font-family: sans-serif; color: black; text-align: justify;">
                                        <span class="font-weight-bold text-bg-info">Descripción:</span> 
                                        ${producto.description}
                                    </p>
                                </div>
                                <div class="d-flex justify-content-center gap-2 mt-3">
                                    <button type="button" class="btn btn-primary" onclick="editarProducto(${producto.id})">
                                        <i class="fa-solid fa-pen-to-square"></i> Editar
                                    </button>
                                    <button type="button" class="btn btn-danger" onclick="eliminarProducto(${producto.id})">
                                        <i class="fa-solid fa-trash"></i> Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }
    });
}