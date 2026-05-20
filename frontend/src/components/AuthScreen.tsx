'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../locales/dictionary';
import { Sparkles, ShoppingBag, Eye, EyeOff } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register, language } = useApp();
  const t = translations[language];

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'Customer' | 'ShopOwner'>('Customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Shop details if owner registers
  const [shopName, setShopName] = useState('');
  const [shopDesc, setShopDesc] = useState('');
  const [shopPhone, setShopPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isLogin) {
      // For demo, we allow logging in as SuperAdmin if email is admin@luxe.com
      const actualRole = email.toLowerCase() === 'admin@luxe.com' ? 'SuperAdmin' : role;
      const successLogin = login(email, actualRole);
      if (!successLogin) {
        setError('Invalid credentials for selected role. Please check and try again.');
      }
    } else {
      if (role === 'ShopOwner' && !shopName) {
        setError('Boutique name is required for Shop Owners.');
        return;
      }
      
      const successReg = register(name, email, role, role === 'ShopOwner' ? {
        shopName,
        description: shopDesc,
        contactPhone: shopPhone,
        categories: ['Women', 'Men', 'Accessories'],
        deliveryAvailability: true
      } : null);

      if (successReg) {
        setSuccess('Registration successful! Logging in...');
        setTimeout(() => {
          login(email, role);
        }, 1000);
      } else {
        setError('Email already registered.');
      }
    }
  };

  const triggerQuickLogin = (demoEmail: string, demoRole: string) => {
    setError('');
    login(demoEmail, demoRole);
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-lg space-y-8 glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl" />

        <div className="text-center relative z-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-gold shadow-lg dark:bg-zinc-800">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase font-sans">
            {isLogin ? t.login : t.register}
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {t.tagline}
          </p>
        </div>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-2xl bg-red-50 dark:bg-red-950/30 dark:text-red-300 border border-red-200 dark:border-red-900/50">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 mb-4 text-sm text-green-800 rounded-2xl bg-green-50 dark:bg-green-950/30 dark:text-green-300 border border-green-200 dark:border-green-900/50">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('Customer')}
              className={`py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                role === 'Customer'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-md'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
              }`}
            >
              {t.roleCustomer}
            </button>
            <button
              type="button"
              onClick={() => setRole('ShopOwner')}
              className={`py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                role === 'ShopOwner'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-md'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
              }`}
            >
              {t.roleShopOwner}
            </button>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-inner"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. customer@luxe.com"
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-inner"
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Shop specific fields for owner registration */}
            {!isLogin && role === 'ShopOwner' && (
              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                  <Sparkles className="h-4 w-4" /> Boutique Details
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Boutique Name *</label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Majestic Threads"
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    value={shopDesc}
                    onChange={(e) => setShopDesc(e.target.value)}
                    placeholder="Brief history, specialized fabric, themes..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-inner resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Contact Number</label>
                  <input
                    type="text"
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-inner"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl font-bold text-black dark:text-black uppercase tracking-wider transition-all duration-300 shadow-lg cursor-pointer bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-600 hover:shadow-amber-500/20 active:scale-95"
            >
              {isLogin ? t.login : t.register}
            </button>
          </div>
        </form>

        <div className="text-center relative z-10 pt-2">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400 transition-colors"
          >
            {isLogin ? "New to Luxe? Register a Boutique or Buyer Account" : "Already registered? Return to Login"}
          </button>
        </div>

        {/* Demo Fast Access Credentials */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 space-y-3 relative z-10">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-zinc-400">
            Developer Fast-Access Credentials
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => triggerQuickLogin('customer@luxe.com', 'Customer')}
              className="py-2.5 px-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-[11px] font-bold rounded-xl text-zinc-700 dark:text-zinc-300 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer flex flex-col items-center justify-center"
            >
              <span className="text-base mb-0.5">🛍️</span>
              <span>{t.roleCustomer}</span>
            </button>
            <button
              onClick={() => triggerQuickLogin('owner1@luxe.com', 'ShopOwner')}
              className="py-2.5 px-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-[11px] font-bold rounded-xl text-zinc-700 dark:text-zinc-300 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer flex flex-col items-center justify-center"
            >
              <span className="text-base mb-0.5">✨</span>
              <span>{t.roleShopOwner}</span>
            </button>
            <button
              onClick={() => triggerQuickLogin('admin@luxe.com', 'SuperAdmin')}
              className="py-2.5 px-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-[11px] font-bold rounded-xl text-zinc-700 dark:text-zinc-300 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer flex flex-col items-center justify-center"
            >
              <span className="text-base mb-0.5">⚜️</span>
              <span>{t.roleSuperAdmin}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
