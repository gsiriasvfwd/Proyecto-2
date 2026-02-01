document.addEventListener('DOMContentLoaded', function () {
    // Sincronizar estados y fechas con localStorage (Admin)
    actualizarEstadosBecas();

    function actualizarEstadosBecas() {
        const convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];
        const cards = document.querySelectorAll('.beca-card');

        convocatorias.forEach(conv => {
            // Buscar la tarjeta correspondiente por su ID (basado en el título por ahora)
            // Se asume que el ID coincide con una clase o un atributo de la tarjeta
            const card = document.querySelector(`.beca-card[data-id="${conv.id}"]`);
            if (card) {
                const estado = calcularEstado(conv.inicio, conv.cierre);

                // Actualizar clases de estado
                card.classList.remove('open', 'coming-soon', 'closed');
                card.classList.add(estado === 'activo' ? 'open' : (estado === 'proximo' ? 'coming-soon' : 'closed'));

                // Actualizar texto del badge de estado
                const statusBadge = card.querySelector('.status-badge');
                if (statusBadge) {
                    const textMap = { 'activo': 'Abierta', 'proximo': 'Próxima', 'closed': 'Cerrada' };
                    statusBadge.textContent = textMap[estado] || 'Cerrada';
                }

                // Actualizar texto de fechas en el HTML
                const fechaTexto = card.querySelector('.beca-dates');
                if (fechaTexto) {
                    const inicioFormat = conv.inicio.split('-').reverse().join('/');
                    const cierreFormat = conv.cierre.split('-').reverse().join('/');
                    fechaTexto.innerHTML = `<strong>Periodo de postulación:</strong> ${inicioFormat} - ${cierreFormat}`;
                }

                // Actualizar requisitos dinámicamente
                const requisitosLista = card.querySelector('.dynamic-requisitos');
                if (requisitosLista && conv.requisitos) {
                    const items = conv.requisitos.split('\n');
                    requisitosLista.innerHTML = items.map(item => `<li>${item.trim()}</li>`).join('');
                }
            }
        });
    }

    function calcularEstado(inicio, cierre) {
        const hoy = new Date().toISOString().split('T')[0];
        if (hoy < inicio) return 'proximo';
        if (hoy >= inicio && hoy <= cierre) return 'activo';
        return 'cerrado';
    }

    // Funcionalidad para botones "Ver más"
    const buttons = document.querySelectorAll('.btn-ver-mas');
    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.beca-card');
            const extraInfo = card.querySelector('.beca-details');

            const isActive = extraInfo.classList.toggle('active');
            this.textContent = isActive ? 'Ver menos' : 'Ver más';
        });
    });
});
