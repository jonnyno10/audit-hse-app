const API_KEY = "AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjM";
const SHEET_ID = "1CNopIVdSKPdb4L6Bp6-rF4mluabO7znPI_FuWtpGAYs";
const SHEET_NAME = "Foglio1";

const tableBody = document.querySelector("#table-body");

let startX = 0, startY = 0;

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
                    <td class="status vuoto no-select">-</td>
                    <td><textarea rows="2"></textarea></td>
                `;

                const statusCell = tr.querySelector(".status");
                addDragEventsToCell(statusCell);

                tableBody.appendChild(tr);
            }
        });

    } catch (error) {
        console.error("Errore nel recupero delle domande:", error);
    }
}

function addDragEventsToCell(cell) {
    // Desktop
    cell.addEventListener("mousedown", (e) => {
        startX = e.clientX;
        startY = e.clientY;

        const onMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            handleDirectionChange(cell, dx, dy);
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    // Mobile
    cell.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    });

    cell.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        handleDirectionChange(cell, dx, dy);
    }, { passive: false });
}

function handleDirectionChange(cell, dx, dy) {
    const threshold = 30;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > threshold) {
            updateStatus(cell, "Conforme", "conforme");
        } else if (dx < -threshold) {
            updateStatus(cell, "Non Conforme", "non-conforme");
        }
    } else {
        if (dy < -threshold) {
            updateStatus(cell, "Non Applicabile", "non-applicabile");
        } else if (dy > threshold) {
            updateStatus(cell, "-", "vuoto");
        }
    }
}

function updateStatus(cell, text, className) {
    cell.textContent = text;
    cell.className = `status ${className} no-select`;
}

function confermaChecklist() {
    alert("Checklist salvata con successo!");
}

window.onload = fetchQuestions;
