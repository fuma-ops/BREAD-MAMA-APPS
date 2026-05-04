import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';

export function Shop() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'ALL';

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'ALL') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  const handleCategoryChange = (cat: string) => {
    if (cat === 'ALL') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="flex-1 py-12 px-4 container mx-auto max-w-7xl animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">Notre Menu</h1>
          <p className="text-[var(--color-gold)] text-lg">De notre four à votre table.</p>
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto md:flex-wrap pb-2 md:pb-0 no-scrollbar gap-2 sm:gap-3 w-full md:w-auto items-center justify-start md:justify-end -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex-none px-4 sm:px-6 py-2 sm:py-2.5 font-bold text-[10px] sm:text-[11px] uppercase tracking-widest rounded-full transition-all border ${
                activeCategory === cat 
                  ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20' 
                  : 'bg-transparent border-white/20 text-white/50 hover:border-white/50 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'TOUS' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 justify-items-stretch">
        {filteredProducts.map(product => (
          <div key={product.id} className="w-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-white/50">
          <p className="text-xl">Aucun produit trouvé dans cette catégorie.</p>
        </div>
      )}

    </div>
  );
}
