// Script para la página home

document.addEventListener('DOMContentLoaded', function () {
    // Animación de entrada para las tarjetas de compromiso
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar tarjetas de compromiso
    const compromisoCards = document.querySelectorAll('.compromiso-card');
    compromisoCards.forEach((card, index) => {
        card.style.setProperty('--delay', `${index * 0.1}s`);
        observer.observe(card);
    });

    // Observar tarjetas de misión y visión
    const misionVisionBoxes = document.querySelectorAll('.mision-box, .vision-box');
    misionVisionBoxes.forEach((box, index) => {
        box.style.setProperty('--delay', `${index * 0.2}s`);
        observer.observe(box);
    });

    // Contador animado para los emojis (ahora manejado por CSS)
    const compromisoIcons = document.querySelectorAll('.compromiso-icon');
    compromisoIcons.forEach(icon => {
        // La interactividad se maneja en home.css con :hover
    });

    // Efecto de brillo en iconos circulares (ahora manejado por CSS)
    const iconCircles = document.querySelectorAll('.icon-circle');
    iconCircles.forEach(circle => {
        // La interactividad se maneja en home.css con :hover
    });

    // El efecto parallax ha sido eliminado para mantener las cajas quietas según solicitud del usuario

    // Botón de registro con efecto de pulso
    const btnRegistro = document.querySelector('.acciones .btn-secondary');
    if (btnRegistro) {
        btnRegistro.classList.add('animate-pulse');
    }
});

// La animación de pulso y las transiciones se han movido a home.css
