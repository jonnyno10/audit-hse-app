// script.js

// CONFIGURAZIONE
const API_KEY = "AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjM";
const SHEET_ID = "1CNopIVdSKPdb4L6Bp6-rF4mluabO7znPI_FuWtpGAYs";
const SHEET_NAME = "Foglio1";

const tableBody = document.querySelector("#table-body");

// Trascinamento: Variabili globali
let startX, startY, isDragging = false;

// Stato → colore e label
const STATES = [
  { label: "-", className: "vuoto" },
  { label: "Conforme", className: "conforme" },
  { label: "Non Conforme", className: "non-conforme" },
  { label: "Non Applicabile", className: "non-applicabile" }
];

// ─────────────────────────────────────
// FETCH DOMANDE DA GOOGLE SHEETS
// ─────────────────────────────────────
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
          <td class="status-cell">
            <div class="status vuoto" draggable="true">
              <span class="status-label">-</span>
              <div class="status-arrows">
                <span class="arrow">⬅️</span>
                <span class="arrow">➡️</span>
                <span class="arrow">⬆️</span>
                <span class="arrow">⬇️</span>
              </div>
            </div>
          </td>
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

// ─────────────────────────────────────
// GESTIONE TRASCINAMENTO
// ─────────────────────────────────────
function addDragEvents(row) {
  const statusDiv = row.querySelector(".status");

  statusDiv.addEventListener("touchstart", handleTouchStart);
  statusDiv.addEventListener("touchmove", (e) => handleTouchMove(e, statusDiv));
  statusDiv.addEventListener("touchend", handleTouchEnd);

  statusDiv.addEventListener("mousedown", (e) => handleMouseDown(e, statusDiv));
}

function handleTouchStart(event) {
  const touch = event.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  isDragging = false;
}

function handleTouchMove(event, element) {
  const touch = event.touches[0];
  const movementX = touch.clientX - startX;
  const movementY = touch.clientY - startY;
  isDragging = true;
  event.preventDefault();

  updateStatusByDirection(element, movementX, movementY);
}

function handleTouchEnd() {
  document.body.style.overflow = "auto";
}

function handleMouseDown(event, element) {
  startX = event.clientX;
  startY = event.clientY;
  isDragging = false;

  const onMouseMove = (e) => {
    isDragging = true;
    const movementX = e.clientX - startX;
    const movementY = e.clientY - startY;
    updateStatusByDirection(element, movementX, movementY);
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

function updateStatusByDirection(statusElement, dx, dy) {
  const labelSpan = statusElement.querySelector(".status-label");

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) setStatus(statusElement, 1); // Conforme
    else if (dx < -30) setStatus(statusElement, 2); // Non Conforme
  } else {
    if (dy < -30) setStatus(statusElement, 3); // Non Applicabile
    else if (dy > 30) setStatus(statusElement, 0); // Vuoto
  }
}

function setStatus(element, index) {
  const { label, className } = STATES[index];
  const labelSpan = element.querySelector(".status-label");

  labelSpan.textContent = label;
  element.className = `status ${className}`;
}

// ─────────────────────────────────────
// CONFERMA CHECKLIST
// ─────────────────────────────────────
function confermaChecklist() {
  alert("Checklist salvata con successo!");
}

window.onload = fetchQuestions;
