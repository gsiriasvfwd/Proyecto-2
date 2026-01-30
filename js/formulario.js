(function () {
    const btnEnviar = document.getElementById("btnEnviar");

    if (!btnEnviar) return;

    btnEnviar.addEventListener("click", function () {
        // 1. Obtener los elementos (Identificación y Selección)
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
            inputNombre, inputCorreo, inputTelefono,
            selectIngreso, selectDependientes, selectVivienda, selectFuente,
            selectPromedio, selectModalidad, selectNivel, selectTrabajo, selectTraslado, inputEdad, inputcedula
        ];

        if (camposObligatorios.some(c => c.value.trim() === "")) {
            Swal.fire({
                icon: "error",
                title: "Campos incompletos",
                text: "Por favor complete todos los campos resaltados en rojo.",
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
            fecha: new Date().toLocaleString(),
            estudiante: {
                nombre: inputNombre.value.trim(),
                correo: inputCorreo.value.trim(),
                telefono: "+506 " + inputTelefono.value.trim(),
                cedula: inputcedula.value.trim(),
                edad: inputEdad.value.trim(),
                comentarios: areaComentarios.value.trim()
            },
            puntajes: {
                economico: Math.round(puntajeEconomico),
                academico: Math.round(puntajeAcademico),
                social: Math.round(puntajeSocial),
                total: Math.round(puntajeTotal)
            },
            estado: "Pendiente"
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



