// Script para la página de convocatorias

document.addEventListener('DOMContentLoaded', function () {
    const btnGuardar = document.getElementById('btnGuardar');
    const btnLimpiar = document.getElementById('btnLimpiar');

    // Cargar convocatorias existentes
    cargarConvocatorias();

    // Botón de guardar convocatoria
    btnGuardar.addEventListener('click', function () {
        // Obtener valores
        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const tipo = document.getElementById('tipo').value;
        const inicio = document.getElementById('inicio').value;
        const cierre = document.getElementById('cierre').value;

        // Validaciones
        if (!nombre.trim()) {
            alert('⚠️ Por favor ingrese el nombre de la convocatoria');
            return;
        }

        if (!tipo) {
            alert('⚠️ Por favor seleccione el tipo de beca');
            return;
        }

        if (!inicio || !cierre) {
            alert('⚠️ Por favor ingrese las fechas de inicio y cierre');
            return;
        }

        if (cierre < inicio) {
            alert('⚠️ La fecha de cierre no puede ser anterior a la fecha de inicio');
            return;
        }

        // Crear objeto de convocatoria
        const convocatoriaData = {
            id: Date.now(),
            nombre: nombre,
            descripcion: descripcion,
            tipo: tipo,
            inicio: inicio,
            cierre: cierre,
            estado: obtenerEstado(inicio, cierre)
        };

        // Guardar en localStorage
        let convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];
        convocatorias.push(convocatoriaData);
        localStorage.setItem('convocatorias', JSON.stringify(convocatorias));

        alert('✅ Convocatoria guardada exitosamente!');

        limpiarFormulario();
        cargarConvocatorias();
    });

    // Botón de limpiar
    btnLimpiar.addEventListener('click', limpiarFormulario);

    // Función para limpiar el formulario
    function limpiarFormulario() {
        document.getElementById('nombre').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('tipo').value = '';
        document.getElementById('inicio').value = '';
        document.getElementById('cierre').value = '';
    }

    // Función para determinar el estado
    function obtenerEstado(inicio, cierre) {
        const hoy = new Date().toISOString().split('T')[0];

        if (hoy < inicio) {
            return 'proximo';
        } else if (hoy >= inicio && hoy <= cierre) {
            return 'activo';
        } else {
            return 'cerrado';
        }
    }

    // Función para cargar convocatorias en la tabla
    function cargarConvocatorias() {
        const tbody = document.getElementById('listaConvocatorias');
        const convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];

        if (convocatorias.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay convocatorias registradas</td></tr>';
            return;
        }

        tbody.innerHTML = '';

        convocatorias.forEach((conv, index) => {
            const estado = obtenerEstado(conv.inicio, conv.cierre);
            const estadoTexto = {
                'activo': 'Activo',
                'proximo': 'Próximo',
                'cerrado': 'Cerrado'
            };

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${conv.nombre}</td>
                <td><span class="badge">${conv.tipo.charAt(0).toUpperCase() + conv.tipo.slice(1)}</span></td>
                <td>${formatearFecha(conv.inicio)}</td>
                <td>${formatearFecha(conv.cierre)}</td>
                <td><span class="badge ${estado}">${estadoTexto[estado]}</span></td>
                <td>
                    <button class="btn-tabla btn-editar" onclick="editarConvocatoria(${conv.id})">Editar</button>
                    <button class="btn-tabla btn-eliminar" onclick="eliminarConvocatoria(${conv.id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Función para formatear fecha
    function formatearFecha(fecha) {
        const partes = fecha.split('-');
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    // Funciones globales para editar y eliminar
    window.editarConvocatoria = function (id) {
        const convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];
        const conv = convocatorias.find(c => c.id === id);

        if (conv) {
            document.getElementById('nombre').value = conv.nombre;
            document.getElementById('descripcion').value = conv.descripcion;
            document.getElementById('tipo').value = conv.tipo;
            document.getElementById('inicio').value = conv.inicio;
            document.getElementById('cierre').value = conv.cierre;

            // Eliminar la convocatoria antigua
            eliminarConvocatoria(id, false);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    window.eliminarConvocatoria = function (id, confirmar = true) {
        if (confirmar && !confirm('¿Está seguro de eliminar esta convocatoria?')) {
            return;
        }

        let convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];
        convocatorias = convocatorias.filter(c => c.id !== id);
        localStorage.setItem('convocatorias', JSON.stringify(convocatorias));

        if (confirmar) {
            alert('Convocatoria eliminada exitosamente');
        }

        cargarConvocatorias();
    };

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
