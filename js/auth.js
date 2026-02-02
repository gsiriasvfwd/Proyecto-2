document.addEventListener('DOMContentLoaded', function () {
    const navContainer = document.querySelector('nav');
    if (!navContainer) return;

    renderNav();

    function renderNav() {
        const path = window.location.pathname;
        const page = path.split("/").pop();

        // Regla especial para registro: sin navegación
        if (page === 'register.html') {
            navContainer.classList.add('hidden');
            return;
        }

        // Regla especial para login: solo link a home
        if (page === 'login.html') {
            navContainer.innerHTML = '<ul><li><a href="home.html">Home</a></li></ul>';
            return;
        }

        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
        const isLoggedIn = usuarioActivo && usuarioActivo.estaActivo;

        let navHTML = '<ul>';

        // Opciones comunes para todos (logueados o no)
        navHTML += '<li><a href="home.html">Home</a></li>';
        navHTML += '<li><a href="beca.html">Becas</a></li>';

        if (isLoggedIn) {
            // Opciones según el rol del usuario logueado
            const rol = usuarioActivo.rol;

            if (rol === 'admin') {
                navHTML += '<li><a href="administrador.html">Administrador</a></li>';
            } else if (rol === 'postulante') {
                navHTML += '<li><a href="postulante.html">Mi Historial</a></li>';
                navHTML += '<li><a href="solicitudbeca.html">Solicitud Beca</a></li>';
            } else if (rol === 'evaluador') {
                navHTML += '<li><a href="evaluador.html">Evaluador</a></li>';
            }

            navHTML += '<li><button id="logout" class="btn-logout">Cerrar Sesión</button></li>';
        } else {
            // Opciones para usuarios no logueados o inactivos
            navHTML += '<li><a href="login.html">Iniciar Sesión</a></li>';
            navHTML += '<li><a href="register.html">Registro</a></li>';
        }

        navHTML += '</ul>';
        navContainer.innerHTML = navHTML;

        // Agregar evento de logout si existe el botón
        const logoutBtn = document.getElementById('logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
                    if (usuario) {
                        usuario.estaActivo = false;
                        localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
                    }
                    window.location.href = 'login.html';
                }
            });
        }
    }
});
