
const API_KEY = "AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjM";
const SHEET_ID = "1CNopIVdSKPdb4L6Bp6-rF4mluabO7znPI_FuWtpGAYs";
const SHEET_NAME = "Foglio1";

const tableBody = document.querySelector("#table-body");
let startX = 0;
let startY = 0;
let currentCell = null;

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
                const statusCell = document.createElement("td");

                statusCell.className = "status vuoto";
                statusCell.innerHTML = "&nbsp;";
                statusCell.addEventListener("touchstart", startInteraction, { passive: false });
                statusCell.addEventListener("touchmove", moveInteraction, { passive: false });
                statusCell.addEventListener("touchend", endInteraction);
                statusCell.addEventListener("mousedown", startInteraction);

                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td class="domanda">${domanda}</td>
                `;
                tr.appendChild(statusCell);
                tableBody.appendChild(tr);
            }
        });
    } catch (error) {
        console.error("Errore nel recupero delle domande:", error);
    }
}

function getCoordinates(event) {
    if (event.touches && event.touches[0]) {
        return {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    } else {
        return {
            x: event.clientX,
            y: event.clientY
        };
    }
}

function startInteraction(event) {
    const coords = getCoordinates(event);
    startX = coords.x;
    startY = coords.y;
    currentCell = event.currentTarget;

    if (event.type === "touchstart") {
        document.body.classList.add("no-scroll");
    } else {
        document.addEventListener("mousemove", moveInteraction);
        document.addEventListener("mouseup", endInteraction);
    }
}

function moveInteraction(event) {
    if (!currentCell) return;

    const coords = getCoordinates(event);
    const dx = coords.x - startX;
    const dy = coords.y - startY;

    applySwipeLogic(dx, dy, currentCell);

    if (event.type.startsWith("touch")) {
        event.preventDefault();
    }
}

function endInteraction(event) {
    if (!currentCell) return;

    if (event.type === "mouseup") {
        document.removeEventListener("mousemove", moveInteraction);
        document.removeEventListener("mouseup", endInteraction);
    } else {
        document.body.classList.remove("no-scroll");
    }

    resetCellBackground(currentCell);
    currentCell = null;
}

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

function setStatus(cell, text, statusClass) {
    cell.textContent = text || " ";
    cell.className = `status ${statusClass}`;
}

function previewBackground(cell, statusClass) {
    cell.className = `status ${statusClass} preview`;
}

function resetCellBackground(cell) {
    cell.classList.remove("preview");
}

function showDialog() {
    alert("Hai modificato lo stato da vuoto a uno stato selezionato.");
}

function confermaChecklist() {
    alert("Checklist salvata con successo!");
}

window.onload = fetchQuestions;
