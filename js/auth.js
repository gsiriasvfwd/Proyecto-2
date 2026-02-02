/**
 * Este archivo maneja la lógica de autenticación y la renderización dinámica del menú de navegación
 * dependiendo del estado de la sesión y el rol del usuario.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Selecciona el contenedor de navegación del DOM
    const navContainer = document.querySelector('nav');
    // Si no hay contenedor de navegación, detiene la ejecución
    if (!navContainer) return;

    // Llama a la función para renderizar el menú
    renderNav();

    /**
     * Función principal para generar y mostrar el menú de navegación basado en el contexto de la página
     * y el estado del usuario logueado en LocalStorage.
     */
    function renderNav() {
        const path = window.location.pathname;
        const page = path.split("/").pop();

        // Regla especial para la página de registro: se oculta la navegación
        if (page === 'register.html') {
            navContainer.classList.add('hidden');
            return;
        }

        // Regla especial para login: solo se muestra el enlace a Home
        if (page === 'login.html') {
            navContainer.innerHTML = '<ul><li><a href="home.html">Home</a></li></ul>';
            return;
        }

        // Obtiene el usuario activo desde LocalStorage
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
        // Verifica si hay una sesión activa
        const isLoggedIn = usuarioActivo && usuarioActivo.estaActivo;

        let navHTML = '<ul>';

        // Opciones comunes disponibles para todos los usuarios (logueados o no)
        navHTML += '<li><a href="home.html">Home</a></li>';
        navHTML += '<li><a href="beca.html">Becas</a></li>';

        if (isLoggedIn) {
            // Define opciones de navegación según el rol del usuario logueado
            const rol = usuarioActivo.rol;

            if (rol === 'admin') {
                // Navegación para administradores
                navHTML += '<li><a href="administrador.html">Administrador</a></li>';
            } else if (rol === 'postulante') {
                // Navegación para postulantes (historial y solicitudes)
                navHTML += '<li><a href="postulante.html">Mi Historial</a></li>';
                navHTML += '<li><a href="solicitudbeca.html">Solicitud Beca</a></li>';
            } else if (rol === 'evaluador') {
                // Navegación para evaluadores
                navHTML += '<li><a href="evaluador.html">Evaluador</a></li>';
            }

            // Agrega botón de cierre de sesión para usuarios logueados
            navHTML += '<li><button id="logout" class="btn-logout">Cerrar Sesión</button></li>';
        } else {
            // Opciones de inicio de sesión y registro para usuarios no logueados
            navHTML += '<li><a href="login.html">Iniciar Sesión</a></li>';
            navHTML += '<li><a href="register.html">Registro</a></li>';
        }

        navHTML += '</ul>';
        // Inyecta el HTML generado en el contenedor de navegación
        navContainer.innerHTML = navHTML;

        // Añade la clase 'active' al enlace de la página actual
        const links = navContainer.querySelectorAll('a');
        links.forEach(link => {
            if (link.getAttribute('href') === page) {
                link.classList.add('active');
            }
        });

        // Configura el evento de clic para el botón de cerrar sesión
        const logoutBtn = document.getElementById('logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                // Solicita confirmación antes de cerrar la sesión mediante SweetAlert2
                Swal.fire({
                    title: '¿Cerrar sesión?',
                    text: '¿Estás seguro de que deseas cerrar sesión?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, salir',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#e74c3c',
                    cancelButtonColor: '#7f8c8d'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
                        if (usuario) {
                            // Cambia el estado de actividad del usuario en LocalStorage
                            usuario.estaActivo = false;
                            localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
                        }
                        // Redirige a la página de inicio de sesión
                        window.location.href = 'login.html';
                    }
                });
            });
        }
    }
});
