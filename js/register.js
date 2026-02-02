/**
 * Script para el registro de nuevos usuarios.
 * Maneja validaciones en tiempo real, cálculo de la fuerza de contraseña y almacenamiento en LocalStorage.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Referencias a los campos de entrada y botones
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');
    const rolSelect = document.getElementById('rol');
    const securityCodeContainer = document.getElementById('security-code-container');
    const securityCodeInput = document.getElementById('securityCode');
    const btnRegistrar = document.getElementById('btn-register');

    /**
     * Creación dinámica del indicador de fuerza de la contraseña.
     * Se inserta en el DOM justo después del campo de contraseña.
     */
    /**
     * Creación dinámica del indicador de fuerza de la contraseña.
     * Se inserta en el DOM justo después del campo de contraseña.
     */
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    strengthIndicator.innerHTML = '<div class="password-strength-bar"></div>';
    passwordInput.parentNode.insertBefore(strengthIndicator, passwordInput.nextSibling);

    /**
     * Maneja la visibilidad del código de seguridad según el rol.
     */
    rolSelect.addEventListener('change', function () {
        if (this.value === 'admin' || this.value === 'evaluador') {
            securityCodeContainer.style.display = 'block';
            securityCodeInput.setAttribute('required', 'true');
        } else {
            securityCodeContainer.style.display = 'none';
            securityCodeInput.removeAttribute('required');
            securityCodeInput.value = '';
        }
    });

    /**
     * Validación de correo electrónico mientras se escribe.
     * Cambia entre clases 'valid' e 'invalid' según el formato.
     */
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

    /**
     * Maneja el indicador visual de la fuerza de la contraseña.
     * Evalúa longitud, mayúsculas, números y caracteres especiales.
     */
    passwordInput.addEventListener('input', function () {
        const password = this.value;
        const strength = calcularFuerzaPassword(password);

        if (password.length > 0) {
            strengthIndicator.classList.add('visible');
            strengthIndicator.className = 'password-strength visible';

            // Aplica colores según la dificultad (se define en CSS: weak, medium, strong)
            if (strength < 3) {
                strengthIndicator.classList.add('weak');
            } else if (strength < 5) {
                strengthIndicator.classList.add('medium');
            } else {
                strengthIndicator.classList.add('strong');
            }

            // Validación de longitud mínima
            if (password.length >= 8) {
                this.classList.add('valid');
                this.classList.remove('invalid');
            } else {
                this.classList.add('invalid');
                this.classList.remove('valid');
            }
        } else {
            strengthIndicator.classList.remove('visible');
            this.classList.remove('valid', 'invalid');
        }
    });

    /**
     * Validación en tiempo real para confirmar la contraseña.
     * Compara si el valor coincide con el campo de contraseña original.
     */
    passwordConfirmInput.addEventListener('input', function () {
        const password = passwordInput.value;
        const confirmPassword = this.value;

        if (confirmPassword && confirmPassword === password) {
            this.classList.add('valid');
            this.classList.remove('invalid');
        } else if (confirmPassword) {
            this.classList.add('invalid');
            this.classList.remove('valid');
        } else {
            this.classList.remove('valid', 'invalid');
        }
    });

    /**
     * Validación simple para el campo de nombre al perder el foco (blur).
     */
    nombreInput.addEventListener('blur', function () {
        if (this.value.trim().length >= 3) {
            this.classList.add('valid');
            this.classList.remove('invalid');
        } else if (this.value.trim()) {
            this.classList.add('invalid');
            this.classList.remove('valid');
        }
    });

    /**
     * Evento principal para el registro de usuario.
     * Verifica que todos los campos sean válidos, que las contraseñas coincidan 
     * y que el correo no esté ya registrado.
     */
    btnRegistrar.addEventListener('click', function (e) {
        e.preventDefault();

        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = passwordConfirmInput.value;
        const rol = rolSelect.value;

        // Validaciones finales antes de guardar
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

        if (!password || password.length < 8) {
            Swal.fire({
                icon: 'warning',
                title: 'Contraseña débil',
                text: 'La contraseña debe tener al menos 8 caracteres'
            });
            passwordInput.focus();
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Las contraseñas no coinciden',
                text: 'Por favor verifique que ambas contraseñas sean iguales'
            });
            passwordConfirmInput.focus();
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

        // Validación del código de seguridad para Admin y Evaluador
        if (rol === 'admin' || rol === 'evaluador') {
            const code = securityCodeInput.value.trim();
            const codes = {
                'admin': 'ADMIN2026',
                'evaluador': 'EVAL2026'
            };

            if (!code) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Código requerido',
                    text: `El rol de ${rol} requiere un código de seguridad de autorización.`
                });
                securityCodeInput.focus();
                return;
            }

            if (code !== codes[rol]) {
                Swal.fire({
                    icon: 'error',
                    title: 'Código incorrecto',
                    text: 'El código de seguridad ingresado no es válido para este rol.'
                });
                securityCodeInput.value = '';
                securityCodeInput.focus();
                return;
            }
        }

        /**
         * Verificación de duplicados en la base de datos (LocalStorage).
         */
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const existe = usuarios.find(u => u.email === email);

        if (existe) {
            Swal.fire({
                icon: 'error',
                title: 'Usuario ya existe',
                text: 'Este correo electrónico ya está registrado. Por favor use otro o inicie sesión.'
            });
            emailInput.focus();
            return;
        }

        /**
         * Registro del nuevo usuario.
         * Genera un ID basado en el timestamp y almacena la fecha de registro.
         */
        const nuevoUsuario = {
            id: Date.now(),
            nombre: nombre,
            email: email,
            password: password, // En un entorno real, esto debería estar hasheado
            rol: rol,
            fechaRegistro: new Date().toISOString()
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: `Bienvenido ${nombre}. Ahora puede iniciar sesión con sus credenciales.`,
            confirmButtonColor: '#28a745'
        }).then(() => {
            // Redirección a la página de inicio de sesión
            window.location.href = 'login.html';
        });
    });

    /**
     * Valida el formato del email mediante expresión regular.
     */
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Calcula una puntuación de 'fuerza' para la contraseña.
     * @returns {number} Puntaje de 0 a 5.
     */
    function calcularFuerzaPassword(password) {
        let fuerza = 0;

        if (password.length >= 8) fuerza++;
        if (password.length >= 10) fuerza++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) fuerza++;
        if (/\d/.test(password)) fuerza++;
        if (/[^a-zA-Z\d]/.test(password)) fuerza++;

        return fuerza;
    }

    // Efecto visual para el botón
    setTimeout(() => {
        btnRegistrar.classList.add('animate-pulse');
    }, 500);

    // Restricción para evitar espacios en el campo de email
    emailInput.addEventListener('keypress', function (e) {
        if (e.key === ' ') {
            e.preventDefault();
        }
    });
});
