// Script para la página de convocatorias

document.addEventListener('DOMContentLoaded', function () {
    const btnGuardar = document.getElementById('btnGuardar');
    const btnLimpiar = document.getElementById('btnLimpiar');

    // Becas fijas oficiales
    const becasFijas = [
        {
            id: 'raiz-solidaria',
            nombre: 'Beca Raíz Solidaria',
            tipo: 'socioeconomica',
            inicio: '2026-01-01',
            cierre: '2026-02-28',
            requisitos: 'Promedio académico mínimo: 7.0\nPuntaje mínimo en Situación Económica: 30 / 40\nPuntaje mínimo en Contexto Social: 20 / 30\nPuntaje mínimo en Rendimiento Académico: 15 / 30\nllevar una foto tamaño pasaporte'
        },
        {
            id: 'brote',
            nombre: 'Beca Brote',
            tipo: 'economica',
            inicio: '2026-02-01',
            cierre: '2026-03-31',
            requisitos: 'Promedio académico mínimo: 7.5\nPuntaje mínimo en Situación Económica: 25 / 40\nPuntaje mínimo en Rendimiento Académico: 18 / 30\nPuntaje mínimo en Contexto Social: 15 / 30\nllevar una foto tamaño pasaporte'
        },
        {
            id: 'germen',
            nombre: 'Beca Germen',
            tipo: 'economica',
            inicio: '2025-10-01',
            cierre: '2025-12-15',
            requisitos: 'Promedio académico mínimo: 8.0\nPuntaje mínimo en Situación Económica: 28 / 40\nPuntaje mínimo en Rendimiento Académico: 20 / 30\nPuntaje mínimo en Contexto Social: 15 / 30\nllevar una foto tamaño pasaporte'
        },
        {
            id: 'cultivo-merito',
            nombre: 'Beca Cultivo del Mérito',
            tipo: 'academica',
            inicio: '2026-03-01',
            cierre: '2026-04-15',
            requisitos: 'Promedio académico mínimo: 9.0\nPuntaje mínimo en Rendimiento Académico: 25 / 30\nPuntaje mínimo en Contexto Social: 15 / 30\nPuntaje mínimo en Situación Económica: 10 / 40\nllevar una foto tamaño pasaporte'
        },
        {
            id: 'cosecha-saber',
            nombre: 'Beca Cosecha del Saber',
            tipo: 'academica',
            inicio: '2026-01-15',
            cierre: '2026-02-15',
            requisitos: 'Promedio académico mínimo: 8.5\nPuntaje mínimo en Rendimiento Académico: 22 / 30\nPuntaje mínimo en Situación Económica: 18 / 40\nPuntaje mínimo en Contexto Social: 15 / 30\nllevar una foto tamaño pasaporte'
        },
        {
            id: 'impulso-deportivo',
            nombre: 'Beca Impulso Deportivo',
            tipo: 'deportiva',
            inicio: '2026-02-01',
            cierre: '2026-03-31',
            requisitos: 'Promedio académico mínimo: 7.5\nPuntaje mínimo en Contexto Social: 25 / 30\nPuntaje mínimo en Rendimiento Académico: 18 / 30\nPuntaje mínimo en Situación Económica: 15 / 40\nllevar una foto tamaño pasaporte'
        }
    ];

    // Inicializar convocatorias con los datos oficiales
    const convocatoriasGuardadas = JSON.parse(localStorage.getItem('convocatorias'));
    if (!convocatoriasGuardadas || convocatoriasGuardadas.length !== 6) {
        localStorage.setItem('convocatorias', JSON.stringify(becasFijas));
    }

    cargarConvocatorias();

    // El administrador solo puede EDITAR, no crear ni eliminar.
    // Ocultaremos los botones de crear y eliminar si es necesario, 
    // pero por ahora limitaremos la lógica de guardado.

    btnGuardar.addEventListener('click', function () {
        const idEditando = btnGuardar.getAttribute('data-id');
        if (!idEditando) {
            alert('⚠️ Seleccione una beca de la tabla para editar sus fechas o requisitos.');
            return;
        }

        const inicio = document.getElementById('inicio').value;
        const cierre = document.getElementById('cierre').value;
        const requisitos = document.getElementById('descripcion').value; // Usamos el campo descripción para requisitos

        if (!inicio || !cierre || !requisitos.trim()) {
            alert('⚠️ Por favor complete las fechas y los requisitos.');
            return;
        }

        if (cierre < inicio) {
            alert('⚠️ La fecha de cierre no puede ser anterior a la fecha de inicio');
            return;
        }

        let convocatorias = JSON.parse(localStorage.getItem('convocatorias'));
        convocatorias = convocatorias.map(c => {
            if (c.id === idEditando) {
                return { ...c, inicio, cierre, requisitos };
            }
            return c;
        });

        localStorage.setItem('convocatorias', JSON.stringify(convocatorias));
        alert('✅ Convocatoria actualizada exitosamente!');
        limpiarFormulario();
        cargarConvocatorias();

        // Enviar arriba a Convocatorias Registradas
        document.getElementById('seccion-registradas').scrollIntoView({ behavior: 'smooth' });
    });

    btnLimpiar.addEventListener('click', limpiarFormulario);

    function limpiarFormulario() {
        document.getElementById('nombre').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('inicio').value = '';
        document.getElementById('cierre').value = '';
        btnGuardar.removeAttribute('data-id');
        btnGuardar.textContent = 'Actualizar Convocatoria';
    }

    function obtenerEstado(inicio, cierre) {
        const hoy = new Date().toISOString().split('T')[0];
        if (hoy < inicio) return 'proximo';
        if (hoy >= inicio && hoy <= cierre) return 'activo';
        return 'cerrado';
    }

    function cargarConvocatorias() {
        const tbody = document.getElementById('listaConvocatorias');
        const convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];

        tbody.innerHTML = '';
        convocatorias.forEach(conv => {
            const estado = obtenerEstado(conv.inicio, conv.cierre);
            const estadoTexto = { 'activo': 'Activo', 'proximo': 'Próximo', 'cerrado': 'Cerrado' };

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${conv.nombre}</td>
                <td><span class="badge">${conv.tipo.charAt(0).toUpperCase() + conv.tipo.slice(1)}</span></td>
                <td>${formatearFecha(conv.inicio)}</td>
                <td>${formatearFecha(conv.cierre)}</td>
                <td><span class="badge ${estado}">${estadoTexto[estado]}</span></td>
                <td>
                    <button class="btn-tabla btn-editar" onclick="editarConvocatoria('${conv.id}')">Editar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function formatearFecha(fecha) {
        if (!fecha) return '-';
        const partes = fecha.split('-');
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    window.editarConvocatoria = function (id) {
        const convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];
        const conv = convocatorias.find(c => c.id === id);

        if (conv) {
            document.getElementById('nombre').value = conv.nombre;
            document.getElementById('descripcion').value = conv.requisitos || '';
            document.getElementById('inicio').value = conv.inicio;
            document.getElementById('cierre').value = conv.cierre;

            btnGuardar.setAttribute('data-id', id);
            btnGuardar.textContent = 'Guardar Cambios';

            // Scroll al formulario para editar
            document.getElementById('convocatoria').scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Eliminamos la función eliminarConvocatoria ya que son fijas
    window.eliminarConvocatoria = function () {
        alert('No se pueden eliminar las becas base del sistema.');
    };
});
