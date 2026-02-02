// Script para la página de convocatorias

document.addEventListener('DOMContentLoaded', function () {
    const btnGuardar = document.getElementById('btnGuardar');

    // Becas fijas oficiales con estructura de criterios dinámica
    const becasFijas = [
        {
            id: 'raiz-solidaria',
            nombre: 'Beca Raíz Solidaria',
            tipo: 'socioeconomica',
            inicio: '2026-01-01',
            cierre: '2026-02-28',
            promedioMinimo: 7.0,
            criterios: {
                economico: { nombre: 'Situación Económica', min: 0, max: 40 },
                academico: { nombre: 'Rendimiento Académico', min: 0, max: 30 },
                social: { nombre: 'Contexto Social', min: 0, max: 30 }
            }
        },
        {
            id: 'brote',
            nombre: 'Beca Brote',
            tipo: 'economica',
            inicio: '2026-02-01',
            cierre: '2026-03-31',
            promedioMinimo: 7.5,
            criterios: {
                economico: { nombre: 'Situación Económica', min: 0, max: 40 },
                academico: { nombre: 'Rendimiento Académico', min: 0, max: 30 },
                social: { nombre: 'Contexto Social', min: 0, max: 30 }
            }
        },
        {
            id: 'germen',
            nombre: 'Beca Germen',
            tipo: 'economica',
            inicio: '2025-10-01',
            cierre: '2025-12-15',
            promedioMinimo: 8.0,
            criterios: {
                economico: { nombre: 'Situación Económica', min: 0, max: 40 },
                academico: { nombre: 'Rendimiento Académico', min: 0, max: 30 },
                social: { nombre: 'Contexto Social', min: 0, max: 30 }
            }
        },
        {
            id: 'cultivo-merito',
            nombre: 'Beca Cultivo del Mérito',
            tipo: 'academica',
            inicio: '2026-03-01',
            cierre: '2026-04-15',
            promedioMinimo: 9.0,
            criterios: {
                economico: { nombre: 'Situación Económica', min: 0, max: 40 },
                academico: { nombre: 'Rendimiento Académico', min: 0, max: 30 },
                social: { nombre: 'Contexto Social', min: 0, max: 30 }
            }
        },
        {
            id: 'cosecha-saber',
            nombre: 'Beca Cosecha del Saber',
            tipo: 'academica',
            inicio: '2026-01-15',
            cierre: '2026-02-15',
            promedioMinimo: 8.5,
            criterios: {
                economico: { nombre: 'Situación Económica', min: 0, max: 40 },
                academico: { nombre: 'Rendimiento Académico', min: 0, max: 30 },
                social: { nombre: 'Contexto Social', min: 0, max: 30 }
            }
        },
        {
            id: 'impulso-deportivo',
            nombre: 'Beca Impulso Deportivo',
            tipo: 'deportiva',
            inicio: '2026-02-01',
            cierre: '2026-03-31',
            promedioMinimo: 7.5,
            criterios: {
                economico: { nombre: 'Situación Económica', min: 0, max: 40 },
                academico: { nombre: 'Rendimiento Académico', min: 0, max: 30 },
                social: { nombre: 'Contexto Social', min: 0, max: 30 }
            }
        }
    ];

    // Inicializar convocatorias con los datos oficiales revisados
    const convocatoriasGuardadas = JSON.parse(localStorage.getItem('convocatorias'));
    // Si no existen o si queremos resetear para aplicar la nueva estructura
    if (!convocatoriasGuardadas || !convocatoriasGuardadas[0].criterios) {
        localStorage.setItem('convocatorias', JSON.stringify(becasFijas));
    }

    cargarConvocatorias();

    btnGuardar.addEventListener('click', function () {
        const idEditando = btnGuardar.getAttribute('data-id');
        if (!idEditando) {
            alert('⚠️ Seleccione una beca de la tabla para editar sus fechas o criterios.');
            return;
        }

        const inicio = document.getElementById('inicio').value;
        const cierre = document.getElementById('cierre').value;
        const promedioMinimo = parseFloat(document.getElementById('promedioMinimo').value);

        const criterios = {
            economico: {
                nombre: document.getElementById('nombreEconomico').value,
                min: parseInt(document.getElementById('minEconomico').value),
                max: parseInt(document.getElementById('maxEconomico').value)
            },
            academico: {
                nombre: document.getElementById('nombreAcademico').value,
                min: parseInt(document.getElementById('minAcademico').value),
                max: parseInt(document.getElementById('maxAcademico').value)
            },
            social: {
                nombre: document.getElementById('nombreSocial').value,
                min: parseInt(document.getElementById('minSocial').value),
                max: parseInt(document.getElementById('maxSocial').value)
            }
        };

        if (!inicio || !cierre || isNaN(promedioMinimo)) {
            alert('⚠️ Por favor complete las fechas y el promedio mínimo.');
            return;
        }

        if (cierre < inicio) {
            alert('⚠️ La fecha de cierre no puede ser anterior a la fecha de inicio');
            return;
        }

        let convocatorias = JSON.parse(localStorage.getItem('convocatorias'));
        convocatorias = convocatorias.map(c => {
            if (c.id === idEditando) {
                // Actualizamos requisitos (string descriptivo para mantener compatibilidad si se viera en otro lado)
                const requisitos = `Promedio mínimo: ${promedioMinimo}\n${criterios.economico.nombre}: ${criterios.economico.min}-${criterios.economico.max}\n${criterios.academico.nombre}: ${criterios.academico.min}-${criterios.academico.max}\n${criterios.social.nombre}: ${criterios.social.min}-${criterios.social.max}`;
                return { ...c, inicio, cierre, promedioMinimo, criterios, requisitos };
            }
            return c;
        });

        localStorage.setItem('convocatorias', JSON.stringify(convocatorias));
        alert('✅ Convocatoria actualizada exitosamente!');
        limpiarFormulario();
        cargarConvocatorias();

        document.getElementById('seccion-registradas').scrollIntoView({ behavior: 'smooth' });
    });

    function limpiarFormulario() {
        document.getElementById('nombre').value = '';
        document.getElementById('promedioMinimo').value = '';
        document.getElementById('nombreEconomico').value = '';
        document.getElementById('minEconomico').value = '';
        document.getElementById('maxEconomico').value = '';
        document.getElementById('nombreAcademico').value = '';
        document.getElementById('minAcademico').value = '';
        document.getElementById('maxAcademico').value = '';
        document.getElementById('nombreSocial').value = '';
        document.getElementById('minSocial').value = '';
        document.getElementById('maxSocial').value = '';
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
                    <button class="btn-tabla btn-editar" data-id="${conv.id}">Editar</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Event delegation for edit buttons
        tbody.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function () {
                editarConvocatoria(this.getAttribute('data-id'));
            });
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
            document.getElementById('inicio').value = conv.inicio;
            document.getElementById('cierre').value = conv.cierre;

            // Campos dinámicos
            document.getElementById('promedioMinimo').value = conv.promedioMinimo || '';

            if (conv.criterios) {
                document.getElementById('nombreEconomico').value = conv.criterios.economico.nombre;
                document.getElementById('minEconomico').value = conv.criterios.economico.min;
                document.getElementById('maxEconomico').value = conv.criterios.economico.max;

                document.getElementById('nombreAcademico').value = conv.criterios.academico.nombre;
                document.getElementById('minAcademico').value = conv.criterios.academico.min;
                document.getElementById('maxAcademico').value = conv.criterios.academico.max;

                document.getElementById('nombreSocial').value = conv.criterios.social.nombre;
                document.getElementById('minSocial').value = conv.criterios.social.min;
                document.getElementById('maxSocial').value = conv.criterios.social.max;
            }

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
    // Estadísticas Globales para el Administrador
    function actualizarEstadisticas() {
        const postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];
        const total = postulaciones.length;
        const aprobadas = postulaciones.filter(p => p.estado === 'Aprobada').length;
        const pendientes = postulaciones.filter(p => p.estado === 'Enviada' || p.estado === 'En revisión').length;
        const rechazadas = postulaciones.filter(p => p.estado === 'Rechazada').length;

        const elTotal = document.getElementById('totalPostulaciones');
        const elAprobadas = document.getElementById('totalAprobadas');
        const elPendientes = document.getElementById('totalPendientes');
        const elRechazadas = document.getElementById('totalRechazadas');

        if (elTotal) elTotal.textContent = total;
        if (elAprobadas) elAprobadas.textContent = aprobadas;
        if (elPendientes) elPendientes.textContent = pendientes;
        if (elRechazadas) elRechazadas.textContent = rechazadas;
    }

    actualizarEstadisticas();
});
