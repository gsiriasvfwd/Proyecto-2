/**
 * Script para la gestión de convocatorias por parte del administrador.
 * Permite editar fechas, requisitos y criterios de evaluación de las becas existentes.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Referencia al botón para guardar o actualizar la convocatoria
    const btnGuardar = document.getElementById('btnGuardar');

    /**
     * Definición de becas fijas iniciales con su configuración base.
     * Incluye id, nombre, tipo, fechas, promedio mínimo y criterios de evaluación dinámicos.
     */
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

    // Cargar convocatorias desde LocalStorage o inicializarlas con los datos fijos
    const convocatoriasGuardadas = JSON.parse(localStorage.getItem('convocatorias'));
    if (!convocatoriasGuardadas || !convocatoriasGuardadas[0].criterios) {
        localStorage.setItem('convocatorias', JSON.stringify(becasFijas));
    }

    // Mostrar las convocatorias en la tabla al cargar la página
    cargarConvocatorias();

    /**
     * Evento para guardar los cambios realizados en una convocatoria seleccionada.
     */
    btnGuardar.addEventListener('click', function () {
        const idEditando = btnGuardar.getAttribute('data-id');
        if (!idEditando) {
            Swal.fire({
                icon: 'info',
                title: 'Selección requerida',
                text: 'Seleccione una beca de la tabla para editar sus fechas o criterios.'
            });
            return;
        }

        // Obtener valores de los campos del formulario
        const inicio = document.getElementById('inicio').value;
        const cierre = document.getElementById('cierre').value;
        const promedioMinimo = parseFloat(document.getElementById('promedioMinimo').value);

        // Estructura de criterios de evaluación
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

        // Validaciones básicas
        if (!inicio || !cierre || isNaN(promedioMinimo)) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor complete las fechas y el promedio mínimo.'
            });
            return;
        }

        if (cierre < inicio) {
            Swal.fire({
                icon: 'error',
                title: 'Error en fechas',
                text: 'La fecha de cierre no puede ser anterior a la fecha de inicio'
            });
            return;
        }

        // Actualizar la lista de convocatorias en LocalStorage
        let convocatorias = JSON.parse(localStorage.getItem('convocatorias'));
        convocatorias = convocatorias.map(c => {
            if (c.id === idEditando) {
                // Generar string de requisitos para compatibilidad
                const requisitos = `Promedio mínimo: ${promedioMinimo}\n${criterios.economico.nombre}: ${criterios.economico.min}-${criterios.economico.max}\n${criterios.academico.nombre}: ${criterios.academico.min}-${criterios.academico.max}\n${criterios.social.nombre}: ${criterios.social.min}-${criterios.social.max}`;
                return { ...c, inicio, cierre, promedioMinimo, criterios, requisitos };
            }
            return c;
        });

        localStorage.setItem('convocatorias', JSON.stringify(convocatorias));

        Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'Convocatoria actualizada exitosamente!',
            showConfirmButton: false,
            timer: 1500
        });

        limpiarFormulario();
        cargarConvocatorias();

        // Desplazarse a la sección de convocatorias registradas
        document.getElementById('seccion-registradas').scrollIntoView({ behavior: 'smooth' });
    });

    /**
     * Limpia todos los campos del formulario y resetea el botón de guardado.
     */
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

    /**
     * Determina el estado de una convocatoria (activo, próximo, cerrado) según la fecha actual.
     */
    function obtenerEstado(inicio, cierre) {
        const hoy = new Date().toISOString().split('T')[0];
        if (hoy < inicio) return 'proximo';
        if (hoy >= inicio && hoy <= cierre) return 'activo';
        return 'cerrado';
    }

    /**
     * Carga y muestra todas las convocatorias en la tabla del DOM.
     */
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

        // Asignar eventos a los botones de edición (delegación de eventos)
        tbody.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function () {
                editarConvocatoria(this.getAttribute('data-id'));
            });
        });
    }

    /**
     * Formatea una fecha de YYYY-MM-DD a DD/MM/YYYY.
     */
    function formatearFecha(fecha) {
        if (!fecha) return '-';
        const partes = fecha.split('-');
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    /**
     * Prepara el formulario con los datos de una convocatoria específica para su edición.
     */
    window.editarConvocatoria = function (id) {
        const convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];
        const conv = convocatorias.find(c => c.id === id);

        if (conv) {
            document.getElementById('nombre').value = conv.nombre;
            document.getElementById('inicio').value = conv.inicio;
            document.getElementById('cierre').value = conv.cierre;
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

            // Desplazarse al formulario de edición
            document.getElementById('convocatoria').scrollIntoView({ behavior: 'smooth' });
        }
    };

    /**
     * Muestra alerta indicando que no se pueden eliminar becas base.
     */
    window.eliminarConvocatoria = function () {
        Swal.fire({
            icon: 'error',
            title: 'Acción no permitida',
            text: 'No se pueden eliminar las becas base del sistema.'
        });
    };

    /**
     * Calcula y actualiza las estadísticas globales de postulaciones en el dashboard.
     */
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

    // Actualizar estadísticas al cargar
    actualizarEstadisticas();
});
