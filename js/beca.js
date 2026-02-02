/**
 * Script para la visualización de becas.
 * Sincroniza la información de las tarjetas de becas con los datos guardados por el administrador.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Sincroniza los estados y fechas de las becas con la información de LocalStorage
    actualizarEstadosBecas();

    /**
     * Busca las tarjetas de becas en el DOM y actualiza su contenido (estado, fechas, requisitos)
     * basándose en las convocatorias configuradas en LocalStorage.
     */
    function actualizarEstadosBecas() {
        const convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];
        const cards = document.querySelectorAll('.beca-card');

        convocatorias.forEach(conv => {
            // Encuentra la tarjeta correspondiente mediante el atributo data-id
            const card = document.querySelector(`.beca-card[data-id="${conv.id}"]`);
            if (card) {
                const estado = calcularEstado(conv.inicio, conv.cierre);

                // Alterna las clases CSS para reflejar visualmente el estado (Abierta, Próxima, Cerrada)
                card.classList.remove('open', 'coming-soon', 'closed');
                card.classList.add(estado === 'activo' ? 'open' : (estado === 'proximo' ? 'coming-soon' : 'closed'));

                // Actualiza el texto de la etiqueta de estado
                const statusBadge = card.querySelector('.status-badge');
                if (statusBadge) {
                    const textMap = { 'activo': 'Abierta', 'proximo': 'Próxima', 'closed': 'Cerrada' };
                    statusBadge.textContent = textMap[estado] || 'Cerrada';
                }

                // Actualiza las fechas de postulación en la tarjeta
                const fechaTexto = card.querySelector('.beca-dates');
                if (fechaTexto) {
                    const inicioFormat = conv.inicio.split('-').reverse().join('/');
                    const cierreFormat = conv.cierre.split('-').reverse().join('/');
                    fechaTexto.innerHTML = `<strong>Periodo de postulación:</strong> ${inicioFormat} - ${cierreFormat}`;
                }

                // Genera la lista de requisitos dinámicamente si existen
                const requisitosLista = card.querySelector('.dynamic-requisitos');
                if (requisitosLista && conv.requisitos) {
                    const items = conv.requisitos.split('\n');
                    requisitosLista.innerHTML = items.map(item => `<li>${item.trim()}</li>`).join('');
                }
            }
        });
    }

    /**
     * Calcula el estado de una beca comparando la fecha actual con las de inicio y cierre.
     */
    function calcularEstado(inicio, cierre) {
        const hoy = new Date().toISOString().split('T')[0];
        if (hoy < inicio) return 'proximo';
        if (hoy >= inicio && hoy <= cierre) return 'activo';
        return 'cerrado';
    }

    // Configura la funcionalidad de expansión/colapso para los botones "Ver más"
    const buttons = document.querySelectorAll('.btn-ver-mas');
    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.beca-card');
            const extraInfo = card.querySelector('.beca-details');

            // Alterna la clase 'active' para mostrar u ocultar detalles adicionales
            const isActive = extraInfo.classList.toggle('active');
            // Cambia el texto del botón según el estado de visibilidad
            this.textContent = isActive ? 'Ver menos' : 'Ver más';
        });
    });
});
