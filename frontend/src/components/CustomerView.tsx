'use client';

import React, { useState } from 'react';
import { useApp, Product, Shop } from '../context/AppContext';
import { translations } from '../locales/dictionary';
import { 
  Search, Star, ChevronLeft, ShoppingCart, X, Plus, Minus, Check, 
  MapPin, Phone, Mail, Award, Clock, ArrowRight, Tag, Heart, MessageSquare
} from 'lucide-react';

export const CustomerView: React.FC = () => {
  const {
    shops, products, orders, cart, followedShops, selectedShopId, language, reviews,
    selectShop, followShop, addToCart, removeFromCart, updateCartQuantity, checkout, addReview
  } = useApp();

  const t = translations[language];

  // Search & Filtering
  const [shopSearch, setShopSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [shopCategoryFilter, setShopCategoryFilter] = useState<string>('All');

  // UI Tabs & Toggles
  const [activeTab, setActiveTab] = useState<'browse' | 'orders'>('browse');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Detail Modal Selections
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);

  // Review Submissions
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Checkout states
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [shipPhone, setShipPhone] = useState('');
  const [shipLandmark, setShipLandmark] = useState('');
  const [shipStreetAddress, setShipStreetAddress] = useState('');
  const [shipPincode, setShipPincode] = useState('');
  const [shipAltPhone, setShipAltPhone] = useState('');
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(false);

  // Get active shop
  const activeShop = shops.find(s => s.id === selectedShopId && s.isApproved && !s.isSuspended);

  // Filter approved & active shops
  const filteredShops = shops.filter(s => {
    if (!s.isApproved || s.isSuspended) return false;
    const matchesSearch = s.shopName.toLowerCase().includes(shopSearch.toLowerCase()) || 
                          s.description.toLowerCase().includes(shopSearch.toLowerCase());
    const matchesCategory = shopCategoryFilter === 'All' || s.categories.includes(shopCategoryFilter);
    return matchesSearch && matchesCategory;
  });

  // Filter products in selected shop
  const activeShopProducts = products.filter(p => {
    if (p.shopId !== selectedShopId) return false;
    const matchesSearch = p.title.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.description.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate cart metrics
  const cartSubtotal = cart.reduce((acc, item) => {
    const discPrice = item.product.price * (1 - item.product.discount / 100);
    return acc + (discPrice * item.quantity);
  }, 0);
  const cartDiscount = appliedDiscount ? cartSubtotal * 0.2 : 0;
  const cartTotal = cartSubtotal - cartDiscount;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipStreetAddress || !shipPhone || !shipPincode) {
      alert('Please fill in all required fields.');
      return;
    }
    const combinedAddress = [
      `Address: ${shipStreetAddress}`,
      `Landmark: ${shipLandmark || 'N/A'}`,
      `Pincode: ${shipPincode}`,
      `Phone: ${shipPhone}`,
      `Alt Phone: ${shipAltPhone || 'N/A'}`
    ].join(' | ');

    checkout(combinedAddress, appliedDiscount ? 'LUCKY20' : undefined);
    setIsCheckoutMode(false);
    setIsCartOpen(false);
    setActiveTab('orders');
    alert('Thank you for your purchase! Your order is being processed.');

    // Clear checkout fields
    setShipStreetAddress('');
    setShipLandmark('');
    setShipPincode('');
    setShipPhone('');
    setShipAltPhone('');
  };

  const handleReviewSubmit = (e: React.FormEvent, productId: string, shopId: string) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview(productId, shopId, reviewRating, reviewComment);
    setReviewComment('');
    setReviewRating(5);
    alert('Thank you! Your feedback has been recorded.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      
      {/* Navigation Tabs */}
      <div className="flex justify-between items-center mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`text-lg font-bold pb-4 -mb-4 border-b-2 transition-all ${
              activeTab === 'browse'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {t.selectShop}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`text-lg font-bold pb-4 -mb-4 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {t.orders} ({orders.length})
          </button>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 py-2 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white transition-all cursor-pointer relative shadow-md"
        >
          <ShoppingCart className="h-5 w-5 text-gold" />
          <span className="font-bold text-sm">{t.cart} ({cart.length})</span>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-amber-500 text-black font-extrabold text-[10px] rounded-full flex items-center justify-center animate-bounce shadow">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* ================= BROWSE TAB ================= */}
      {activeTab === 'browse' && (
        <>
          {/* 1. NO SHOP SELECTED -> SHOW HALL OF BOUTIQUES */}
          {!selectedShopId ? (
            <div className="space-y-12">
              
              {/* Premium Luxury Banners Carousel Mock */}
              <div className="relative h-[380px] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-start px-8 sm:px-16 text-white">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 hover:scale-[1.03]" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1500&q=80')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="relative z-10 max-w-xl space-y-6">
                  <span className="px-3 py-1 bg-amber-500 text-black text-xs font-black tracking-widest uppercase rounded-full">
                    Exclusive Marketplace
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight uppercase font-sans">
                    The Grand <span className="text-amber-400">Boutique</span> Hall
                  </h1>
                  <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
                    Step inside customized high-fashion stores. Each designer boutique features tailor-made silk cuts, modern street contours, and handcrafted luxury accessories.
                  </p>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-300 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <Award className="h-4 w-4 text-amber-400" /> 100% Authentic Apparel
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-zinc-300 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <Clock className="h-4 w-4 text-amber-400" /> Worldwide Luxury Express
                    </span>
                  </div>
                </div>
              </div>

              {/* Shop Filtering controls */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900/60 p-4 rounded-2xl glass-panel shadow-sm">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-zinc-400" />
                  <input
                    type="text"
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                    placeholder={t.searchShops}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pt-2 md:pt-0">
                  {['All', 'Women', 'Men', 'Kids', 'Accessories'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setShopCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        shopCategoryFilter === cat
                          ? 'bg-amber-500 text-black shadow'
                          : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Boutique shops */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredShops.map(shop => {
                  const isFollowing = followedShops.includes(shop.id);
                  return (
                    <div 
                      key={shop.id} 
                      className="group relative overflow-hidden bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1"
                    >
                      {/* Shop Banner header */}
                      <div className="relative h-44 w-full overflow-hidden">
                        <img 
                          src={shop.shopBanner} 
                          alt={shop.shopName} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <span className="absolute top-4 left-4 h-12 w-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-zinc-200/50 dark:border-zinc-700">
                          {shop.shopLogo}
                        </span>
                        
                        {/* Favorite Heart action */}
                        <button
                          onClick={() => followShop(shop.id)}
                          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white cursor-pointer transition-colors shadow"
                        >
                          <Heart className={`h-5 w-5 ${isFollowing ? 'fill-amber-500 text-amber-500' : 'text-white'}`} />
                        </button>
                      </div>

                      {/* Shop Details */}
                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                              {shop.shopName}
                            </h3>
                            <div className="flex items-center gap-1 text-amber-500 text-sm font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-lg">
                              <Star className="h-4 w-4 fill-amber-500" />
                              <span>{shop.ratings || 'New'}</span>
                            </div>
                          </div>
                          <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                            {shop.description}
                          </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                          {/* Details details */}
                          <div className="flex flex-wrap gap-1.5">
                            {shop.categories.map(cat => (
                              <span key={cat} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-300">
                                {cat}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span>👥 {shop.followersCount} Followers</span>
                            <span>🚚 {shop.deliveryAvailability ? 'Delivery Available' : 'Store Pickup Only'}</span>
                          </div>

                          {/* Dynamic Action button */}
                          <button
                            onClick={() => selectShop(shop.id)}
                            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1"
                          >
                            <span>Step Inside Boutique</span>
                            <ArrowRight className="h-4 w-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            
            // 2. SHOP IS SELECTED -> SHOW BOUTIQUE PRODUCTS & STYLING
            <div className="space-y-8">
              
              {/* Return link */}
              <button
                onClick={() => selectShop(null)}
                className="flex items-center gap-1.5 text-sm font-bold text-amber-500 hover:text-amber-600 cursor-pointer transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Return to Grand Hall</span>
              </button>

              {/* Boutique Premium Profile Banner */}
              {activeShop && (
                <div className="relative rounded-3xl overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="h-60 w-full relative">
                    <img 
                      src={activeShop.shopBanner} 
                      alt={activeShop.shopName} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  </div>
                  
                  {/* Shop Floating Details */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-white">
                    <div className="flex gap-4 items-start">
                      <span className="h-16 w-16 bg-white dark:bg-zinc-900 rounded-3xl flex items-center justify-center text-3xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800">
                        {activeShop.shopLogo}
                      </span>
                      <div className="space-y-1.5">
                        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white flex items-center gap-2">
                          {activeShop.shopName}
                        </h2>
                        <p className="text-zinc-300 text-xs sm:text-sm max-w-xl leading-relaxed line-clamp-2">
                          {activeShop.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                      <div className="text-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                        <div className="text-lg font-bold text-amber-400">{activeShop.ratings || 'New'} ⭐</div>
                        <div className="text-[10px] text-zinc-300 uppercase tracking-widest font-black">Boutique rating</div>
                      </div>
                      <div className="text-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                        <div className="text-lg font-bold text-white">{activeShop.followersCount}</div>
                        <div className="text-[10px] text-zinc-300 uppercase tracking-widest font-black">Followers</div>
                      </div>
                      
                      <button
                        onClick={() => followShop(activeShop.id)}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          followedShops.includes(activeShop.id)
                            ? 'bg-amber-500 text-black hover:bg-amber-600 shadow'
                            : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        {followedShops.includes(activeShop.id) ? t.following : t.follow}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Shop contact & address panel */}
              {activeShop && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-zinc-900/60 p-4 rounded-2xl glass-panel shadow-sm text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-amber-500" />
                    <span>{activeShop.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-amber-500" />
                    <span>{activeShop.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-amber-500" />
                    <span>{activeShop.contactEmail}</span>
                  </div>
                </div>
              )}

              {/* Products search and filter category bar */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900/60 p-4 rounded-2xl glass-panel shadow-sm">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-zinc-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder={t.searchProducts}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pt-2 md:pt-0">
                  {['All', 'Women', 'Men', 'Kids', 'Accessories'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-amber-500 text-black shadow'
                          : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Boutique Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeShopProducts.map(product => {
                  const finalPrice = product.price * (1 - product.discount / 100);
                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        setSelectedSize(product.sizes[0] || 'One Size');
                        setSelectedColor(product.colors[0] || 'Default');
                        setQty(1);
                      }}
                      className="group bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer"
                    >
                      <div className="h-64 w-full bg-zinc-100 dark:bg-zinc-950 relative overflow-hidden">
                        <img 
                          src={product.images[0]} 
                          alt={product.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {product.discount > 0 && (
                          <span className="absolute top-4 left-4 py-1 px-2.5 bg-red-500 text-white text-[10px] font-black tracking-wider uppercase rounded-lg shadow-md flex items-center gap-0.5">
                            <Tag className="h-3 w-3" /> Save {product.discount}%
                          </span>
                        )}
                        <span className="absolute bottom-4 right-4 py-0.5 px-2 bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold rounded-lg flex items-center gap-0.5 border border-white/10">
                          ★ {product.ratings || 'New'}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h4 className="text-zinc-900 dark:text-white font-bold uppercase tracking-wider line-clamp-1 group-hover:text-amber-500 transition-colors text-sm">
                            {product.title}
                          </h4>
                          <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                          <div className="space-y-0.5">
                            {product.discount > 0 ? (
                              <div className="flex items-center gap-2">
                                <span className="text-base font-extrabold text-zinc-900 dark:text-white">₹{finalPrice.toFixed(2)}</span>
                                <span className="text-xs text-zinc-400 line-through">₹{product.price}</span>
                              </div>
                            ) : (
                              <span className="text-base font-extrabold text-zinc-900 dark:text-white">₹{product.price}</span>
                            )}
                            <span className="text-[10px] block text-zinc-400">
                              {product.stock > 0 ? `${product.stock} items remaining` : 'Out of Stock'}
                            </span>
                          </div>

                          <span className="py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest rounded-xl text-zinc-800 dark:text-zinc-200 transition-colors group-hover:bg-amber-500 group-hover:text-black">
                            Select Details
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeShopProducts.length === 0 && (
                <div className="text-center py-20 text-zinc-400">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-zinc-300" />
                  <p className="text-base font-medium">No items found matching your filters.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ================= ORDERS TAB ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-black uppercase tracking-widest text-zinc-900 dark:text-white">
            Your Orders Ledgers
          </h2>

          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-md overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-850 flex flex-wrap justify-between items-center gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-zinc-400 font-bold uppercase tracking-wider block">Order Reference</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white uppercase">#{order.id}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-400 font-bold uppercase tracking-wider block">Boutique</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white uppercase">{order.shopName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-400 font-bold uppercase tracking-wider block">Placed Date</span>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-400 font-bold uppercase tracking-wider block">Total Paid</span>
                  <span className="font-extrabold text-amber-500 text-sm">₹{order.totalAmount}</span>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="p-6 border-b border-zinc-150 dark:border-zinc-850">
                <div className="flex justify-between items-center max-w-md mx-auto">
                  {['Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                    const steps = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
                    const currentIdx = steps.indexOf(order.orderStatus);
                    const isCompleted = currentIdx >= idx && order.orderStatus !== 'Cancelled';
                    const isActive = currentIdx === idx;
                    
                    return (
                      <div key={step} className="flex flex-col items-center relative flex-1 last:flex-none">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                          isCompleted 
                            ? 'bg-amber-500 text-black' 
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                        }`}>
                          {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                        </div>
                        <span className={`mt-2 text-[10px] font-black uppercase tracking-wider ${
                          isActive ? 'text-amber-500' : 'text-zinc-400'
                        }`}>
                          {step}
                        </span>
                        
                        {idx < 2 && (
                          <div className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 ${
                            currentIdx > idx ? 'bg-amber-500' : 'bg-zinc-100 dark:bg-zinc-800'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                {order.orderStatus === 'Cancelled' && (
                  <div className="text-center py-2 font-bold text-xs text-red-500 uppercase tracking-widest mt-4">
                    ⚠️ This order was cancelled
                  </div>
                )}
              </div>

              {/* Products List & Review trigger */}
              <div className="divide-y divide-zinc-100 dark:divide-zinc-850 p-6">
                {order.products.map(p => (
                  <div key={p.productId} className="py-4 first:pt-0 last:pb-0 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex gap-4">
                      <img src={p.image} alt={p.title} className="h-16 w-16 object-cover rounded-xl border border-zinc-200 dark:border-zinc-800" />
                      <div className="space-y-1">
                        <h5 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-xs sm:text-sm">{p.title}</h5>
                        <div className="flex gap-3 text-[10px] text-zinc-400 font-bold">
                          <span>Size: {p.size}</span>
                          <span>Color: {p.color}</span>
                          <span>Qty: {p.quantity}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Add Review Panel if order status is Delivered */}
                    {order.orderStatus === 'Delivered' && (
                      <form 
                        onSubmit={(e) => handleReviewSubmit(e, p.productId, order.shopId)}
                        className="w-full sm:w-auto p-4 bg-zinc-50 dark:bg-zinc-850 rounded-2xl border border-zinc-150 dark:border-zinc-800 space-y-3"
                      >
                        <h6 className="text-[10px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" /> Rate & Review This Product
                        </h6>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="text-amber-500 cursor-pointer"
                            >
                              <Star className={`h-4 w-4 ${reviewRating >= star ? 'fill-amber-500' : ''}`} />
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Add your review here..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 bg-amber-500 text-black text-xs font-bold rounded-xl cursor-pointer hover:bg-amber-600 transition-colors"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-20 text-zinc-400">
              <Clock className="h-12 w-12 mx-auto mb-4 text-zinc-300" />
              <p className="text-base font-medium">No order placements recorded yet.</p>
            </div>
          )}
        </div>
      )}

      {/* ================= SIDE CART DRAWER ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between">
              
              {/* Header */}
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/60">
                <h3 className="text-lg font-black uppercase tracking-widest text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <ShoppingCart className="h-5 w-5 text-gold animate-pulse" /> {t.cart}
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-zinc-600 cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Middle Cart List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {!isCheckoutMode ? (
                  <>
                    {cart.map((item, idx) => {
                      const discPrice = item.product.price * (1 - item.product.discount / 100);
                      return (
                        <div key={idx} className="flex gap-4 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-850 relative group">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.title} 
                            className="h-20 w-20 object-cover rounded-xl border border-zinc-200 dark:border-zinc-800" 
                          />
                          <div className="flex-1 space-y-1">
                            <h4 className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider line-clamp-1">{item.product.title}</h4>
                            <div className="flex gap-2 text-[10px] text-zinc-400 font-bold">
                              <span>Size: {item.size}</span>
                              <span>Color: {item.color}</span>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                              <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg">
                                <button 
                                  onClick={() => updateCartQuantity(idx, Math.max(1, item.quantity - 1))}
                                  className="p-1 hover:bg-zinc-150 dark:hover:bg-zinc-850"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-2 text-xs font-bold">{item.quantity}</span>
                                <button 
                                  onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                                  className="p-1 hover:bg-zinc-150 dark:hover:bg-zinc-850"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="font-extrabold text-sm text-zinc-900 dark:text-white">
                                ₹{(discPrice * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <button 
                            onClick={() => removeFromCart(idx)}
                            className="absolute top-2 right-2 p-1 text-zinc-300 hover:text-red-500 cursor-pointer transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}

                    {cart.length === 0 && (
                      <div className="text-center py-20 text-zinc-400 space-y-4">
                        <ShoppingCart className="h-12 w-12 mx-auto text-zinc-300" />
                        <p className="font-medium text-zinc-500">Your luxury shopping cart is empty.</p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="py-2.5 px-5 bg-amber-500 text-black text-xs font-bold uppercase rounded-xl"
                        >
                          Continue Browsing
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  
                  // Checkout input form
                  <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                      Secure Luxury Checkout
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={shipPhone}
                          onChange={(e) => setShipPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-850 dark:text-zinc-200 shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Street Address *</label>
                        <textarea
                          required
                          rows={2}
                          value={shipStreetAddress}
                          onChange={(e) => setShipStreetAddress(e.target.value)}
                          placeholder="e.g. Flat 302, Royal Gardens, Heritage Lane"
                          className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none text-zinc-850 dark:text-zinc-200 shadow-inner"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Landmark</label>
                          <input
                            type="text"
                            value={shipLandmark}
                            onChange={(e) => setShipLandmark(e.target.value)}
                            placeholder="e.g. Near Rose Metro Station"
                            className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-850 dark:text-zinc-200 shadow-inner"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Pincode *</label>
                          <input
                            type="text"
                            required
                            value={shipPincode}
                            onChange={(e) => setShipPincode(e.target.value)}
                            placeholder="e.g. 110001"
                            className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-850 dark:text-zinc-200 shadow-inner"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Additional Phone Number</label>
                        <input
                          type="tel"
                          value={shipAltPhone}
                          onChange={(e) => setShipAltPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43211"
                          className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-850 dark:text-zinc-200 shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-zinc-400 uppercase">Simulated Payment Method</label>
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl text-xs font-bold flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-300">💎 Premium Cash on Delivery</span>
                        <span className="text-[10px] text-green-500 uppercase font-black">Pre-approved</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase tracking-wider rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-1 shadow-md"
                    >
                      <Check className="h-5 w-5" /> <span>{t.placeOrder}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsCheckoutMode(false)}
                      className="w-full text-center text-xs font-bold text-zinc-400 hover:text-zinc-600"
                    >
                      Return to Cart Items
                    </button>
                  </form>
                )}
              </div>

              {/* Footer Calculations */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4 bg-zinc-50 dark:bg-zinc-900/60">
                  
                  {/* Coupon section */}
                  {!isCheckoutMode && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="ENTER COUPON: LUCKY20"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs uppercase font-extrabold border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (coupon.toUpperCase() === 'LUCKY20') {
                            setAppliedDiscount(true);
                            alert('20% coupon applied successfully!');
                          } else {
                            alert('Invalid coupon code.');
                          }
                        }}
                        className="py-2 px-4 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-bold rounded-xl text-xs cursor-pointer"
                      >
                        {t.apply}
                      </button>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs text-zinc-500">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-bold text-zinc-800 dark:text-white">₹{cartSubtotal.toFixed(2)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between text-green-500 font-bold">
                        <span>Coupon (LUCKY20 -20%):</span>
                        <span>-₹{cartDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3 text-sm text-zinc-900 dark:text-white font-extrabold">
                      <span>{t.total}:</span>
                      <span className="text-amber-500">₹{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {!isCheckoutMode ? (
                    <button
                      onClick={() => setIsCheckoutMode(true)}
                      className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-black text-white font-extrabold uppercase tracking-wider rounded-2xl cursor-pointer transition-all shadow-md"
                    >
                      Proceed to Checkout
                    </button>
                  ) : null}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ================= PRODUCT DETAIL MODAL ================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs" onClick={() => setSelectedProduct(null)} />
          
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-850 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10 grid grid-cols-1 md:grid-cols-2">
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 z-20 p-2 bg-black/60 backdrop-blur-md rounded-full text-white cursor-pointer hover:bg-black/80"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Image Side */}
            <div className="h-80 md:h-full bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-850">
              <img 
                src={selectedProduct.images[0]} 
                alt={selectedProduct.title} 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Right Information Side */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Title & Reviews summary */}
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black tracking-widest uppercase rounded-md border border-amber-500/20 inline-block">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-zinc-900 dark:text-white leading-tight">
                    {selectedProduct.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 text-sm font-bold flex items-center gap-0.5">
                      ★ {selectedProduct.ratings || 'New'}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">({selectedProduct.reviewsCount} verified reviews)</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="space-y-1">
                  {selectedProduct.discount > 0 ? (
                    <div className="flex items-end gap-3">
                      <span className="text-2xl font-black text-zinc-900 dark:text-white">
                        ₹{(selectedProduct.price * (1 - selectedProduct.discount / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm text-zinc-400 line-through pb-0.5">₹{selectedProduct.price}</span>
                      <span className="text-xs text-red-500 font-bold pb-0.5">({selectedProduct.discount}% Off)</span>
                    </div>
                  ) : (
                    <span className="text-2xl font-black text-zinc-900 dark:text-white">₹{selectedProduct.price}</span>
                  )}
                  <span className="text-[10px] text-zinc-400 block font-semibold">
                    {selectedProduct.stock > 0 ? `In Stock: ${selectedProduct.stock} items remaining` : 'Out of Stock'}
                  </span>
                </div>

                <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Size selections */}
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Select Size</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-amber-500 text-black shadow font-black border border-amber-500'
                            : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Select Color</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          selectedColor === color
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow border border-zinc-900 dark:border-white'
                            : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity selection */}
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Quantity</label>
                  <div className="flex items-center border border-zinc-200 dark:border-zinc-850 rounded-xl w-32 bg-zinc-50 dark:bg-zinc-950">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-2 hover:bg-zinc-150 dark:hover:bg-zinc-850 flex-1 flex justify-center cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 text-sm font-extrabold text-zinc-900 dark:text-white">{qty}</span>
                    <button 
                      onClick={() => setQty(qty + 1)}
                      className="p-2 hover:bg-zinc-150 dark:hover:bg-zinc-850 flex-1 flex justify-center cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Add to cart CTA */}
              <div className="pt-6 border-t border-zinc-150 dark:border-zinc-850 flex flex-col gap-4">
                <button
                  disabled={selectedProduct.stock === 0}
                  onClick={() => {
                    addToCart(selectedProduct, selectedSize, selectedColor, qty);
                    setSelectedProduct(null);
                    alert('Added to your luxury cart!');
                  }}
                  className={`w-full py-4 text-black dark:text-black font-extrabold uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedProduct.stock > 0
                      ? 'bg-amber-500 hover:bg-amber-600 active:scale-95'
                      : 'bg-zinc-250 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>{selectedProduct.stock > 0 ? t.addToCart : t.outOfStock}</span>
                </button>

                {/* Reviews List */}
                <div className="space-y-4 pt-4 border-t border-zinc-150 dark:border-zinc-850">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Reviews & Feeds</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {reviews
                      .filter(r => r.productId === selectedProduct.id && !r.isHidden)
                      .map(rev => (
                        <div key={rev.id} className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-2xl space-y-1 text-xs">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-zinc-800 dark:text-zinc-200">{rev.userName}</span>
                            <span className="text-amber-500">{'★'.repeat(rev.rating)}</span>
                          </div>
                          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{rev.comment}</p>
                        </div>
                      ))}
                    {reviews.filter(r => r.productId === selectedProduct.id && !r.isHidden).length === 0 && (
                      <p className="text-center text-[10px] text-zinc-400 py-3 uppercase tracking-wider font-semibold">No reviews left for this product yet.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
