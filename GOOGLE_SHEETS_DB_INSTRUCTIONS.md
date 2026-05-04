# Instructions for Google Sheets Database

Pour utiliser Google Sheets comme base de données pour votre application, la méthode la plus simple et sécurisée est d'utiliser Google Apps Script. 

## Étape 1 : Préparer le Google Sheet
1. Créez un nouveau Google Sheet.
2. Renommez la première feuille (onglet) en `Commandes` (ou le nom de votre choix).
3. Ajoutez vos en-têtes de colonnes sur la première ligne (par exemple : `id`, `date`, `client`, `telephone`, `adresse`, `produits`, `total`, `statut`).

## Étape 2 : Ajouter le code Apps Script
1. Dans votre Google Sheet, allez dans **Extensions** > **Apps Script**.
2. Remplacez le code existant par le code suivant :

```javascript
const SHEET_NAME = "Commandes";
const HEADERS = ["id", "date", "client", "telephone", "adresse", "produits", "total", "statut"];

// Fonction pour initialiser la base de données automatiquement
function initDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Créer la feuille si elle n'existe pas
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // Vérifier et ajouter les en-têtes si la première ligne est vide
  const range = sheet.getRange(1, 1, 1, HEADERS.length);
  const currentHeaders = range.getValues()[0];
  
  if (!currentHeaders[0] || currentHeaders[0] === "") {
    range.setValues([HEADERS]);
    // Mettre en gras et figer la première ligne
    range.setFontWeight("bold");
    sheet.setFrozenRows(1);
    // Ajuster la largeur des colonnes
    try { sheet.autoResizeColumns(1, HEADERS.length); } catch(e) {}
  }
  
  return sheet;
}

function doGet(e) {
  const sheet = initDatabase();
  const data = sheet.getDataRange().getValues();
  
  // Si on a seulement les entêtes (ou aucune donnée)
  if (data.length <= 1) {
     return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const headers = data[0];
  const rows = data.slice(1);
  
  const result = rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success", data: result }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = initDatabase();
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    if (action === "ADD_ORDER") {
      const order = postData.order;
      const headers = sheet.getDataRange().getValues()[0];
      
      const newRow = headers.map(header => {
        return order[header] !== undefined ? order[header] : "";
      });
      
      sheet.appendRow(newRow);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Commande ajoutée" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === "UPDATE_ORDER_STATUS") {
      const { id, status } = postData;
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const idIndex = headers.indexOf("id");
      const statusIndex = headers.indexOf("statut");
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][idIndex] == id) {
          sheet.getRange(i + 1, statusIndex + 1).setValue(status);
          return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Statut mis à jour" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Commande non trouvée" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fonction requise pour autoriser les requêtes CORS (OPTIONS)
function doOptions(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Étape 3 : Déployer en tant qu'application Web
1. Cliquez sur le bouton bleu **Déployer** (en haut à droite) > **Nouveau déploiement**.
2. Cliquez sur l'icône d'engrenage à côté de "Sélectionner le type" et choisissez **Application Web**.
3. Description : `API Base de données`
4. Exécuter en tant que : **Moi (votre adresse email)**
5. Qui a accès : **Tout le monde** (Important pour que l'appli puisse y accéder sans s'authentifier par Google)
6. Cliquez sur **Déployer**. (Autorisez les permissions si demandé, allez dans "Paramètres avancés" et "Aller à l'application").
7. Copiez l'**URL de l'application Web**.

## Étape 4 : Configurer le Front-end
Créez un fichier `.env` à la racine du projet (au même niveau que package.json) et ajoutez :
`VITE_GOOGLE_SHEETS_API_URL=votre_url_copiée_ici`

Le code de service `googleSheetsService.ts` a été préparé pour utiliser cette URL.
