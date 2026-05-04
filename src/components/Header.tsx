import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ShoppingBag, X, Search, User, Home as HomeIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { CartSidebar } from './CartSidebar';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#1A1410] border-b border-white/5 relative">
        <div className="container mx-auto px-4 lg:px-8 w-full max-w-[1400px] h-[72px] md:h-[90px] flex items-center justify-between">
          
          {/* Mobile Menu Button & Desktop Nav (Left) */}
          <div className="flex-1 flex items-center justify-start">
            <button 
              className="lg:hidden p-2 -ml-2 text-white/70 hover:text-white"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link to="/" className={`text-[12px] xl:text-[13px] uppercase tracking-wider pb-1 transition-all duration-300 ${isActive('/') ? 'text-[var(--color-gold)] border-b-2 border-[var(--color-gold)] font-bold scale-105' : 'text-white/70 hover:text-white hover:scale-105'}`}>Accueil</Link>
              <Link to="/shop" className={`text-[12px] xl:text-[13px] uppercase tracking-wider pb-1 transition-all duration-300 ${isActive('/shop') ? 'text-[var(--color-gold)] border-b-2 border-[var(--color-gold)] font-bold scale-105' : 'text-white/70 hover:text-white hover:scale-105'}`}>Boutique</Link>
              <Link to="/delivery" className={`text-[12px] xl:text-[13px] uppercase tracking-wider pb-1 transition-all duration-300 ${isActive('/delivery') ? 'text-[var(--color-gold)] border-b-2 border-[var(--color-gold)] font-bold scale-105' : 'text-white/70 hover:text-white hover:scale-105'}`}>Livraison</Link>
              <Link to="/contact" className={`text-[12px] xl:text-[13px] uppercase tracking-wider pb-1 transition-all duration-300 ${isActive('/contact') ? 'text-[var(--color-gold)] border-b-2 border-[var(--color-gold)] font-bold scale-105' : 'text-white/70 hover:text-white hover:scale-105'}`}>Contact</Link>
            </nav>
          </div>

          {/* Logo (Center) */}
          <div className="flex-none flex items-center justify-center shrink-0 z-20 px-4">
            <Link to="/" className="flex flex-col items-center justify-center gap-0.5 group w-max py-2">
              <div className="text-[8px] sm:text-[9px] text-[var(--color-gold)]/80 flex items-center justify-center z-10 transition-colors duration-300 tracking-[0.15em] whitespace-nowrap">
                 <span className="font-serif italic">— MADE WITH LOVE —</span>
              </div>
              <div className="flex items-center gap-2 z-10 w-full justify-center">
                <span className="text-[26px] sm:text-[34px] lg:text-[40px] font-serif tracking-[0.12em] text-[#E8D1B5] leading-none group-hover:text-white transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] whitespace-nowrap">
                  BREAD MAMA
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 z-10 w-full justify-center">
                <div className="w-3 sm:w-6 h-[1px] bg-[#E8D1B5]/50 group-hover:bg-white/70 transition-colors"></div>
                <span className="text-[6px] sm:text-[8px] font-sans tracking-[0.15em] sm:tracking-[0.3em] font-medium uppercase text-[#E8D1B5]/90 group-hover:text-white transition-colors whitespace-nowrap">Homemade • Natural • Fresh</span>
                <div className="w-3 sm:w-6 h-[1px] bg-[#E8D1B5]/50 group-hover:bg-white/70 transition-colors"></div>
              </div>
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex-1 flex items-center justify-end gap-2 lg:gap-4">
            <Link to="/login" className="hidden lg:flex text-[11px] xl:text-[12px] font-bold text-white/50 hover:text-white uppercase tracking-wider transition-colors mr-2">
              Espace Equipe
            </Link>
            <button className="hidden sm:flex p-2 text-white/70 hover:text-white transition-colors">
              <Search size={22} strokeWidth={1.5} />
            </button>
            <button className="hidden sm:flex p-2 text-white/70 hover:text-white transition-colors">
              <User size={22} strokeWidth={1.5} />
            </button>
            <button 
              className="relative p-2 -mr-2 sm:mr-0 text-[var(--color-gold)] hover:text-white transition-colors"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={24} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-0 inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold text-black transform translate-x-1/4 -translate-y-1/4 bg-[var(--color-gold)] rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={cn(
          "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300 sm:hidden",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )} onClick={() => setIsMenuOpen(false)} />
        
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-surface)] shadow-2xl transform transition-transform duration-300 ease-in-out sm:hidden flex flex-col",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <span className="text-2xl font-serif font-bold text-[var(--color-gold)]">BREAD MAMA</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white/70 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-2 p-6">
            <Link onClick={() => setIsMenuOpen(false)} to="/" className={`p-4 text-xl font-serif border-b border-white/10 ${isActive('/') ? 'text-[var(--color-gold)]' : 'text-white hover:text-[var(--color-gold)]'}`}>Accueil</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/shop" className={`p-4 text-xl font-serif border-b border-white/10 ${isActive('/shop') ? 'text-[var(--color-gold)]' : 'text-white hover:text-[var(--color-gold)]'}`}>Boutique</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/delivery" className={`p-4 text-xl font-serif border-b border-white/10 ${isActive('/delivery') ? 'text-[var(--color-gold)]' : 'text-white hover:text-[var(--color-gold)]'}`}>Livraison</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/contact" className={`p-4 text-xl font-serif border-b border-white/10 ${isActive('/contact') ? 'text-[var(--color-gold)]' : 'text-white hover:text-[var(--color-gold)]'}`}>Contact</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/login" className="p-4 mt-4 text-[11px] font-bold text-[var(--color-accent)] uppercase tracking-widest">Espace Équipe</Link>
          </nav>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
