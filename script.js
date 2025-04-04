const SHEET_ID = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPQ2rb9ES4v_bsafPHwu4PbdHaanFZ9uh6vy5Mrbc9re4eKqTK19OfmzUvytSL0SNHTrmgGpax3vHE/pub?output=csv";
const SHEET_RANGE = "A1:A";
const API_KEY = "AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjMY";
const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?alt=json&key=${API_KEY}`;

let startX, startY;
let isDragging = false;

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
  const statusCell = row.cells[2];
  const movementX = touch.clientX - startX;
  const movementY = touch.clientY - startY;

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

function handleMouseDown(event) {
  startX = event.clientX;
  startY = event.clientY;
  isDragging = false;
}

function handleMouseMove(event, row) {
  if (event.buttons !== 1) return;

  const movementX = event.clientX - startX;
  const movementY = event.clientY - startY;
  const statusCell = row.cells[2];

  if (Math.abs(movementX) > 5 || Math.abs(movementY) > 5) {
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
}

function handleMouseUp(event, row) {
  // Il cambiamento è già visualizzato durante il movimento
}

function inizializzaTrascinamento() {
  document.querySelectorAll("tr[draggable=true]").forEach(row => {
    // Touch events
    row.addEventListener("touchstart", handleTouchStart);
    row.addEventListener("touchmove", (event) => handleTouchMove(event, row));
    row.addEventListener("touchend", (event) => handleTouchEnd(event, row));

    // Mouse events
    row.addEventListener("mousedown", handleMouseDown);
    row.addEventListener("mousemove", (event) => handleMouseMove(event, row));
    row.addEventListener("mouseup", (event) => handleMouseUp(event, row));
  });
}

function confermaChecklist() {
  alert("Checklist salvata con successo!");
}

async function caricaDomande() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const domande = data.values;
    const table = document.getElementById("checklist-table");

    domande.forEach((riga, index) => {
      if (!riga[0] || riga[0].toLowerCase().includes("domanda")) return;

      const row = table.insertRow();
      row.setAttribute("draggable", "true");

      row.innerHTML = `
        <td>${index}</td>
        <td class="domanda" style="user-select: none;">${riga[0]}</td>
        <td class="status vuoto">-</td>
        <td><textarea rows="2"></textarea></td>
      `;
    });

    inizializzaTrascinamento();
  } catch (error) {
    console.error("Errore durante il caricamento delle domande:", error);
  }
}

// Avvio caricamento al load
caricaDomande();
