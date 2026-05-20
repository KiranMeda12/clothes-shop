'use client';

import React, { useState } from 'react';
import { useApp, Product } from '../context/AppContext';
import { translations } from '../locales/dictionary';
import { 
  TrendingUp, ShoppingBag, Package, Star, MessageSquare, Settings, 
  Plus, Edit, Trash, Check, X, ShieldAlert, Sparkles, Truck
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const {
    currentUser, shops, products, orders, reviews, language,
    updateOrderStatus, addProduct, updateProduct, deleteProduct, toggleReviewVisibility, updateShop
  } = useApp();

  const t = translations[language];

  // Active Tabs
  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders' | 'reviews' | 'settings'>('analytics');
  const [catFilter, setCatFilter] = useState<'All' | 'Women' | 'Men' | 'Kids' | 'Accessories'>('All');

  // Modals & Forms
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form values
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState<'Men' | 'Women' | 'Kids' | 'Accessories'>('Women');
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L']);
  const [colors, setColors] = useState<string[]>(['Obsidian Black', 'Cream Alabaster']);
  const [imageUrl, setImageUrl] = useState('');

  // Find owner's shop
  const myShop = shops.find(s => s.ownerId === currentUser?.id);

  // Filter products for this shop
  const myProducts = products.filter(p => p.shopId === myShop?.id);

  // Filter orders for this shop
  const myOrders = orders.filter(o => o.shopId === myShop?.id);

  // Filter reviews for this shop
  const myReviews = reviews.filter(r => r.shopId === myShop?.id);

  // Calculate stats
  const totalSalesRevenue = myOrders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrdersCount = myOrders.filter(o => o.orderStatus === 'Processing').length;

  // Chart data calculation (mock sales trend)
  const salesData = [
    { day: 'Mon', sales: 120 },
    { day: 'Tue', sales: 340 },
    { day: 'Wed', sales: 290 },
    { day: 'Thu', sales: myOrders.length > 0 ? 590 : 150 },
    { day: 'Fri', sales: totalSalesRevenue > 0 ? totalSalesRevenue * 0.4 : 400 },
    { day: 'Sat', sales: totalSalesRevenue > 0 ? totalSalesRevenue * 0.5 : 680 },
    { day: 'Sun', sales: totalSalesRevenue > 0 ? totalSalesRevenue * 0.2 : 220 },
  ];
  const maxSalesVal = Math.max(...salesData.map(d => d.sales), 100);

  const openAddModal = () => {
    setTitle('');
    setDesc('');
    setPrice(100);
    setDiscount(0);
    setStock(20);
    setCategory(catFilter !== 'All' ? catFilter : 'Women');
    setSizes(['S', 'M', 'L']);
    setColors(['Ivory', 'Obsidian Black']);
    setImageUrl('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80');
    setIsAddModalOpen(true);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myShop) return;

    addProduct({
      shopId: myShop.id,
      title,
      description: desc,
      price: parseFloat(String(price)),
      discount: parseFloat(String(discount)),
      stock: parseInt(String(stock)),
      category,
      sizes,
      colors,
      images: [imageUrl || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80']
    });

    setIsAddModalOpen(false);
    alert('Product added to boutique catalogue!');
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setDesc(product.description);
    setPrice(product.price);
    setDiscount(product.discount);
    setStock(product.stock);
    setCategory(product.category);
    setSizes(product.sizes);
    setColors(product.colors);
    setImageUrl(product.images[0]);
    setIsEditModalOpen(true);
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      title,
      description: desc,
      price: parseFloat(String(price)),
      discount: parseFloat(String(discount)),
      stock: parseInt(String(stock)),
      category,
      sizes,
      colors,
      images: [imageUrl]
    });

    setIsEditModalOpen(false);
    setEditingProduct(null);
    alert('Product updated successfully!');
  };

  const handleShopSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myShop) return;

    const form = e.target as HTMLFormElement;
    const nameVal = (form.elements.namedItem('shopName') as HTMLInputElement).value;
    const descVal = (form.elements.namedItem('shopDesc') as HTMLTextAreaElement).value;
    const addrVal = (form.elements.namedItem('shopAddr') as HTMLInputElement).value;
    const phoneVal = (form.elements.namedItem('shopPhone') as HTMLInputElement).value;
    const emailVal = (form.elements.namedItem('shopEmail') as HTMLInputElement).value;
    const bannerVal = (form.elements.namedItem('shopBanner') as HTMLInputElement).value;
    const deliveryVal = (form.elements.namedItem('shopDelivery') as HTMLInputElement).checked;

    updateShop(myShop.id, {
      shopName: nameVal,
      description: descVal,
      address: addrVal,
      contactPhone: phoneVal,
      contactEmail: emailVal,
      shopBanner: bannerVal,
      deliveryAvailability: deliveryVal
    });

    alert('Boutique profile configuration saved!');
  };

  if (!myShop) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center glass-panel rounded-3xl space-y-6">
        <ShieldAlert className="h-14 w-14 text-red-500 mx-auto animate-bounce" />
        <h3 className="text-xl font-bold uppercase tracking-widest">No Registered Boutique Detected</h3>
        <p className="text-zinc-500 text-sm">
          Please logout and register a new account selecting the **Shop Owner** role to create your boutique.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Shop Owner Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-zinc-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 border border-zinc-800">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15" style={{ backgroundImage: `url('${myShop.shopBanner}')` }} />
        <div className="relative z-10 space-y-2 flex-1 text-center sm:text-left">
          <span className="px-2.5 py-1 bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider rounded-md">
            {myShop.isApproved ? 'Active Boutique' : 'Awaiting Approval'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-gold">
            {myShop.shopName} {t.ownerDashboard}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium">
            Manage your boutique identity, full collection, sales sheets, and review controls.
          </p>
        </div>

        {/* Dynamic status indicators */}
        <div className="flex gap-4 relative z-10">
          <div className="text-center bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
            <span className="block text-amber-500 text-sm font-bold">★ {myShop.ratings || 'N/A'}</span>
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Rating</span>
          </div>
          <div className="text-center bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
            <span className="block text-white text-sm font-bold">{myShop.followersCount}</span>
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Followers</span>
          </div>
        </div>
      </div>

      {/* Merchant Admin Dashboard controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl space-y-4 shadow-sm border border-zinc-200 dark:border-zinc-800/80 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-150 dark:border-zinc-800/80 pb-2">
            Merchant Desk
          </h3>
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
              }`}
            >
              <TrendingUp className="h-4.5 w-4.5" /> <span>Sales Analytics</span>
            </button>
            
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
              }`}
            >
              <Package className="h-4.5 w-4.5" /> <span>Catalogue ({myProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
              }`}
            >
              <ShoppingBag className="h-4.5 w-4.5" /> <span>Orders Desk ({pendingOrdersCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
              }`}
            >
              <MessageSquare className="h-4.5 w-4.5" /> <span>Feed Moderation</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
              }`}
            >
              <Settings className="h-4.5 w-4.5" /> <span>Boutique Profile</span>
            </button>
          </nav>
        </div>

        {/* Content Shell */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* ================= ANALYTICS TAB ================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 bg-green-500/10 text-green-500 rounded-2xl">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Total Revenue</span>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white">₹{totalSalesRevenue.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-2xl">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Received Orders</span>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white">{myOrders.length}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 bg-blue-500/10 text-blue-500 rounded-2xl">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Active Catalogue</span>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white">{myProducts.length}</span>
                  </div>
                </div>
              </div>

              {/* Graphic Chart (Interactive SVG Bars) */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">Weekly Sales Dynamics</h3>
                
                {/* SVG graph */}
                <div className="h-64 flex items-end justify-between gap-2 pt-6">
                  {salesData.map(d => {
                    const percent = (d.sales / maxSalesVal) * 100;
                    return (
                      <div key={d.day} className="flex-1 flex flex-col items-center gap-3 group relative cursor-pointer">
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-[calc(100%+8px)] hidden group-hover:block bg-zinc-950 text-white text-[10px] font-bold py-1 px-2 rounded-lg shadow-md z-15">
                          ₹{d.sales}
                        </div>

                        {/* Chart Column */}
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-xl h-44 flex items-end">
                          <div 
                            style={{ height: `${percent}%` }}
                            className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-xl transition-all duration-700 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{d.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= INVENTORY TAB ================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-white">Boutique Catalogue</h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    Category: {catFilter === 'All' ? 'All Departments' : `${catFilter} Collection`}
                  </p>
                </div>
                <button
                  onClick={openAddModal}
                  className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <Plus className="h-4 w-4" /> Add Product ({catFilter !== 'All' ? catFilter : 'Select'})
                </button>
              </div>

              {/* Quick Add by Department Section */}
              <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-150 dark:border-zinc-850 space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-amber-500">Quick Add by Department</h4>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Select a department below to directly add a product to that specific collection</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { cat: 'Women', icon: '👗', bg: 'hover:border-pink-500/30 hover:bg-pink-50/10 dark:hover:bg-pink-950/10', color: 'text-pink-500', desc: 'Dresses, sarees, tops' },
                    { cat: 'Men', icon: '👔', bg: 'hover:border-blue-500/30 hover:bg-blue-50/10 dark:hover:bg-blue-950/10', color: 'text-blue-500', desc: 'Shirts, suits, denim' },
                    { cat: 'Kids', icon: '🧸', bg: 'hover:border-green-500/30 hover:bg-green-50/10 dark:hover:bg-green-950/10', color: 'text-green-500', desc: 'Baby rompers, outfits' },
                    { cat: 'Accessories', icon: '💎', bg: 'hover:border-purple-500/30 hover:bg-purple-50/10 dark:hover:bg-purple-950/10', color: 'text-purple-500', desc: 'Bags, jewelry, belts' }
                  ].map(({ cat, icon, bg, color, desc }) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setTitle('');
                        setDesc('');
                        setPrice(100);
                        setDiscount(0);
                        setStock(20);
                        setCategory(cat as any);
                        setSizes(cat === 'Kids' ? ['0-3M', '3-6M', '6-12M'] : cat === 'Accessories' ? ['One Size'] : ['S', 'M', 'L']);
                        setColors(cat === 'Accessories' ? ['Gold', 'Silver'] : ['Ivory', 'Obsidian Black']);
                        
                        const defaultImages: Record<string, string> = {
                          Women: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
                          Men: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
                          Kids: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
                          Accessories: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
                        };
                        setImageUrl(defaultImages[cat]);
                        setIsAddModalOpen(true);
                      }}
                      className={`flex flex-col items-center justify-center p-4 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer ${bg}`}
                    >
                      <span className="text-3xl mb-2 filter drop-shadow-sm">{icon}</span>
                      <span className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Add {cat}</span>
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-1 line-clamp-1">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category-specific Catalogue Section Tabs */}
              <div className="flex gap-2 border-b border-zinc-150 dark:border-zinc-800 pb-3 overflow-x-auto">
                {(['All', 'Women', 'Men', 'Kids', 'Accessories'] as const).map(cat => {
                  const count = myProducts.filter(p => cat === 'All' || p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCatFilter(cat)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        catFilter === cat
                          ? 'bg-amber-500 text-black shadow'
                          : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-650 dark:text-zinc-300'
                      }`}
                    >
                      <span>
                        {cat === 'All' ? '📂 All' : cat === 'Women' ? '👗 Women' : cat === 'Men' ? '👔 Men' : cat === 'Kids' ? '🧸 Kids' : '💎 Accessories'}
                      </span>
                      <span className={`py-0.5 px-1.5 rounded-md text-[9px] font-black ${
                        catFilter === cat ? 'bg-black/25 text-black' : 'bg-zinc-250 dark:bg-zinc-900 text-zinc-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Product Inventory Table/List */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="divide-y divide-zinc-150 dark:divide-zinc-850">
                  {myProducts
                    .filter(p => catFilter === 'All' || p.category === catFilter)
                    .map(product => (
                      <div key={product.id} className="p-6 flex flex-wrap justify-between items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-950/20 transition-colors animate-fadeIn">
                        <div className="flex gap-4">
                          <img src={product.images[0]} alt={product.title} className="h-16 w-16 object-cover rounded-xl border border-zinc-200/60 dark:border-zinc-800" />
                          <div className="space-y-1">
                            <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-xs sm:text-sm">{product.title}</h4>
                            <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                              <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider">{product.category}</span>
                              <span className="text-zinc-400">Stock: {product.stock} items</span>
                              <span className="text-zinc-400">Price: ₹{product.price}</span>
                              {product.discount > 0 && <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded">{product.discount}% Discount</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to remove this product from the inventory?')) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl cursor-pointer"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                  {myProducts.filter(p => catFilter === 'All' || p.category === catFilter).length === 0 && (
                    <div className="text-center py-20 text-zinc-400">
                      <Package className="h-12 w-12 mx-auto mb-4 text-zinc-300 animate-pulse" />
                      <p className="text-base font-medium">No items uploaded in the "{catFilter}" section yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= ORDERS DESK ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Pending & Shipped Orders</h3>

              <div className="space-y-6">
                {myOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex flex-wrap justify-between items-center border-b border-zinc-150 dark:border-zinc-800 pb-3 gap-4 text-xs font-bold">
                      <div className="space-y-0.5">
                        <span className="text-zinc-400">ORDER REF</span>
                        <span className="block text-zinc-900 dark:text-white uppercase font-extrabold">#{order.id}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-zinc-400">BUYER DETAILS</span>
                        <span className="block text-zinc-700 dark:text-zinc-300 font-bold">{order.customerName}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-zinc-400">TOTAL AMOUNT</span>
                        <span className="block text-amber-500 font-black">₹{order.totalAmount}</span>
                      </div>

                      {/* Dropdown status update changer */}
                      <div className="flex items-center gap-2">
                        <Truck className="h-4.5 w-4.5 text-amber-500" />
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="py-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-bold text-xs"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="text-xs text-zinc-400 leading-relaxed font-medium bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                      🚚 <strong className="text-zinc-600 dark:text-zinc-300 uppercase tracking-widest font-black text-[9px] mr-1">Shipping Address:</strong> 
                      {order.shippingAddress}
                    </div>

                    {/* Product List */}
                    <div className="space-y-3">
                      {order.products.map(p => (
                        <div key={p.productId} className="flex gap-3 text-xs">
                          <img src={p.image} alt={p.title} className="h-10 w-10 object-cover rounded-lg border border-zinc-150 dark:border-zinc-800" />
                          <div>
                            <h5 className="font-bold text-zinc-950 dark:text-white uppercase tracking-wider">{p.title}</h5>
                            <div className="flex gap-2 text-[10px] text-zinc-400 font-bold">
                              <span>Qty: {p.quantity}</span>
                              <span>Size: {p.size}</span>
                              <span>Color: {p.color}</span>
                              <span>Price: ₹{p.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {myOrders.length === 0 && (
                  <div className="text-center py-20 text-zinc-400">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-zinc-300" />
                    <p className="text-base font-medium">No order placements recorded for your boutique yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= REVIEWS TAB ================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Customer Feed & Spam Moderation</h3>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm divide-y divide-zinc-150 dark:divide-zinc-850">
                {myReviews.map(review => (
                  <div key={review.id} className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white">{review.userName}</span>
                          <span className="text-amber-500 font-bold text-xs">{'★'.repeat(review.rating)}</span>
                        </div>
                        <p className={`text-xs sm:text-sm font-medium ${review.isHidden ? 'text-zinc-300 line-through dark:text-zinc-700' : 'text-zinc-500 dark:text-zinc-400'}`}>
                          {review.comment}
                        </p>
                      </div>
                      
                      {/* Moderate Spam Button */}
                      <button
                        onClick={() => toggleReviewVisibility(review.id)}
                        className={`py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer ${
                          review.isHidden 
                            ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                            : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                        }`}
                      >
                        {review.isHidden ? 'Recover review' : 'Hide spam'}
                      </button>
                    </div>

                    {review.isSpam && !review.isHidden && (
                      <div className="py-2 px-3 bg-amber-500/10 text-amber-500 font-bold text-[9px] uppercase tracking-widest rounded-lg w-fit border border-amber-500/20 flex items-center gap-1">
                        <ShieldAlert className="h-3.5 w-3.5" /> High likelihood of spam bot trigger
                      </div>
                    )}
                  </div>
                ))}

                {myReviews.length === 0 && (
                  <div className="text-center py-20 text-zinc-400">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-zinc-300 animate-pulse" />
                    <p className="text-base font-medium">Your boutique has not received any reviews yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= SETTINGS TAB ================= */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm animate-fadeIn">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">Configure Boutique Profile</h3>

              <form onSubmit={handleShopSettingsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Boutique Name *</label>
                    <input
                      type="text"
                      required
                      name="shopName"
                      defaultValue={myShop.shopName}
                      className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Contact Phone</label>
                    <input
                      type="text"
                      name="shopPhone"
                      defaultValue={myShop.contactPhone}
                      className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Boutique Description</label>
                  <textarea
                    rows={3}
                    name="shopDesc"
                    defaultValue={myShop.description}
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Boutique Email *</label>
                    <input
                      type="email"
                      required
                      name="shopEmail"
                      defaultValue={myShop.contactEmail}
                      className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Business Address</label>
                    <input
                      type="text"
                      name="shopAddr"
                      defaultValue={myShop.address}
                      className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Boutique Cover Banner URL</label>
                  <input
                    type="text"
                    name="shopBanner"
                    defaultValue={myShop.shopBanner}
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="shopDelivery"
                    name="shopDelivery"
                    defaultChecked={myShop.deliveryAvailability}
                    className="h-5 w-5 text-amber-500 border-zinc-300 rounded focus:ring-amber-500 focus:outline-none bg-zinc-50 dark:bg-zinc-950"
                  />
                  <label htmlFor="shopDelivery" className="text-xs font-bold text-zinc-600 dark:text-zinc-300 cursor-pointer">
                    Enable Express Worldwide Home Delivery
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-black text-white font-extrabold uppercase tracking-wider rounded-2xl cursor-pointer transition-all shadow-md active:scale-95"
                >
                  Save Configuration Profile
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* ================= ADD PRODUCT MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-850 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative z-10 space-y-6">
            <h3 className="text-lg font-black uppercase tracking-wider text-zinc-900 dark:text-white border-b border-zinc-150 dark:border-zinc-800 pb-3 flex items-center gap-1 text-gold">
              <Sparkles className="h-5 w-5" /> Catalogue New Addition
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Silk Evening Gown"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Fabric makeup, dynamic tailoring outlines, accents..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Stock Level *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase">Target Department Category *</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Women', 'Men', 'Kids', 'Accessories'] as const).map((cat) => {
                    const icon = cat === 'Women' ? '👗' : cat === 'Men' ? '👔' : cat === 'Kids' ? '🧸' : '💎';
                    const active = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setSizes(cat === 'Kids' ? ['0-3M', '3-6M', '6-12M'] : cat === 'Accessories' ? ['One Size'] : ['S', 'M', 'L']);
                          setColors(cat === 'Accessories' ? ['Gold', 'Silver'] : ['Ivory', 'Obsidian Black']);
                          
                          const defaultImages: Record<string, string> = {
                            Women: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
                            Men: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
                            Kids: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
                            Accessories: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
                          };
                          if (!imageUrl || Object.values(defaultImages).includes(imageUrl)) {
                            setImageUrl(defaultImages[cat]);
                          }
                        }}
                        className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          active
                            ? 'bg-amber-500 border-amber-600 text-black shadow font-extrabold scale-[1.02]'
                            : 'bg-zinc-50 border-zinc-200 dark:bg-zinc-950 dark:border-zinc-850 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 font-bold'
                        }`}
                      >
                        <span className="text-lg">{icon}</span>
                        <span className="text-[10px] tracking-wider uppercase">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-150 dark:border-zinc-800">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Create Item
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-3 px-6 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT PRODUCT MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs" onClick={() => setIsEditModalOpen(false)} />
          
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-850 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative z-10 space-y-6">
            <h3 className="text-lg font-black uppercase tracking-wider text-zinc-900 dark:text-white border-b border-zinc-150 dark:border-zinc-800 pb-3 flex items-center gap-1 text-gold">
              <Sparkles className="h-5 w-5" /> Edit Catalogue Item
            </h3>

            <form onSubmit={handleEditProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Stock Level *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase">Target Department Category *</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Women', 'Men', 'Kids', 'Accessories'] as const).map((cat) => {
                    const icon = cat === 'Women' ? '👗' : cat === 'Men' ? '👔' : cat === 'Kids' ? '🧸' : '💎';
                    const active = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setSizes(cat === 'Kids' ? ['0-3M', '3-6M', '6-12M'] : cat === 'Accessories' ? ['One Size'] : ['S', 'M', 'L']);
                          setColors(cat === 'Accessories' ? ['Gold', 'Silver'] : ['Ivory', 'Obsidian Black']);
                          
                          const defaultImages: Record<string, string> = {
                            Women: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
                            Men: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
                            Kids: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
                            Accessories: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
                          };
                          if (!imageUrl || Object.values(defaultImages).includes(imageUrl)) {
                            setImageUrl(defaultImages[cat]);
                          }
                        }}
                        className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          active
                            ? 'bg-amber-500 border-amber-600 text-black shadow font-extrabold scale-[1.02]'
                            : 'bg-zinc-50 border-zinc-200 dark:bg-zinc-950 dark:border-zinc-850 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 font-bold'
                        }`}
                      >
                        <span className="text-lg">{icon}</span>
                        <span className="text-[10px] tracking-wider uppercase">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-150 dark:border-zinc-800">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="py-3 px-6 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
