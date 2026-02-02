// Script para la página de historial

document.addEventListener('DOMContentLoaded', function () {
    const filtroEstado = document.getElementById('filtroEstado');
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (!usuarioActivo) {
        window.location.href = 'login.html';
        return;
    }

    // Cargar historial al iniciar
    cargarHistorial();

    // Evento de filtro
    filtroEstado.addEventListener('change', function () {
        cargarHistorial(this.value);
    });

    // Redirección a solicitud
    const btnSolicitar = document.getElementById('btn-solicitar');
    if (btnSolicitar) {
        btnSolicitar.addEventListener('click', function () {
            window.location.href = 'solicitudbeca.html';
        });
    }

    // Función para cargar historial
    function cargarHistorial(filtro = 'todos') {
        const tbody = document.getElementById('historial');
        const postulaciones = JSON.parse(localStorage.getItem('postulaciones')) || [];

        // Filtrar solo las del usuario actual
        let misPostulaciones = postulaciones.filter(p => p.usuarioId === usuarioActivo.id);

        // Aplicar filtro de estado
        if (filtro !== 'todos') {
            misPostulaciones = misPostulaciones.filter(p => p.estado === filtro);
        }

        if (misPostulaciones.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay convocatoria por mostrar</td></tr>';
            return;
        }

        tbody.innerHTML = '';

        misPostulaciones.forEach(post => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${post.convocatoria}</td>
                <td>${post.estudiante.correo}</td>
                <td>${post.estudiante.telefono}</td>
                <td>${post.fecha}</td>
                <td><strong>${post.puntajes.total}</strong></td>
                <td><span class="badge ${post.estado.toLowerCase().replace(/ /g, '-')}">${post.estado}</span></td>
                <td>${post.motivoRechazo || '-'}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Función para formatear fecha (ya no es necesaria si usamos post.fecha directamente, 
    // pero la dejamos por si se requiere en otro formato)
    function formatearFecha(fechaStr) {
        return fechaStr;
    }
});
