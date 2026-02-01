/**
 * FUNCIONAMIENTO Y LÓGICA (JavaScript)
 * Este archivo contiene toda la lógica de negocio, manipulación del DOM
 * y persistencia de datos. Separándolo de la estructura (HTML).
 */

(function () {
    const lista = document.getElementById("lista");
    const btnBorrarTodo = document.getElementById("btnBorrarTodo");

    let postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];

    /**
     * Renderiza la estructura dinámica dentro del contenedor HTML
     */
    function renderizarPostulaciones() {
        actualizarEstadisticas();
        if (postulaciones.length === 0) {
            lista.innerHTML = "<p>No hay postulaciones registradas.</p>";
            return;
        }

        lista.innerHTML = ""; // Limpiar antes de re-dibujar

        postulaciones.forEach((p, index) => {
            const article = document.createElement("article");

            article.innerHTML = `
        <div class="postulacion-info">
            <h3>${p.estudiante.nombre} <small>${p.convocatoria}</small></h3>
            <p><strong>Fecha de solicitud:</strong> ${p.fecha || 'N/A'}</p>
            <p><strong>Contacto:</strong> ${p.estudiante.correo} | ${p.estudiante.telefono}</p>
            <p><strong>Puntajes:</strong> 
              Econ: ${p.puntajes.economico} | 
              Acad: ${p.puntajes.academico} | 
              Soc: ${p.puntajes.social}
            </p>
            <p><strong>Promedio Académico:</strong> ${p.estudiante.promedio || 'N/A'}</p>
            <p><strong>Comentarios:</strong> ${p.estudiante.comentarios || '<em>Sin comentarios</em>'}</p>
        </div>

        <div class="postulacion-acciones">
            <p><strong>Puntaje:</strong> <span class="puntaje-total">${p.puntajes.total}</span></p>
            <p><strong>Estado:</strong> <span class="badge ${p.state ? p.state.toLowerCase() : p.estado.toLowerCase()}">${p.estado}</span></p>
            
            <div class="controles">
              <button data-action="aprobar" data-index="${index}">Aprobar</button>
              <button data-action="rechazar" data-index="${index}">Rechazar</button>
              <button data-action="eliminar" data-index="${index}">Eliminar</button>
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
        postulaciones[index].state = nuevoEstado.toLowerCase(); // Para compatibilidad de CSS
        postulaciones[index].estado = nuevoEstado;
        if (nuevoEstado === "Rechazada") {
            postulaciones[index].motivoRechazo = motivo;
        } else {
            postulaciones[index].motivoRechazo = ""; // Limpiar si se aprueba
        }
        actualizarStorage();
        renderizarPostulaciones();
    }

    function eliminarPostulacion(index) {
        if (confirm("¿Desea eliminar este registro?")) {
            postulaciones.splice(index, 1);
            actualizarStorage();
            renderizarPostulaciones();
        }
    }

    function actualizarStorage() {
        localStorage.setItem("postulaciones", JSON.stringify(postulaciones));
    }

    function actualizarEstadisticas() {
        const total = postulaciones.length;
        const aprobadas = postulaciones.filter(p => p.estado === 'Aprobada').length;
        const pendientes = postulaciones.filter(p => p.estado === 'Pendiente').length;
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

    btnBorrarTodo.addEventListener("click", () => {
        if (confirm("¿Eliminar TODAS las postulaciones?")) {
            postulaciones = [];
            actualizarStorage();
            renderizarPostulaciones();
        }
    });

    // Ejecución inicial de la lógica
    renderizarPostulaciones();
})();
