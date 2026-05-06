import { X, Leaf, Heart, ArrowRight, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const { addReview } = useProducts();
  const [canReview, setCanReview] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Check if user can review
      try {
        const allowed = JSON.parse(localStorage.getItem('can_review_products') || '[]');
        setCanReview(allowed.includes(product.id));
      } catch(e) {}
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, product.id]);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      category: product.category,
      image: product.images[0] || ''
    });
    setQuantity(1);
    onClose();
  };

  const [quantity, setQuantity] = useState(1);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewText) return;
    
    addReview(product.id, {
      author: reviewName,
      rating: reviewRating,
      text: reviewText
    });

    // Remove from allowed list
    try {
      const allowed = JSON.parse(localStorage.getItem('can_review_products') || '[]');
      const newAllowed = allowed.filter((id: number) => id !== product.id);
      localStorage.setItem('can_review_products', JSON.stringify(newAllowed));
      setCanReview(false);
    } catch(e) {}
    
    setReviewName('');
    setReviewText('');
    setReviewRating(5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative bg-[var(--color-surface)] w-full max-w-3xl max-h-[90vh] rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Image Area */}
        <div className="h-40 sm:h-56 bg-gradient-to-br from-[#4A3222] to-[#1A1410] relative flex items-center justify-center shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-colors z-20"
          >
            <X size={20} />
          </button>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-10 z-0">
            <span className="text-[var(--color-gold)] font-serif italic text-9xl pointer-events-none">{product.arabicName}</span>
          </div>

          {product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          ) : (
            <div className="text-8xl sm:text-9xl drop-shadow-2xl relative z-10 transform hover:scale-110 transition-transform duration-500">
              {product.emoji}
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-surface)] to-transparent z-10" />
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 no-scrollbar">
          
          {/* Title & Info */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
              <div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-gold)]">{product.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-sans font-medium text-white/80">{product.arabicName}</span>
                  <span className="text-white/20">•</span>
                  <span className="text-xs font-bold text-[var(--color-accent)] tracking-wider px-2 py-0.5 bg-[var(--color-accent)]/10 rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white shrink-0 font-sans">
                {product.price} <span className="text-lg text-white/50">DH</span>
              </div>
            </div>
            <p className="text-lg text-white mt-4 leading-relaxed font-sans">{product.description}</p>
          </div>

          {/* Section 1: Qualité & Ingrédients */}
          <div className="bg-black/20 rounded-xl p-5 border border-white/5">
            <h3 className="text-xl font-serif font-bold text-[var(--color-gold)] mb-4 flex items-center gap-2">
              <Leaf className="text-[var(--color-accent)]" size={20} />
              Qualité & Ingrédients
            </h3>
            <div className="space-y-4">
              <div>
                <span className="font-bold text-white/90">Ingrédients:</span>
                <p className="text-white/70 text-sm mt-1 leading-relaxed">{product.quality.ingredients}</p>
              </div>
              <div>
                <span className="font-bold text-white/90">Process:</span>
                <p className="text-white/70 text-sm mt-1 leading-relaxed">{product.quality.process}</p>
              </div>
              <div>
                <span className="font-bold text-white/90">Artisanal:</span>
                <p className="text-white/70 text-sm mt-1 leading-relaxed">{product.quality.handmade}</p>
              </div>
              <div className="pt-2">
                <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 p-3 rounded-lg flex items-start gap-3">
                  <Heart className="text-red-400 shrink-0 mt-0.5" size={16} />
                  <span className="text-sm text-[var(--color-gold)]/90 italic font-medium">{product.quality.love}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Avis Clients */}
          <div>
            <h3 className="text-xl font-serif font-bold text-[var(--color-gold)] mb-4">Avis Clients</h3>
            
            {canReview && (
              <form onSubmit={handleSubmitReview} className="mb-6 bg-[var(--color-gold)]/5 p-4 rounded-xl border border-[var(--color-gold)]/20 animate-in fade-in slide-in-from-top-4">
                <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider text-[var(--color-gold)]">Laisser un avis récent</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`text-xl transition-colors ${star <= reviewRating ? 'text-yellow-500' : 'text-white/20 hover:text-white/40'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    placeholder="Votre prénom" 
                    value={reviewName}
                    onChange={e => setReviewName(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-gold)]"
                  />
                  <textarea 
                    placeholder="Qu'avez-vous pensé de ce produit ?" 
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm h-16 resize-none focus:outline-none focus:border-[var(--color-gold)]"
                  />
                  <button type="submit" className="px-4 py-2 bg-[var(--color-gold)] text-black font-bold text-sm rounded shadow hover:bg-yellow-500 transition-colors">
                    Publier l'avis
                  </button>
                </div>
              </form>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {product.reviews.map((review, idx) => (
                <div key={idx} className="bg-[#8B5A3C]/10 border border-[#8B5A3C]/20 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-white/90">{review.author}</span>
                    <span className="text-yellow-500 text-xs">{'★'.repeat(review.rating)}</span>
                  </div>
                  <p className="text-white/70 text-sm italic">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Availability */}
          <div className="flex items-center gap-4 text-sm bg-black/20 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", product.available ? "bg-green-500" : "bg-red-500")} />
              <span className="text-white/80">{product.available ? "En stock aujourd'hui" : "Rupture de stock"}</span>
            </div>
            <span className="text-white/20">|</span>
            <span className="text-white/80 font-medium">Temps de préparation: <span className="text-[var(--color-gold)]">{product.preparation_time}</span></span>
          </div>
          
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-white/10 shrink-0 flex flex-col sm:flex-row items-center gap-3 bg-[var(--color-surface)]">
          <div className="flex items-center gap-4 bg-black/40 rounded-lg px-4 py-3 border border-white/5 w-full sm:w-auto justify-between sm:justify-start">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white/70 hover:text-[var(--color-gold)] font-bold px-2 focus:outline-none text-xl">-</button>
            <span className="text-white font-mono text-lg">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="text-white/70 hover:text-[var(--color-gold)] font-bold px-2 focus:outline-none text-xl">+</button>
          </div>
          <button 
            onClick={handleAddToCart}
            className="flex-1 w-full py-4 bg-gradient-to-r from-[var(--color-accent)] to-[#6b4229] hover:opacity-90 text-white font-bold rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all text-sm uppercase tracking-wider"
          >
            Ajouter au panier <ArrowRight size={18} />
          </button>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-lg transition-all"
          >
            FERMER
          </button>
        </div>
        
      </div>
    </div>
  );
}
