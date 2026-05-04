import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';

export function Checkout() {
  const { items, subtotal, deliveryFee, total, isEmpty, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'card'
  const [orderComplete, setOrderComplete] = useState(false);

  if (isEmpty && !orderComplete) {
    return (
      <div className="flex-1 py-20 px-4 container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-serif font-bold text-white mb-4">Votre panier est vide</h2>
        <p className="text-white/60 mb-8">Ajoutez de délicieuses pâtisseries avant de commander !</p>
        <button 
          onClick={() => navigate('/shop')}
          className="px-8 py-3 bg-[var(--color-accent)] text-white font-bold rounded-lg"
        >
          Retour à la Boutique
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateWhatsAppMessage = () => {
    let msg = `*Nouvelle Commande BREAD MAMA*\n\n`;
    msg += `*Client:* ${formData.name}\n`;
    msg += `*Tél:* ${formData.phone}\n`;
    msg += `*Adresse:* ${formData.address}\n`;
    if (formData.notes) msg += `*Notes:* ${formData.notes}\n`;
    msg += `\n*Commande:*\n`;
    items.forEach(item => {
      msg += `- ${item.quantity}x ${item.name} (${item.price} DH/u)\n`;
    });
    msg += `\n*Sous-total:* ${subtotal} DH\n`;
    msg += `*Livraison:* ${deliveryFee} DH\n`;
    msg += `*TOTAL:* ${total} DH\n`;
    msg += `\nMéthode: ${paymentMethod === 'cash' ? 'Paiement à la livraison' : 'WhatsApp'}`;
    
    return encodeURIComponent(msg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save order in context
    addOrder({
      customerName: formData.name,
      customerPhone: formData.phone,
      customerAddress: formData.address + (formData.notes ? ` (Notes: ${formData.notes})` : ''),
      items: items,
      subtotal,
      deliveryFee,
      total,
    });
    
    // Both payment methods trigger automatic WhatsApp confirmation simulation (no redirect)
    console.log(`Automatic WhatsApp Confirmation sent for order via ${paymentMethod}`);
    
    // locally complete the order
    setOrderComplete(true);
    clearCart();
  };

  if (orderComplete) {
    return (
      <div className="flex-1 py-12 px-4 container mx-auto max-w-3xl text-center animate-in zoom-in duration-500">
        <div className="bg-[var(--color-surface)] border border-green-500/30 rounded-2xl p-8 sm:p-12">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500" size={48} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-[var(--color-gold)] mb-4">Commande Confirmée!</h1>
          <p className="text-xl text-white/80 mb-2">Merci pour votre commande, {formData.name}.</p>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Nous préparons vos délices. Ils seront livrés demain entre 18h et 20h à votre adresse sur Marrakech.
          </p>
          <div className="bg-white/10 text-white/90 text-sm p-4 rounded-lg mb-8 inline-flex items-center gap-2">
            <CheckCircle size={16} className="text-green-400" />
            Une confirmation détaillée a été envoyée automatiquement sur WhatsApp.
          </div>
          
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-[var(--color-accent)] text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-12 px-4 container mx-auto max-w-6xl">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h1 className="text-4xl font-serif font-bold text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Shipping Address */}
            <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-xl border border-white/5">
              <h2 className="text-2xl font-serif font-bold text-[var(--color-gold)] mb-6 flex items-center gap-3">
                <Truck size={24} /> 1. Informations de Livraison
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/70">Nom Complet *</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)]"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/70">Téléphone *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)]"
                    placeholder="+212 6..."
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-white/70">Adresse Complète * (Marrakech uniquement)</label>
                  <textarea 
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] h-24 resize-none"
                    placeholder="Quartier, Rue, Résidence, Appartement..."
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-white/70">Notes (Optionnel)</label>
                  <input 
                    type="text" 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)]"
                    placeholder="Instructions pour le livreur..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-xl border border-white/5">
              <h2 className="text-2xl font-serif font-bold text-[var(--color-gold)] mb-6 flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-[var(--color-gold)]/20 text-[var(--color-gold)] flex items-center justify-center text-sm">💳</span> 
                2. Méthode de Paiement
              </h2>
              
              <div className="space-y-4">
                <label className={`block p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/5' : 'border-white/10 bg-black/20 hover:bg-black/30'}`}>
                  <div className="flex items-center gap-4">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="w-5 h-5 accent-[var(--color-gold)]"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-white block text-lg">💵 Paiement à la livraison (Cash)</span>
                      <span className="text-white/50 text-sm">Payez en espèces lorsque le livreur vous remet la commande.</span>
                    </div>
                  </div>
                </label>

                <label className={`block p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/5' : 'border-white/10 bg-black/20 hover:bg-black/30'}`}>
                  <div className="flex items-center gap-4">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-5 h-5 accent-[var(--color-gold)]"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-white block text-lg">💳 Paiement par carte bancaire</span>
                      <span className="text-white/50 text-sm">Paiement électronique sécurisé en ligne.</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 sticky top-24">
            <h2 className="text-xl font-serif font-bold text-white mb-6">Résumé de la commande</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto no-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-white/80">
                    <span className="w-6 text-center bg-black/30 rounded text-[var(--color-gold)] font-bold">{item.quantity}x</span>
                    <span className="truncate max-w-[150px]">{item.name}</span>
                  </div>
                  <span className="text-white whitespace-nowrap">{item.price * item.quantity} DH</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-4 space-y-3 mb-6 relative">
              <div className="flex justify-between text-white/60 text-sm">
                <span>Sous-total</span>
                <span>{subtotal} DH</span>
              </div>
              <div className="flex justify-between text-white/60 text-sm">
                <span>Livraison (Marrakech)</span>
                <span>{deliveryFee} DH</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-[var(--color-gold)] pt-3 border-t border-white/10">
                <span>TOTAL</span>
                <span>{total} DH</span>
              </div>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              className="w-full py-4 rounded-lg font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-opacity-90 shadow-[var(--color-accent)]/20"
            >
              CONFIRMER LA COMMANDE
            </button>
            <p className="text-center text-xs text-white/40 mt-4">
              En confirmant, vous acceptez nos conditions de vente.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
