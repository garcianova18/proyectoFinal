let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-accion-comprar");
const botonAgregarEnvio = document.querySelector("#agregar-envio");
const botonQuitarEnvio = document.querySelector("#quitar-envio");
const contenedorMetodoPago = document.querySelector("#contenedor-pago")

//input del formulario
const tipoPago = document.querySelector("#tipo-tarjeta");
const nombretitular = document.querySelector("#nombre-titular");
const numerotarjeta = document.querySelector("#numero-tarjeta");
const fechaexpiracion = document.querySelector("#fecha-expiracion");
const codigocvc = document.querySelector("#codigo-cvc");

// Variables para el total
const costoEnvio = 500;
let totalConEnvio = 0; // Inicializar total con envío
let envioAgregado = false; // Estado para controlar si el envío ha sido agregado

// Función para cargar productos en el carrito
function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        contenedorMetodoPago.classList.add("disabled")
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function() {}
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    });
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    totalConEnvio = totalCalculado; // Solo el total sin costo de envío
    contenedorTotal.innerText = `$${totalConEnvio}`; // Mostrar solo el total sin envío
}

// Agregar costo de envío
botonAgregarEnvio.addEventListener("click", () => {
    if (!envioAgregado) { // Solo agregar si no ha sido agregado antes
        totalConEnvio += costoEnvio; // Añadir costo de envío al total
        envioAgregado = true; // Cambiar el estado a agregado
        contenedorTotal.innerText = `$${totalConEnvio}`; // Actualizar el total mostrado
        botonAgregarEnvio.disabled = true; // Deshabilitar el botón para evitar agregarlo más de una vez
    }
});

// Quitar costo de envío
botonQuitarEnvio.addEventListener("click", () => {
    if (envioAgregado) { // Solo quitar si el envío ha sido agregado
        totalConEnvio -= costoEnvio; // Quitar costo de envío al total
        envioAgregado = false; // Cambiar el estado a no agregado
        contenedorTotal.innerText = `$${totalConEnvio}`; // Actualizar el total mostrado
        botonAgregarEnvio.disabled = false; // Habilitar el botón de agregar envío nuevamente
    }
});

// Evento de compra
botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {

    if (tipoPago.value ==="" || nombretitular.value === "" || numerotarjeta.value === "" || fechaexpiracion.value === "" || codigocvc.value === "") {
        // Mostrar mensaje de validación
        Swal.fire({
            title: 'Debes de completar el formulario de pago',
            text: "Todos los campos son obligatorios",
            icon: 'warning',
            timer: 3000,
            showConfirmButton: false
        });
    }
    else
    {
         // Mensaje de confirmación con el total final
        Swal.fire({
        title: 'Compra realizada',
        text: `Total: $${totalConEnvio}`, // Mostrar total final
        icon: 'success',
        showConfirmButton: false
        });

        //guardar resumen de venta
        GuardarResumenVenta(nombretitular.value,tipoPago.value);

        productosEnCarrito.length = 0;
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.remove("disabled");

        window.setTimeout(redireccionar, 2000);

        function redireccionar() {
            window.location.replace('./ventasResumen.html');
        }
    }
   
}

   //guardar resumen de venta
function GuardarResumenVenta(nombreCliente,tipoPago){

     let getproductosEnCarrito = localStorage.getItem("productos-en-carrito");
     getproductosEnCarrito = JSON.parse(getproductosEnCarrito);

     // Obtener el array existente de ventas
     let ventasResumenArray = JSON.parse(localStorage.getItem("ventasResumen")) || [];

     // Calcular el resumen de la venta actual
     const ventasResumenActual = getproductosEnCarrito.reduce((acumulador, producto) => {
       
         acumulador.cantidadTotal += producto.cantidad;
         acumulador.precioTotal += producto.precio;
         return acumulador;
     }, { cantidadTotal: 0, precioTotal: 0 });

     // Asignar un número de venta 
     ventasResumenActual.nroVenta = `0000${ventasResumenArray.length + 1}`;
     ventasResumenActual.nombreCliente = nombreCliente;
     ventasResumenActual.tipoPago = tipoPago;
     //agregar costo de envio si es requerido
     if (envioAgregado) {

        ventasResumenActual.precioTotal +=costoEnvio;
     }
     
     // Agregar el resumen actual al array de ventas
     ventasResumenArray.push(ventasResumenActual);

     // Guardar en localStorage
     localStorage.setItem("ventasResumen", JSON.stringify(ventasResumenArray));
}

const fechaExpiracionInput = document.getElementById("fecha-expiracion");

fechaExpiracionInput.addEventListener("input", function (e) {
    let input = e.target.value;

    // Remover cualquier carácter que no sea un número
    input = input.replace(/\D/g, "");

    // Insertar '/' después de los primeros dos números, si es necesario
    if (input.length > 2) {
        input = input.slice(0, 2) + "/" + input.slice(2);
    }

    e.target.value = input.slice(0, 5); // Limitar a "MM/AA"
});

// Asegurar que solo se ingresen números y permitir borrar
fechaExpiracionInput.addEventListener("keydown", function (e) {
    // Permitir teclas de control: borrar, flechas, etc.
    if (
        ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key) ||
        (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
    ) {
        return;
    }

    // Evitar cualquier carácter que no sea numérico
    if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
});

const nombreTitularInput = document.getElementById("nombre-titular");

nombreTitularInput.addEventListener("input", function (e) {
    // Remover cualquier carácter que no sea una letra (incluyendo acentos)
    e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
});

// Asegurar que solo se ingresen letras y permitir borrar
nombreTitularInput.addEventListener("keydown", function (e) {
    // Permitir teclas de control: borrar, flechas, etc.
    if (
        ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key) ||
        (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
    ) {
        return;
    }

    // Evitar cualquier carácter que no sea una letra
    if (!/[a-zA-ZÀ-ÿ\s]/.test(e.key)) {
        e.preventDefault();
    }
});

// Obtener elementos
const nombreUsuarioInput = document.getElementById('nombre-usuario');
const comentariosTextoArea = document.getElementById('comentarios');
const enviarComentarioBtn = document.getElementById('enviar-comentario');
const borrarComentarioBtn = document.getElementById('borrar-comentario');
const carritoComentariosDiv = document.createElement('div');
carritoComentariosDiv.id = 'carrito-comentarios-list';
document.querySelector('.carrito-comentarios').appendChild(carritoComentariosDiv);

// Función para enviar comentario
enviarComentarioBtn.addEventListener('click', () => {
    const nombre = nombreUsuarioInput.value.trim();
    const comentario = comentariosTextoArea.value.trim();

    if (nombre && comentario) {
        // Crear un nuevo comentario
        const comentarioDiv = document.createElement('div');
        comentarioDiv.classList.add('comentario');
        comentarioDiv.innerHTML = `<strong>${nombre}:</strong> <p>${comentario}</p>`;
        
        // Añadir el comentario a la lista de comentarios
        carritoComentariosDiv.appendChild(comentarioDiv);

        // Limpiar el textarea y el campo de nombre
        comentariosTextoArea.value = '';
        nombreUsuarioInput.value = '';
    } else {
        alert('Por favor, escribe tu nombre y un comentario antes de enviar.');
    }
});

// Función para borrar solo el comentario que se está escribiendo
borrarComentarioBtn.addEventListener('click', () => {
    // Limpiar el textarea y el campo de nombre
    comentariosTextoArea.value = ''; // Elimina el texto escrito en el textarea
    nombreUsuarioInput.value = ''; // Elimina el texto escrito en el campo de nombre
});

// Seleccionar el campo de nombre
const nombreUsuario = document.getElementById('nombre-usuario');

// Escuchar el evento 'input' en el campo de nombre
nombreUsuarioInput.addEventListener('input', function() {
    // Reemplazar cualquier carácter que no sea una letra o espacio
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
});
