import { addSession } from "../utils/sessionStorage.controller.js";

const container = document.getElementById('contenedor');
const registerBtn = document.getElementById('btnRegistro');
const loginBtn = document.getElementById('btnLogin');

if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");    
    });
}

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
}

const formularioRegistro = document.getElementById('formulario-registro');
const formularioLogin = document.getElementById('formulario-login');

if (formularioRegistro) {
    formularioRegistro.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const direccion = document.getElementById('direccion').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const userData = {
            nombre: nombre,
            apellido: apellido,
            direccion: direccion,
            email: email,
            password: password,
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        enviarCorreoConfirmacion(userData);

        alert('Usuario creado correctamente!');
        window.location.href = '../pages/main.html';
    });
}

function enviarCorreoConfirmacion(userData) {
    
    const templateParams = {
        nombre: userData.nombreCompleto,
        email: userData.email
    };

    emailjs.send("TecnoShop", "APPWEB2-Prueba", templateParams)
        .then(function(response) {
            console.log("Correo de confirmación enviado con éxito", response);
        }, function(error) {
            console.error("Error al enviar el correo de confirmación", error);
        });
}

if (formularioLogin) {
    formularioLogin.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const loginData = { email: email, password: password };

        fetch('http://localhost:5000/user/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                const userId = data.data.Id;
                addSession({ Id: userId });
                window.location.href = "../pages/main.html";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert('Error al iniciar sesión');
        });
    });
}