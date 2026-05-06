import { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ProductModal } from './ProductModal';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      category: product.category,
      image: product.images[0] || ''
    });
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-[#1A1410]/80 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-[var(--color-gold)]/50 transition-all duration-300 flex flex-col group h-full cursor-pointer relative"
      >
        
        {/* Image Section */}
        <div className="h-32 sm:h-40 w-full relative flex items-center justify-center overflow-hidden shrink-0">
          {product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#4A3222] to-[#2A1D13] flex items-center justify-center">
              <span className="text-5xl">{product.emoji}</span>
            </div>
          )}
          
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur border border-white/10 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold tracking-wider text-[var(--color-gold)] uppercase">
            {product.category}
          </div>
          
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }} 
              className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-colors"
            >
              <Heart size={14} className={cn("transition-colors", isLiked ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : "text-white/70 hover:text-white")} />
            </button>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410] via-transparent to-transparent opacity-90 pointer-events-none" />
        </div>

        {/* Content Section */}
        <div className="px-3 py-3 md:px-4 md:py-4 flex flex-col flex-1 relative z-10 bg-transparent">
          <div className="flex flex-col mb-1.5 md:mb-2">
            <h3 className="text-sm md:text-base font-serif font-bold text-white leading-tight break-words">{product.name}</h3>
            <span className="text-[10px] md:text-xs font-sans text-[var(--color-gold)]/80 mt-0.5 tracking-wide">{product.arabicName}</span>
          </div>
          
          {product.description && (
             <p className="text-[var(--color-gold)] text-[10px] md:text-xs leading-relaxed line-clamp-2 mb-3 font-serif italic opacity-70">
               {product.description}
             </p>
          )}

          <div className="mt-auto flex justify-between items-end border-t border-white/5 pt-2 md:pt-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-0.5 text-[9px] md:text-[10px] text-yellow-500 mb-1">
                {'★'.repeat(5)} <span className="text-white/40 ml-1 font-sans">({product.reviews.length * 24})</span>
              </div>
              <span className="text-sm md:text-lg font-bold text-white tracking-widest">{(Number(product.price) || 0).toFixed(2)} <span className="text-[10px] md:text-xs text-[var(--color-gold)] font-sans">DH</span></span>
            </div>
            
            {/* Quick Add Action */}
            <div className="flex items-center">
                 <button 
                    onClick={handleAddToCart}
                    className="h-8 md:h-9 px-3 md:px-4 bg-[var(--color-accent)] hover:bg-[#A86F4A] text-white text-[10px] md:text-[11px] font-bold rounded shadow-lg shadow-[var(--color-accent)]/20 transition-all tracking-wider flex items-center justify-center gap-1.5 md:gap-2 uppercase"
                  >
                    <Plus size={16} strokeWidth={2.5} /> <span className="hidden lg:inline">Ajouter</span>
                  </button>
            </div>
          </div>
        </div>
      </div>

      <ProductModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
