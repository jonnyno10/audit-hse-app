const API_KEY = "AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjM";
const SHEET_ID = "1CNopIVdSKPdb4L6Bp6-rF4mluabO7znPI_FuWtpGAYs";
const SHEET_NAME = "Foglio1";

const tableBody = document.querySelector("#table-body");
let startX = 0;
let startY = 0;
let currentCell = null;
let currentNoteKey = null;

async function fetchQuestions() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A2:A1000?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.values || data.values.length === 0) {
            console.error("Nessuna domanda trovata.");
            tableBody.innerHTML = "<tr><td colspan='3' style='text-align:center; color:red;'>Nessuna domanda trovata nel foglio Google Sheets</td></tr>";
            return;
        }

        tableBody.innerHTML = "";

        data.values.forEach((row, index) => {
            const domanda = row[0];
            const rowIndex = index + 1;
            const noteKey = `nota_riga_${rowIndex}`;
            const statoKey = `stato_riga_${rowIndex}`;
            const savedStatus = localStorage.getItem(statoKey);
            const savedNote = localStorage.getItem(noteKey);

            const tr = document.createElement("tr");

            const numeroTd = document.createElement("td");
            numeroTd.textContent = rowIndex;

            const domandaTd = document.createElement("td");
            domandaTd.textContent = domanda;

            const statoTd = document.createElement("td");
            statoTd.className = savedStatus ? `status ${savedStatus}` : "status vuoto";
            statoTd.textContent = savedStatus ? statusLabel(savedStatus) : "\u00A0";
            statoTd.addEventListener("touchstart", startInteraction, { passive: false });
            statoTd.addEventListener("touchmove", moveInteraction, { passive: false });
            statoTd.addEventListener("touchend", endInteraction);
            statoTd.addEventListener("mousedown", startInteraction);

            const badge = document.createElement("span");
            badge.className = "note-badge";
            badge.textContent = "📝";
            badge.style.display = savedNote ? "inline-block" : "none";
            badge.onclick = () => {
                const note = localStorage.getItem(noteKey) || "Nessuna nota presente.";
                alert(note);
            };

            statoTd.appendChild(badge);

            tr.appendChild(numeroTd);
            tr.appendChild(domandaTd);
            tr.appendChild(statoTd);
            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Errore nel recupero delle domande:", error);
        tableBody.innerHTML = "<tr><td colspan='3' style='text-align:center; color:red;'>Errore nel caricamento delle domande</td></tr>";
    }
}

function getCoordinates(event) {
    if (event.touches && event.touches[0]) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    } else {
        return { x: event.clientX, y: event.clientY };
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

    if (currentCell.textContent.trim() !== "") {
        showDialog(currentCell);
    }

    resetCellBackground(currentCell);
    currentCell = null;
}

function applySwipeLogic(dx, dy, cell) {
    const isEmpty = cell.textContent.trim() === "";

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
            const rowIndex = cell.parentElement.rowIndex;
            const noteKey = `nota_riga_${rowIndex}`;
            const hasNote = localStorage.getItem(noteKey);
            const currentStatus = cell.className.includes("vuoto") ? "" : cell.className;

            if (currentStatus !== "status vuoto" || hasNote) {
                const confirmReset = confirm("Sei sicuro di voler rimuovere lo stato? Verranno eliminate anche eventuali note associate.");
                if (!confirmReset) return;
            }

            localStorage.removeItem(noteKey);
            localStorage.removeItem(`stato_riga_${rowIndex}`);
            setStatus(cell, "", "vuoto");
            resetCellBackground(cell);
            currentCell = null;
            return;

        } else {
            previewBackground(cell, "non-applicabile");
        }
    }
}

function setStatus(cell, text, statusClass) {
    const rowIndex = cell.parentElement.rowIndex;
    localStorage.setItem(`stato_riga_${rowIndex}`, statusClass);
    cell.textContent = statusLabel(statusClass);
    cell.className = `status ${statusClass}`;
}

function statusLabel(statusClass) {
    switch(statusClass) {
        case "conforme": return "Conforme";
        case "non-conforme": return "Non Conforme";
        case "non-applicabile": return "Non Applicabile";
        default: return "\u00A0";
    }
}

function previewBackground(cell, statusClass) {
    cell.className = `status ${statusClass} preview`;
}

function resetCellBackground(cell) {
    cell.classList.remove("preview");
}

function showDialog(cell) {
    const modal = document.getElementById("note-modal");
    const closeModal = document.getElementById("close-modal");
    const saveNote = document.getElementById("save-note");
    const deleteNote = document.getElementById("delete-note");
    const noteText = document.getElementById("note-text");

    const rowIndex = cell.parentElement.rowIndex;
    const noteKey = `nota_riga_${rowIndex}`;
    currentNoteKey = noteKey;
    noteText.value = localStorage.getItem(noteKey) || "";

    modal.style.display = "block";

    closeModal.onclick = () => {
        modal.style.display = "none";
    };

    saveNote.onclick = () => {
        localStorage.setItem(noteKey, noteText.value);
        modal.style.display = "none";
        fetchQuestions();
    };

    deleteNote.onclick = () => {
        localStorage.removeItem(noteKey);
        modal.style.display = "none";
        fetchQuestions();
    };
}

function confermaChecklist() {
    alert("Checklist salvata con successo!");
}

window.onload = fetchQuestions;


function exportToExcel() {
    const rows = document.querySelectorAll("#table-body tr");
    const data = [["#", "Domanda", "Stato", "Nota"]];

    rows.forEach((tr, index) => {
        const cells = tr.querySelectorAll("td");
        const numero = cells[0].textContent.trim();
        const domanda = cells[1].textContent.trim();
        const stato = cells[2].textContent.trim();
        const noteKey = `nota_riga_${index + 1}`;
        const nota = localStorage.getItem(noteKey) || "";

        data.push([numero, domanda, stato, nota]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Audit");

    XLSX.writeFile(workbook, "audit_hse_export.xlsx");
}


function exportToGoogleSheets() {
    const rows = document.querySelectorAll("#table-body tr");
    const dati = [];

    rows.forEach((tr, index) => {
        const celle = tr.querySelectorAll("td");
        const numero = celle[0].textContent.trim();
        const domanda = celle[1].textContent.trim();
        const stato = celle[2].textContent.trim();
        const nota = localStorage.getItem(`nota_riga_${index + 1}`) || "";

        dati.push({ numero, domanda, stato, nota });
    });

    fetch("https://script.google.com/macros/s/AKfycbxL8aY8ipOI2ZHPc3IkHIH3azxmqopd4Z161cLqZN99Y7uLnHBUQPJS0C9-l6ZHQDnQ/exec", {
        method: "POST",
        body: JSON.stringify(dati),
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.text())
    .then(msg => alert("✅ " + msg))
    .catch(err => alert("❌ Errore: " + err));
}
