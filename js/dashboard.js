// Script para la página de dashboard

document.addEventListener('DOMContentLoaded', function () {
    // Verificar si hay usuario logueado
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    if (!usuarioActual) {
        alert('⚠️ Debe iniciar sesión para acceder al dashboard');
        window.location.href = 'login.html';
        return;
    }

    // Mostrar mensaje de bienvenida personalizado
    const header = document.querySelector('header p');
    if (header) {
        header.textContent = `Bienvenido, ${usuarioActual.nombre}`;
    }

    // Configurar botones según el rol
    const acciones = document.querySelector('.acciones');
    if (acciones && usuarioActual.rol) {
        acciones.innerHTML = '';

        if (usuarioActual.rol === 'admin') {
            acciones.innerHTML = `
                <a href="convocatorias.html" class="btn">Gestionar Convocatorias</a>
                <a href="evaluador.html" class="btn-secondary">Ver Evaluaciones</a>
            `;
        } else if (usuarioActual.rol === 'evaluador') {
            acciones.innerHTML = `
                <a href="evaluador.html" class="btn">Evaluar Postulantes</a>
                <a href="historial.html" class="btn-secondary">Ver Historial</a>
            `;
        } else {
            acciones.innerHTML = `
                <a href="postulación.html" class="btn">Nueva Postulación</a>
                <a href="historial.html" class="btn-secondary">Mi Historial</a>
            `;
        }
    }

    // Actualizar mensaje de bienvenida en la sección
    const welcomeSection = document.querySelector('section p');
    if (welcomeSection && usuarioActual.rol) {
        const mensajes = {
            'admin': 'Como administrador, puedes gestionar convocatorias, ver evaluaciones y administrar el sistema.',
            'evaluador': 'Como evaluador, puedes revisar y calificar las postulaciones de los estudiantes.',
            'postulante': 'Puedes postular a becas disponibles y revisar el estado de tus solicitudes.'
        };
        welcomeSection.textContent = mensajes[usuarioActual.rol] || 'Accede a las diferentes secciones del sistema.';
    }

    // Botón de cerrar sesión
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                localStorage.removeItem('usuarioActual');
                alert('✅ Sesión cerrada exitosamente');
                window.location.href = 'login.html';
            }
        });
    }

    // Animación de entrada para los botones
    setTimeout(() => {
        const buttons = document.querySelectorAll('.btn, .btn-secondary');
        buttons.forEach((btn, index) => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';

            setTimeout(() => {
                btn.style.transition = 'all 0.5s ease';
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    }, 300);

    // Cargar estadísticas si el usuario es postulante
    if (usuarioActual.rol === 'postulante') {
        cargarEstadisticas();
    }

    function cargarEstadisticas() {
        const postulaciones = JSON.parse(localStorage.getItem('postulaciones')) || [];
        const misPostulaciones = postulaciones.filter(p => p.email === usuarioActual.email);

        if (misPostulaciones.length > 0) {
            const section = document.querySelector('section');
            const statsDiv = document.createElement('div');
            statsDiv.style.marginTop = '2rem';
            statsDiv.style.padding = '1.5rem';
            statsDiv.style.background = 'linear-gradient(135deg, var(--verde-claro) 0%, var(--verde-medio) 100%)';
            statsDiv.style.borderRadius = '10px';
            statsDiv.style.color = 'white';
            statsDiv.innerHTML = `
                <h3 style="margin-bottom: 1rem;">📊 Resumen Rápido</h3>
                <p><strong>Total de postulaciones:</strong> ${misPostulaciones.length}</p>
                <p><strong>Pendientes:</strong> ${misPostulaciones.filter(p => p.estado === 'pendiente').length}</p>
                <p><strong>Aprobadas:</strong> ${misPostulaciones.filter(p => p.estado === 'aprobado').length}</p>
            `;
            section.appendChild(statsDiv);
        }
    }
});
