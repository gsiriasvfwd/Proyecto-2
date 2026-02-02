// Inyectar SweetAlert2 dinámicamente si no está presente
if (!window.Swal) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(script);
}

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
        Swal.fire({
            title: '¿Desea eliminar este registro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                postulaciones.splice(index, 1);
                actualizarStorage();
                renderizarPostulaciones();
                Swal.fire(
                    '¡Eliminado!',
                    'El registro ha sido eliminado.',
                    'success'
                );
            }
        });
    }

    function actualizarStorage() {
        localStorage.setItem("postulaciones", JSON.stringify(postulaciones));
    }

    btnBorrarTodo.addEventListener("click", () => {
        Swal.fire({
            title: '¿Eliminar TODAS las postulaciones?',
            text: "Se borrarán permanentemente todos los registros",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, borrar todo',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                postulaciones = [];
                actualizarStorage();
                renderizarPostulaciones();
                Swal.fire(
                    '¡Borrados!',
                    'Se han eliminado todas las postulaciones.',
                    'success'
                );
            }
        });
    });

    // Ejecución inicial de la lógica
    // Ejecución inicial de la lógica
    renderizarPostulaciones();

    // Manejo de Cerrar Sesión
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¿Deseas cerrar la sesión?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('usuarioActual');
                    window.location.href = 'login.html';
                }
            });
        });
    }
})();
