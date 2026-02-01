// Script para la página de login

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Efecto de focus en inputs
    const inputs = [emailInput, passwordInput];
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('input-focus-effect');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('input-focus-effect');
        });
    });

    // Manejo del inicio de sesión (click en botón)
    document.getElementById('btn-login').addEventListener('click', function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validaciones básicas
        if (!email) {
            alert('⚠️ Por favor ingrese su correo electrónico');
            emailInput.focus();
            return;
        }

        if (!validarEmail(email)) {
            alert('⚠️ Por favor ingrese un correo electrónico válido');
            emailInput.focus();
            return;
        }

        if (!password) {
            alert('⚠️ Por favor ingrese su contraseña');
            passwordInput.focus();
            return;
        }

        if (password.length < 6) {
            alert('⚠️ La contraseña debe tener al menos 6 caracteres');
            passwordInput.focus();
            return;
        }

        // Simular inicio de sesión
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuario = usuarios.find(u => u.email === email && u.password === password);

        if (usuario) {
            // Guardar sesión
            usuario.estaActivo = true;
            localStorage.setItem('usuarioActivo', JSON.stringify(usuario));

            alert('✅ Inicio de sesión exitoso!\n\nBienvenido: ' + usuario.nombre);

            // Redirigir según el rol
            if (usuario.rol === 'admin') {
                window.location.href = 'administrador.html';
            } else if (usuario.rol === 'evaluador') {
                window.location.href = 'evaluador.html';
            } else {
                window.location.href = 'postulante.html';
            }
        } else {
            alert('❌ Correo o contraseña incorrectos\n\nSi no tienes cuenta, regístrate primero.');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    // Función para validar email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Animación del botón al cargar
    const submitBtn = document.getElementById('btn-login');
    setTimeout(() => {
        submitBtn.classList.add('animate-pulse');
    }, 500);

    // Efecto de escritura en placeholders
    let typingTimeout;
    emailInput.addEventListener('input', function () {
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            if (this.value && !validarEmail(this.value)) {
                this.classList.add('error-input');
            } else {
                this.classList.remove('error-input');
            }
        }, 500);
    });
});
