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
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';

                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar tarjetas de compromiso
    const compromisoCards = document.querySelectorAll('.compromiso-card');
    compromisoCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observar tarjetas de misión y visión
    const misionVisionBoxes = document.querySelectorAll('.mision-box, .vision-box');
    misionVisionBoxes.forEach((box, index) => {
        box.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(box);
    });

    // Contador animado para los emojis
    const compromisoIcons = document.querySelectorAll('.compromiso-icon');
    compromisoIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.2) rotate(10deg)';
        });

        icon.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Efecto de brillo en iconos circulares
    const iconCircles = document.querySelectorAll('.icon-circle');
    iconCircles.forEach(circle => {
        circle.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1) rotate(360deg)';
            this.style.transition = 'transform 0.6s ease';
        });

        circle.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // El efecto parallax ha sido eliminado para mantener las cajas quietas según solicitud del usuario

    // Botón de registro con efecto de pulso
    const btnRegistro = document.querySelector('.acciones .btn-secondary');
    if (btnRegistro) {
        setInterval(() => {
            btnRegistro.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                btnRegistro.style.animation = '';
            }, 600);
        }, 5000);
    }
});

// Animación de pulso
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }
        50% {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
        }
    }
`;
document.head.appendChild(style);
