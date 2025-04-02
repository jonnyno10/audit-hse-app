let startX, startY;

function handleTouchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
}

function handleTouchMove(event, row) {
    event.preventDefault(); // Evita lo scrolling accidentale
    const touch = event.touches[0];
    const statusCell = row.cells[2];
    const movementX = touch.clientX - startX;
    const movementY = touch.clientY - startY;

    // Determina la direzione del movimento e mostra anteprima del colore e del testo
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
    const touch = event.changedTouches[0];
    const statusCell = row.cells[2];
    const movementX = touch.clientX - startX;
    const movementY = touch.clientY - startY;

    // Conferma il colore e lo stato definitivo
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

document.querySelectorAll("tr[draggable=true]").forEach(row => {
    row.addEventListener("touchstart", handleTouchStart);
    row.addEventListener("touchmove", (event) => handleTouchMove(event, row));
    row.addEventListener("touchend", (event) => handleTouchEnd(event, row));
});

function confermaChecklist() {
    alert("Checklist salvata con successo!");
}
