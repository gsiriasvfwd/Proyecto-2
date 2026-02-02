/**
 * FUNCIONAMIENTO Y LÓGICA (JavaScript)
 * Este archivo contiene toda la lógica de negocio, manipulación del DOM
 * y persistencia de datos. Separándolo de la estructura (HTML).
 */

(function () {
    const lista = document.getElementById("lista");
    const btnBorrarTodo = document.getElementById("btnBorrarTodo");
    const filtroEstado = document.getElementById("filtroEstado");

    let postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];

    /**
     * Renderiza la estructura dinámica dentro del contenedor HTML
     */
    function renderizarPostulaciones(filtro = 'todos') {
        if (postulaciones.length === 0) {
            lista.innerHTML = "<p>No hay postulaciones registradas.</p>";
            return;
        }

        lista.innerHTML = ""; // Limpiar antes de re-dibujar

        let postulacionesAMostrar = postulaciones;
        if (filtro !== 'todos') {
            postulacionesAMostrar = postulaciones.filter(p => p.estado === filtro);
        }

        postulacionesAMostrar.forEach((p, index) => {
            const article = document.createElement("article");
            article.classList.add("postulacion-card");
            if (p.expanded) article.classList.add("expanded");

            article.innerHTML = `
        <div class="postulacion-header">
            <div class="header-info">
                <h3>${p.estudiante.nombre}</h3>
                <span class="badge ${p.estado.toLowerCase().replace(/ /g, '-')}">${p.estado}</span>
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
                  <button data-action="eliminar" data-index="${index}">Eliminar</button>
                </div>
            </div>
        </div>
      `;

            lista.appendChild(article);
        });
    }

    /**
     * Manejador de eventos (Funcionamiento)
     */
    lista.addEventListener("click", (e) => {
        const target = e.target;

        // Manejo de Ver más
        if (target.classList.contains("btn-ver-mas")) {
            const index = parseInt(target.getAttribute("data-index"));
            const p = postulaciones[index];

            p.expanded = !p.expanded;

            // Al abrir, si está "Enviada", pasar a "En revisión"
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

        if (action === "aprobar") {
            cambiarEstado(index, "Aprobada");
        } else if (action === "rechazar") {
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
        } else if (action === "eliminar") {
            eliminarPostulacion(index);
        }
    });

    function cambiarEstado(index, nuevoEstado, motivo = "") {
        postulaciones[index].state = nuevoEstado.toLowerCase().replace(/ /g, '-');
        postulaciones[index].estado = nuevoEstado;
        if (nuevoEstado === "Rechazada") {
            postulaciones[index].motivoRechazo = motivo;
        } else {
            postulaciones[index].motivoRechazo = ""; // Limpiar si se aprueba
        }
        actualizarStorage();
        renderizarPostulaciones(filtroEstado.value);
    }

    function eliminarPostulacion(index) {
        if (confirm("¿Desea eliminar este registro?")) {
            postulaciones.splice(index, 1);
            actualizarStorage();
            renderizarPostulaciones(filtroEstado.value);
        }
    }

    function actualizarStorage() {
        localStorage.setItem("postulaciones", JSON.stringify(postulaciones));
    }

    btnBorrarTodo.addEventListener("click", () => {
        if (confirm("¿Eliminar TODAS las postulaciones?")) {
            postulaciones = [];
            actualizarStorage();
            renderizarPostulaciones(filtroEstado.value);
        }
    });

    filtroEstado.addEventListener("change", (e) => {
        renderizarPostulaciones(e.target.value);
    });

    // Ejecución inicial de la lógica
    renderizarPostulaciones();
})();
