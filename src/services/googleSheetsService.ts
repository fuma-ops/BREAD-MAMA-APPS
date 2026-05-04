// src/services/googleSheetsService.ts

// The URL should be set in a .env file as VITE_GOOGLE_SHEETS_API_URL
const API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL;

export interface OrderData {
  id: string;
  date: string;
  client: string;
  telephone: string;
  adresse: string;
  produits: string;
  total: number;
  statut: string;
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
        "Content-Type": "text/plain;charset=utf-8", // text/plain used to avoid CORS preflight issues with GAS
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
export const updateOrderStatusInSheet = async (id: string, status: string): Promise<boolean> => {
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
        status
      })
    });
    
    const result = await response.json();
    return result.status === "success";
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
