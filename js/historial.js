// Script para la página de historial

document.addEventListener('DOMContentLoaded', function () {
    const filtroEstado = document.getElementById('filtroEstado');

    // Cargar historial al iniciar
    cargarHistorial();
    actualizarEstadisticas();

    // Evento de filtro
    filtroEstado.addEventListener('change', function () {
        cargarHistorial(this.value);
    });

    // Función para cargar historial
    function cargarHistorial(filtro = 'todos') {
        const tbody = document.getElementById('historial');
        const postulaciones = JSON.parse(localStorage.getItem('postulaciones')) || [];

        // Filtrar postulaciones
        let postulacionesFiltradas = postulaciones;
        if (filtro !== 'todos') {
            postulacionesFiltradas = postulaciones.filter(p => p.estado === filtro);
        }

        if (postulacionesFiltradas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay postulaciones registradas</td></tr>';
            return;
        }

        tbody.innerHTML = '';

        postulacionesFiltradas.forEach(post => {
            const estadoTexto = {
                'pendiente': 'Pendiente',
                'aprobado': 'Aprobado',
                'rechazado': 'Rechazado'
            };

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${post.convocatoria}</td>
                <td>${formatearFecha(post.fecha)}</td>
                <td><span class="badge ${post.estado}">${estadoTexto[post.estado]}</span></td>
                <td>${post.puntaje !== null ? post.puntaje + '/100' : 'Sin evaluar'}</td>
                <td>${post.observaciones || 'Sin observaciones'}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Función para actualizar estadísticas
    function actualizarEstadisticas() {
        const postulaciones = JSON.parse(localStorage.getItem('postulaciones')) || [];

        const total = postulaciones.length;
        const aprobadas = postulaciones.filter(p => p.estado === 'aprobado').length;
        const pendientes = postulaciones.filter(p => p.estado === 'pendiente').length;
        const rechazadas = postulaciones.filter(p => p.estado === 'rechazado').length;

        document.getElementById('totalPostulaciones').textContent = total;
        document.getElementById('totalAprobadas').textContent = aprobadas;
        document.getElementById('totalPendientes').textContent = pendientes;
        document.getElementById('totalRechazadas').textContent = rechazadas;
    }

    // Función para formatear fecha
    function formatearFecha(fecha) {
        const date = new Date(fecha);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const anio = date.getFullYear();
        const hora = String(date.getHours()).padStart(2, '0');
        const minutos = String(date.getMinutes()).padStart(2, '0');

        return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
    }

    // Botón de cerrar sesión
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                window.location.href = 'login.html';
            }
        });
    }
});
