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
const SHEET_ORDERS = "Commandes";
const SHEET_LOGS = "AuditLogs";
const SHEET_PRODUCTS = "Produits";

const HEADERS_ORDERS = [
  "id", "date_creation", "client", "telephone", "adresse", 
  "produits", "total", "statut", "historique"
];
const HEADERS_LOGS = ["timestamp", "acteur", "action", "details"];
const HEADERS_PRODUCTS = ["id", "nom", "prix", "categorie", "description"];

// Initialisation des bases de données
function initDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Sheet Commandes
  let sheetOrders = ss.getSheetByName(SHEET_ORDERS);
  if (!sheetOrders) {
    sheetOrders = ss.insertSheet(SHEET_ORDERS);
    sheetOrders.getRange(1, 1, 1, HEADERS_ORDERS.length).setValues([HEADERS_ORDERS]).setFontWeight("bold");
    sheetOrders.setFrozenRows(1);
    try { sheetOrders.autoResizeColumns(1, HEADERS_ORDERS.length); } catch(e) {}
  }
  
  // Sheet AuditLogs
  let sheetLogs = ss.getSheetByName(SHEET_LOGS);
  if (!sheetLogs) {
    sheetLogs = ss.insertSheet(SHEET_LOGS);
    sheetLogs.getRange(1, 1, 1, HEADERS_LOGS.length).setValues([HEADERS_LOGS]).setFontWeight("bold");
    sheetLogs.setFrozenRows(1);
    try { sheetLogs.autoResizeColumns(1, HEADERS_LOGS.length); } catch(e) {}
  }

  // Sheet Produits
  let sheetProducts = ss.getSheetByName(SHEET_PRODUCTS);
  if (!sheetProducts) {
    sheetProducts = ss.insertSheet(SHEET_PRODUCTS);
    sheetProducts.getRange(1, 1, 1, HEADERS_PRODUCTS.length).setValues([HEADERS_PRODUCTS]).setFontWeight("bold");
    sheetProducts.setFrozenRows(1);
    try { sheetProducts.autoResizeColumns(1, HEADERS_PRODUCTS.length); } catch(e) {}
  }
  
  return { sheetOrders, sheetLogs, sheetProducts };
}

function doGet(e) {
  const { sheetOrders, sheetProducts } = initDatabase();
  
  // Récupérer les commandes
  const dataOrders = sheetOrders.getDataRange().getValues();
  let resultOrders = [];
  if (dataOrders.length > 1) {
    const headers = dataOrders[0];
    const rows = dataOrders.slice(1);
    resultOrders = rows.map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
  }

  return ContentService.createTextOutput(JSON.stringify({ 
    status: "success", 
    data: resultOrders
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const { sheetOrders, sheetLogs, sheetProducts } = initDatabase();
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    // --- Tracer toutes les actions importantes (Logs) ---
    if (action === "LOG_ACTION") {
      const { timestamp, actor, actionType, details } = postData.log;
      sheetLogs.appendRow([timestamp, actor, actionType, JSON.stringify(details)]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Log ajouté" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // --- Ajouter une commande ---
    if (action === "ADD_ORDER") {
      const order = postData.order;
      // headers : id, date_creation, client, telephone, adresse, produits, total, statut, historique
      const newRow = [
        order.id || "",
        order.date_creation || new Date().toISOString(),
        order.client || "",
        order.telephone || "",
        order.adresse || "",
        order.produits || "[]",
        order.total || 0,
        order.statut || "PENDING",
        order.historique || "[]"
      ];
      
      sheetOrders.appendRow(newRow);
      
      // Auto Log
      sheetLogs.appendRow([new Date().toISOString(), "Client", "NOUVELLE_COMMANDE", JSON.stringify({id: order.id})]);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Commande ajoutée avec détails" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // --- Mettre à jour une commande ---
    if (action === "UPDATE_ORDER_STATUS") {
      const { id, status, actor, timestamp, historyStr } = postData;
      const data = sheetOrders.getDataRange().getValues();
      const headers = data[0];
      const idIndex = headers.indexOf("id");
      const statusIndex = headers.indexOf("statut");
      const histoIndex = headers.indexOf("historique");
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][idIndex] == id) {
          sheetOrders.getRange(i + 1, statusIndex + 1).setValue(status);
          if(historyStr) {
            sheetOrders.getRange(i + 1, histoIndex + 1).setValue(historyStr);
          }
          
          // Auto Log
          sheetLogs.appendRow([timestamp || new Date().toISOString(), actor || "Systeme", "MISE_A_JOUR_STATUT", JSON.stringify({id: id, nouveau_statut: status})]);
          
          return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Statut et historique mis à jour" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Commande non trouvée" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // --- Sync Produits ---
    if (action === "SYNC_PRODUCTS") {
      const products = postData.products;
      // On efface les anciens produits (sauf l'entête)
      if (sheetProducts.getLastRow() > 1) {
        sheetProducts.getRange(2, 1, sheetProducts.getLastRow() - 1, HEADERS_PRODUCTS.length).clearContent();
      }
      
      const newRows = products.map(p => [
        p.id || "",
        p.name || "",
        p.price || 0,
        p.category || "",
        p.description || ""
      ]);
      
      if(newRows.length > 0) {
        sheetProducts.getRange(2, 1, newRows.length, HEADERS_PRODUCTS.length).setValues(newRows);
      }
      
      sheetLogs.appendRow([new Date().toISOString(), "Admin", "SYNC_PRODUIT", "Catalogue mis à jour"]);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Produits synchronisés" }))
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
