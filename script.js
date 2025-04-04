let startX = 0, startY = 0;
let isDragging = false;
let currentRow = null;

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
    if (!status) return;
    const cell = row.cells[2];
    cell.textContent = status.text;
    cell.className = status.className;
}

function handleStart(x, y, row) {
    startX = x;
    startY = y;
    isDragging = false;
    currentRow = row;
    disableScroll();
}

function handleMove(x, y) {
    if (!currentRow) return;
    const dx = x - startX;
    const dy = y - startY;

    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        isDragging = true;
    }

    const status = getStatusByMovement(dx, dy);
    applyStatus(currentRow, status);
}

function handleEnd(x, y) {
    if (!currentRow) return;
    const dx = x - startX;
    const dy = y - startY;

    if (isDragging) {
        const finalStatus = getStatusByMovement(dx, dy);
        applyStatus(currentRow, finalStatus);
    }

    currentRow = null;
    enableScroll();
}

function attachDragEvents(row) {
    // Touch
    row.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        handleStart(t.clientX, t.clientY, row);
    });

    row.addEventListener("touchmove", (e) => {
        const t = e.touches[0];
        handleMove(t.clientX, t.clientY);
        e.preventDefault();
    });

    row.addEventListener("touchend", (e) => {
        const t = e.changedTouches[0];
        handleEnd(t.clientX, t.clientY);
    });

    // Mouse
    row.addEventListener("mousedown", (e) => {
        handleStart(e.clientX, e.clientY, row);
    });

    row.addEventListener("mousemove", (e) => {
        if (e.buttons === 1) { // left mouse button held
            handleMove(e.clientX, e.clientY);
        }
    });

    row.addEventListener("mouseup", (e) => {
        handleEnd(e.clientX, e.clientY);
    });

    row.addEventListener("mouseleave", (e) => {
        if (isDragging) handleEnd(e.clientX, e.clientY);
    });
}

document.querySelectorAll("table tr").forEach((row, index) => {
    if (index === 0) return; // salta intestazione
    attachDragEvents(row);
});

function confermaChecklist() {
    alert("Checklist salvata con successo!");
}
