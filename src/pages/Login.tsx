import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChefHat, Truck } from 'lucide-react';
import { useAuth, Role } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('admin');

  // POC: Simulation d'authentification sans backend.
  // Plus tard, on vérifiera via Google Sheets (Utilisateurs)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234') { // Mot de passe de démo
      login(selectedRole === 'admin' ? 'FZ (Admin)' : selectedRole === 'production' ? 'Chef (Production)' : 'Youssef (Livreur)', selectedRole);
      navigate('/dashboard');
    } else {
      alert('Code incorrect. Utilisez 1234 pour la démo.');
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center py-12 px-4 container mx-auto relative z-10 w-full mb-12">
      <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-3xl font-serif font-bold text-white mb-2 text-center">Espace Équipe</h2>
        <p className="text-white/50 text-center text-sm mb-8">Connexion au portail BREAD MAMA</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setSelectedRole('admin')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${selectedRole === 'admin' ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]' : 'border-white/10 text-white/50 hover:bg-white/5'}`}
          >
            <Shield size={24} className="mb-2" />
            <span className="text-[10px] font-bold uppercase">Admin</span>
          </button>
          <button
            onClick={() => setSelectedRole('production')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${selectedRole === 'production' ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'border-white/10 text-white/50 hover:bg-white/5'}`}
          >
            <ChefHat size={24} className="mb-2" />
            <span className="text-[10px] font-bold uppercase">Production</span>
          </button>
          <button
            onClick={() => setSelectedRole('livreur')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${selectedRole === 'livreur' ? 'border-blue-400 bg-blue-400/10 text-blue-400' : 'border-white/10 text-white/50 hover:bg-white/5'}`}
          >
            <Truck size={24} className="mb-2" />
            <span className="text-[10px] font-bold uppercase">Livreur</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-white/70 block mb-2">Code d'accès (Démo: 1234)</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] text-center tracking-widest text-xl"
              placeholder="••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[var(--color-accent)] hover:bg-[#A86F4A] text-white font-bold rounded shadow-lg transition-all"
          >
            SE CONNECTER
          </button>
        </form>
      </div>
    </div>
  );
}
