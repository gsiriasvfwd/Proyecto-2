/**
 * Script para la página de Inicio (Home).
 * Maneja las animaciones de entrada y efectos visuales de los elementos al hacer scroll.
 */

document.addEventListener('DOMContentLoaded', function () {
    /**
     * Configuración del Intersection Observer para activar animaciones cuando los elementos
     * entran en el campo de visión del usuario.
     */
    const observerOptions = {
        threshold: 0.2, // El 20% del elemento debe ser visible para activar la animación
        rootMargin: '0px 0px -50px 0px' // Margen inferior para disparar la animación antes de que el elemento aparezca por completo
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Agrega la clase 'visible' que dispara la transición CSS
                entry.target.classList.add('visible');
                // Deja de observar el elemento una vez animado
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    /**
     * Observar y configurar retardos para las tarjetas de compromiso.
     * Se utiliza una variable CSS '--delay' para escalar las animaciones secuencialmente.
     */
    const compromisoCards = document.querySelectorAll('.compromiso-card');
    compromisoCards.forEach((card, index) => {
        card.style.setProperty('--delay', `${index * 0.1}s`);
        observer.observe(card);
    });

    /**
     * Observar y configurar retardos para las cajas de misión y visión.
     */
    const misionVisionBoxes = document.querySelectorAll('.mision-box, .vision-box');
    misionVisionBoxes.forEach((box, index) => {
        box.style.setProperty('--delay', `${index * 0.2}s`);
        observer.observe(box);
    });

    // Nota: Las interacciones de los iconos circulares y compromiso-icon se manejan directamente en home.css (:hover)

    /**
     * Agrega un efecto de pulso al botón de registro para llamar la atención del usuario.
     */
    const btnRegistro = document.querySelector('.acciones .btn-secondary');
    if (btnRegistro) {
        btnRegistro.classList.add('animate-pulse');
    }
});
