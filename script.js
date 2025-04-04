// CONFIGURAZIONE: Inserisci la tua API key e ID del foglio
const API_KEY = "AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjM";
const SHEET_ID = "1CNopIVdSKPdb4L6Bp6-rF4mluabO7znPI_FuWtpGAYs";
const SHEET_NAME = "Foglio1";

const tableBody = document.querySelector("#table-body");

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
                        &nbsp;
                    </td>
                `;
                tableBody.appendChild(tr);
            }
        });

    } catch (error) {
        console.error("Errore nel recupero delle domande:", error);
    }
}

let startX = 0;
let startY = 0;

// TOUCH EVENTS
function touchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    document.body.classList.add("no-scroll");
}

function touchMove(event, cell) {
    const touch = event.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    applySwipeLogic(dx, dy, cell);
}

function touchEnd(event, cell) {
    document.body.classList.remove("no-scroll");
    resetCellBackground(cell);
}

// MOUSE EVENTS
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

// Cambia stato cella in base alla direzione
function applySwipeLogic(dx, dy, cell) {
    const currentText = cell.textContent.trim();
    const isEmpty = currentText === "";

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) {
            if (isEmpty) showDialog();
            setStatus(cell, "Conforme", "conforme");
        } else if (dx < -30) {
            if (isEmpty) showDialog();
            setStatus(cell, "Non Conforme", "non-conforme");
        } else {
            previewBackground(cell, "conforme");
        }
    } else {
        if (dy < -30) {
            if (isEmpty) showDialog();
            setStatus(cell, "Non Applicabile", "non-applicabile");
        } else if (dy > 30) {
            setStatus(cell, "", "vuoto");
        } else {
            previewBackground(cell, "non-applicabile");
        }
    }
}

// Applica lo stato selezionato
function setStatus(cell, text, statusClass) {
    cell.textContent = text || "\u00A0";
    cell.className = `status ${statusClass}`;
}

// Mostra sfondo animato durante swipe
function previewBackground(cell, statusClass) {
    cell.className = `status ${statusClass} preview`;
}

// Ripristina sfondo
function resetCellBackground(cell) {
    cell.classList.remove("preview");
}

// Finestra di dialogo quando cambia stato da vuoto
function showDialog() {
    alert("Hai modificato lo stato da vuoto a uno stato selezionato.");
}

// Pulsante conferma
function confermaChecklist() {
    alert("Checklist salvata con successo!");
}

window.onload = fetchQuestions;
