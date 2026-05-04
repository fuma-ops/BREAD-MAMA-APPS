import { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeFromCart, subtotal, deliveryFee, total, isEmpty } = useCart();
  const navigate = useNavigate();

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )} 
        onClick={onClose} 
      />

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 right-0 z-50 w-full sm:w-[350px] bg-[var(--color-surface)] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out font-sans",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-2xl font-serif font-bold text-[var(--color-gold)]">Your Cart</h2>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5">
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-white/50 space-y-4">
              <ShoppingBag size={48} className="opacity-50" />
              <p className="text-lg">Your cart is empty.</p>
              <button 
                onClick={() => { onClose(); navigate('/shop'); }}
                className="mt-4 px-6 py-3 bg-[var(--color-accent)] text-white font-bold rounded-md hover:bg-opacity-90 transition-all text-sm tracking-wider uppercase"
              >
                Browse Boutique
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center border-b border-white/5 pb-4">
                <div className="w-16 h-16 sm:w-16 sm:h-16 flex-shrink-0 bg-gradient-to-br from-[#4A3222] to-[#2A1D13] rounded-md overflow-hidden relative">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-[10px] text-white/50 text-center uppercase p-1">No Image</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif font-bold text-[var(--color-text-primary)] text-sm leading-tight">{item.name}</h4>
                      <p className="text-[var(--color-gold)] text-[13px] font-bold mt-0.5">{item.price.toFixed(2)} DH</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-white/40 hover:text-red-400 p-1 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center mt-2 border border-white/10 rounded w-fit">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="w-6 text-center font-medium text-xs font-sans text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Sumary */}
        {!isEmpty && (
          <div className="border-t border-white/10 p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center text-white/70 text-[13px]">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} DH</span>
            </div>
            <div className="flex justify-between items-center text-white/70 text-[13px]">
              <span>Livraison</span>
              <span>{deliveryFee.toFixed(2)} DH</span>
            </div>
            
            <div className="flex justify-between items-center text-[var(--color-gold)] font-bold text-lg pt-1 border-t border-white/10 mt-1">
              <span>Total</span>
              <span>{total.toFixed(2)} DH</span>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <button 
                onClick={handleCheckout}
                className="w-full py-3 rounded font-bold text-[11px] uppercase tracking-wide text-white bg-[var(--color-accent)] hover:opacity-90 transition-all"
              >
                PROCEED TO CHECKOUT
              </button>
              
              <button 
                onClick={handleCheckout} // In future goes directly to whatsapp logic
                className="w-full py-3 rounded font-bold text-[11px] uppercase tracking-wide text-white bg-[#446A36] hover:bg-[#4F7A3F] transition-all"
              >
                ORDER VIA WHATSAPP
              </button>
              
              <div className="mt-2 space-y-2">
                <p className="font-serif text-[11px] text-white/50 text-center border-b border-white/5 pb-2 uppercase tracking-widest">We Accept</p>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5 text-[var(--color-gold)] mt-0.5"><ShoppingBag size={12}/></div>
                  <div>
                    <p className="text-[11px] text-white font-medium">Cash on Livraison</p>
                    <p className="text-[10px] text-white/40">Pay when you receive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
