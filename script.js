let startX = 0, startY = 0;
let draggedElem = null;
let originalTransform = "";

function getStatusByDirection(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) return { text: "Conforme", className: "status conforme" };
    if (dx < -30) return { text: "Non Conforme", className: "status non-conforme" };
  } else {
    if (dy < -30) return { text: "Non Applicabile", className: "status non-applicabile" };
    if (dy > 30) return { text: "-", className: "status vuoto" };
  }
  return null;
}

function applyStatusFromMovement(elem, dx, dy) {
  const row = elem.parentElement;
  const statusCell = row.cells[2];
  const status = getStatusByDirection(dx, dy);
  if (status) {
    statusCell.textContent = status.text;
    statusCell.className = status.className;
  }
}

function resetTransform(elem) {
  elem.style.transform = originalTransform;
}

function onStart(e, elem) {
  const point = e.touches ? e.touches[0] : e;
  startX = point.clientX;
  startY = point.clientY;
  draggedElem = elem;
  originalTransform = elem.style.transform || "";
  document.body.style.userSelect = "none";
}

function onMove(e) {
  if (!draggedElem) return;
  const point = e.touches ? e.touches[0] : e;
  const dx = point.clientX - startX;
  const dy = point.clientY - startY;
  draggedElem.style.transform = `translate(${dx}px, ${dy}px)`;
  applyStatusFromMovement(draggedElem, dx, dy);
}

function onEnd() {
  if (!draggedElem) return;
  resetTransform(draggedElem);
  document.body.style.userSelect = "auto";
  draggedElem = null;
}

document.querySelectorAll(".draggable").forEach(elem => {
  // Touch
  elem.addEventListener("touchstart", e => onStart(e, elem));
  elem.addEventListener("touchmove", e => {
    onMove(e);
    e.preventDefault();
  });
  elem.addEventListener("touchend", onEnd);

  // Mouse
  elem.addEventListener("mousedown", e => onStart(e, elem));
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);
});

function confermaChecklist() {
  alert("Checklist salvata con successo!");
}
