// Script para la página de becas

document.addEventListener('DOMContentLoaded', function () {
    const becasContainer = document.getElementById('becas-container');
    const logoutBtn = document.getElementById('logout');

    // Cargar becas desde localStorage
    cargarBecas();

    // Botón de cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                localStorage.removeItem('usuarioActual');
                window.location.href = 'login.html';
            }
        });
    }

    function cargarBecas() {
        const convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];

        if (convocatorias.length === 0) {
            becasContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                    <p style="color: var(--gris-medio); font-size: 1.1rem;">
                        No hay convocatorias disponibles en este momento.
                    </p>
                </div>
            `;
            return;
        }

        becasContainer.innerHTML = '';

        convocatorias.forEach((conv, index) => {
            const estado = obtenerEstado(conv.inicio, conv.cierre);
            const estadoTexto = {
                'open': 'Abierta',
                'future': 'Próximamente',
                'closed': 'Cerrada'
            };

            const card = document.createElement('div');
            card.className = `beca-card ${estado}`;
            card.innerHTML = `
                <h3>${conv.nombre}</h3>
                <div class="tipo">${conv.tipo.charAt(0).toUpperCase() + conv.tipo.slice(1)}</div>
                <span class="status-badge">${estadoTexto[estado]}</span>
                
                <div class="beca-details" id="details-${index}">
                    <div class="beca-info-item">
                        <strong>📅 Fecha de Inicio:</strong> ${formatearFecha(conv.inicio)}
                    </div>
                    <div class="beca-info-item">
                        <strong>⏰ Fecha de Cierre:</strong> ${formatearFecha(conv.cierre)}
                    </div>
                    ${conv.descripcion ? `
                        <div class="beca-info-item">
                            <strong>📋 Descripción:</strong><br>
                            ${conv.descripcion}
                        </div>
                    ` : ''}
                </div>
                
                <button class="btn-ver-mas" data-index="${index}">Ver más</button>
            `;

            becasContainer.appendChild(card);
        });

        // Agregar eventos a los botones "Ver más"
        document.querySelectorAll('.btn-ver-mas').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                const details = document.getElementById(`details-${index}`);

                if (details.classList.contains('active')) {
                    details.classList.remove('active');
                    this.textContent = 'Ver más';
                } else {
                    details.classList.add('active');
                    this.textContent = 'Ver menos';
                }
            });
        });
    }

    function obtenerEstado(inicio, cierre) {
        const hoy = new Date().toISOString().split('T')[0];

        if (hoy < inicio) {
            return 'future';
        } else if (hoy >= inicio && hoy <= cierre) {
            return 'open';
        } else {
            return 'closed';
        }
    }

    function formatearFecha(fecha) {
        const partes = fecha.split('-');
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
});
