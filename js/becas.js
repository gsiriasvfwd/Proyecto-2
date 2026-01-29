/**
 * becas.js - Lógica para la sección de becas
 */

document.addEventListener('DOMContentLoaded', () => {
    const becas = [
        {
            id: 1,
            nombre: "Beca Raíz Solidaria",
            descripcion: "Exoneración parcial del pago de matrícula, Depósito de cuota de alimentos, Acceso a residencia universitaria.",
            tipo: "Social",
            fechaInicio: "2026-01-01",
            fechaFin: "2026-02-28",
            requisitos: ["Estudio socioeconómico", "Constancia de vecindad", "Promedio mínimo de 8.0"],
            estado: "abierto"
        },
        {
            id: 2,
            nombre: "Beca Brote",
            descripcion: "Exoneración de un porcentaje del pago de matrícula, Depósito de cuota de alimentos.",
            tipo: "Economica",
            fechaInicio: "2026-02-01",
            fechaFin: "2026-03-31",
            requisitos: ["Comprobante de ingresos familiares", "Carta de solicitud motivada", "Copia de identificación"],
            estado: "abierto"
        },
        {
            id: 3,
            nombre: "Beca Germen",
            descripcion: "Exoneración parcial del pago de matrícula, Depósito de cuota de alimentos.",
            tipo: "Economica",
            fechaInicio: "2025-10-01",
            fechaFin: "2025-12-15",
            requisitos: ["Cuestionario de situación económica", "Certificado de estudios previos", "Sin otras becas vigentes"],
            estado: "abierto"
        },
        {
            id: 4,
            nombre: "Beca Cultivo del Mérito",
            descripcion: "Exoneración parcial del pago de matrícula, Préstamo de una cantidad definida de libros.",
            tipo: "Academica",
            fechaInicio: "2026-03-01",
            fechaFin: "2026-04-15",
            requisitos: ["Promedio superior a 9.0", "Dos cartas de recomendación académica", "Participación en actividades extracurriculares"],
            estado: "abierto"
        },
        {
            id: 5,
            nombre: "Beca Cosecha del Saber",
            descripcion: "Exoneración parcial del pago de matrícula, Préstamo de libros académicos.",
            tipo: "Academica",
            fechaInicio: "2026-01-15",
            fechaFin: "2026-02-15",
            requisitos: ["Promedio superior a 8.5", "Constancia de conducta", "Ensayo sobre objetivos de carrera"],
            estado: "abierto"
        }
    ];

    const container = document.getElementById('becas-container');
    const hoy = new Date();

    becas.forEach(beca => {
        const fechaInicio = new Date(beca.fechaInicio);
        const fechaFin = new Date(beca.fechaFin);

        let colorClass = "";
        let statusLabel = "";

        if (hoy < fechaInicio) {
            colorClass = "future";
            statusLabel = "Próximamente";
        } else if (hoy >= fechaInicio && hoy <= fechaFin) {
            colorClass = "open";
            statusLabel = "Abierta";
        } else {
            colorClass = "closed";
            statusLabel = "Cerrada";
        }

        const card = document.createElement('div');
        card.className = `beca-card ${colorClass}`;
        card.innerHTML = `
            <h3>${beca.nombre}</h3>
            <p class="tipo">${beca.tipo}</p>
            <p>${beca.descripcion.substring(0, 100)}...</p>
            
            <div class="beca-details" id="details-${beca.id}">
                <div class="beca-info-item"><strong>Descripción:</strong> ${beca.descripcion}</div>
                <div class="beca-info-item"><strong>Tipo:</strong> ${beca.tipo}</div>
                <div class="beca-info-item"><strong>Fecha Inicio:</strong> ${beca.fechaInicio}</div>
                <div class="beca-info-item"><strong>Fecha Fin:</strong> ${beca.fechaFin}</div>
                <div class="beca-info-item"><strong>Requisitos:</strong> 
                    <ul>
                        ${beca.requisitos.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <span class="status-badge">${statusLabel}</span>
            <button class="btn-ver-mas">Ver más</button>
        `;

        // Agregar listener al botón de forma programática (Separación de conceptos)
        const btn = card.querySelector('.btn-ver-mas');
        const details = card.querySelector(`#details-${beca.id}`);

        btn.addEventListener('click', () => {
            if (details.classList.contains('active')) {
                details.classList.remove('active');
                btn.textContent = 'Ver más';
            } else {
                details.classList.add('active');
                btn.textContent = 'Ver menos';
            }
        });

        container.appendChild(card);
    });
});
