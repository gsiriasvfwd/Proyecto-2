/**
 * Script para la vista del Postulante.
 * Muestra el historial de solicitudes enviadas por el usuario logueado.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Referencias a elementos del DOM y datos de sesión
    const filtroEstado = document.getElementById('filtroEstado');
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    // Redirigir al login si no hay un usuario activo
    if (!usuarioActivo) {
        window.location.href = 'login.html';
        return;
    }

    // Cargar la lista inicial de solicitudes del usuario
    cargarHistorial();

    // Actualizar la lista cuando el usuario cambie el filtro de estado
    filtroEstado.addEventListener('change', function () {
        cargarHistorial(this.value);
    });

    /**
     * Redirige al formulario para crear una nueva solicitud de beca.
     */
    const btnSolicitar = document.getElementById('btn-solicitar');
    if (btnSolicitar) {
        btnSolicitar.addEventListener('click', function () {
            window.location.href = 'solicitudbeca.html';
        });
    }

    /**
     * Obtiene las postulaciones de LocalStorage y filtra las que pertenecen al usuario logueado.
     * @param {string} filtro - El estado seleccionado para filtrar los resultados.
     */
    function cargarHistorial(filtro = 'todos') {
        const tbody = document.getElementById('historial');
        const postulaciones = JSON.parse(localStorage.getItem('postulaciones')) || [];

        // Filtrar solo las postulaciones que coinciden con el ID del usuario actual
        let misPostulaciones = postulaciones.filter(p => p.usuarioId === usuarioActivo.id);

        // Aplicar filtro de estado si es diferente a 'todos'
        if (filtro !== 'todos') {
            misPostulaciones = misPostulaciones.filter(p => p.estado === filtro);
        }

        // Manejo de tabla vacía
        if (misPostulaciones.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay postulaciones para mostrar</td></tr>';
            return;
        }

        tbody.innerHTML = '';

        // Renderizar cada fila de la tabla de historial
        misPostulaciones.forEach(post => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${post.convocatoria}</td>
                <td>${post.estudiante.correo}</td>
                <td>${post.estudiante.telefono}</td>
                <td>${post.fecha}</td>
                <td><strong>${post.puntajes.total}</strong></td>
                <td><span class="badge ${post.estado.toLowerCase().replace(/ /g, '-')}">${post.estado}</span></td>
                <td>${post.motivoRechazo || '<em>N/A</em>'}</td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * Función auxiliar para formateo de fechas si fuera necesario en el futuro.
     */
    function formatearFecha(fechaStr) {
        return fechaStr;
    }
});
