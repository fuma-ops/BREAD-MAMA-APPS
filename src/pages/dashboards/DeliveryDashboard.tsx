import { useState } from 'react';
import { LogOut, MapPin, Truck, Phone, History } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';

export function DeliveryDashboard() {
  const { user, logout } = useAuth();
  const { getOrdersByStatus, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState<'todo' | 'history'>('todo');

  const deliveryOrders = getOrdersByStatus('READY_FOR_DELIVERY');
  const historyOrders = getOrdersByStatus('DELIVERED');
  const upcomingOrders = getOrdersByStatus(['VALIDATED', 'IN_PREPARATION']);
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  // Orders created before today are for today. Orders created today are for tomorrow.
  const upcomingToday = upcomingOrders.filter(o => !isToday(new Date(o.createdAt)));
  const upcomingTomorrow = upcomingOrders.filter(o => isToday(new Date(o.createdAt)));

  const revenueToCollect = deliveryOrders.reduce((acc, order) => acc + order.total, 0);
  const revenueCollected = historyOrders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="flex-1 container mx-auto p-4 lg:py-8 w-full max-w-md animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-blue-400">Livreur App</h1>
          <p className="text-white/60 text-sm">Bienvenue, {user?.name?.replace('Hassan', 'FZ')}</p>
        </div>
        <button onClick={logout} className="p-2 text-red-400 hover:text-red-300 transition-colors bg-white/5 rounded-full">
          <LogOut size={16} />
        </button>
      </div>

      <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 w-fit mb-6">
        <button 
          onClick={() => setActiveTab('todo')}
          className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'todo' ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white'}`}
        >
          <Truck size={16} /> À Livrer
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
          <div className="bg-blue-400/10 border border-blue-400/20 p-4 rounded-xl mb-6">
            <h3 className="text-blue-300 text-sm font-bold uppercase mb-1">Total à encaisser aujourd'hui</h3>
            <p className="text-2xl font-bold text-white">{revenueToCollect} DH</p>
          </div>

          <h2 className="text-lg font-bold text-white mb-4">Commandes Prêtes (Ma tournée)</h2>
          
          {deliveryOrders.length === 0 ? (
            <div className="bg-[var(--color-surface)] text-center py-12 rounded-xl border border-white/5 text-white/50">
              Aucune commande prête à être livrée.
            </div>
          ) : (
            deliveryOrders.map(order => (
              <div key={order.id} className="bg-[var(--color-surface)] p-5 rounded-xl border border-white/5 shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[var(--color-gold)] font-mono font-bold text-sm">#{order.id}</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[10px] uppercase font-bold tracking-wider">PRÊT</span>
                </div>

                <div className="space-y-3 mb-4">
                   <div className="flex items-start gap-3 text-white/80 text-sm">
                      <MapPin className="text-[var(--color-accent)] shrink-0 mt-0.5" size={16} />
                      <p>{order.customerAddress}</p>
                   </div>
                   <div className="flex items-center gap-3 text-white/80 text-sm">
                      <Phone className="text-[var(--color-accent)] shrink-0" size={16} />
                      <a href={`tel:${order.customerPhone}`} className="text-blue-400 underline font-mono">{order.customerPhone}</a>
                      <span className="text-white/40 text-xs ml-auto">({order.customerName})</span>
                   </div>
                </div>

                <div className="flex justify-between items-center text-sm bg-black/30 p-3 rounded mb-4">
                   <span className="text-white/60">A encaisser:</span>
                   <span className="text-[var(--color-gold)] font-bold text-lg">{order.total} DH</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(order.customerAddress)}`, '_blank')}
                    className="bg-white/5 hover:bg-white/10 text-white py-2 rounded text-xs font-bold transition-colors"
                  >
                    Google Maps
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'DELIVERED', 'Livreur (Terrain)')}
                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 rounded text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                     <Truck size={14}/> LIVRÉE
                  </button>
                </div>
              </div>
            ))
          )}

          {upcomingToday.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-white/50 mb-4 flex items-center gap-2">
                <Truck size={18} /> À Prévoir pour Aujourd'hui ({upcomingToday.length})
              </h2>
              <div className="space-y-4">
                {upcomingToday.map(order => (
                  <div key={order.id} className="bg-black/20 p-4 rounded-xl border border-white/5 border-dashed opacity-50 select-none">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[var(--color-gold)] font-mono font-bold text-sm">#{order.id}</span>
                      <span className={`px-2 py-1 bg-white/5 text-white/40 rounded text-[10px] uppercase font-bold tracking-wider`}>
                        {order.status === 'VALIDATED' ? 'EN ATTENTE CHEF' : 'EN PRÉPARATION'}
                      </span>
                    </div>
                    <div className="text-white/60 text-sm">{order.customerAddress.split(',')[0]}... ({order.customerName})</div>
                    <div className="text-[10px] text-white/40 mt-1">Sera prêt aujourd'hui. Vous le verrez actif après validation du Chef.</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {upcomingTomorrow.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-white/30 mb-4 flex items-center gap-2">
                <Truck size={18} /> Demain ({upcomingTomorrow.length})
              </h2>
              <div className="space-y-4">
                {upcomingTomorrow.map(order => (
                  <div key={order.id} className="bg-black/40 p-4 rounded-xl border border-white/5 border-dashed opacity-30 select-none">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[var(--color-gold)] font-mono font-bold text-sm">#{order.id}</span>
                      <span className={`px-2 py-1 bg-white/5 text-white/40 rounded text-[10px] uppercase font-bold tracking-wider`}>
                        {order.status === 'VALIDATED' ? 'EN ATTENTE CHEF' : 'EN PRÉPARATION'}
                      </span>
                    </div>
                    <div className="text-white/60 text-sm">{order.customerAddress.split(',')[0]}... ({order.customerName})</div>
                    <div className="text-[10px] text-white/40 mt-1">Livraison prévue pour demain.</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-green-400/10 border border-green-400/20 p-4 rounded-xl mb-6">
            <h3 className="text-green-300 text-sm font-bold uppercase mb-1">Total encaissé</h3>
            <p className="text-2xl font-bold text-white">{revenueCollected} DH</p>
          </div>

          <h2 className="text-lg font-bold text-white mb-4">Commandes Livrées</h2>
          
          {historyOrders.length === 0 ? (
            <div className="bg-[var(--color-surface)] text-center py-12 rounded-xl border border-white/5 text-white/50">
              Aucune commande livrée pour le moment.
            </div>
          ) : (
            historyOrders.map(order => (
              <div key={order.id} className="bg-[var(--color-surface)] p-4 sm:p-5 rounded-xl border border-white/5 shadow-md opacity-80">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[var(--color-gold)] font-mono font-bold text-sm">#{order.id}</span>
                    <div className="text-white/60 text-xs mt-1">{order.customerAddress.split(',')[0]}... ({order.customerName})</div>
                    <div className="text-[10px] text-white/40 mt-1">Livré à: {order.history?.find((h:any) => h.status === 'DELIVERED')?.timestamp 
                        ? new Date(order.history.find((h:any) => h.status === 'DELIVERED').timestamp).toLocaleString('fr-FR', { timeStyle: 'short' }) 
                        : '--'}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[10px] uppercase font-bold tracking-wider shrink-0">
                    LIVRÉE
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-2 mb-4">
                  <span className="text-xs text-white/50">Montant collecté</span>
                  <div className="text-green-400 font-bold text-sm">{order.total} DH</div>
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
