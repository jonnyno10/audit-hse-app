// CONFIGURAZIONE
const API_KEY = "AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjM";
const SHEET_ID = "1CNopIVdSKPdb4L6Bp6-rF4mluabO7znPI_FuWtpGAYs";
const SHEET_NAME = "Foglio1";

const tableBody = document.querySelector("#table-body");

let startX, startY;

// ─────────────────────────────
// FETCH DOMANDE DA GOOGLE SHEET
// ─────────────────────────────
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
                    <td class="status vuoto" ontouchstart="touchStart(event)" ontouchmove="touchMove(event)" ontouchend="touchEnd()" onmousedown="mouseDown(event)">-</td>
                    <td><textarea rows="2"></textarea></td>
                `;
                tableBody.appendChild(tr);
            }
        });

    } catch (error) {
        console.error("Errore nel recupero delle domande:", error);
    }
}

// ─────────────────────────────
// TOUCH EVENTS
// ─────────────────────────────
function touchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    document.body.style.overflow = "hidden";
}

function touchMove(event) {
    const touch = event.touches[0];
    const movementX = touch.clientX - startX;
    const movementY = touch.clientY - startY;
    const target = event.target;

    if (!target.classList.contains("status")) return;

    event.preventDefault();

    if (Math.abs(movementX) > Math.abs(movementY)) {
        if (movementX > 30) setStatus(target, "Conforme");
        else if (movementX < -30) setStatus(target, "Non Conforme");
    } else {
        if (movementY < -30) setStatus(target, "Non Applicabile");
        else if (movementY > 30) setStatus(target, "-");
    }
}

function touchEnd() {
    document.body.style.overflow = "auto";
}

// ─────────────────────────────
// MOUSE EVENTS
// ─────────────────────────────
function mouseDown(event) {
    if (!event.target.classList.contains("status")) return;

    startX = event.clientX;
    startY = event.clientY;

    const mouseMoveHandler = (e) => {
        const movementX = e.clientX - startX;
        const movementY = e.clientY - startY;
        const target = event.target;

        if (Math.abs(movementX) > Math.abs(movementY)) {
            if (movementX > 30) setStatus(target, "Conforme");
            else if (movementX < -30) setStatus(target, "Non Conforme");
        } else {
            if (movementY < -30) setStatus(target, "Non Applicabile");
            else if (movementY > 30) setStatus(target, "-");
        }

        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
    };

    const mouseUpHandler = () => {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
}

// ─────────────────────────────
// STATO: AGGIORNA VISUALMENTE
// ─────────────────────────────
function setStatus(cell, status) {
    const statusMap = {
        "Conforme": "status conforme",
        "Non Conforme": "status non-conforme",
        "Non Applicabile": "status non-applicabile",
        "-": "status vuoto"
    };

    cell.textContent = status;
    cell.className = statusMap[status] || "status vuoto";
}

// ─────────────────────────────
// CONFERMA CHECKLIST
// ─────────────────────────────
function confermaChecklist() {
    alert("Checklist salvata con successo!");
}

// Avvia caricamento domande al load
window.onload = fetchQuestions;
