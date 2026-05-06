import { useState, useMemo, useEffect } from 'react';
import { LogOut, Plus, Trash2, Package, Activity, Copy, Edit2, Send, Check, Tags, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { useCategories } from '../../context/CategoryContext';
import { fetchMessagesFromSheet } from '../../services/googleSheetsService';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const { categories, addCategory, deleteCategory } = useCategories();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'team' | 'production' | 'messages'>('overview');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessagesFromSheet().then(data => {
        setMessages(data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      });
    }
  }, [activeTab]);

  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
  const activeDeliveryCount = orders.filter(o => o.status === 'READY_FOR_DELIVERY').length;
  const todaysRevenue = orders.filter(o => o.status === 'DELIVERED').reduce((acc, current) => acc + current.total, 0);

  const [name, setName] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0] || 'TRADITIONAL');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAddingMode, setIsAddingMode] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Team Management state (Mocked for interface)
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Chef Cuisine principale', role: 'CHEF' },
    { id: 2, name: 'Mohamed (Secteur 1)', role: 'LIVREUR' }
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('CHEF');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if(!name || !price) return;
    
    const newProductData = {
      name,
      arabicName,
      price: parseFloat(price) || 0,
      category,
      description,
      emoji: '🥐',
      quality: {
        ingredients: 'Mise à jour requise',
        process: 'Mise à jour requise',
        handmade: 'Fait main avec passion',
        love: 'Recette authentique'
      },
      reviews: [],
      images: imageUrl ? [imageUrl] : [],
      tags: [category.toLowerCase()],
      available: true,
      preparation_time: 'Fresh daily'
    };

    if (editingId !== null) {
      updateProduct(editingId, newProductData);
    } else {
      addProduct({ ...newProductData, reviews: [] });
    }
    
    setName('');
    setArabicName('');
    setPrice('');
    setCategory('TRADITIONAL');
    setDescription('');
    setImageUrl('');
    setIsAddingMode(false);
    setEditingId(null);
  };

  const handleEditProduct = (product: any) => {
    setName(product.name);
    setArabicName(product.arabicName || '');
    setPrice(product.price.toString());
    setCategory(product.category);
    setDescription(product.description || '');
    setImageUrl(product.images[0] || '');
    setEditingId(product.id);
    setIsAddingMode(true);
    setActiveTab('products');
  };

  const handleDuplicateProduct = (product: any) => {
    addProduct({
      ...product,
      name: `${product.name} (Copie)`,
      id: undefined
    });
  };

  const notifyClientAndValidate = (order: any) => {
    updateOrderStatus(order.id, 'VALIDATED', 'Admin');
    const msg = encodeURIComponent(`Bonjour ${order.customerName},\n\nVotre commande Darkom (${order.id}) a bien été validée et est en cours de préparation !\nMerci pour votre confiance.`);
    
    // Format the phone number cleanly (remove spaces, replace leading 0 with country code)
    let phoneStr = order.customerPhone.replace(/\s+/g, '');
    if (phoneStr.startsWith('0')) {
      phoneStr = '212' + phoneStr.substring(1);
    } else if (phoneStr.startsWith('+')) {
      phoneStr = phoneStr.substring(1);
    }

    window.open(`https://wa.me/${phoneStr}?text=${msg}`, '_blank');
  };

  return (
    <div className="flex-1 container mx-auto p-4 lg:py-8 w-full max-w-6xl animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 border-b border-white/10 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[var(--color-gold)]">Admin Dashboard</h1>
          <p className="text-white/60 text-sm">Bienvenue, {user?.name?.replace('Hassan', 'FZ')}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex overflow-x-auto bg-black/40 p-1 rounded-lg border border-white/5 no-scrollbar">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-[var(--color-accent)] text-white' : 'text-white/50 hover:text-white'}`}
            >
              <Activity size={14} className="inline mr-2" />
              Vue d'ensemble
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'products' ? 'bg-[var(--color-accent)] text-white' : 'text-white/50 hover:text-white'}`}
            >
              <Package size={14} className="inline mr-2" />
              Produits
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'categories' ? 'bg-[var(--color-accent)] text-white' : 'text-white/50 hover:text-white'}`}
            >
              <Tags size={14} className="inline mr-2" />
              Catégories
            </button>
            <button 
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'team' ? 'bg-[var(--color-accent)] text-white' : 'text-white/50 hover:text-white'}`}
            >
              <Users size={14} className="inline mr-2" />
              Équipe
            </button>
            <button 
              onClick={() => setActiveTab('production')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'production' ? 'bg-[var(--color-accent)] text-white' : 'text-white/50 hover:text-white'}`}
            >
              <Check size={14} className="inline mr-2" />
              Ligne de Prod
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === 'messages' ? 'bg-[var(--color-accent)] text-white' : 'text-white/50 hover:text-white'}`}
            >
              <MessageSquare size={14} className="inline mr-2" />
              Messages
            </button>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors bg-white/5 py-2 px-4 rounded-lg">
            <LogOut size={16} /> <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-gold)]/20 shadow-md">
              <h3 className="text-white/50 text-sm font-bold uppercase mb-2">Ventes Complètes</h3>
              <p className="text-3xl font-bold text-white">{todaysRevenue} DH</p>
            </div>
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-md">
              <h3 className="text-white/50 text-sm font-bold uppercase mb-2">Commandes En Attente</h3>
              <p className="text-3xl font-bold text-white">{pendingOrdersCount} <span className="text-sm font-normal text-white/50 leading-tight">à vérifier</span></p>
            </div>
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-md">
              <h3 className="text-white/50 text-sm font-bold uppercase mb-2">En Livraison</h3>
              <p className="text-3xl font-bold text-white">{activeDeliveryCount} <span className="text-sm font-normal text-white/50 leading-tight">avec le livreur</span></p>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl border border-white/5 p-6 shadow-md overflow-x-auto">
            <h3 className="text-xl font-bold font-serif text-white mb-6">Toutes les Commandes</h3>
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                  <th className="pb-3 px-2">ID Commande</th>
                  <th className="pb-3 px-2">Client</th>
                  <th className="pb-3 px-2">Total</th>
                  <th className="pb-3 px-2">Statut</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-white/80">
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2">
                       <span className="font-mono text-[var(--color-gold)]">#{order.id}</span>
                       <div className="text-[10px] text-white/40 mt-1">{new Date(order.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</div>
                    </td>
                    <td className="py-4 px-2">{order.customerName} <br/><span className="text-xs text-white/40">{order.customerAddress.substring(0, 30)}...</span></td>
                    <td className="py-4 px-2 font-bold">{order.total} DH</td>
                    <td className="py-4 px-2">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase w-fit ${
                          order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                          order.status === 'VALIDATED' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'IN_PREPARATION' ? 'bg-orange-500/20 text-orange-400' :
                          order.status === 'READY_FOR_DELIVERY' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {order.status}
                        </span>
                        <div className="mt-2 text-[10px] text-white/50 space-y-1">
                          {order.history?.map((h: any, i: number) => (
                            <div key={i} className="flex gap-2 border-l border-white/20 pl-2">
                               <span className="text-white/40 min-w-[35px]">{new Date(h.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                               <span className="font-bold text-white/60">{h.actor}:</span>
                               <span className="truncate">{h.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      {order.status === 'PENDING' && (
                        <button 
                          onClick={() => notifyClientAndValidate(order)}
                          className="text-[11px] bg-[var(--color-accent)] text-white px-3 py-1.5 rounded font-bold tracking-wider hover:bg-opacity-90 transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Check size={14} /> Valider
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-white/50">Aucune commande pour le moment.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 bg-blue-500/10 border border-blue-500/30 p-4 rounded text-blue-300 text-sm flex gap-3">
            <span className="text-2xl">ℹ️</span>
            <p>Bientôt, ces données seront directement synchronisées depuis votre <strong>Google Sheet</strong>. Vous pourrez modifier le sheet pour voir les produits et les commandes se mettre à jour en temps réel.</p>
          </div>
        </>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-md">
            <div>
              <h2 className="text-xl font-bold font-serif text-white">Gestion des Produits</h2>
              <p className="text-white/50 text-sm mt-1">Gérez le catalogue des pâtisseries.</p>
            </div>
            <button 
              onClick={() => setIsAddingMode(!isAddingMode)}
              className="bg-[var(--color-accent)] hover:bg-[#A86F4A] text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              {isAddingMode ? 'Annuler' : <><Plus size={16}/> NOUVEAU PRODUIT</>}
            </button>
          </div>

          {isAddingMode && (
            <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-xl border border-[var(--color-gold)]/30 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
               <h3 className="text-lg font-bold font-serif text-[var(--color-gold)] mb-6">Ajouter un produit</h3>
               
               <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-white/70 uppercase mb-2 block tracking-wider">Nom du produit *</label>
                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[var(--color-gold)] font-serif" placeholder="Ex: Msemen" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/70 uppercase mb-2 block tracking-wider">Nom en Arabe</label>
                    <input type="text" value={arabicName} onChange={e => setArabicName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[var(--color-gold)] font-serif text-right" dir="auto" placeholder="Ex: مسمن" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/70 uppercase mb-2 block tracking-wider">Prix (DH) *</label>
                    <input required type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[var(--color-gold)]" placeholder="Ex: 10.00" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/70 uppercase mb-2 block tracking-wider">Catégorie *</label>
                    <select required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[var(--color-gold)] appearance-none cursor-pointer">
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-white/70 uppercase mb-2 block tracking-wider">Image (URL) <span className="text-white/40 normal-case font-normal">(Le téléchargement de fichier sera ajouté plus tard)</span></label>
                    <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[var(--color-gold)]" placeholder="https://images.unsplash.com/photo-..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-white/70 uppercase mb-2 block tracking-wider">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[var(--color-gold)] resize-none" placeholder="Description détaillée du produit..."></textarea>
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end mt-4 pt-6 border-t border-white/5">
                    <button type="submit" className="bg-[var(--color-gold)] hover:bg-[#d1a354] text-black px-8 py-3 rounded font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-[var(--color-gold)]/20 text-xs">
                       {editingId !== null ? 'Mettre à jour le produit' : 'Enregistrer le produit'}
                    </button>
                  </div>
               </form>
            </div>
          )}

          <div className="bg-[var(--color-surface)] rounded-xl border border-white/5 shadow-md overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-black/20 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-medium">Produit</th>
                  <th className="py-4 px-6 font-medium">Catégorie</th>
                  <th className="py-4 px-6 font-medium">Prix</th>
                  <th className="py-4 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-white/80 divide-y divide-white/5">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/40 rounded border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">{product.emoji}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-serif font-bold text-white text-base leading-tight">{product.name}</p>
                          <p className="text-white/40 text-xs mt-0.5" dir="auto">{product.arabicName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 text-white/70">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-[var(--color-gold)]">
                      {(Number(product.price) || 0).toFixed(2)} DH
                    </td>
                    <td className="py-4 px-6 text-right">
                       <div className="flex justify-end gap-1">
                         <button 
                           onClick={() => handleEditProduct(product)}
                           className="text-white/50 hover:text-[var(--color-gold)] p-2 rounded hover:bg-white/5 transition-colors"
                           title="Modifier"
                         >
                           <Edit2 size={16} />
                         </button>
                         <button 
                           onClick={() => handleDuplicateProduct(product)}
                           className="text-white/50 hover:text-white p-2 rounded hover:bg-white/5 transition-colors"
                           title="Dupliquer"
                         >
                           <Copy size={16} />
                         </button>
                         <button 
                           onClick={() => deleteProduct(product.id)}
                           className="text-red-400/50 hover:text-red-400 p-2 rounded hover:bg-red-400/10 transition-colors"
                           title="Supprimer"
                         >
                           <Trash2 size={16} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-white/50">Aucun produit dans le catalogue.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-md">
            <div>
              <h2 className="text-xl font-bold font-serif text-white">Catégories</h2>
              <p className="text-white/50 text-sm mt-1">Gérez les catégories de votre boutique.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-md">
              <h3 className="text-lg font-bold font-serif text-[var(--color-gold)] mb-4">Ajouter une catégorie</h3>
              <form onSubmit={handleAddCategory} className="flex gap-2 text-sm">
                <input 
                  type="text" 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)} 
                  required
                  placeholder="Nom de la catégorie" 
                  className="flex-1 bg-black/40 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[var(--color-gold)] uppercase" 
                />
                <button type="submit" className="bg-[var(--color-accent)] hover:bg-[#A86F4A] text-white px-4 py-3 rounded font-bold uppercase transition-colors shrink-0">
                  Ajouter
                </button>
              </form>
            </div>

            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-md">
              <h3 className="text-lg font-bold font-serif text-[var(--color-gold)] mb-4">Catégories Actuelles</h3>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat} className="flex items-center justify-between p-3 bg-black/20 border border-white/5 rounded-lg">
                    <span className="font-bold text-white/80">{cat}</span>
                    <button 
                      onClick={() => deleteCategory(cat)}
                      className="text-red-400/50 hover:text-red-400 p-2 rounded hover:bg-red-400/10 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-md">
            <div>
              <h2 className="text-xl font-bold font-serif text-white">Gestion de l'Équipe</h2>
              <p className="text-white/50 text-sm mt-1">Créez des profils pour vos chefs et livreurs et suivez leur travail.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Team Members List */}
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-md">
              <h3 className="text-lg font-bold font-serif text-[var(--color-gold)] mb-4 flex items-center gap-2"><Users size={20} /> Membres</h3>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if(newMemberName) {
                    setTeamMembers([...teamMembers, { id: Date.now(), name: newMemberName, role: newMemberRole }]);
                    setNewMemberName('');
                  }
                }}
                className="flex gap-2 text-sm mb-6"
              >
                <input 
                  type="text" 
                  value={newMemberName} 
                  onChange={e => setNewMemberName(e.target.value)} 
                  required
                  placeholder="Nom du profil..." 
                  className="flex-1 bg-black/40 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-[var(--color-gold)]" 
                />
                <select 
                  value={newMemberRole}
                  onChange={e => setNewMemberRole(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-[var(--color-gold)]"
                >
                  <option value="CHEF">Chef</option>
                  <option value="LIVREUR">Livreur</option>
                </select>
                <button type="submit" className="bg-[var(--color-accent)] hover:bg-[#A86F4A] text-white px-3 py-2 rounded font-bold uppercase transition-colors shrink-0">
                  <Plus size={16} />
                </button>
              </form>

              <ul className="space-y-2">
                {teamMembers.map(member => (
                  <li key={member.id} className="flex justify-between p-3 bg-black/20 border border-white/5 rounded-lg items-center">
                    <div>
                      <span className="font-bold text-white/90 block">{member.name}</span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mt-1 inline-block ${member.role === 'CHEF' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {member.role}
                      </span>
                    </div>
                    <button 
                      onClick={() => setTeamMembers(teamMembers.filter(m => m.id !== member.id))}
                      className="text-red-400/50 hover:text-red-400 p-2 rounded hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Work in progress overview */}
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-md">
              <h3 className="text-lg font-bold font-serif text-[var(--color-gold)] mb-4 flex justify-between items-center">
                <span>Suivi d'activité</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/50 font-sans font-normal uppercase tracking-wider">Aujourd'hui</span>
              </h3>
              
              <div className="space-y-4">
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                   <div className="flex justify-between mb-2">
                     <span className="text-white/70">En cuisine (Préparation)</span>
                     <span className="font-bold text-[var(--color-gold)]">{orders.filter(o => o.status === 'IN_PREPARATION' || o.status === 'VALIDATED').length} commandes</span>
                   </div>
                   <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                     <div className="bg-orange-400 h-full" style={{width: `${Math.min(100, (orders.filter(o => o.status === 'IN_PREPARATION' || o.status === 'VALIDATED').length / orders.length) * 100)}%`}}></div>
                   </div>
                </div>

                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                   <div className="flex justify-between mb-2">
                     <span className="text-white/70">En livraison (Prêt)</span>
                     <span className="font-bold text-[var(--color-gold)]">{orders.filter(o => o.status === 'READY_FOR_DELIVERY').length} commandes</span>
                   </div>
                   <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                     <div className="bg-blue-400 h-full" style={{width: `${Math.min(100, (orders.filter(o => o.status === 'READY_FOR_DELIVERY').length / orders.length) * 100)}%`}}></div>
                   </div>
                </div>

                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                   <div className="flex justify-between mb-2">
                     <span className="text-white/70">Livrées (Terminées)</span>
                     <span className="font-bold text-green-400">{orders.filter(o => o.status === 'DELIVERED').length} commandes</span>
                   </div>
                   <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                     <div className="bg-green-400 h-full" style={{width: `${Math.min(100, (orders.filter(o => o.status === 'DELIVERED').length / orders.length) * 100)}%`}}></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'production' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-md">
            <div>
              <h2 className="text-xl font-bold font-serif text-[var(--color-gold)]">Ligne de Production</h2>
              <p className="text-white/50 text-sm mt-1">Supervision globale des commandes selon les cycles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Aujourd'hui */}
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-md border-t-2 border-t-red-400">
              <h3 className="text-lg font-bold font-serif text-red-400 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2"><Activity size={20} /> Livraison Aujourd'hui</span>
                <span className="text-[10px] bg-red-400/20 px-2 py-1 rounded">Priorité</span>
              </h3>
              <div className="space-y-4">
                {orders.filter(o => {
                  const today = new Date();
                  const orderDate = new Date(o.createdAt);
                  const isToday = orderDate.getDate() === today.getDate() && orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
                  return !isToday && ['VALIDATED', 'IN_PREPARATION', 'READY_FOR_DELIVERY'].includes(o.status);
                }).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(order => (
                  <div key={order.id} className="bg-black/20 p-4 rounded-lg border border-white/5 shadow-inner">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-[var(--color-gold)] font-bold text-sm">#{order.id}</span>
                      <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider ${
                        order.status === 'VALIDATED' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'IN_PREPARATION' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {order.status === 'READY_FOR_DELIVERY' ? 'TRÈS PRÊT' : order.status}
                      </span>
                    </div>
                    <div className="text-xs text-white/70 mb-2">{order.customerName} - {order.items.length} article(s)</div>
                    <div className="flex justify-between items-end">
                      <div className="text-white/40 text-[10px]">Reçu: {new Date(order.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</div>
                    </div>
                  </div>
                ))}
                {orders.filter(o => {
                  const today = new Date();
                  const orderDate = new Date(o.createdAt);
                  return !(orderDate.getDate() === today.getDate() && orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear()) && ['VALIDATED', 'IN_PREPARATION', 'READY_FOR_DELIVERY'].includes(o.status);
                }).length === 0 && <div className="text-white/40 text-sm text-center py-4 bg-black/10 rounded border border-white/5 dashed">Aucune commande urgente</div>}
              </div>
            </div>

            {/* A Prévoir */}
            <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-md border-t-2 border-t-[var(--color-gold)]">
              <h3 className="text-lg font-bold font-serif text-[var(--color-gold)] mb-4 flex items-center gap-2">
                <Check size={20} /> À Prévoir (Livraison Demain)
              </h3>
              <div className="space-y-4">
                {orders.filter(o => {
                  const today = new Date();
                  const orderDate = new Date(o.createdAt);
                  const isToday = orderDate.getDate() === today.getDate() && orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
                  return isToday && ['PENDING', 'VALIDATED', 'IN_PREPARATION'].includes(o.status);
                }).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(order => (
                  <div key={order.id} className="bg-black/20 p-4 rounded-lg border border-white/5 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-[var(--color-gold)] font-bold text-sm border-b border-white/10 border-dashed pb-1">#{order.id}</span>
                      <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider ${
                        order.status === 'PENDING' ? 'bg-gray-500/20 text-gray-400' :
                        order.status === 'VALIDATED' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-white/70 mb-2">{order.customerName} - {order.items.length} article(s)</div>
                    <div className="text-white/40 text-[10px]">Reçu aujourd'hui : {new Date(order.createdAt).toLocaleString('fr-FR', { timeStyle: 'short' })}</div>
                  </div>
                ))}
                {orders.filter(o => {
                  const today = new Date();
                  const orderDate = new Date(o.createdAt);
                  return (orderDate.getDate() === today.getDate() && orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear()) && ['PENDING', 'VALIDATED', 'IN_PREPARATION'].includes(o.status);
                }).length === 0 && <div className="text-white/40 text-sm text-center py-4 bg-black/10 rounded border border-white/5 dashed">Aucune commande à prévoir</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-md">
            <div>
              <h2 className="text-xl font-bold font-serif text-[var(--color-gold)]">Messages de Contact</h2>
              <p className="text-white/50 text-sm mt-1">Consultez les messages envoyés depuis l'application via le formulaire de contact.</p>
            </div>
            <button 
              onClick={() => {
                fetchMessagesFromSheet().then(data => {
                  setMessages(data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                });
              }}
              className="bg-[var(--color-accent)] hover:bg-[#A86F4A] text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0"
            >
              Rafraîchir
            </button>
          </div>
          <div className="bg-[var(--color-surface)] rounded-xl border border-white/5 shadow-md overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-black/20 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-medium">Date</th>
                  <th className="py-4 px-6 font-medium">Expéditeur</th>
                  <th className="py-4 px-6 font-medium">Sujet</th>
                  <th className="py-4 px-6 font-medium">Message</th>
                </tr>
              </thead>
              <tbody className="text-sm text-white/80 divide-y divide-white/5">
                {messages.map((msg, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white/50 whitespace-nowrap">
                      {msg.date ? new Date(msg.date).toLocaleString('fr-FR') : 'Date inconnue'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{msg.nom}</div>
                      <a href={`mailto:${msg.email}`} className="text-[var(--color-gold)] text-xs hover:underline">{msg.email}</a>
                    </td>
                    <td className="py-4 px-6 font-medium text-white/90">
                      {msg.sujet}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-white/70 line-clamp-3 text-xs leading-relaxed max-w-sm" title={msg.message}>
                        {msg.message}
                      </p>
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-white/50">Aucun message pour le moment.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
