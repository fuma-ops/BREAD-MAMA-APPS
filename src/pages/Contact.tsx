import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { addMessageToSheet } from '../services/googleSheetsService';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addMessageToSheet({
        nom: formData.name,
        email: formData.email,
        telephone: formData.telephone,
        sujet: "Contact Site Web",
        message: formData.message
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', telephone: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting contact form", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex-1 py-12 px-4 container mx-auto max-w-6xl">
      <div className="text-center mb-16 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight"
        >
          Contactez <span className="text-[var(--color-gold)]">Nous</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-white/70 max-w-2xl mx-auto"
        >
          Une question sur nos produits ? Une commande spéciale à passer ? Nous sommes à votre écoute pour toute demande.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 relative z-10">
        {/* Informations */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="bg-[var(--color-surface)] p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-2xl font-serif text-[var(--color-gold)] mb-6 font-bold">Nos Coordonnées</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10 group-hover:border-[var(--color-gold)]/30 transition-colors">
                  <MapPin className="text-[var(--color-gold)]" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Notre Atelier</h3>
                  <p className="text-white/60">Home Sweet Home<br/>Marrakech, Maroc</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10 group-hover:border-[var(--color-gold)]/30 transition-colors">
                  <Phone className="text-[var(--color-gold)]" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Téléphone / WhatsApp</h3>
                  <p className="text-white/60">+212 646 34 07 29<br/>Lun-Sam, 9h-20h</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10 group-hover:border-[var(--color-gold)]/30 transition-colors">
                  <Mail className="text-[var(--color-gold)]" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Email</h3>
                  <p className="text-white/60">contact@breadmama.ma<br/>Nous répondons sous 24h</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Formulaire */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] p-8 rounded-2xl border border-white/5 space-y-6">
            <h2 className="text-2xl font-serif text-[var(--color-gold)] mb-2 font-bold">Envoyez-nous un message</h2>
            <p className="text-white/50 text-sm mb-6">Remplissez ce formulaire et nous vous contacterons au plus vite.</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-white/70 block mb-2">Nom Complet</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-white/70 block mb-2">Téléphone (WhatsApp)</label>
                <input 
                  type="tel" 
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  placeholder="+212 6..."
                />
              </div>

              <div>
                <label className="text-sm font-bold text-white/70 block mb-2">Email (Optionnel)</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-white/70 block mb-2">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] h-32 resize-none transition-colors"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || submitted}
              className={`w-full py-4 bg-gradient-to-r ${submitted ? 'from-green-500 to-green-600' : 'from-[var(--color-accent)] to-[#6b4229]'} hover:opacity-90 text-white font-bold rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : submitted ? (
                <><CheckCircle size={20} /> Envoyé avec succès</>
              ) : (
                <><Send size={20} /> Envoyer le message</>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
