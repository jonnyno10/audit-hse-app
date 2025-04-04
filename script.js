const SHEET_ID = "2PACX-1vTPQ2rb9ES4v_bsafPHwu4PbdHaanFZ9uh6vy5Mrbc9re4eKqTK19OfmzUvytSL0SNHTrmgGpax3vHE";
const API_KEY = "AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjMY";
const SHEET_NAME = "Foglio1"; // Cambia se il foglio ha un nome diverso

let startX, startY, isDragging = false;

function disableScroll() {
    document.body.style.overflow = "hidden";
}

function enableScroll() {
    document.body.style.overflow = "auto";
}

function handleTouchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    isDragging = false;
}

function handleTouchMove(event, row) {
    const touch = event.touches[0];
    const statusCell = row.cells[2];
    const movementX = touch.clientX - startX;
    const movementY = touch.clientY - startY;

    if (Math.abs(movementX) > 10 || Math.abs(movementY) > 10) {
        isDragging = true;
        disableScroll();
    }

    event.preventDefault();

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
}

function handleTouchEnd(event, row) {
    enableScroll();
    if (!isDragging) return;

    const touch = event.changedTouches[0];
    const movementX = touch.clientX - startX;
    const movementY = touch.clientY - startY;
    const statusCell = row.cells[2];

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
}

function handleMouseDrag(row) {
    let currentStatus = row.cells[2].textContent.trim();
    let nextStatus = {
        "-": "Conforme",
        "Conforme": "Non Conforme",
        "Non Conforme": "Non Applicabile",
        "Non Applicabile": "-"
    }[currentStatus] || "-";

    row.cells[2].textContent = nextStatus;
    row.cells[2].className = `status ${nextStatus.toLowerCase().replace(" ", "-")}`;
}

function addRow(index, domanda) {
    const table = document.getElementById("checklistTable");
    const row = table.insertRow(-1);
    row.setAttribute("draggable", "true");

    row.innerHTML = `
        <td>${index + 1}</td>
        <td class="domanda" unselectable="on">${domanda}</td>
        <td class="status vuoto">-</td>
        <td><textarea rows="2"></textarea></td>
    `;

    // Touch (mobile)
    row.addEventListener("touchstart", handleTouchStart);
    row.addEventListener("touchmove", (event) => handleTouchMove(event, row));
    row.addEventListener("touchend", (event) => handleTouchEnd(event, row));

    // Mouse (desktop)
    row.addEventListener("click", () => handleMouseDrag(row));
}

async function caricaDomandeDaGoogleSheet() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A2:A?key=${API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.values) {
            data.values.forEach((row, i) => {
                addRow(i, row[0]);
            });
        } else {
            alert("Nessuna domanda trovata nel foglio Google Sheet.");
        }
    } catch (error) {
        console.error("Errore nel caricamento da Google Sheets:", error);
        alert("Errore nel caricamento delle domande.");
    }
}

function confermaChecklist() {
    alert("Checklist salvata con successo!");
}

window.onload = caricaDomandeDaGoogleSheet;
