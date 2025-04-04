// CONFIGURAZIONE: Inserisci la tua API key e ID del foglio
const API_KEY = "AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjM";
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

        if (!data.values || data.values.length === 0) {
            console.error("Nessuna domanda trovata nel foglio Google Sheet.");
            return;
        }

        tableBody.innerHTML = "";

        data.values.forEach((row, index) => {
            const domanda = row[0];
            if (domanda) {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td class="domanda">${domanda}</td>
                    <td class="status vuoto" data-status="vuoto">-</td>
                    <td><textarea rows="2"></textarea></td>
                `;
                addDragEvents(tr.querySelector(".status"));
                tableBody.appendChild(tr);
            }
        });

    } catch (error) {
        console.error("Errore nel recupero delle domande:", error);
    }
}

// ─────────────────────────────────────
// GESTIONE TRASCINAMENTO MOBILE SOLO SULLA CELLA "STATO"
// ─────────────────────────────────────
function handleTouchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    isDragging = false;
    event.currentTarget.classList.add("dragging-active");
}

function handleTouchMove(event) {
    const touch = event.touches[0];
    const cell = event.currentTarget;
    const movementX = touch.clientX - startX;
    const movementY = touch.clientY - startY;

    if (Math.abs(movementX) > 10 || Math.abs(movementY) > 10) {
        isDragging = true;
        document.body.style.overflow = "hidden";
    }

    event.preventDefault();

    applyDirectionToCell(cell, movementX, movementY);
}

function handleTouchEnd(event) {
    document.body.style.overflow = "auto";
    const cell = event.currentTarget;
    finalizeStatus(cell);
    cell.classList.remove("dragging-active", "left", "right", "up", "down");
}

// ─────────────────────────────────────
// GESTIONE TRASCINAMENTO DESKTOP SOLO SULLA CELLA "STATO"
// ─────────────────────────────────────
function handleMouseDown(event) {
    startX = event.clientX;
    startY = event.clientY;
    isDragging = false;
    const cell = event.currentTarget;
    cell.classList.add("dragging-active");

    function mouseMoveHandler(e) {
        const movementX = e.clientX - startX;
        const movementY = e.clientY - startY;
        applyDirectionToCell(cell, movementX, movementY);
    }

    function mouseUpHandler() {
        finalizeStatus(cell);
        cell.classList.remove("dragging-active", "left", "right", "up", "down");
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
    }

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
}

// ─────────────────────────────────────
// APPLICA DIREZIONE COME CLASSE TEMPORANEA
// ─────────────────────────────────────
function applyDirectionToCell(cell, movementX, movementY) {
    cell.classList.remove("left", "right", "up", "down");

    if (Math.abs(movementX) > Math.abs(movementY)) {
        if (movementX > 30) cell.classList.add("right");
        else if (movementX < -30) cell.classList.add("left");
    } else {
        if (movementY < -30) cell.classList.add("up");
        else if (movementY > 30) cell.classList.add("down");
    }
}

// ─────────────────────────────────────
// ASSEGNA LO STATO FINALE ALLA CELLA
// ─────────────────────────────────────
function finalizeStatus(cell) {
    if (cell.classList.contains("right")) {
        cell.textContent = "Conforme";
        cell.className = "status conforme";
    } else if (cell.classList.contains("left")) {
        cell.textContent = "Non Conforme";
        cell.className = "status non-conforme";
    } else if (cell.classList.contains("up")) {
        cell.textContent = "Non Applicabile";
        cell.className = "status non-applicabile";
    } else if (cell.classList.contains("down")) {
        cell.textContent = "-";
        cell.className = "status vuoto";
    }
}

// ─────────────────────────────────────
// AGGIUNTA EVENTI A SINGOLA CELLA "STATO"
// ─────────────────────────────────────
function addDragEvents(cell) {
    cell.addEventListener("touchstart", handleTouchStart);
    cell.addEventListener("touchmove", handleTouchMove);
    cell.addEventListener("touchend", handleTouchEnd);

    cell.addEventListener("mousedown", handleMouseDown);
}

// ─────────────────────────────────────
// CONFERMA CHECKLIST
// ─────────────────────────────────────
function confermaChecklist() {
    alert("Checklist salvata con successo!");
}

// Avvia al caricamento
window.onload = fetchQuestions;
