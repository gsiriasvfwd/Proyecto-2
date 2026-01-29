/**
 * dashboard.js - Funcionalidad compartida del dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Lógica simple de cierre de sesión
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                // Redirigir al login (asumiendo que está en la misma carpeta o raíz)
                window.location.href = 'login.html';
            }
        });
    }
});
