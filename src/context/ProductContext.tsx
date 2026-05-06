import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { products as defaultProducts } from '../data/products';
import { fetchProductsFromSheet, syncProductsToSheet } from '../services/googleSheetsService';
import { parsePrice } from '../utils/price';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
  addReview: (id: number, review: { author: string; rating: number; text: string }) => void;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const saved = localStorage.getItem('darkom_products');
        if (saved) {
          setProducts(JSON.parse(saved));
        } else {
          setProducts(defaultProducts);
        }

        const sheetProducts = await fetchProductsFromSheet();
        if (sheetProducts && sheetProducts.length > 0) {
          const formattedProducts: Product[] = sheetProducts.map(p => {
             const defaultFallback = defaultProducts.find(dp => dp.id === Number(p.id)) || {
               arabicName: '',
               emoji: '🥖',
               quality: {
                 ingredients: '',
                 process: '',
                 handmade: '',
                 love: ''
               },
               tags: [],
               available: true,
               preparation_time: '24h'
             };

             return {
              id: Number(p.id),
              name: p.nom,
              price: parsePrice(p.prix),
              category: p.categorie as any,
              description: p.description,
              images: [p.image || 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80'],
              reviews: defaultProducts.find(dp => dp.id === Number(p.id))?.reviews || [], 
              arabicName: p.nom_arabe || defaultFallback.arabicName || '',
              emoji: defaultFallback.emoji || '🥖',
              quality: defaultFallback.quality || {
                 ingredients: '',
                 process: '',
                 handmade: '',
                 love: ''
               },
              tags: defaultFallback.tags || [],
              available: defaultFallback.available ?? true,
              preparation_time: defaultFallback.preparation_time || '24h'
            };
          });
          setProducts(formattedProducts);
        } else if (!saved && sheetProducts && sheetProducts.length === 0) {
           // Si la base est completement vide sur Google Sheets, on la remplit avec nos produits par défaut
           await syncProductsToSheet(defaultProducts);
        }
      } catch (error) {
        console.warn("Could not fetch products from Google Sheets (may not be configured). Using local cache.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      try {
        localStorage.setItem('darkom_products', JSON.stringify(products));
      } catch (e) {
        console.warn('Failed to write products to localStorage', e);
      }
    }
  }, [products]);

  const addProduct = async (newProductData: Omit<Product, 'id'>) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct: Product = { ...newProductData, id: newId };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    await syncProductsToSheet(updatedProducts);
  };

  const updateProduct = async (id: number, updatedProductData: Omit<Product, 'id'>) => {
    const updatedProducts = products.map(p => p.id === id ? { ...updatedProductData, id } : p);
    setProducts(updatedProducts);
    await syncProductsToSheet(updatedProducts);
  };

  const deleteProduct = async (id: number) => {
     const updatedProducts = products.filter(p => p.id !== id);
     setProducts(updatedProducts);
     await syncProductsToSheet(updatedProducts);
  };

  const addReview = (id: number, review: { author: string; rating: number; text: string }) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          reviews: [review, ...(p.reviews || [])]
        };
      }
      return p;
    }));
    // Note: Reviews aren't explicitly synced back via syncProductsToSheet right now unless we added a 'reviews' column.
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, addReview, loading }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
