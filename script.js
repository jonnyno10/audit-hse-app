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

let mouseDown = false;
let mouseStartX, mouseStartY;
let activeRow = null;

document.querySelectorAll("tr[draggable=true]").forEach(row => {
  // Touch
  row.addEventListener("touchstart", handleTouchStart);
  row.addEventListener("touchmove", (e) => handleTouchMove(e, row));
  row.addEventListener("touchend", (e) => handleTouchEnd(e, row));

  // Mouse
  row.addEventListener("mousedown", (e) => {
    mouseDown = true;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    activeRow = row;
    disableScroll();
  });

  row.addEventListener("mousemove", (e) => {
    if (!mouseDown || !activeRow) return;

    const movementX = e.clientX - mouseStartX;
    const movementY = e.clientY - mouseStartY;
    const statusCell = activeRow.cells[2];

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

  row.addEventListener("mouseup", () => {
    mouseDown = false;
    activeRow = null;
    enableScroll();
  });

  row.addEventListener("mouseleave", () => {
    if (mouseDown) {
      mouseDown = false;
      activeRow = null;
      enableScroll();
    }
  });
});

function confermaChecklist() {
  alert("Checklist salvata con successo!");
}
