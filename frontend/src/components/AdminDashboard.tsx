'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../locales/dictionary';
import { 
  ShieldCheck, ShoppingBag, Users, Store, Award, 
  CheckCircle, AlertTriangle, Trash2, ShieldAlert, BadgeCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    shops, users, orders, language, currentUser,
    approveShop, suspendShop, deleteShop, deleteUser 
  } = useApp();

  const t = translations[language];

  // Active sub-panels
  const [adminTab, setAdminTab] = useState<'overview' | 'approvals' | 'ledger' | 'users'>('overview');

  // Filter pending approvals
  const pendingShops = shops.filter(s => !s.isApproved);

  // Filter approved shops
  const approvedShops = shops.filter(s => s.isApproved);

  // Calculate Platform wide metrics
  const totalPlatformRevenue = orders
    .filter(o => o.paymentStatus === 'Completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Super Admin Top Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-zinc-900 text-white p-6 sm:p-8 flex items-center justify-between gap-6 mb-8 border border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-600/5 to-transparent" />
        <div className="relative z-10 space-y-2">
          <span className="px-2.5 py-1 bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider rounded-md">
            Super Administrator Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-gold flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-amber-500" /> Platform Overseer Panel
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium">
            Monitor whole marketplace analytics, process boutique listings approvals, moderate merchants, and supervise platform directories.
          </p>
        </div>
      </div>

      {/* Admin Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl space-y-4 shadow-sm border border-zinc-200 dark:border-zinc-800/80 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-150 dark:border-zinc-800/80 pb-2">
            Administration
          </h3>
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setAdminTab('overview')}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                adminTab === 'overview'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
              }`}
            >
              <Users className="h-4.5 w-4.5" /> <span>Global Analytics</span>
            </button>
            
            <button
              onClick={() => setAdminTab('approvals')}
              className={`flex items-center justify-between py-3 px-4 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                adminTab === 'approvals'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
              }`}
            >
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-4.5 w-4.5" /> <span>Store approvals</span>
              </div>
              {pendingShops.length > 0 && (
                <span className="h-5 w-5 bg-red-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {pendingShops.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setAdminTab('ledger')}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                adminTab === 'ledger'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
              }`}
            >
              <Store className="h-4.5 w-4.5" /> <span>Merchant ledger</span>
            </button>

            <button
              onClick={() => setAdminTab('users')}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                adminTab === 'users'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-850'
              }`}
            >
              <Users className="h-4.5 w-4.5" /> <span>User directories</span>
            </button>
          </nav>
        </div>

        {/* Content Shell */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* ================= OVERVIEW TAB ================= */}
          {adminTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex items-center gap-3">
                  <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Platform Revenue</span>
                    <span className="text-xl font-black text-zinc-900 dark:text-white">₹{totalPlatformRevenue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex items-center gap-3">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Total Accounts</span>
                    <span className="text-xl font-black text-zinc-900 dark:text-white">{users.length}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Total Boutiques</span>
                    <span className="text-xl font-black text-zinc-900 dark:text-white">{shops.length}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex items-center gap-3">
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Global Orders</span>
                    <span className="text-xl font-black text-zinc-900 dark:text-white">{orders.length}</span>
                  </div>
                </div>
              </div>

              {/* Action alert box if pending shops exist */}
              {pendingShops.length > 0 && (
                <div className="p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-3xl flex items-center gap-3 text-xs font-bold animate-pulse">
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                  <span>
                    Notice: There are {pendingShops.length} boutique applications awaiting approval. Go to the "Store Approvals" tab to review.
                  </span>
                </div>
              )}

              {/* Recent Orders Overview */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Recent Marketplace Transactions</h3>
                <div className="divide-y divide-zinc-150 dark:divide-zinc-850">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="py-4 first:pt-0 last:pb-0 flex flex-wrap justify-between items-center text-xs gap-3">
                      <div className="space-y-0.5">
                        <strong className="text-zinc-900 dark:text-white uppercase font-extrabold">Order #{o.id}</strong>
                        <span className="block text-zinc-400">By {o.customerName}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-zinc-400">Boutique:</span>
                        <strong className="block text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">{o.shopName}</strong>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-zinc-400">Total:</span>
                        <strong className="block text-amber-500 font-black">₹{o.totalAmount}</strong>
                      </div>
                      <span className="py-1 px-2.5 bg-green-500/10 text-green-500 font-bold uppercase tracking-widest rounded-lg">
                        {o.orderStatus}
                      </span>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="text-center py-10 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                      No platform transactions processed yet.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ================= APPROVALS TAB ================= */}
          {adminTab === 'approvals' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Pending Store Registration Review Room</h3>

              <div className="space-y-6">
                {pendingShops.map(shop => (
                  <div key={shop.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col sm:flex-row border-l-4 border-l-amber-500">
                    <img src={shop.shopBanner} alt={shop.shopName} className="h-44 sm:h-auto sm:w-48 object-cover border-r border-zinc-150 dark:border-zinc-850" />
                    
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{shop.shopLogo}</span>
                          <h4 className="text-xl font-bold uppercase tracking-wider text-zinc-900 dark:text-white">{shop.shopName}</h4>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium">
                          {shop.description}
                        </p>
                        <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-1">
                          <span>📍 Location: {shop.address}</span>
                          <span>📞 Phone: {shop.contactPhone}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                          onClick={() => {
                            approveShop(shop.id);
                            alert(`Boutique "${shop.shopName}" was approved!`);
                          }}
                          className="py-2.5 px-4 bg-green-500 hover:bg-green-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow flex items-center gap-1"
                        >
                          <CheckCircle className="h-4 w-4" /> Approve Boutique
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Reject listing application for "${shop.shopName}"?`)) {
                              deleteShop(shop.id);
                            }
                          }}
                          className="py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                        >
                          Reject Application
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {pendingShops.length === 0 && (
                  <div className="text-center py-20 text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p className="text-base font-medium">Splendid! No boutique listings pending approval.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= MERCHANTS LEDGER ================= */}
          {adminTab === 'ledger' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Marketplace Boutiques Catalog Ledger</h3>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="divide-y divide-zinc-150 dark:divide-zinc-850">
                  {shops.map(shop => (
                    <div key={shop.id} className="p-6 flex flex-wrap justify-between items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-950/20 transition-colors">
                      <div className="flex gap-4">
                        <span className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-xl border border-zinc-250 dark:border-zinc-700">
                          {shop.shopLogo}
                        </span>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-xs sm:text-sm">{shop.shopName}</h4>
                          <div className="flex flex-wrap gap-3 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                            <span>Rating: ★{shop.ratings || 'New'}</span>
                            <span>Followers: {shop.followersCount}</span>
                            <span className={shop.isSuspended ? 'text-red-500 font-black' : shop.isApproved ? 'text-green-500 font-black' : 'text-amber-500 font-black'}>
                              {shop.isSuspended ? '🛑 Suspended' : shop.isApproved ? '✅ Active' : '⌛ Pending Approval'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {shop.isApproved && (
                          <button
                            onClick={() => {
                              suspendShop(shop.id);
                              alert(`Boutique "${shop.shopName}" status was toggled.`);
                            }}
                            className={`py-2 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors cursor-pointer ${
                              shop.isSuspended 
                                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                                : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                            }`}
                          >
                            {shop.isSuspended ? 'Reinstate Boutique' : 'Suspend Boutique'}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm(`Remove boutique "${shop.shopName}" from the platform entirely?`)) {
                              deleteShop(shop.id);
                            }
                          }}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl cursor-pointer"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= USER DIRECTORIES ================= */}
          {adminTab === 'users' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Registered platform directory accounts</h3>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="divide-y divide-zinc-150 dark:divide-zinc-850">
                  {users.map(user => (
                    <div key={user.id} className="p-6 flex justify-between items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-950/20 transition-colors">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <strong className="text-zinc-900 dark:text-white uppercase font-extrabold text-sm">{user.name}</strong>
                          <span className={`py-0.5 px-2 font-black uppercase tracking-wider rounded text-[9px] ${
                            user.role === 'SuperAdmin' 
                              ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                              : user.role === 'ShopOwner' 
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <span className="block text-zinc-400 font-bold">{user.email}</span>
                      </div>
                      
                      {currentUser?.id !== user.id && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove user "${user.name}"? This will delete their account and cascadingly remove any shops and inventory they own.`)) {
                              deleteUser(user.id);
                              alert(`User "${user.name}" has been successfully removed.`);
                            }
                          }}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl cursor-pointer transition-colors active:scale-95 duration-150"
                          title="Remove User"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
