import { useState } from 'react';
import { LogOut, CheckCircle, Clock, MapPin, User, History, Package, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';

export function ProductionDashboard() {
  const { user, logout } = useAuth();
  const { getOrdersByStatus, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState<'todo' | 'planned' | 'history'>('todo');

  const productionOrders = getOrdersByStatus(['VALIDATED', 'IN_PREPARATION']);
  const historyOrders = getOrdersByStatus(['READY_FOR_DELIVERY', 'DELIVERED']);

  // Sort orders by timestamp
  const sortedProduction = [...productionOrders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  // Logic: Orders placed before today (midnight) are for today. Orders placed today are for tomorrow.
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const urgentOrders = sortedProduction.filter(o => !isToday(new Date(o.createdAt)));
  const plannedOrders = sortedProduction.filter(o => isToday(new Date(o.createdAt)));

  const renderOrderList = (ordersToRender: any[], title: string, color: string, deliveryTime: string) => {
    if (ordersToRender.length === 0) return null;
    return (
      <div className="mb-8">
        <h3 className={`text-lg font-bold ${color} mb-4 flex items-center gap-2`}><Clock size={18} /> {title} ({ordersToRender.length})</h3>
        <div className="space-y-4">
          {ordersToRender.map(order => (
              <div key={order.id} className="bg-[var(--color-surface)] border-l-4 border-[var(--color-gold)] p-4 sm:p-6 rounded-r-xl shadow-md border-y border-r border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[var(--color-gold)] font-mono font-bold">#{order.id}</span>
                    <p className="text-white/80 font-bold text-xs mt-1 bg-white/5 inline-block px-2 py-1 rounded">Livraison prévue : {deliveryTime}</p>
                    <div className="text-[11px] text-white/50 mt-2 flex items-center gap-1">
                      <Calendar size={12} /> Reçu le: {new Date(order.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-white/80 text-sm">
                      <User size={14} className="text-[var(--color-accent)]" /> {order.customerName}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                    order.status === 'VALIDATED' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {order.status === 'VALIDATED' ? 'À Préparer' : 'En Préparation'}
                  </span>
                </div>

                <div className="bg-black/30 p-4 rounded-lg mb-4 space-y-2">
                   {order.items.map((item: any) => (
                     <div key={item.id} className="flex justify-between text-white text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                       <span><strong className="text-[var(--color-gold)] text-lg">{item.quantity}x</strong> {item.name}</span>
                     </div>
                   ))}
                   {order.customerAddress.includes('Notes:') && (
                     <div className="mt-4 p-3 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded text-xs border border-[var(--color-accent)]/20">
                       <strong className="uppercase">Notes Client :</strong> {order.customerAddress.split('Notes:')[1].replace(')','')}
                     </div>
                   )}
                </div>

                <div className="flex gap-4">
                  {order.status === 'VALIDATED' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'IN_PREPARATION', 'Chef Cuisine')}
                      className="flex-1 bg-black/40 border border-white/10 hover:bg-white/10 text-white py-3 rounded font-bold transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Clock size={16} /> COMMENCER
                    </button>
                  )}
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'READY_FOR_DELIVERY', 'Chef Cuisine')}
                    className="flex-1 bg-[var(--color-accent)] hover:bg-[#A86F4A] text-white py-3 rounded font-bold transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <CheckCircle size={16} /> PRÊT À LIVRER
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 container mx-auto p-4 lg:py-8 w-full max-w-4xl animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[var(--color-accent)]">Production (Cuisine)</h1>
          <p className="text-white/60 text-sm">Bienvenue, {user?.name?.replace('Hassan', 'FZ')}</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors bg-white/5 py-2 px-4 rounded">
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 w-fit mb-6 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('todo')}
          className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'todo' ? 'bg-red-500 text-white' : 'text-white/50 hover:text-white'}`}
        >
          <Package size={16} /> Aujourd'hui
        </button>
        <button 
          onClick={() => setActiveTab('planned')}
          className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'planned' ? 'bg-[var(--color-accent)] text-white' : 'text-white/50 hover:text-white'}`}
        >
          <Calendar size={16} /> À Prévoir (Demain)
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'history' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
        >
          <History size={16} /> Historique
        </button>
      </div>
      
      {activeTab === 'todo' && (
        <div className="space-y-4">
          {urgentOrders.length === 0 ? (
            <div className="bg-[var(--color-surface)] text-center py-12 rounded-xl border border-white/5 text-white/50">
              Aucune commande urgente pour aujourd'hui.
            </div>
          ) : (
            renderOrderList(urgentOrders, "Livraison Aujourd'hui (Priorité Haute)", "text-red-400", "Aujourd'hui, 18h-20h")
          )}
        </div>
      )}

      {activeTab === 'planned' && (
        <div className="space-y-4">
          {plannedOrders.length === 0 ? (
            <div className="bg-[var(--color-surface)] text-center py-12 rounded-xl border border-white/5 text-white/50">
              Aucune commande à prévoir pour demain.
            </div>
          ) : (
            renderOrderList(plannedOrders, "Livraison Demain (À prévoir)", "text-[var(--color-gold)]", "Demain, 18h-20h")
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Historique de vos préparations</h2>
          {historyOrders.length === 0 ? (
            <div className="bg-[var(--color-surface)] text-center py-12 rounded-xl border border-white/5 text-white/50">
              Aucun historique pour le moment.
            </div>
          ) : (
            historyOrders.map(order => (
              <div key={order.id} className="bg-[var(--color-surface)] p-4 sm:p-5 rounded-xl border border-white/5 shadow-md opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-3">
                  <div>
                    <span className="text-[var(--color-gold)] font-mono font-bold text-sm">#{order.id}</span>
                    <div className="text-white/60 text-xs mt-1"><User size={12} className="inline mr-1"/> {order.customerName}</div>
                    <div className="text-[10px] text-white/40 mt-1">
                      Finie le: {order.history?.find((h:any) => h.status === 'READY_FOR_DELIVERY')?.timestamp 
                        ? new Date(order.history.find((h:any) => h.status === 'READY_FOR_DELIVERY').timestamp).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'medium' }) 
                        : '--'}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider shrink-0 ${
                    order.status === 'READY_FOR_DELIVERY' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {order.status === 'READY_FOR_DELIVERY' ? 'AU LIVREUR' : 'LIVRÉE'}
                  </span>
                </div>
                
                <div className="bg-black/20 p-3 rounded text-sm space-y-1 mb-4">
                  <p className="text-white/50 text-xs mb-2 uppercase tracking-wider font-bold">Détails préparés :</p>
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-white/80">
                      <span>{item.quantity}x {item.name}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-black/40 p-3 rounded text-[10px] space-y-1 border border-white/5">
                  <p className="text-[var(--color-gold)] font-bold mb-2 uppercase">Traçabilité complète :</p>
                  {order.history?.map((h: any, i: number) => (
                    <div key={i} className="flex gap-2 text-white/60">
                       <span className="text-white/40">{new Date(h.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                       <span className="font-bold">{h.actor}:</span>
                       <span>{h.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
