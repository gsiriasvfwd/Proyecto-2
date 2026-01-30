// Script para la página de becas


document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logout');


    // Botón de cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                localStorage.removeItem('usuarioActual');
                window.location.href = 'login.html';
            }
        });
    }


    // Funcionalidad para botones "Ver más" de las tarjetas estáticas
    const buttons = document.querySelectorAll('.btn-ver-mas');


    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Buscar el contenedor de información extra dentro de la misma tarjeta
            const card = this.closest('.beca-card');
            const extraInfo = card.querySelector('.extra-info');


            if (extraInfo.style.display === 'none' || extraInfo.style.display === '') {
                extraInfo.style.display = 'block';
                this.textContent = 'Ver menos';
            } else {
                extraInfo.style.display = 'none';
                this.textContent = 'Ver más';
            }
        });
    });
});
