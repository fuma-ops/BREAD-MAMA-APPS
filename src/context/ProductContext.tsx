import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { products as defaultProducts } from '../data/products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
  addReview: (id: number, review: { author: string; rating: number; text: string }) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('darkom_products');
      return saved ? JSON.parse(saved) : defaultProducts;
    } catch (e) {
      console.warn('Failed to read products from localStorage', e);
      return defaultProducts;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('darkom_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to write products to localStorage', e);
    }
  }, [products]);

  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct: Product = { ...newProductData, id: newId };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: number, updatedProductData: Omit<Product, 'id'>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...updatedProductData, id } : p));
  };

  const deleteProduct = (id: number) => {
     setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addReview = (id: number, review: { author: string; rating: number; text: string }) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          reviews: [review, ...p.reviews]
        };
      }
      return p;
    }));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, addReview }}>
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
