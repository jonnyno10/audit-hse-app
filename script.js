// ─────────────────────────────────────
// CONFIGURAZIONE GOOGLE SHEET
// ─────────────────────────────────────
const API_KEY = "AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjM";
const SHEET_ID = "1CNopIVdSKPdb4L6Bp6-rF4mluabO7znPI_FuWtpGAYs";
const SHEET_NAME = "Foglio1";

const tableBody = document.querySelector("#checklist tbody");

// ─────────────────────────────────────
// VARIABILI GLOBALI PER IL TRASCINAMENTO
// ─────────────────────────────────────
let startX, startY, isDragging = false;

// ─────────────────────────────────────
// FUNZIONE PER RECUPERARE LE DOMANDE
// ─────────────────────────────────────
async function fetchQuestions() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A2:A1000?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.values || data.values.length === 0) {
            console.error("Nessuna domanda trovata nel foglio Google Sheet.");
            return;
        }

        // Pulisce la tabella prima di aggiungere nuove righe
        tableBody.innerHTML = "";

        // Per ogni domanda, crea una nuova riga con struttura personalizzata
        data.values.forEach((row, index) => {
            const domanda = row[0];
            if (domanda) {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td class="domanda">${domanda}</td>
                    <td>
                        <div class="status vuoto draggable-status" title="Trascina per cambiare stato">-</div>
                    </td>
                    <td><textarea rows="2"></textarea></td>
                `;

                // Applica eventi di trascinamento alla sola cella status
                const statusCell = tr.querySelector(".draggable-status");
                addDragEvents(statusCell);

                tableBody.appendChild(tr);
            }
        });

    } catch (error) {
        console.error("Errore nel recupero delle domande:", error);
    }
}

// ─────────────────────────────────────
// EVENTI TOUCH (per dispositivi mobili)
// ─────────────────────────────────────
function handleTouchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    isDragging = false;
}

function handleTouchMove(event) {
    const touch = event.touches[0];
    const element = event.currentTarget;
    const movementX = touch.clientX - startX;
    const movementY = touch.clientY - startY;

    if (Math.abs(movementX) > 10 || Math.abs(movementY) > 10) {
        isDragging = true;
        document.body.style.overflow = "hidden";
    }

    event.preventDefault();

    updateStatusBasedOnMovement(element, movementX, movementY);
}

function handleTouchEnd() {
    document.body.style.overflow = "auto";
}

// ─────────────────────────────────────
// EVENTI MOUSE (per desktop)
// ─────────────────────────────────────
function handleMouseDown(event) {
    startX = event.clientX;
    startY = event.clientY;
    isDragging = false;

    const element = event.currentTarget;
    element.classList.add("dragging");

    function move(e) {
        const movementX = e.clientX - startX;
        const movementY = e.clientY - startY;

        isDragging = true;
        updateStatusBasedOnMovement(element, movementX, movementY);
    }

    function up() {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        element.classList.remove("dragging");
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
}

// ─────────────────────────────────────
// LOGICA CAMBIO STATO
// ─────────────────────────────────────
function updateStatusBasedOnMovement(cell, dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) {
            cell.textContent = "Conforme";
            cell.className = "status conforme draggable-status";
        } else if (dx < -30) {
            cell.textContent = "Non Conforme";
            cell.className = "status non-conforme draggable-status";
        }
    } else {
        if (dy < -30) {
            cell.textContent = "Non Applicabile";
            cell.className = "status non-applicabile draggable-status";
        } else if (dy > 30) {
            cell.textContent = "-";
            cell.className = "status vuoto draggable-status";
        }
    }
}

// ─────────────────────────────────────
// AGGIUNTA EVENTI A UNA CELLA STATO
// ─────────────────────────────────────
function addDragEvents(element) {
    // Mobile
    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchmove", handleTouchMove);
    element.addEventListener("touchend", handleTouchEnd);

    // Desktop
    element.addEventListener("mousedown", handleMouseDown);
}

// ─────────────────────────────────────
// CONFERMA CHECKLIST (placeholder)
// ─────────────────────────────────────
function confermaChecklist() {
    alert("Checklist salvata con successo!");
}

// ─────────────────────────────────────
// AVVIO ALLA PARTENZA DELLA PAGINA
// ─────────────────────────────────────
window.onload = fetchQuestions;
