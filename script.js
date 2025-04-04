// CONFIGURAZIONE: Inserisci la tua API key e ID del foglio
const API_KEY = "INSERISCI_LA_TUA_API_KEY";
const SHEET_ID = "1CNopIVdSKPdb4L6Bp6-rF4mluabO7znPI_FuWtpGAYs";
const SHEET_NAME = "Foglio1"; // Assicurati che corrisponda esattamente

const tableBody = document.querySelector("#checklist tbody");

// Trascinamento: Variabili globali
let startX, startY, isDragging = false;

// ─────────────────────────────────────
// FETCH DOMANDE DA GOOGLE SHEETS
// ─────────────────────────────────────
async function fetchQuestions() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A2:A1000?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        console.log("Risposta API:", data); // Per debug

        if (!data.values || data.values.length === 0) {
            console.error("Nessuna domanda trovata nel foglio Google Sheet.");
            return;
        }

        tableBody.innerHTML = "";

        data.values.forEach((row, index) => {
            const domanda = row[0];
            if (domanda) {
                const tr = document.createElement("tr");
                tr.draggable = true;
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td class="domanda">${domanda}</td>
                    <td class="status vuoto">-</td>
                    <td><textarea rows="2"></textarea></td>
                `;
                addDragEvents(tr);
                tableBody.appendChild(tr);
            }
        });

    } catch (error) {
        console.error("Errore nel recupero delle domande:", error);
    }
}

// ─────────────────────────────────────
// GESTIONE TRASCINAMENTO MOBILE
// ─────────────────────────────────────
function handleTouchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    isDragging = false;
}

function handleTouchMove(event, row) {
    const touch = event.touches[0];
    const statusCell = row.cells[2];
    const movementX = touch.clientX - startX;
    const movementY = touch.clientY - startY;

    if (Math.abs(movementX) > 10 || Math.abs(movementY) > 10) {
        isDragging = true;
        document.body.style.overflow = "hidden";
    }

    event.preventDefault();

    if (Math.abs(movementX) > Math.abs(movementY)) {
        if (movementX > 30) {
            statusCell.textContent = "Conforme";
            statusCell.className = "status conforme";
        } else if (movementX < -30) {
            statusCell.textContent = "Non Conforme";
            statusCell.className = "status non-conforme";
        }
    } else {
        if (movementY < -30) {
            statusCell.textContent = "Non Applicabile";
            statusCell.className = "status non-applicabile";
        } else if (movementY > 30) {
            statusCell.textContent = "-";
            statusCell.className = "status vuoto";
        }
    }
}

function handleTouchEnd() {
    document.body.style.overflow = "auto";
}

// ─────────────────────────────────────
// GESTIONE TRASCINAMENTO DESKTOP
// ─────────────────────────────────────
function handleMouseDown(event) {
    startX = event.clientX;
    startY = event.clientY;
    isDragging = false;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    event.currentTarget.classList.add("dragging");
}

function handleMouseMove(event) {
    isDragging = true;
    const row = document.querySelector(".dragging");
    const statusCell = row?.cells[2];

    if (!statusCell) return;

    const movementX = event.clientX - startX;
    const movementY = event.clientY - startY;

    if (Math.abs(movementX) > Math.abs(movementY)) {
        if (movementX > 30) {
            statusCell.textContent = "Conforme";
            statusCell.className = "status conforme";
        } else if (movementX < -30) {
            statusCell.textContent = "Non Conforme";
            statusCell.className = "status non-conforme";
        }
    } else {
        if (movementY < -30) {
            statusCell.textContent = "Non Applicabile";
            statusCell.className = "status non-applicabile";
        } else if (movementY > 30) {
            statusCell.textContent = "-";
            statusCell.className = "status vuoto";
        }
    }
}

function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    const row = document.querySelector(".dragging");
    if (row) row.classList.remove("dragging");
}

// ─────────────────────────────────────
// AGGIUNTA EVENTI A OGNI RIGA
// ─────────────────────────────────────
function addDragEvents(row) {
    row.addEventListener("touchstart", handleTouchStart);
    row.addEventListener("touchmove", (e) => handleTouchMove(e, row));
    row.addEventListener("touchend", handleTouchEnd);

    row.addEventListener("mousedown", handleMouseDown);
}

// ─────────────────────────────────────
// CONFERMA CHECKLIST
// ─────────────────────────────────────
function confermaChecklist() {
    alert("Checklist salvata con successo!");
}

// Avvia al caricamento
window.onload = fetchQuestions;
