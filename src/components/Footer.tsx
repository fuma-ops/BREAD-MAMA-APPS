import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[var(--color-accent)] text-white/90 py-12 mt-auto border-t border-[var(--color-gold)]/20">
      <div className="container mx-auto px-4 w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-3xl font-serif font-bold text-white mb-2">BREAD MAMA</Link>
            <p className="text-sm text-white/80 max-w-xs">
              Pâtisserie Artisanale | Marrakech
            </p>
            <p className="text-sm font-medium mt-2">
              Made with ❤️
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-lg text-white mb-2 font-serif tracking-wide border-b border-white/20 pb-2 w-fit">Boutique</h4>
            <Link to="/shop" className="text-sm hover:text-white hover:underline transition-all">All Pastries</Link>
            <Link to="/shop?category=TRADITIONAL" className="text-sm hover:text-white hover:underline transition-all">Traditional</Link>
            <Link to="/shop?category=SWEET" className="text-sm hover:text-white hover:underline transition-all">Sweet & Filled</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-lg text-white mb-2 font-serif tracking-wide border-b border-white/20 pb-2 w-fit">Company</h4>
            {/* <Link to="/story" className="text-sm hover:text-white hover:underline transition-all">Our Story</Link> */}
            <Link to="/delivery" className="text-sm hover:text-white hover:underline transition-all">Livraison Info</Link>
            <Link to="/contact" className="text-sm hover:text-white hover:underline transition-all">Contact Us</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-lg text-white mb-2 font-serif tracking-wide border-b border-white/20 pb-2 w-fit">Help</h4>
            <span className="text-sm cursor-pointer hover:text-white hover:underline transition-all">Track Order</span>
            <span className="text-sm cursor-pointer hover:text-white hover:underline transition-all">Returns</span>
            <span className="text-sm cursor-pointer hover:text-white hover:underline transition-all">FAQs</span>
          </div>

        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/70">
          <p>© {new Date().getFullYear()} BREAD MAMA. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
            <span className="cursor-pointer hover:text-white transition-colors font-medium">WhatsApp: +212 6XX XXX XXX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
