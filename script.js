let startX, startY;
let isDragging = false;
let activeRow = null;

function disableScroll() {
  document.body.style.overflow = "hidden";
}

function enableScroll() {
  document.body.style.overflow = "auto";
}

function getStatusByMovement(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) return { text: "Conforme", className: "status conforme" };
    if (dx < -30) return { text: "Non Conforme", className: "status non-conforme" };
  } else {
    if (dy < -30) return { text: "Non Applicabile", className: "status non-applicabile" };
    if (dy > 30) return { text: "-", className: "status vuoto" };
  }
  return null;
}

function applyStatus(row, status) {
  const cell = row.cells[2];
  if (status) {
    cell.textContent = status.text;
    cell.className = status.className;
  }
}

function handleStart(x, y, row) {
  startX = x;
  startY = y;
  isDragging = false;
  activeRow = row;
  disableScroll();
}

function handleMove(x, y) {
  if (!activeRow) return;

  const dx = x - startX;
  const dy = y - startY;

  if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
    isDragging = true;
  }

  const previewStatus = getStatusByMovement(dx, dy);
  applyStatus(activeRow, previewStatus);
}

function handleEnd(x, y) {
  if (!activeRow || !isDragging) {
    enableScroll();
    activeRow = null;
    return;
  }

  const dx = x - startX;
  const dy = y - startY;

  const finalStatus = getStatusByMovement(dx, dy);
  applyStatus(activeRow, finalStatus);

  enableScroll();
  activeRow = null;
}

// Event binding
document.querySelectorAll("tr[draggable=true]").forEach(row => {
  // Touch events
  row.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    handleStart(t.clientX, t.clientY, row);
  });

  row.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    handleMove(t.clientX, t.clientY);
    e.preventDefault(); // Evita scroll
  });

  row.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0];
    handleEnd(t.clientX, t.clientY);
  });

  // Mouse events
  row.addEventListener("mousedown", (e) => {
    handleStart(e.clientX, e.clientY, row);
  });

  row.addEventListener("mousemove", (e) => {
    if (activeRow) handleMove(e.clientX, e.clientY);
  });

  row.addEventListener("mouseup", (e) => {
    handleEnd(e.clientX, e.clientY);
  });

  row.addEventListener("mouseleave", (e) => {
    if (activeRow) handleEnd(e.clientX, e.clientY);
  });
});

function confermaChecklist() {
  alert("Checklist salvata con successo!");
}
