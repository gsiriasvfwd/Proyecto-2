/**
 * Lógica para la interfaz del Evaluador.
 * Permite visualizar, filtrar y gestionar (aprobar/rechazar) las postulaciones recibidas.
 * Utiliza LocalStorage para la persistencia y SweetAlert2 para interacciones enriquecidas.
 */

(function () {
    // Referencias a elementos del DOM
    const lista = document.getElementById("lista");
    const filtroEstado = document.getElementById("filtroEstado");

    // Obtener postulaciones almacenadas o inicializar con un array vacío
    let postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];

    /**
     * Genera dinámicamente el HTML para mostrar las postulaciones.
     * @param {string} filtro - El estado por el cual filtrar (todos, enviada, aprobada, etc).
     */
    function renderizarPostulaciones(filtro = 'todos') {
        // Mensaje si no hay datos
        if (postulaciones.length === 0) {
            lista.innerHTML = "<p>No hay postulaciones registradas.</p>";
            return;
        }

        lista.innerHTML = ""; // Limpia el contenedor antes de renderizar

        // Filtrar postulaciones según el estado seleccionado
        let postulacionesAMostrar = postulaciones;
        if (filtro !== 'todos') {
            postulacionesAMostrar = postulaciones.filter(p => p.estado === filtro);
        }

        // Crear tarjetas para cada postulación
        postulacionesAMostrar.forEach((p, index) => {
            const article = document.createElement("article");
            article.classList.add("postulacion-card");
            if (p.expanded) article.classList.add("expanded");

            article.innerHTML = `
        <div class="postulacion-header">
            <div class="header-center">
                <h3>${p.estudiante.nombre}</h3>
                <p class="estado-wrapper">Estado: <span class="badge ${p.estado.toLowerCase().replace(/ /g, '-')}">${p.estado}</span></p>
            </div>
            <button class="btn-ver-mas" data-index="${index}">${p.expanded ? 'Cerrar' : 'Ver más'}</button>
        </div>

        <div class="postulacion-detalles ${p.expanded ? 'show' : ''}">
            <div class="detalles-grid">
                <div class="info-grupo">
                    <h4>Datos del Postulante</h4>
                    <p><strong>Beca:</strong> ${p.convocatoria}</p>
                    <p><strong>Fecha:</strong> ${p.fecha || 'N/A'}</p>
                    <p><strong>Correo:</strong> ${p.estudiante.correo}</p>
                    <p><strong>Teléfono:</strong> ${p.estudiante.telefono}</p>
                    <p><strong>Cédula:</strong> ${p.estudiante.cedula || 'N/A'}</p>
                    <p><strong>Edad:</strong> ${p.estudiante.edad || 'N/A'}</p>
                </div>
                <div class="info-grupo">
                    <h4>Puntajes y Académico</h4>
                    <p><strong>Promedio:</strong> ${p.estudiante.promedio || 'N/A'}</p>
                    <p><strong>${p.criteriosNombres ? p.criteriosNombres.economico : 'Económico'}:</strong> ${p.puntajes.economico}</p>
                    <p><strong>${p.criteriosNombres ? p.criteriosNombres.academico : 'Académico'}:</strong> ${p.puntajes.academico}</p>
                    <p><strong>${p.criteriosNombres ? p.criteriosNombres.social : 'Social'}:</strong> ${p.puntajes.social}</p>
                    <p class="total-destacado"><strong>Puntaje Total:</strong> ${p.puntajes.total}</p>
                </div>
            </div>
            <div class="info-comentarios">
                <h4>Comentarios</h4>
                <p>${p.estudiante.comentarios || '<em>Sin comentarios</em>'}</p>
            </div>
            
            <div class="postulacion-acciones">
                <div class="controles">
                  <button data-action="aprobar" data-index="${index}">Aprobar</button>
                  <button data-action="rechazar" data-index="${index}">Rechazar</button>
                </div>
            </div>
        </div>
      `;

            lista.appendChild(article);
        });
    }

    /**
     * Manejador de eventos para clicks dentro de la lista de postulaciones.
     * Utiliza delegación de eventos para mayor eficiencia.
     */
    lista.addEventListener("click", (e) => {
        const target = e.target;

        // Lógica para expandir/colapsar detalles
        if (target.classList.contains("btn-ver-mas")) {
            const index = parseInt(target.getAttribute("data-index"));
            const p = postulaciones[index];

            p.expanded = !p.expanded;

            // Al abrir por primera vez una postulación "Enviada", cambia su estado a "En revisión"
            if (p.expanded && p.estado === "Enviada") {
                p.estado = "En revisión";
                p.state = "en-revision";
            }

            actualizarStorage();
            renderizarPostulaciones(filtroEstado.value);
            return;
        }

        if (target.tagName !== "BUTTON") return;

        const action = target.getAttribute("data-action");
        const index = parseInt(target.getAttribute("data-index"));

        // Acciones sobre la postulación
        if (action === "aprobar") {
            cambiarEstado(index, "Aprobada");
        } else if (action === "rechazar") {
            // Solicitar motivo de rechazo mediante SweetAlert
            Swal.fire({
                title: 'Motivo de rechazo',
                input: 'textarea',
                inputPlaceholder: 'Escriba el motivo del rechazo aquí...',
                showCancelButton: true,
                confirmButtonText: 'Rechazar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#e74c3c',
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    cambiarEstado(index, "Rechazada", result.value);
                } else if (result.isConfirmed) {
                    Swal.fire('Error', 'Debe proporcionar un motivo para rechazar', 'error');
                }
            });
        }
    });

    /**
     * Cambia el estado de una postulación y actualiza la persistencia.
     */
    function cambiarEstado(index, nuevoEstado, motivo = "") {
        postulaciones[index].state = nuevoEstado.toLowerCase().replace(/ /g, '-');
        postulaciones[index].estado = nuevoEstado;
        if (nuevoEstado === "Rechazada") {
            postulaciones[index].motivoRechazo = motivo;
        } else {
            postulaciones[index].motivoRechazo = ""; // Limpiar motivo si se aprueba
        }
        actualizarStorage();
        renderizarPostulaciones(filtroEstado.value);
    }


    /**
     * Guarda el estado actual de las postulaciones en LocalStorage.
     */
    function actualizarStorage() {
        localStorage.setItem("postulaciones", JSON.stringify(postulaciones));
    }


    // Evento para filtrar la lista basándose en la selección del usuario
    filtroEstado.addEventListener("change", (e) => {
        renderizarPostulaciones(e.target.value);
    });

    // Carga inicial de datos
    renderizarPostulaciones();
})();
