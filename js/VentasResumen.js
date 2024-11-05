let GetVentasResumen = localStorage.getItem("ventasResumen");
GetVentasResumen = JSON.parse(GetVentasResumen);


const tableBody = document.querySelector("#table-body");

let totalesVentas =0;
GetVentasResumen.forEach(producto => {
    // Crear una nueva fila
    const row = document.createElement("tr");

    //crea la celda para nroVenta
    const nroVentaCell = document.createElement("td")
    nroVentaCell.textContent = producto.nroVenta; // Asigna el valor de nroVenta
    nroVentaCell.classList.add("text-primary");
    row.appendChild(nroVentaCell); // Añade la celda a la fila

    //crear la celda para nombre cliente
    const nombreCliente = document.createElement("td")
    nombreCliente.textContent = producto.nombreCliente
    nombreCliente.classList.add("text-primary");
    row.appendChild(nombreCliente)

     //crear la celda para nombre cliente
     const metodoPago = document.createElement("td")
     metodoPago.textContent = producto.tipoPago
     metodoPago.classList.add("text-primary");
     row.appendChild(metodoPago);

    // Crear la celda para la cantidad
    const cantidadCell = document.createElement("td");
    cantidadCell.textContent = producto.cantidadTotal; // Asigna el valor de cantidad
    cantidadCell.classList.add("text-primary");
    row.appendChild(cantidadCell); // Añade la celda a la fila
    
    // Crear la celda para el total
    const totalCell = document.createElement("td");
    totalCell.classList.add("text-success");
    totalCell.textContent = `$ ${producto.precioTotal}`  // Asigna el valor de total
    row.appendChild(totalCell); // Añade la celda a la fila

   
    // Añadir la fila completa al cuerpo de la tabla
    tableBody.appendChild(row);

    totalesVentas += producto.precioTotal;
});

const totalVentas = document.querySelector("#total-ventas");

totalVentas.value = totalesVentas;