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
        if (postulaciones.length === 0) {
            lista.innerHTML = "<p>No hay postulaciones registradas.</p>";
            return;
        }

        lista.innerHTML = ""; // Limpiar antes de re-dibujar

        postulaciones.forEach((p, index) => {
            const article = document.createElement("article");
            article.style.border = "1px solid #ccc";
            article.style.padding = "10px";
            article.style.marginBottom = "10px";

            article.innerHTML = `
        <h3>${p.estudiante.nombre}</h3>
        <p><strong>Fecha:</strong> ${p.fecha || 'N/A'}</p>
        <p><strong>Contacto:</strong> ${p.estudiante.correo} | ${p.estudiante.telefono}</p>
        <p><strong>Puntajes:</strong> 
          Economía: ${p.puntajes.economico} | 
          Académico: ${p.puntajes.academico} | 
          Social: ${p.puntajes.social}
        </p>

        <p><strong>Total acumulado:</strong> ${p.puntajes.total}</p>
        <p><strong>Estado:</strong> ${p.estado}</p>
        <p><strong>Comentarios:</strong> ${p.estudiante.comentarios || '<em>Sin comentarios</em>'}</p>
        
        <div class="controles">
          <button data-action="aprobar" data-index="${index}">Aprobar</button>
          <button data-action="rechazar" data-index="${index}">Rechazar</button>
          <button data-action="eliminar" data-index="${index}">Eliminar</button>
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
            cambiarEstado(index, "Rechazada");
        } else if (action === "eliminar") {
            eliminarPostulacion(index);
        }
    });

    function cambiarEstado(index, nuevoEstado) {
        postulaciones[index].estado = nuevoEstado;
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
