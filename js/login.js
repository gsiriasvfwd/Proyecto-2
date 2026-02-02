/**
 * Script para manejar el inicio de sesión de usuarios.
 * Valida las credenciales contra LocalStorage y gestiona la redirección según el rol asignado.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Referencias a los elementos del formulario
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const securityCodeContainer = document.getElementById('security-code-container');
    const securityCodeInput = document.getElementById('securityCode');

    /**
     * Agrega efectos visuales de enfoque (focus) a los campos de entrada.
     */
    const inputs = [emailInput, passwordInput];
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('input-focus-effect');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('input-focus-effect');
        });
    });

    /**
     * Evento principal para el botón de inicio de sesión.
     * Realiza validaciones de formato y verifica la existencia del usuario en LocalStorage.
     */
    document.getElementById('btn-login').addEventListener('click', function (e) {
        e.preventDefault(); // Evita el envío tradicional del formulario

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validaciones de los campos
        if (!email) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo incompleto',
                text: 'Por favor ingrese su correo electrónico'
            });
            emailInput.focus();
            return;
        }

        if (!validarEmail(email)) {
            Swal.fire({
                icon: 'warning',
                title: 'Email inválido',
                text: 'Por favor ingrese un correo electrónico válido'
            });
            emailInput.focus();
            return;
        }

        if (!password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo incompleto',
                text: 'Por favor ingrese su contraseña'
            });
            passwordInput.focus();
            return;
        }

        if (password.length < 8) {
            Swal.fire({
                icon: 'warning',
                title: 'Contraseña corta',
                text: 'La contraseña debe tener al menos 8 caracteres'
            });
            passwordInput.focus();
            return;
        }

        /**
         * Verificación de credenciales.
         * Busca en la lista de usuarios registrados en LocalStorage.
         */
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuario = usuarios.find(u => u.email === email && u.password === password);

        if (usuario) {
            // Verificación de código de seguridad para roles administrativos
            if (usuario.rol === 'admin' || usuario.rol === 'evaluador') {
                const securityCodeVisible = securityCodeContainer.style.display === 'block';

                if (!securityCodeVisible) {
                    // Mostrar el campo y pedir que lo llenen
                    securityCodeContainer.style.display = 'block';
                    Swal.fire({
                        icon: 'info',
                        title: 'Autenticación Adicional',
                        text: 'Este rol requiere un código de seguridad. Por favor, ingrésalo arriba para continuar.'
                    });
                    securityCodeInput.focus();
                    return;
                }

                const code = securityCodeInput.value.trim();
                const codes = {
                    'admin': 'ADMIN2026',
                    'evaluador': 'EVAL2026'
                };

                if (code !== codes[usuario.rol]) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Código Incorrecto',
                        text: 'El código de seguridad no es válido para este rol.'
                    });
                    securityCodeInput.value = '';
                    securityCodeInput.focus();
                    return;
                }
            }
            // Activa la sesión para el usuario encontrado
            usuario.estaActivo = true;
            // Se guarda una copia del objeto usuario como 'usuarioActivo' para persistir la sesión
            localStorage.setItem('usuarioActivo', JSON.stringify(usuario));

            Swal.fire({
                icon: 'success',
                title: '¡Inicio de sesión exitoso!',
                text: 'Bienvenido: ' + usuario.nombre,
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                // Redirige al usuario a su panel correspondiente según su rol
                if (usuario.rol === 'admin') {
                    window.location.href = 'administrador.html';
                } else if (usuario.rol === 'evaluador') {
                    window.location.href = 'evaluador.html';
                } else {
                    window.location.href = 'postulante.html';
                }
            });
        } else {
            // Manejo de error si las credenciales no coinciden
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: 'Correo o contraseña incorrectos. Si no tienes cuenta, regístrate primero.'
            });
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    /**
     * Función auxiliar para validar el formato del correo electrónico mediante Regex.
     */
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Efecto de animación para el botón al cargar la página
    const submitBtn = document.getElementById('btn-login');
    setTimeout(() => {
        submitBtn.classList.add('animate-pulse');
    }, 500);

    /**
     * Validación en tiempo real para el campo de email.
     * Muestra visualmente si el formato es incorrecto mientras el usuario escribe.
     */
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
