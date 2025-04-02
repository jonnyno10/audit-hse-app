const CLIENT_ID = 972446330294-nir948gv3j91qa89r3gil7unrc58roi5.apps.googleusercontent.com; // Inserisci qui il tuo Client ID OAuth 2.0
const API_KEY = AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjM;     // Inserisci qui la tua API Key
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

// Inizializzazione dell'API Google
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        console.log("API Inizializzata correttamente!");
    });
}

// Funzione per autenticarsi con Google
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

// Funzione per disconnettersi
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

// Funzione per caricare un file da Google Drive
function loadFile(fileId) {
    gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
    }).then(response => {
        const data = response.body;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        
        console.log(json); // Per vedere l'output in console
        popolaTabella(json);
    }, error => {
        console.error("Errore nel caricamento del file: ", error);
    });
}

// Funzione per popolare la tabella HTML
function popolaTabella(dati) {
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = ''; // Svuota la tabella prima di popolarla

    dati.forEach((domanda, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${domanda.Domanda}</td>
            <td class="status vuoto">-</td>
            <td><textarea rows="2"></textarea></td>
        `;
        tbody.appendChild(row);
    });
}
