'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { translations, Language } from '../locales/dictionary';
import { AuthScreen } from '../components/AuthScreen';
import { CustomerView } from '../components/CustomerView';
import { OwnerDashboard } from '../components/OwnerDashboard';
import { AdminDashboard } from '../components/AdminDashboard';
import { Sun, Moon, LogOut, Sparkles, Languages, User } from 'lucide-react';

export default function Home() {
  const { currentUser, language, darkMode, logout, updateUserPreferences } = useApp();
  const t = translations[language];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUserPreferences(e.target.value as Language, darkMode);
  };

  const handleThemeToggle = () => {
    updateUserPreferences(language, !darkMode);
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Premium Luxury Header Nav */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="h-10 w-10 bg-zinc-900 text-gold rounded-full flex items-center justify-center font-extrabold text-lg shadow border border-zinc-800">
              ⚜️
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-widest text-zinc-900 dark:text-white uppercase font-sans flex items-center gap-1.5">
                {t.appName}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-amber-500 font-black">
                {t.tagline}
              </span>
            </div>
          </div>

          {/* Configuration controls */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Multi language switcher */}
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
              <Languages className="h-4.5 w-4.5 text-amber-500" />
              <select
                value={language}
                onChange={handleLanguageChange}
                className="py-1 px-2.5 text-xs font-bold bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="en" className="dark:bg-zinc-900">English</option>
                <option value="hi" className="dark:bg-zinc-900">हिन्दी (Hindi)</option>
                <option value="ta" className="dark:bg-zinc-900">தமிழ் (Tamil)</option>
                <option value="kn" className="dark:bg-zinc-900">ಕನ್ನಡ (Kannada)</option>
                <option value="te" className="dark:bg-zinc-900">తెలుగు (Telugu)</option>
              </select>
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-150 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-zinc-700" />}
            </button>

            {/* User Session details if logged in */}
            {currentUser && (
              <div className="flex items-center gap-3 sm:gap-4 border-l border-zinc-200 dark:border-zinc-800 pl-4 sm:pl-6">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">{currentUser.name}</span>
                  <span className="text-[9px] uppercase tracking-widest text-amber-500 font-black">{currentUser.role}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">{t.logout}</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* Main Core View Shell */}
      <main className="flex-grow bg-zinc-50 dark:bg-black transition-colors duration-300">
        {!currentUser ? (
          <AuthScreen />
        ) : (
          <>
            {currentUser.role === 'Customer' && <CustomerView />}
            {currentUser.role === 'ShopOwner' && <OwnerDashboard />}
            {currentUser.role === 'SuperAdmin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Luxury Footer */}
      <footer className="w-full py-8 border-t border-zinc-200/50 dark:border-zinc-850 bg-white dark:bg-zinc-950 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center items-center gap-1.5 font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            <span>⚜️ {t.appName} ⚜️</span>
          </div>
          <p className="max-w-md mx-auto leading-relaxed">
            A state-of-the-art multi-vendor fashion hub showcasing tailor-made couture, luxury fits, and dynamic boutique customizers.
          </p>
          <div className="pt-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Luxe Fashion Group. All Rights Reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
