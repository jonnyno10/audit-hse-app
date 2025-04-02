let startX, startY;

function handleDragStart(event) {
    startX = event.clientX;
    startY = event.clientY;
}

function handleDrag(event, row) {
    const statusCell = row.cells[2];
    const movementX = event.clientX - startX;
    const movementY = event.clientY - startY;

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

function handleDragEnd(event, row) {
    const statusCell = row.cells[2];
    const movementX = event.clientX - startX;
    const movementY = event.clientY - startY;

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
    row.addEventListener("dragstart", handleDragStart);
    row.addEventListener("drag", (event) => handleDrag(event, row));
    row.addEventListener("dragend", (event) => handleDragEnd(event, row));
});

function confermaChecklist() {
    alert("Checklist salvata con successo!");
}