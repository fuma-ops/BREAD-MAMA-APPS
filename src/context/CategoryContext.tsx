import React, { createContext, useContext, useState, useEffect } from 'react';

interface CategoryContextType {
  categories: string[];
  addCategory: (cat: string) => void;
  deleteCategory: (cat: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('darkom_categories');
      return saved ? JSON.parse(saved) : ['TRADITIONAL', 'SWEET', 'PREMIUM', 'DELICE'];
    } catch (e) {
      return ['TRADITIONAL', 'SWEET', 'PREMIUM', 'DELICE'];
    }
  });

  useEffect(() => {
    localStorage.setItem('darkom_categories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (cat: string) => {
    if (!categories.includes(cat.toUpperCase())) {
      setCategories(prev => [...prev, cat.toUpperCase()]);
    }
  };

  const deleteCategory = (cat: string) => {
    setCategories(prev => prev.filter(c => c !== cat));
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
