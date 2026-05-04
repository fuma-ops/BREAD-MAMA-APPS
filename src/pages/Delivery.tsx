import { Clock, Truck, CreditCard, ClipboardCheck } from 'lucide-react';

export function Delivery() {
  return (
    <div className="flex-1 py-12 px-4 container mx-auto max-w-5xl animate-in fade-in duration-500">
      
      {/* Hero Box */}
      <div className="bg-gradient-to-r from-[#8B5A3C] to-[#5c3722] rounded-2xl p-8 sm:p-12 mb-12 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4 relative z-10">📦 Livraison & Commandes</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto relative z-10">
          Tout ce que vous devez savoir pour recevoir nos pâtisseries fraîches directement à votre porte à Marrakech.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Card 1 */}
        <div className="bg-black/30 border border-white/10 rounded-xl p-8 flex flex-col items-center text-center hover:bg-black/40 transition-colors">
          <div className="w-16 h-16 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center mb-6 text-[var(--color-gold)]">
            <Clock size={32} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-white mb-4">⏰ Horaires de Livraison</h3>
          <div className="text-white/80 space-y-2">
            <p>Les commandes passées <strong className="text-[var(--color-gold)]">AVANT MINUIT</strong></p>
            <p>sont livrées</p>
            <p className="text-xl font-bold bg-[var(--color-surface)] py-2 px-6 rounded-md inline-block mt-2">DEMAIN • 18h-20h</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-black/30 border border-white/10 rounded-xl p-8 flex flex-col items-center text-center hover:bg-black/40 transition-colors">
          <div className="w-16 h-16 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center mb-6 text-[var(--color-gold)]">
            <Truck size={32} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-white mb-4">🚚 Livraison à Marrakech</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-[var(--color-gold)] mb-2">15 DH</p>
            <p className="text-white/80 font-medium">partout sur Marrakech</p>
            <p className="text-white/50 text-sm mt-4">Livraison incluse dans tous les secteurs de la ville rouge.</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-black/30 border border-white/10 rounded-xl p-8 hover:bg-black/40 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center text-[var(--color-gold)]">
              <CreditCard size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">💳 Méthodes de Paiement</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-white/80">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">✓</div>
              <span>Paiement à la livraison (Espèces)</span>
            </li>
            <li className="flex items-center gap-3 text-white/80">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">✓</div>
              <span>Virement bancaire (À l'avance)</span>
            </li>
            <li className="flex items-center gap-3 text-white/80">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">✓</div>
              <span>Commande via WhatsApp direct</span>
            </li>
          </ul>
        </div>

        {/* Card 4 */}
        <div className="bg-black/30 border border-white/10 rounded-xl p-8 hover:bg-black/40 transition-colors">
           <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center text-[var(--color-gold)]">
              <ClipboardCheck size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">📝 Suivi & Qualité</h3>
          </div>
          <ul className="space-y-4 text-white/80">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">✓</div>
              <span>Laisser des commentaires sur vos commandes</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">✓</div>
              <span>Noter nos produits et notre service</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">✓</div>
              <span>Poser des questions via WhatsApp</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">✓</div>
              <span>Notification par message avant livraison</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
