const SHEET_ID = "1CNopIVdSKPdb4L6Bp6-rF4mluabO7znPI_FuWtpGAYs"; // Sostituisci con il tuo Sheet ID
const API_KEY = "AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjM"; // Inserisci la tua API Key
const SHEET_NAME = "Foglio1"; // Modifica se il foglio ha un nome diverso

const tableBody = document.getElementById("table-body");

async function fetchQuestions() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A2:A1000?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.values || data.values.length === 0) {
            console.error("Nessuna domanda trovata nel foglio Google Sheet.");
            return;
        }

        tableBody.innerHTML = ""; // Svuota la tabella prima di aggiornare

        data.values.forEach((row, index) => {
            const domanda = row[0]; // Prende la domanda dalla colonna A
            if (domanda) {
                const tr = document.createElement("tr");
                tr.draggable = true;
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${domanda}</td>
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

// Gestione del trascinamento (drag & drop)
function addDragEvents(row) {
    let startX, startY, isDragging = false;

    row.addEventListener("touchstart", (event) => {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isDragging = false;
    });

    row.addEventListener("touchmove", (event) => {
        const touch = event.touches[0];
        const movementX = touch.clientX - startX;
        const movementY = touch.clientY - startY;
        const statusCell = row.cells[2];

        if (Math.abs(movementX) > 10 || Math.abs(movementY) > 10) {
            isDragging = true;
        }

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
    });

    row.addEventListener("touchend", () => {
        if (!isDragging) return;
    });
}

// Conferma checklist
function confermaChecklist() {
    alert("Checklist salvata con successo!");
}

// Esegui l'importazione all'apertura della pagina
document.addEventListener("DOMContentLoaded", fetchQuestions);
