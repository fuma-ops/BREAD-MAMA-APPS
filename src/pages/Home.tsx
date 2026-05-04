import { ArrowRight, Star, Heart, Clock, Truck, ShieldCheck, MapPin, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';

export function Home() {
  const { products } = useProducts();
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full pt-[40px] pb-8 lg:pt-[60px] lg:pb-16 lg:h-[550px] flex items-center border-b border-white/5 overflow-hidden bg-black/10">
        
        <div className="container mx-auto px-4 lg:px-12 relative z-10 w-full max-w-[1400px]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-20">
            
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left mt-4 lg:mt-0 z-20">
              
              <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <span className="w-8 h-[1px] bg-[var(--color-gold)] hidden sm:block" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[var(--color-gold)] uppercase font-sans">
                  De notre four à votre maison
                </span>
                <span className="w-8 h-[1px] bg-[var(--color-gold)] hidden sm:block" />
              </div>

              <h1 className="text-[44px] sm:text-6xl lg:text-7xl xl:text-[84px] font-serif font-bold text-white mb-4 sm:mb-6 leading-[1.05] drop-shadow-md">
                Fraîchement cuit,<br className="hidden sm:block"/>
                Fait ce matin
              </h1>
              
              <p className="text-sm sm:text-base text-white/70 max-w-md mb-8 sm:mb-10 leading-relaxed font-sans px-4 sm:px-0">
                Des pâtisseries marocaines traditionnelles, confectionnées à la main à Marrakech selon des recettes ancestrales.
              </p>
              
              <Link 
                to="/shop" 
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[var(--color-accent)] text-white text-xs font-bold tracking-widest uppercase rounded shadow-sm hover:bg-[#A86F4A] transition-colors w-max"
              >
                BOUTIQUE COLLECTION
              </Link>
            </div>

            {/* Hero image showing Moroccan pastries */}
            <div className="flex-1 relative w-full h-[250px] sm:h-auto max-w-xl lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1A1410] z-10 hidden sm:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410] to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1000" 
                alt="Freshly Baked Bread" 
                className="w-full h-full sm:h-[400px] lg:h-[600px] object-cover animate-in fade-in duration-1000 rotate-1 scale-105"
                style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)' }}
              />
            </div>
            
          </div>
        </div>
      </section>

      {/* Trust / Quality Section - 3 columns on mobile now */}
      <section className="bg-black/20 py-4 sm:py-8 border-b border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-2 sm:px-4 max-w-5xl">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 divide-x divide-white/10">
            
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-4 py-2 sm:py-0 sm:px-4">
              <Leaf className="text-[#3b5e2b] shrink-0" size={24} />
              <div>
                <h4 className="text-[var(--color-gold)] font-serif text-[11px] sm:text-[15px] mb-0.5 leading-tight">Qualité Premium</h4>
                <p className="text-white/40 text-[9px] sm:text-[11px] font-sans leading-tight">Les meilleurs ingrédients<br className="hidden sm:block"/> exclusifs</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-4 py-2 sm:py-0 sm:px-4">
              <Heart className="text-[#9e3a3a] fill-[#9e3a3a] shrink-0" size={24} />
              <div>
                <h4 className="text-[var(--color-gold)] font-serif text-[11px] sm:text-[15px] mb-0.5 leading-tight">Fait avec Amour</h4>
                <p className="text-white/40 text-[9px] sm:text-[11px] font-sans leading-tight">Confectionné à la main<br className="hidden sm:block"/> tous les jours</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-4 py-2 sm:py-0 sm:px-4">
              <ShieldCheck className="text-[var(--color-gold)] shrink-0" size={24} />
              <div>
                <h4 className="text-[var(--color-gold)] font-serif text-[11px] sm:text-[15px] mb-0.5 leading-tight">Naturel</h4>
                <p className="text-white/40 text-[9px] sm:text-[11px] font-sans leading-tight">Sans additifs,<br className="hidden sm:block"/>sans conservateurs</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 sm:py-24 bg-transparent">
        <div className="container mx-auto px-4 lg:px-12 w-full max-w-[1400px]">
          <div className="flex justify-between items-end mb-6 sm:mb-10 border-b border-white/10 pb-4">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">Nos Pâtisseries</h2>
            <Link to="/shop" className="text-[var(--color-gold)] text-[11px] sm:text-sm tracking-wide hover:underline hover:text-white transition-colors uppercase font-bold sm:font-normal sm:normal-case">Voir Tout</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {products.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Livraison Promo */}
      <section className="py-16 bg-gradient-to-r from-black/40 to-black/20 border-t border-b border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center sm:text-left space-y-4">
            <h3 className="text-3xl font-serif font-bold text-white">Envie de douceurs ? Nous livrons.</h3>
            <p className="text-white/70">Commandez avant minuit pour une livraison garantie le lendemain entre 18h et 20h partout à Marrakech.</p>
            <div className="flex items-center justify-center sm:justify-start gap-6 mt-6">
              <div className="flex items-center gap-2 text-[var(--color-gold)]">
                <Truck size={20} /> <span className="font-bold text-sm">Tarif Fixe 15 DH</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-gold)]">
                <MapPin size={20} /> <span className="font-bold text-sm">Tout Marrakech</span>
              </div>
            </div>
          </div>
          <Link to="/delivery" className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
            Règles de Livraison
          </Link>
        </div>
      </section>

    </div>
  );
}
