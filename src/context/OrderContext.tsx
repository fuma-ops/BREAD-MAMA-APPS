import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { fetchOrdersFromSheet, addOrderToSheet, updateOrderStatusInSheet } from '../services/googleSheetsService';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'history'>) => void;
  updateOrderStatus: (id: string, newStatus: OrderStatus, actor?: string) => void;
  getOrdersByStatus: (status: OrderStatus | OrderStatus[]) => Order[];
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync orders with local storage as a fallback/cache
  useEffect(() => {
    if (orders.length > 0) {
      try {
        localStorage.setItem('darkom_orders', JSON.stringify(orders));
      } catch (e) {
        console.warn('Failed to write orders to localStorage', e);
      }
    }
  }, [orders]);

  // Load from Sheets on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Load local cache to display something immediately
        const saved = localStorage.getItem('darkom_orders');
        if (saved) {
          setOrders(JSON.parse(saved));
        }

        const sheetOrders = await fetchOrdersFromSheet();
        if (sheetOrders && sheetOrders.length > 0) {
          // Convert sheet orders back to app's Order type
          const formattedOrders: Order[] = sheetOrders.reverse().map(o => {
            let history = [];
            try {
              history = JSON.parse(o.historique || '[]');
            } catch(e) {}
            
            if (history.length === 0) {
              history = [{ status: (o.statut || 'PENDING') as OrderStatus, timestamp: o.date || new Date().toISOString(), actor: 'Système' }];
            }

            return {
              id: o.id,
              customerName: o.client,
              customerPhone: o.telephone,
              customerAddress: o.adresse,
              items: JSON.parse(o.produits || '[]'),
              subtotal: Number(o.total || 0),
              deliveryFee: 15,
              total: Number(o.total || 0),
              status: (o.statut || 'PENDING') as OrderStatus,
              createdAt: o.date || new Date().toISOString(),
              history: history
            };
          });
          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Could not fetch orders from Google Sheets. Using local cache.", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'history'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      history: [{
        status: 'PENDING',
        timestamp: new Date().toISOString(),
        actor: 'Client'
      }]
    };
    
    // Update local state immediately for fast UI
    setOrders(prev => [newOrder, ...prev]);

    // Send to Google Sheets
    try {
      await addOrderToSheet({
        id: newOrder.id,
        date: newOrder.createdAt,
        client: newOrder.customerName,
        telephone: newOrder.customerPhone,
        adresse: newOrder.customerAddress,
        quantite: newOrder.items.reduce((acc, item) => acc + item.quantity, 0),
        produits: JSON.stringify(newOrder.items),
        total: newOrder.total,
        statut: newOrder.status,
        historique: JSON.stringify(newOrder.history)
      });
    } catch (e) {
      console.error("Failed to sync new order with Google Sheets", e);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: OrderStatus, actor: string = 'Système') => {
    let orderHistoryStr = '[]';
    let targetOrder = orders.find(o => o.id === id);
    const timestamp = new Date().toISOString();
    
    if (targetOrder) {
       const updatedHistory = [...(targetOrder.history || []), { status: newStatus, timestamp, actor }];
       orderHistoryStr = JSON.stringify(updatedHistory);
    }
    
    // Update local state immediately
    setOrders(prev => prev.map(order => {
      if (order.id === id) {
        if (newStatus === 'DELIVERED') {
          // Allow client to review the products in this order
          try {
            const canReview = JSON.parse(localStorage.getItem('can_review_products') || '[]');
            order.items.forEach(item => {
              if (!canReview.includes(item.id)) canReview.push(item.id);
            });
            localStorage.setItem('can_review_products', JSON.stringify(canReview));
            // Simulate WhatsApp message to client
            alert(`Simulation WhatsApp envoyé au client : "Merci pour votre achat ! Donnez-nous votre avis sur http://localhost:3000/shop"`);
          } catch(e) {}
        }
        return {
          ...order,
          status: newStatus,
          history: [...(order.history || []), { status: newStatus, timestamp, actor }]
        };
      }
      return order;
    }));

    // Sync with Google Sheets
    try {
      await updateOrderStatusInSheet(id, newStatus, actor, timestamp, orderHistoryStr);
    } catch (e) {
      console.error("Failed to sync order status update with Google Sheets", e);
    }
  };

  const getOrdersByStatus = (status: OrderStatus | OrderStatus[]) => {
    if (Array.isArray(status)) {
      return orders.filter(order => status.includes(order.status));
    }
    return orders.filter(order => order.status === status);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrdersByStatus, loading }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
