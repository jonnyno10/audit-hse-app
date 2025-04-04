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
                    <td class="status vuoto" 
                        ontouchstart="touchStart(event)" 
                        ontouchmove="touchMove(event, this)" 
                        ontouchend="touchEnd(event, this)" 
                        onmousedown="mouseDown(event, this)">
                        -
                    </td>
                    <td><textarea rows="2"></textarea></td>
                `;
                tableBody.appendChild(tr);
            }
        });

    } catch (error) {
        console.error("Errore nel recupero delle domande:", error);
    }
}

// Coordinate iniziali per calcolo direzione swipe
let startX = 0;
let startY = 0;

/* EVENTI MOBILE */

// Salva posizione iniziale e blocca scroll
function touchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    document.body.classList.add("no-scroll"); // blocca lo scroll
}

// Calcola direzione swipe e applica stato
function touchMove(event, cell) {
    const touch = event.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    applySwipeLogic(dx, dy, cell);
}

// Ripristina stile e scroll
function touchEnd(event, cell) {
    document.body.classList.remove("no-scroll"); // riattiva scroll
    resetCellBackground(cell);
}

/* EVENTI DESKTOP */

// Simula swipe con mouse (desktop)
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

/* GESTIONE STATO */

// Cambia lo stato in base al movimento
function applySwipeLogic(dx, dy, cell) {
    if (Math.abs(dx) > Math.abs(dy)) {
        // Swipe orizzontale
        if (dx > 30) {
            setStatus(cell, "Conforme", "conforme");
        } else if (dx < -30) {
            setStatus(cell, "Non Conforme", "non-conforme");
        } else {
            previewBackground(cell, "conforme");
        }
    } else {
        // Swipe verticale
        if (dy < -30) {
            setStatus(cell, "Non Applicabile", "non-applicabile");
        } else if (dy > 30) {
            setStatus(cell, "-", "vuoto");
        } else {
            previewBackground(cell, "non-applicabile");
        }
    }
}

// Imposta lo stato definitivo nella cella
function setStatus(cell, text, statusClass) {
    cell.textContent = text;
    cell.className = `status ${statusClass}`;
}

// Mostra anteprima dello stato durante swipe
function previewBackground(cell, statusClass) {
    cell.className = `status ${statusClass} preview`;
}

// Rimuove l'effetto preview al termine dello swipe
function resetCellBackground(cell) {
    cell.classList.remove("preview");
}

// Pulsante di conferma checklist
function confermaChecklist() {
    alert("Checklist salvata con successo!");
}

// Avvio iniziale caricamento domande
window.onload = fetchQuestions;
