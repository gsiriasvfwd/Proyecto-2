(function () {
    const btnEnviar = document.getElementById("btnEnviar");

    if (!btnEnviar) return;

    // --- LÓGICA DINÁMICA DE CRITERIOS ---
    const selectBecaLabel = document.getElementById("beca-seleccionada");
    const legendEco = document.getElementById("legend-economica");
    const legendAcad = document.getElementById("legend-academica");
    const legendSoc = document.getElementById("legend-social");

    if (selectBecaLabel) {
        selectBecaLabel.addEventListener("change", function () {
            const convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];
            const becaInfo = convocatorias.find(c => c.id === this.value);

            if (becaInfo && becaInfo.criterios) {
                legendEco.textContent = `${becaInfo.criterios.economico.nombre} (0–${becaInfo.criterios.economico.max} pts)`;
                legendAcad.textContent = `${becaInfo.criterios.academico.nombre} (0–${becaInfo.criterios.academico.max} pts)`;
                legendSoc.textContent = `${becaInfo.criterios.social.nombre} (0–${becaInfo.criterios.social.max} pts)`;
            } else {
                legendEco.textContent = "Situación Económica (0–40 pts)";
                legendAcad.textContent = "Rendimiento Académico (0–30 pts)";
                legendSoc.textContent = "Contexto Social (0–30 pts)";
            }
        });
    }

    btnEnviar.addEventListener("click", function () {
        // 1. Obtener los elementos (Identificación y Selección)
        const selectBeca = document.getElementById("beca-seleccionada");
        const inputNombre = document.getElementById("nombre");
        const inputCorreo = document.getElementById("correo");
        const inputTelefono = document.getElementById("telefono");

        const selectIngreso = document.getElementById("ingreso");
        const selectDependientes = document.getElementById("dependientes");
        const selectVivienda = document.getElementById("vivienda");
        const selectFuente = document.getElementById("fuenteIngreso");
        const selectPromedio = document.getElementById("promedio");
        const selectModalidad = document.getElementById("modalidad");
        const selectNivel = document.getElementById("nivel");
        const selectTrabajo = document.getElementById("trabajo");
        const selectTraslado = document.getElementById("traslado");
        const inputEdad = document.getElementById("edad");
        const inputcedula = document.getElementById("cedula");
        const areaComentarios = document.getElementById("comentarios");

        // 2. Validación (Funcionamiento en JS)
        const camposObligatorios = [
            selectBeca, inputNombre, inputCorreo, inputTelefono,
            selectIngreso, selectDependientes, selectVivienda, selectFuente,
            selectPromedio, selectModalidad, selectNivel, selectTrabajo, selectTraslado, inputEdad, inputcedula
        ];

        if (camposObligatorios.some(c => c.value.trim() === "")) {
            Swal.fire({
                icon: "error",
                title: "Campos incompletos",
                text: "Por favor complete todos los campos obligatorios.",
            });
            return;
        }

        // --- VALIDACIONES DE NEGOCIO ---

        // A. Validar fechas de la beca
        const convocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];
        const becaInfo = convocatorias.find(c => c.id === selectBeca.value);
        const hoy = new Date().toISOString().split('T')[0];

        if (becaInfo) {
            if (hoy < becaInfo.inicio) {
                Swal.fire({
                    icon: "warning",
                    title: "Convocatoria no iniciada",
                    text: `La postulación para esta beca inicia el ${becaInfo.inicio.split('-').reverse().join('/')}.`,
                });
                return;
            }
            if (hoy > becaInfo.cierre) {
                Swal.fire({
                    icon: "error",
                    title: "Convocatoria cerrada",
                    text: "El periodo de postulación para esta beca ha finalizado.",
                });
                return;
            }

            // Validar Promedio Mínimo
            const promedioSeleccionadoTexto = selectPromedio.options[selectPromedio.selectedIndex].text;
            let promedioNumerico = 0;
            if (promedioSeleccionadoTexto.includes('superior')) promedioNumerico = 9.0;
            else if (promedioSeleccionadoTexto.includes('–')) promedioNumerico = parseFloat(promedioSeleccionadoTexto.split('–')[0]);
            else if (promedioSeleccionadoTexto.includes('Menor')) promedioNumerico = 0;

            if (becaInfo.promedioMinimo && promedioNumerico < becaInfo.promedioMinimo) {
                Swal.fire({
                    icon: "error",
                    title: "Promedio insuficiente",
                    text: `Esta beca requiere un promedio mínimo de ${becaInfo.promedioMinimo}. Tu rango seleccionado (${promedioSeleccionadoTexto}) no cumple con el requisito.`,
                });
                return;
            }
        }

        // B. Validar duplicados (Usuario actual + Beca)
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
        const postulacionesExistentes = JSON.parse(localStorage.getItem("postulaciones")) || [];

        const yaPostulo = postulacionesExistentes.find(p =>
            p.usuarioId === usuarioActivo.id &&
            p.becaId === selectBeca.value &&
            (p.estado === "Enviada" || p.estado === "En revisión" || p.estado === "Aprobada")
        );

        if (yaPostulo) {
            Swal.fire({
                icon: "info",
                title: "Postulación existente",
                text: `Ya tienes una solicitud ${yaPostulo.estado.toLowerCase()} para esta beca.`,
            });
            return;
        }

        let edad = Number(inputEdad.value);
        if (edad < 18) {
            Swal.fire({
                icon: "error",
                title: "Edad inválida",
                text: "Debes ser mayor de 18 años para postularte.",
            });
            return;
        }
        let cedula = inputcedula.value;
        if (cedula.length !== 9) {
            Swal.fire({
                icon: "error",
                title: "Cédula inválida",
                text: "La cédula debe tener 9 dígitos.",
            });
            return;
        }
        let telefono = inputTelefono.value;
        if (telefono.length !== 8) {
            Swal.fire({
                icon: "error",
                title: "Teléfono inválido",
                text: "El teléfono debe tener 8 dígitos.",
            });
            return;
        }
        let correo = inputCorreo.value;
        if (!correo.includes("@")) {
            Swal.fire({
                icon: "error",
                title: "Correo inválido",
                text: "El correo debe tener un @.",
            });
            return;
        }
        if (/\d/.test(inputNombre.value)) {
            Swal.fire({
                icon: "error",
                title: "Nombre inválido",
                text: "El nombre no puede incluir números.",
            });
            return;
        }

        // 3. Cálculos de puntaje (Lógica - Funcionamiento en JS)
        const puntajeEconomico =
            Number(selectIngreso.value) +
            Number(selectDependientes.value) +
            Number(selectVivienda.value) +
            Number(selectFuente.value);

        const nivel = Number(selectNivel.value);
        const modalidad = Number(selectModalidad.value);
        const puntajeNivel = (nivel / modalidad) * 12;

        const puntajeAcademico = Number(selectPromedio.value) + puntajeNivel;

        const puntajeSocial =
            Number(selectTrabajo.value) +
            Number(selectTraslado.value);

        const puntajeTotal = puntajeEconomico + puntajeAcademico + puntajeSocial;

        // 4. Crear objeto de postulación (Funcionamiento en JS)
        const postulacion = {
            id: Date.now(),
            usuarioId: usuarioActivo.id,
            becaId: selectBeca.value,
            convocatoria: selectBeca.options[selectBeca.selectedIndex].text,
            fecha: new Date().toLocaleString(),
            estudiante: {
                nombre: inputNombre.value.trim(),
                correo: inputCorreo.value.trim(),
                telefono: "+506 " + inputTelefono.value.trim(),
                cedula: inputcedula.value.trim(),
                edad: inputEdad.value.trim(),
                promedio: selectPromedio.options[selectPromedio.selectedIndex].text,
                comentarios: areaComentarios.value.trim()
            },
            puntajes: {
                economico: Math.round(puntajeEconomico),
                academico: Math.round(puntajeAcademico),
                social: Math.round(puntajeSocial),
                total: Math.round(puntajeTotal)
            },
            criteriosNombres: becaInfo ? {
                economico: becaInfo.criterios.economico.nombre,
                academico: becaInfo.criterios.academico.nombre,
                social: becaInfo.criterios.social.nombre
            } : null,
            estado: "Enviada"
        };

        // 5. Persistencia (Funcionamiento en JS)
        try {
            const data = JSON.parse(localStorage.getItem("postulaciones")) || [];
            data.push(postulacion);
            localStorage.setItem("postulaciones", JSON.stringify(data));

            Swal.fire({
                icon: "success",
                title: "¡Enviado!",
                text: `Postulación de ${postulacion.estudiante.nombre} enviada correctamente.`,
                confirmButtonColor: "#28a745"
            }).then(() => {
                window.location.href = 'postulante.html';
            });

            // Limpiar campos (Reset manual)
            camposObligatorios.forEach(c => {
                c.value = "";
            });
            areaComentarios.value = "";
        } catch (error) {
            console.error("Error en la persistencia:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al guardar los datos."
            });
        }
    });



})();



