// src/services/googleSheetsService.ts

// The URL should be set in a .env file as VITE_GOOGLE_SHEETS_API_URL
const API_URL = (import.meta as any).env.VITE_GOOGLE_SHEETS_API_URL;

export interface OrderData {
  id: string;
  date: string;
  client: string;
  telephone: string;
  adresse: string;
  quantite: number;
  produits: string;
  total: number;
  statut: string;
  historique: string;
  [key: string]: any;
}

/**
 * Fetch all orders from the Google Sheet
 */
export const fetchOrdersFromSheet = async (): Promise<OrderData[]> => {
  if (!API_URL) {
    console.warn("VITE_GOOGLE_SHEETS_API_URL is not set");
    return [];
  }

  try {
    const response = await fetch(API_URL);
    const result = await response.json();
    
    if (result.status === 'success') {
      return result.data as OrderData[];
    } else {
      throw new Error(result.message || "Failed to fetch orders");
    }
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    throw error;
  }
};

/**
 * Add a new order to the Google Sheet
 */
export const addOrderToSheet = async (order: OrderData): Promise<boolean> => {
  if (!API_URL) {
    console.warn("VITE_GOOGLE_SHEETS_API_URL is not set");
    return false;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "ADD_ORDER",
        order: order
      })
    });
    
    const result = await response.json();
    return result.status === "success";
  } catch (error) {
    console.error("Error adding order to Google Sheets:", error);
    throw error;
  }
};

/**
 * Update the status of an existing order
 */
export const updateOrderStatusInSheet = async (
  id: string, 
  status: string, 
  actor: string, 
  timestamp: string, 
  historyStr: string
): Promise<boolean> => {
  if (!API_URL) {
    console.warn("VITE_GOOGLE_SHEETS_API_URL is not set");
    return false;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "UPDATE_ORDER_STATUS",
        id,
        status,
        actor,
        timestamp,
        historyStr
      })
    });
    
    const result = await response.json();
    return result.status === "success";
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

/**
 * Log a general action to Google Sheets
 */
export const logActionToSheet = async (
  actor: string,
  actionType: string,
  details: any
): Promise<boolean> => {
  if (!API_URL) {
    return false;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "LOG_ACTION",
        log: {
          timestamp: new Date().toISOString(),
          actor,
          actionType,
          details
        }
      })
    });
    
    const result = await response.json();
    return result.status === "success";
  } catch (error) {
    console.error("Error logging action:", error);
    return false;
  }
};

/**
 * Fetch all products from the Google Sheet
 */
export const fetchProductsFromSheet = async (): Promise<any[]> => {
  if (!API_URL) {
    console.warn("VITE_GOOGLE_SHEETS_API_URL is not set");
    return [];
  }

  try {
    const response = await fetch(`${API_URL}?type=products`);
    const result = await response.json();
    
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to fetch products");
    }
  } catch (error) {
    console.error("Error fetching products from Google Sheets:", error);
    throw error;
  }
};

/**
 * Sync products list with Google Sheets
 */
export const syncProductsToSheet = async (products: any[]): Promise<boolean> => {
  if (!API_URL) {
    console.warn("VITE_GOOGLE_SHEETS_API_URL is not set");
    return false;
  }

  const mappedProducts = products.map(p => ({
     id: p.id,
     nom: p.name,
     nom_arabe: p.arabicName || '',
     prix: p.price,
     categorie: p.category,
     description: p.description,
     image: p.images && p.images.length > 0 ? p.images[0] : (p.image || '')
  }));

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "SYNC_PRODUCTS",
        products: mappedProducts
      })
    });
    const result = await response.json();
    return result.status === "success";
  } catch (error) {
    console.error("Error syncing products to sheet:", error);
    return false;
  }
};

/**
 * Fetch all users from the Google Sheet
 */
export const fetchUsersFromSheet = async (): Promise<any[]> => {
  if (!API_URL) {
    return [];
  }
  try {
    const response = await fetch(`${API_URL}?type=users`);
    const result = await response.json();
    return result.status === 'success' ? result.data : [];
  } catch (error) {
    console.error("Error fetching users from Google Sheets:", error);
    return [];
  }
};

/**
 * Sync users list to Google Sheets
 */
export const syncUsersToSheet = async (users: any[]): Promise<boolean> => {
  if (!API_URL) return false;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "SYNC_USERS", users })
    });
    const result = await response.json();
    return result.status === "success";
  } catch (error) {
    console.error("Error syncing users to sheet:", error);
    return false;
  }
};

/**
 * Fetch all messages from the Google Sheet
 */
export const fetchMessagesFromSheet = async (): Promise<any[]> => {
  if (!API_URL) {
    return [];
  }
  try {
    const response = await fetch(`${API_URL}?type=messages`);
    const result = await response.json();
    return result.status === 'success' ? result.data : [];
  } catch (error) {
    console.error("Error fetching messages from Google Sheets:", error);
    return [];
  }
};

/**
 * Add a contact message to the Google Sheet
 */
export const addMessageToSheet = async (message: { nom: string; email: string; telephone: string; sujet: string; message: string }): Promise<boolean> => {
  if (!API_URL) {
    console.warn("VITE_GOOGLE_SHEETS_API_URL is not set");
    return false;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "ADD_MESSAGE",
        message
      })
    });
    const result = await response.json();
    return result.status === "success";
  } catch (error) {
    console.error("Error adding message to sheet:", error);
    return false;
  }
};

/**
 * Delete a contact message from the Google Sheet
 */
export const deleteMessageFromSheet = async (id: string): Promise<boolean> => {
  if (!API_URL) return false;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "DELETE_MESSAGE", id })
    });
    const result = await response.json();
    return result.status === "success";
  } catch (error) {
    console.error("Error deleting message from sheet:", error);
    return false;
  }
};

/**
 * Update the status of a contact message
 */
export const updateMessageStatusInSheet = async (id: string, status: 'NEW' | 'SEEN' | 'REPLIED'): Promise<boolean> => {
  if (!API_URL) return false;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "UPDATE_MESSAGE_STATUS", id, status })
    });
    const result = await response.json();
    return result.status === "success";
  } catch (error) {
    console.error("Error updating message status:", error);
    return false;
  }
};

