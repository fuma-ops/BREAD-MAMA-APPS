// =========================================================================
// SCRIPT GOOGLE APPS SCRIPT (à copier-coller dans Code.gs)
// =========================================================================

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId(); // Utilise le fichier actif

// Configurations des feuilles et de leurs en-têtes
const SHEETS_CONFIG = {
  'Commandes': ['id', 'date', 'client', 'telephone', 'adresse', 'quantite', 'produits', 'total', 'statut', 'mode_paiement', 'historique'],
  'Produits': ['id', 'nom', 'nom_arabe', 'prix', 'categorie', 'description', 'image'],
  'Utilisateurs': ['id', 'nom', 'role', 'code'],
  'Logs': ['timestamp', 'actor', 'actionType', 'details'],
  'Messages': ['id', 'date', 'nom', 'email', 'telephone', 'sujet', 'message', 'status']
};

/**
 * Initialise le document en créant les feuilles manquantes et en ajoutant les en-têtes.
 * À exécuter manuellement une fois depuis l'éditeur de script.
 */
function initDatabase() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  for (const sheetName in SHEETS_CONFIG) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    const headers = SHEETS_CONFIG[sheetName];
    // Vérifier si les en-têtes existent déjà
    const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
    
    // S'il n'y a pas d'en-têtes (ou si c'est vide), on les ajoute
    if (!currentHeaders[0]) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      try {
        sheet.setFrozenRows(1);
      } catch(e) {}
    }
  }
}

/**
 * Gère les requêtes GET (Lecture)
 */
function doGet(e) {
  try {
    initDatabase(); // S'assure que les feuilles existent
    
    const type = e.parameter.type || 'orders';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    if (type === 'products') {
      const sheet = ss.getSheetByName('Produits');
      const data = getRecords(sheet);
      return createJsonResponse({ status: 'success', data: data });
    }
    
    if (type === 'orders') {
      const sheet = ss.getSheetByName('Commandes');
      const data = getRecords(sheet);
      return createJsonResponse({ status: 'success', data: data });
    }
    
    if (type === 'users') {
      const sheet = ss.getSheetByName('Utilisateurs');
      const data = getRecords(sheet);
      return createJsonResponse({ status: 'success', data: data });
    }

    if (type === 'messages') {
      const sheet = ss.getSheetByName('Messages');
      const data = getRecords(sheet);
      return createJsonResponse({ status: 'success', data: data });
    }

    return createJsonResponse({ status: 'error', message: 'Type inconnu' });
    
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString(), stack: error.stack });
  }
}

/**
 * Gère les requêtes POST (Écriture/Mise à jour)
 */
function doPost(e) {
  try {
    initDatabase(); // S'assure que les feuilles existent
    
    // IMPORTANT : Vérification de la présence du payload
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ status: 'error', message: "Aucune donnée reçue. Si vous testez depuis l'éditeur Google, c'est normal, utilisez Postman ou l'application." });
    }

    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (action === 'ADD_ORDER') {
      const sheet = ss.getSheetByName('Commandes');
      const order = payload.order;
      
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const rowData = new Array(headers.length).fill('');
      
      const orderMap = {
        'id': order.id || generateId(),
        'date': order.date || new Date().toISOString(),
        'client': order.client || '',
        'telephone': order.telephone || '',
        'adresse': order.adresse || '',
        'quantite': order.quantite || 0,
        'produits': typeof order.produits === 'string' ? order.produits : JSON.stringify(order.produits || []),
        'total': order.total || 0,
        'statut': order.statut || 'PENDING',
        'mode_paiement': order.mode_paiement || 'CASH',
        'historique': order.historique || '[]'
      };
      
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i].toLowerCase();
        if (orderMap[header] !== undefined) {
          rowData[i] = orderMap[header];
        }
      }
      
      sheet.appendRow(rowData);
      return createJsonResponse({ status: 'success', message: 'Commande ajoutée' });
    }
    
    if (action === 'UPDATE_ORDER_STATUS') {
      const sheet = ss.getSheetByName('Commandes');
      const id = payload.id;
      const status = payload.status;
      const historyStr = payload.historyStr;
      
      const data = sheet.getDataRange().getValues();
      const headers = data[0].map(h => h.toString().toLowerCase());
      
      const idColIndex = headers.indexOf('id');
      const statusColIndex = headers.indexOf('statut');
      const historyColIndex = headers.indexOf('historique');
      
      if (idColIndex === -1) {
         return createJsonResponse({ status: 'error', message: 'Colonne id non trouvée' });
      }
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][idColIndex] == id) { 
          if (statusColIndex !== -1) {
            sheet.getRange(i + 1, statusColIndex + 1).setValue(status);
          }
          if (historyColIndex !== -1) {
            sheet.getRange(i + 1, historyColIndex + 1).setValue(historyStr);
          }
          return createJsonResponse({ status: 'success', message: 'Statut mis à jour' });
        }
      }
      return createJsonResponse({ status: 'error', message: 'Commande non trouvée' });
    }
    
    if (action === 'LOG_ACTION') {
      const sheet = ss.getSheetByName('Logs');
      const log = payload.log;
      
      sheet.appendRow([
        log.timestamp || new Date().toISOString(),
        log.actor || 'Inconnu',
        log.actionType || 'Action',
        typeof log.details === 'string' ? log.details : JSON.stringify(log.details || {})
      ]);
      return createJsonResponse({ status: 'success' });
    }
    
    if (action === 'SYNC_PRODUCTS') {
      const sheet = ss.getSheetByName('Produits');
      const products = payload.products || [];
      
      // On efface tout sauf la ligne d'en-tête
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
      }
      
      if (products.length > 0) {
        // Préparer les données
        const rows = products.map(p => [
          p.id || generateId(),
          p.nom || '',
          p.nom_arabe || '',
          p.prix || 0,
          p.categorie || '',
          p.description || '',
          p.image || ''
        ]);
        
        sheet.getRange(2, 1, rows.length, 7).setValues(rows);
      }
      
      return createJsonResponse({ status: 'success', message: 'Produits synchronisés avec succès' });
    }
    
    if (action === 'SYNC_USERS') {
      const sheet = ss.getSheetByName('Utilisateurs');
      const users = payload.users || [];
      
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
      }
      
      if (users.length > 0) {
        const rows = users.map(u => [
          u.id || generateId(),
          u.nom || '',
          u.role || '',
          u.code || ''
        ]);
        sheet.getRange(2, 1, rows.length, 4).setValues(rows);
      }
      return createJsonResponse({ status: 'success', message: 'Utilisateurs synchronisés avec succès' });
    }
    
    if (action === 'ADD_MESSAGE') {
      const sheet = ss.getSheetByName('Messages');
      const msg = payload.message;
      
      sheet.appendRow([
        generateId(),
        new Date().toISOString(),
        msg.nom || '',
        msg.email || '',
        msg.telephone || '',
        msg.sujet || '',
        msg.message || '',
        'NEW'
      ]);
      return createJsonResponse({ status: 'success' });
    }

    if (action === 'DELETE_MESSAGE') {
      const sheet = ss.getSheetByName('Messages');
      const id = payload.id;
      
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] == id) { // La colonne 1 est l'ID
          sheet.deleteRow(i + 1);
          return createJsonResponse({ status: 'success', message: 'Message supprimé' });
        }
      }
      return createJsonResponse({ status: 'error', message: 'Message non trouvé' });
    }

    if (action === 'UPDATE_MESSAGE_STATUS') {
      const sheet = ss.getSheetByName('Messages');
      const { id, status } = payload;
      
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] == id) { // ID is in column A (index 0)
          sheet.getRange(i + 1, 8).setValue(status); // Column H (index 7, 1-based is 8)
          return createJsonResponse({ status: 'success', message: 'Statut du message mis à jour' });
        }
      }
      return createJsonResponse({ status: 'error', message: 'Message non trouvé' });
    }

    return createJsonResponse({ status: 'error', message: 'Action inconnue : ' + action });

  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString(), stack: error.stack });
  }
}

/**
 * Gère les requêtes OPTIONS (CORS)
 */
function doOptions(e) {
  return createJsonResponse({ status: 'success' });
}

/**
 * Fonction utilitaire pour lire les données d'une feuille et les transformer en tableau d'objets JSON
 */
function getRecords(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  
  if (lastRow < 2) return []; // Vide ou juste des en-têtes
  
  const data = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  const headers = data[0];
  const records = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const record = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = row[j];
    }
    records.push(record);
  }
  return records;
}

/**
 * Fonction utilitaire pour créer une réponse JSON avec les bons headers CORS
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Générer un ID unique simple
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
