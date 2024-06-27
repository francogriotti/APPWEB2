let productos = [];

fetch("../../data/items.json") 
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

const productoTemplate = document.getElementById('producto-template');
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}));

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const productoCard = productoTemplate.content.cloneNode(true);

        productoCard.querySelector('.producto-imagen').src = producto.imagen;
        productoCard.querySelector('.producto-imagen').alt = producto.titulo;
        productoCard.querySelector('.producto-titulo').innerText = producto.titulo;
        productoCard.querySelector('.producto-precio').innerText = `$${producto.precio}`;
        productoCard.querySelector('.producto-agregar').id = producto.id;

        contenedorProductos.append(productoCard);
    });

    actualizarBotonesAgregar();
}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            const productosDeCadaCategoria = {};

            productos.forEach(producto => {
                if (!productosDeCadaCategoria[producto.categoria.id]) {
                    productosDeCadaCategoria[producto.categoria.id] = [];
                }
                productosDeCadaCategoria[producto.categoria.id].push(producto);
            });

            const productosMostrados = [];
            for (const categoriaId in productosDeCadaCategoria) {
                productosMostrados.push(...productosDeCadaCategoria[categoriaId].slice(0, 3));
            }

            cargarProductos(productosMostrados);
        }
    });
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}

document.getElementById('boton-logout').addEventListener('click', function() {
    sessionStorage.clear();
    localStorage.clear();
    console.log('Datos de sessionStorage y localStorage eliminados.');

    window.location.href = "../index.html";
});