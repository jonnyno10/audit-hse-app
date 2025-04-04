let startX, startY;
let isDragging = false;

function updateStatusByDirection(row, dx, dy) {
    const statusCell = row.querySelector(".status");

    if (Math.abs(dx) > Math.abs(dy)) {
        // Movimento orizzontale
        if (dx > 30) {
            statusCell.textContent = "Conforme";
            statusCell.className = "status conforme";
        } else if (dx < -30) {
            statusCell.textContent = "Non Conforme";
            statusCell.className = "status non-conforme";
        }
    } else {
        // Movimento verticale
        if (dy < -30) {
            statusCell.textContent = "Non Applicabile";
            statusCell.className = "status non-applicabile";
        } else if (dy > 30) {
            statusCell.textContent = "-";
            statusCell.className = "status vuoto";
        }
    }
}

function attachListeners(row) {
    let active = false;

    // Mouse
    row.addEventListener("mousedown", e => {
        startX = e.clientX;
        startY = e.clientY;
        active = true;
    });

    document.addEventListener("mousemove", e => {
        if (!active) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        updateStatusByDirection(row, dx, dy);
    });

    document.addEventListener("mouseup", () => {
        active = false;
    });

    // Touch
    row.addEventListener("touchstart", e => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        active = true;
    });

    row.addEventListener("touchmove", e => {
        if (!active) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        updateStatusByDirection(row, dx, dy);
    });

    row.addEventListener("touchend", () => {
        active = false;
    });
}

document.querySelectorAll(".draggable-row").forEach(row => {
    attachListeners(row);
});

function confermaChecklist() {
    alert("Checklist salvata con successo!");
}
