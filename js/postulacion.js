// Script para la página de postulación

document.addEventListener('DOMContentLoaded', function () {
    const btnEnviar = document.getElementById('btnEnviar');
    const btnLimpiar = document.getElementById('btnLimpiar');

    // Cargar convocatorias disponibles
    cargarConvocatorias();

    // Botón de enviar postulación
    btnEnviar.addEventListener('click', function () {
        // Obtener valores
        const convocatoria = document.getElementById('convocatoria').value;
        const edad = document.getElementById('edad').value;
        const nivel = document.getElementById('nivel').value;
        const ingresos = document.getElementById('ingresos').value;
        const motivo = document.getElementById('motivo').value;

        // Validaciones
        if (!convocatoria) {
            alert('⚠️ Por favor seleccione una convocatoria');
            return;
        }

        if (!edad || edad < 15 || edad > 100) {
            alert('⚠️ Por favor ingrese una edad válida');
            return;
        }

        if (!nivel) {
            alert('⚠️ Por favor seleccione su nivel educativo');
            return;
        }

        if (!ingresos || ingresos < 0) {
            alert('⚠️ Por favor ingrese los ingresos mensuales');
            return;
        }

        if (!motivo.trim()) {
            alert('⚠️ Por favor explique el motivo de su solicitud');
            return;
        }

        // Crear objeto de postulación
        const postulacionData = {
            convocatoria: convocatoria,
            edad: parseInt(edad),
            nivel: nivel,
            ingresos: parseFloat(ingresos),
            motivo: motivo,
            fecha: new Date().toISOString(),
            estado: 'pendiente',
            puntaje: null
        };

        // Guardar en localStorage
        let postulaciones = JSON.parse(localStorage.getItem('postulaciones')) || [];
        postulaciones.push(postulacionData);
        localStorage.setItem('postulaciones', JSON.stringify(postulaciones));

        alert('✅ Postulación enviada exitosamente!\n\nSu solicitud será evaluada próximamente.');

        limpiarFormulario();
    });

    // Botón de limpiar
    btnLimpiar.addEventListener('click', limpiarFormulario);

    // Función para limpiar el formulario
    function limpiarFormulario() {
        document.getElementById('convocatoria').value = '';
        document.getElementById('edad').value = '';
        document.getElementById('nivel').value = '';
        document.getElementById('ingresos').value = '';
        document.getElementById('motivo').value = '';
    }

    // Cargar convocatorias activas
    function cargarConvocatorias() {
        const select = document.getElementById('convocatoria');
        const convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];

        // Limpiar opciones actuales excepto la primera
        select.innerHTML = '<option value="">Seleccione una convocatoria</option>';

        // Filtrar convocatorias activas
        const hoy = new Date().toISOString().split('T')[0];
        const activas = convocatorias.filter(c => c.cierre >= hoy);

        activas.forEach(conv => {
            const option = document.createElement('option');
            option.value = conv.nombre;
            option.textContent = `${conv.nombre} (${conv.tipo})`;
            select.appendChild(option);
        });

        if (activas.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No hay convocatorias activas';
            option.disabled = true;
            select.appendChild(option);
        }
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
