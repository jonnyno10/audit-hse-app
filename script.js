
// CONFIGURAZIONE: Inserisci la tua API key e ID del foglio
const API_KEY = "AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjM";
const SHEET_ID = "1CNopIVdSKPdb4L6Bp6-rF4mluabO7znPI_FuWtpGAYs";
const SHEET_NAME = "Foglio1";

const tableBody = document.querySelector("#table-body");

// Funzione per caricare le domande dal Google Sheet
async function fetchQuestions() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A2:A1000?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.values || data.values.length === 0) {
            console.error("Nessuna domanda trovata.");
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
                    <td class="status vuoto" ontouchstart="touchStart(event)" ontouchmove="touchMove(event, this)" ontouchend="touchEnd(event, this)" onmousedown="mouseDown(event, this)">-</td>
                `;
                tableBody.appendChild(tr);
            }
        });

    } catch (error) {
        console.error("Errore nel recupero delle domande:", error);
    }
}

// Stato iniziale delle coordinate
let startX = 0;
let startY = 0;

// TOUCH EVENTI MOBILE
function touchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;

    // Blocca lo scroll
    document.body.classList.add("no-scroll");
}

function touchMove(event, cell) {
    const touch = event.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    applySwipeLogic(dx, dy, cell);
}

function touchEnd(event, cell) {
    resetCellBackground(cell);
    // Sblocca lo scroll
    document.body.classList.remove("no-scroll");
}

// MOUSE EVENTI DESKTOP
function mouseDown(event, cell) {
    event.preventDefault();
    startX = event.clientX;
    startY = event.clientY;

    const moveHandler = (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        applySwipeLogic(dx, dy, cell);
    };

    const upHandler = () => {
        document.removeEventListener("mousemove", moveHandler);
        document.removeEventListener("mouseup", upHandler);
        resetCellBackground(cell);
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", upHandler);
}

// Cambia lo stato in base al movimento
function applySwipeLogic(dx, dy, cell) {
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) {
            setStatus(cell, "Conforme", "conforme");
        } else if (dx < -30) {
            setStatus(cell, "Non Conforme", "non-conforme");
        } else {
            previewBackground(cell, "conforme");
        }
    } else {
        if (dy < -30) {
            setStatus(cell, "Non Applicabile", "non-applicabile");
        } else if (dy > 30) {
            setStatus(cell, "-", "vuoto");
        } else {
            previewBackground(cell, "non-applicabile");
        }
    }
}

// Imposta il testo e la classe della cella
function setStatus(cell, text, statusClass) {
    cell.textContent = text;
    cell.className = `status ${statusClass}`;
}

// Mostra anteprima animata sfondo durante swipe
function previewBackground(cell, statusClass) {
    cell.className = `status ${statusClass} preview`;
}

// Ripristina lo sfondo alla fine del trascinamento
function resetCellBackground(cell) {
    cell.classList.remove("preview");
}

// Bottone conferma
function confermaChecklist() {
    alert("Checklist salvata con successo!");
}

// Avvia il caricamento al load
window.onload = fetchQuestions;
