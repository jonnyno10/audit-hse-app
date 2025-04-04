const API_KEY = "AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjM";
const SHEET_ID = "1CNopIVdSKPdb4L6Bp6-rF4mluabO7znPI_FuWtpGAYs";
const SHEET_NAME = "Foglio1";

const tableBody = document.querySelector("#table-body");

// Variabili trascinamento
let startX, startY, isDragging = false;

// Stato
function updateStatus(cell, direction) {
    if (!cell.classList.contains("status")) return;

    if (direction === "right") {
        cell.textContent = "Conforme";
        cell.className = "status conforme";
    } else if (direction === "left") {
        cell.textContent = "Non Conforme";
        cell.className = "status non-conforme";
    } else if (direction === "up") {
        cell.textContent = "Non Applicabile";
        cell.className = "status non-applicabile";
    } else if (direction === "down") {
        cell.textContent = "-";
        cell.className = "status vuoto";
    }
}

// Fetch da Google Sheets
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
                    <td class="status vuoto">-</td>
                    <td><textarea rows="2"></textarea></td>
                `;
                const statusCell = tr.querySelector(".status");
                addDragEvents(statusCell);
                tableBody.appendChild(tr);
            }
        });

    } catch (error) {
        console.error("Errore nel recupero delle domande:", error);
    }
}

// Eventi Drag – Mobile
function handleTouchStart(e) {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    isDragging = false;
}

function handleTouchMove(e) {
    const touch = e.touches[0];
    const movementX = touch.clientX - startX;
    const movementY = touch.clientY - startY;

    if (Math.abs(movementX) > 10 || Math.abs(movementY) > 10) {
        isDragging = true;
        e.preventDefault();
    }

    if (!isDragging) return;

    const cell = e.currentTarget;

    if (Math.abs(movementX) > Math.abs(movementY)) {
        updateStatus(cell, movementX > 30 ? "right" : movementX < -30 ? "left" : null);
    } else {
        updateStatus(cell, movementY < -30 ? "up" : movementY > 30 ? "down" : null);
    }
}

function handleTouchEnd() {
    isDragging = false;
    document.body.style.overflow = "auto";
}

// Eventi Drag – Desktop
function handleMouseDown(e) {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = false;

    const cell = e.currentTarget;

    const onMouseMove = (event) => {
        const movementX = event.clientX - startX;
        const movementY = event.clientY - startY;

        if (Math.abs(movementX) > 10 || Math.abs(movementY) > 10) {
            isDragging = true;
        }

        if (!isDragging) return;

        if (Math.abs(movementX) > Math.abs(movementY)) {
            updateStatus(cell, movementX > 30 ? "right" : movementX < -30 ? "left" : null);
        } else {
            updateStatus(cell, movementY < -30 ? "up" : movementY > 30 ? "down" : null);
        }
    };

    const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
}

// Applica eventi alla cella
function addDragEvents(cell) {
    cell.classList.add("no-select");
    cell.addEventListener("touchstart", handleTouchStart);
    cell.addEventListener("touchmove", handleTouchMove);
    cell.addEventListener("touchend", handleTouchEnd);

    cell.addEventListener("mousedown", handleMouseDown);
}

// Avvia
window.onload = fetchQuestions;
