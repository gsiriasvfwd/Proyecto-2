// Script para la página de evaluación

document.addEventListener('DOMContentLoaded', function () {
    const economia = document.getElementById('economia');
    const rendimiento = document.getElementById('rendimiento');
    const contexto = document.getElementById('contexto');
    const totalPuntaje = document.getElementById('totalPuntaje');

    // Función para calcular el puntaje total
    function actualizarPuntaje() {
        const econVal = parseInt(economia.value) || 0;
        const rendVal = parseInt(rendimiento.value) || 0;
        const contVal = parseInt(contexto.value) || 0;

        const total = econVal + rendVal + contVal;
        totalPuntaje.textContent = total;

        // Cambiar color según el puntaje
        const puntajeDiv = totalPuntaje.parentElement.parentElement;
        if (total > 100) {
            puntajeDiv.style.background = 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)';
        } else if (total === 100) {
            puntajeDiv.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
        } else {
            puntajeDiv.style.background = 'linear-gradient(135deg, var(--verde-claro) 0%, var(--verde-medio) 100%)';
        }
    }

    // Event listeners para actualizar puntaje en tiempo real
    economia.addEventListener('input', actualizarPuntaje);
    rendimiento.addEventListener('input', actualizarPuntaje);
    contexto.addEventListener('input', actualizarPuntaje);

    // Botón de guardar evaluación
    const btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click', function () {
        const total = parseInt(totalPuntaje.textContent);

        // Validar que todos los campos estén llenos
        const postulanteInput = document.getElementById('postulante');
        if (!postulanteInput.value.trim()) {
            alert('⚠️ Por favor ingrese el nombre del postulante');
            postulanteInput.focus();
            return;
        }

        if (total !== 100) {
            alert('⚠️ El puntaje total debe ser exactamente 100 puntos. Actualmente es: ' + total);
            return;
        }

        const evaluacionData = {
            postulante: postulanteInput.value,
            economia: parseInt(economia.value) || 0,
            rendimiento: parseInt(rendimiento.value) || 0,
            contexto: parseInt(contexto.value) || 0,
            observaciones: document.getElementById('observaciones').value,
            total: total,
            fecha: new Date().toISOString()
        };

        // Guardar en localStorage
        let evaluaciones = JSON.parse(localStorage.getItem('evaluaciones')) || [];
        evaluaciones.push(evaluacionData);
        localStorage.setItem('evaluaciones', JSON.stringify(evaluaciones));

        alert('✅ Evaluación guardada exitosamente!\n\nPostulante: ' + evaluacionData.postulante + '\nPuntaje Total: ' + total + ' puntos');

        limpiarFormulario();
    });

    // Botón de limpiar
    const btnLimpiar = document.getElementById('btnLimpiar');
    btnLimpiar.addEventListener('click', limpiarFormulario);

    // Función para limpiar todos los campos
    function limpiarFormulario() {
        document.getElementById('postulante').value = '';
        economia.value = '';
        rendimiento.value = '';
        contexto.value = '';
        document.getElementById('observaciones').value = '';
        actualizarPuntaje();
    }

    // Botón de cerrar sesión
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                window.location.href = 'login.html';
            }
        });
    }
});
