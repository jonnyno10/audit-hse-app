const CLIENT_ID = '972446330294-6opgnfhpm280c4n280h8pb6uphuqbnnt.apps.googleusercontent.com'; // Client ID OAuth 2.0
const API_KEY = 'AIzaSyA5jmTA54BAziJFzNfFH9Vf3mFen8kTfjM'; // La tua API Key
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

// Funzione per selezionare un file da Google Drive
function pickFile() {
    gapi.load('picker', {'callback': createPicker});
}

function createPicker() {
    const picker = new google.picker.PickerBuilder()
        .addView(new google.picker.DocsView().setIncludeFolders(true).setSelectFolderEnabled(true))
        .setOAuthToken(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token)
        .setDeveloperKey(API_KEY)
        .setCallback(pickerCallback)
        .build();
    picker.setVisible(true);
}

function pickerCallback(data) {
    if (data.action == google.picker.Action.PICKED) {
        const fileId = data.docs[0].id;
        loadFileFromDrive(fileId);
    }
}

// Funzione per caricare un file da Google Drive
function loadFileFromDrive(fileId) {
    gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
    }).then(response => {
        const data = response.body;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        
        // Popola la tabella con i dati estratti
        popolaTabella(jsonData);
    }, error => {
        console.error("Errore nel caricamento del file: ", error);
    });
}

// Funzione per popolare la tabella con i dati del file Excel
function popolaTabella(dati) {
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = ''; // Pulisce la tabella prima di aggiungere nuovi dati

    // Aggiungi una riga per ogni elemento nel file Excel
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
