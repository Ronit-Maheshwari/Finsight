import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Briefcase, 
  Atom, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Menu,
  X,
  PieChart,
  Repeat,
  Newspaper,
  Landmark,
  Sun,
  Moon,
  Flame
} from 'lucide-react';
import { auth, signInWithGoogle, logout } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

export const Layout: React.FC<{ children: React.ReactNode; activeTab: string; setActiveTab: (tab: string) => void }> = ({ 
  children, 
  activeTab, 
  setActiveTab 
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stocks', label: 'Stocks', icon: TrendingUp },
    { id: 'crypto', label: 'Crypto', icon: PieChart },
    { id: 'mutual-funds', label: 'Mutual Funds', icon: Landmark },
    { id: 'forex', label: 'Forex', icon: Repeat },
    { id: 'commodities', label: 'Commodities', icon: Flame },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'stocky', label: 'Stocky AI', icon: Atom },
    { id: 'portfolio', label: 'My Portfolio', icon: Briefcase },
  ];

  return (
    <div className="flex h-screen bg-brand-bg text-gray-200 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="hidden md:flex flex-col border-r border-gray-800 bg-brand-sidebar z-30 transition-colors duration-300"
      >
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded-sm flex items-center justify-center shrink-0">
              <TrendingUp className="text-black w-4 h-4" />
            </div>
            {isSidebarOpen && (
              <span className="text-2xl font-bold tracking-tighter text-foreground italic">FINSIGHT</span>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
                activeTab === item.id 
                  ? "bg-gray-800 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-emerald-500" : "group-hover:text-emerald-400")} />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-gray-800 mt-4">
          <button 
            onClick={toggleTheme}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
              "text-gray-400 hover:text-foreground hover:bg-white/5"
            )}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            {isSidebarOpen && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {user ? (
            <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
              <img src={user.photoURL || ''} className="w-8 h-8 rounded-full border border-gray-700" alt="profile" referrerPolicy="no-referrer" />
              {isSidebarOpen && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-medium text-white truncate">{user.displayName}</p>
                  <button onClick={logout} className="text-[10px] text-gray-500 hover:text-rose-400 flex items-center gap-1">
                    <LogOut className="w-3 h-3" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className={cn(
                "flex items-center gap-2 text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors",
                !isSidebarOpen && "justify-center"
              )}
            >
              <User className="w-5 h-5" />
              {isSidebarOpen && <span>Sign In</span>}
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 border-b border-gray-800 bg-brand-bg flex items-center justify-between px-8 z-20 transition-colors duration-300">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:block text-gray-500 hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-500 hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                placeholder="Search stocks, funds..." 
                className="bg-brand-card border border-gray-800 rounded-full py-1.5 pl-9 pr-4 text-xs w-64 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-foreground"
              />
            </div>
            <button className="text-gray-500 hover:text-foreground relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-card border border-gray-800 hidden sm:block overflow-hidden relative">
               {user && user.photoURL && <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-brand-bg transition-colors duration-300">
          {children}
        </div>
      </main>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed inset-0 bg-[#0d0f14] z-50 md:hidden p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-white">FinSight</span>
              <button onClick={() => setIsMobileMenuOpen(false)}><X /></button>
            </div>
            <nav className="space-y-4">
               {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-4 rounded-xl text-lg",
                    activeTab === item.id ? "bg-blue-600/10 text-blue-500" : "text-gray-400"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
