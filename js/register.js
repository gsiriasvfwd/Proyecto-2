// Inyectar SweetAlert2 dinámicamente si no está presente
if (!window.Swal) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(script);
}

// Script para la página de registro

document.addEventListener('DOMContentLoaded', function () {
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rolSelect = document.getElementById('rol');
    const btnRegistrar = document.querySelector('button[type="submit"]');

    // Crear indicador de fuerza de contraseña
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    strengthIndicator.innerHTML = '<div class="password-strength-bar"></div>';
    passwordInput.parentNode.insertBefore(strengthIndicator, passwordInput.nextSibling);

    // Validación en tiempo real del email
    emailInput.addEventListener('input', function () {
        if (this.value && validarEmail(this.value)) {
            this.classList.add('valid');
            this.classList.remove('invalid');
        } else if (this.value) {
            this.classList.add('invalid');
            this.classList.remove('valid');
        } else {
            this.classList.remove('valid', 'invalid');
        }
    });

    // Validación de contraseña con indicador de fuerza
    passwordInput.addEventListener('input', function () {
        const password = this.value;
        const strength = calcularFuerzaPassword(password);

        if (password.length > 0) {
            strengthIndicator.style.display = 'block';
            strengthIndicator.className = 'password-strength';

            if (strength < 3) {
                strengthIndicator.classList.add('weak');
            } else if (strength < 5) {
                strengthIndicator.classList.add('medium');
            } else {
                strengthIndicator.classList.add('strong');
            }

            if (password.length >= 6) {
                this.classList.add('valid');
                this.classList.remove('invalid');
            } else {
                this.classList.add('invalid');
                this.classList.remove('valid');
            }
        } else {
            strengthIndicator.style.display = 'none';
            this.classList.remove('valid', 'invalid');
        }
    });

    // Validación del nombre
    nombreInput.addEventListener('blur', function () {
        if (this.value.trim().length >= 3) {
            this.classList.add('valid');
            this.classList.remove('invalid');
        } else if (this.value.trim()) {
            this.classList.add('invalid');
            this.classList.remove('valid');
        }
    });

    // Manejo del registro
    btnRegistrar.addEventListener('click', function (e) {
        e.preventDefault();

        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rol = rolSelect.value;

        // Validaciones
        if (!nombre || nombre.length < 3) {
            Swal.fire({
                icon: 'warning',
                title: 'Nombre inválido',
                text: 'Por favor ingrese un nombre válido (mínimo 3 caracteres)'
            });
            nombreInput.focus();
            return;
        }

        if (!email || !validarEmail(email)) {
            Swal.fire({
                icon: 'warning',
                title: 'Email inválido',
                text: 'Por favor ingrese un correo electrónico válido'
            });
            emailInput.focus();
            return;
        }

        if (!password || password.length < 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Contraseña corta',
                text: 'La contraseña debe tener al menos 6 caracteres'
            });
            passwordInput.focus();
            return;
        }

        if (!rol) {
            Swal.fire({
                icon: 'warning',
                title: 'Rol no seleccionado',
                text: 'Por favor seleccione un rol de usuario'
            });
            rolSelect.focus();
            return;
        }

        // Verificar si el email ya existe
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const existe = usuarios.find(u => u.email === email);

        if (existe) {
            Swal.fire({
                icon: 'error',
                title: 'Correo ya registrado',
                text: 'Este correo electrónico ya está registrado. Por favor use otro o inicie sesión.'
            });
            emailInput.focus();
            return;
        }

        // Crear nuevo usuario
        const nuevoUsuario = {
            id: Date.now(),
            nombre: nombre,
            email: email,
            password: password,
            rol: rol,
            fechaRegistro: new Date().toISOString()
        };

        // Guardar en localStorage
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: 'Bienvenido: ' + nombre + '. Ahora puede iniciar sesión con sus credenciales.',
            confirmButtonText: 'Ir al Login'
        }).then(() => {
            // Redirigir a login
            window.location.href = 'login.html';
        });
    });

    // Función para validar email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Función para calcular fuerza de contraseña
    function calcularFuerzaPassword(password) {
        let fuerza = 0;

        if (password.length >= 6) fuerza++;
        if (password.length >= 10) fuerza++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) fuerza++;
        if (/\d/.test(password)) fuerza++;
        if (/[^a-zA-Z\d]/.test(password)) fuerza++;

        return fuerza;
    }

    // Animación del botón al cargar
    setTimeout(() => {
        btnRegistrar.style.animation = 'pulse 0.6s ease';
    }, 500);

    // Prevenir espacios en email
    emailInput.addEventListener('keypress', function (e) {
        if (e.key === ' ') {
            e.preventDefault();
        }
    });
});
