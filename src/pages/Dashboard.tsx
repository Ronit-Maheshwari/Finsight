import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Shield, 
  Globe, 
  Award, 
  Activity, 
  PieChart, 
  Zap, 
  Search, 
  Bell, 
  Target, 
  Cpu, 
  ChevronRight,
  Sparkles,
  RefreshCcw,
  BarChart3
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { FinancialChart } from '../components/FinancialChart';
import { useRealTimePrice } from '../hooks/useRealTimePrice';
import { cn } from '../lib/utils';
import { getSmartInsights, MarketInsight } from '../services/geminiService';

const StatCard = ({ title, value, change, trend, basePrice, symbol, icon: Icon }: { title: string, value: string, change: string, trend: 'up' | 'down', basePrice: number, symbol: string, icon: any }) => {
  const { price, changePercent } = useRealTimePrice(basePrice, 0.001, symbol);
  const isUp = changePercent >= 0;
  
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-5 bg-brand-card border border-gray-800 rounded-2xl hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden shadow-lg"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-all" />
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
          isUp ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-right">
           <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full",
            isUp ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
          )}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isUp ? '+' : ''}{changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-foreground tracking-tighter">${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
    </motion.div>
  );
};

const MarketTicker = () => {
  const symbols = ['BTC/USD', 'ETH/USD', 'AAPL', 'NVDA', 'TSLA', 'AMZN', 'JPY/USD', 'GC=F'];
  return (
    <div className="w-full bg-brand-bg border-y border-gray-800/50 py-2.5 overflow-hidden whitespace-nowrap transition-colors">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="inline-flex gap-12"
      >
        {[...symbols, ...symbols, ...symbols].map((s, i) => (
          <div key={i} className="flex items-center gap-2 group cursor-pointer">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-foreground transition-colors">{s}</span>
            <span className="text-[10px] font-mono font-bold text-emerald-400">+{(Math.random() * 2).toFixed(2)}%</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const SentimentGauge = () => {
  const [sentiment, setSentiment] = useState(68); // 0 to 100 (Bear to Bull)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSentiment(prev => {
        const delta = (Math.random() - 0.5) * 5;
        return Math.min(Math.max(prev + delta, 20), 90);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-brand-card border border-gray-800 space-y-6 shadow-lg">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Market Sentiment</h4>
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
          sentiment > 60 ? "bg-emerald-500/10 text-emerald-500" : sentiment < 40 ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
        )}>
          {sentiment > 60 ? 'Bullish' : sentiment < 40 ? 'Bearish' : 'Neutral'}
        </span>
      </div>
      
      <div className="relative pt-8 pb-4">
        <div className="h-2 w-full bg-gray-900/10 rounded-full flex overflow-hidden border border-gray-800">
          <div className="h-full bg-rose-500 w-1/3 opacity-50" />
          <div className="h-full bg-amber-500 w-1/3 opacity-50" />
          <div className="h-full bg-emerald-500 w-1/3 opacity-50" />
        </div>
        <motion.div 
          animate={{ left: `${sentiment}%` }}
          transition={{ type: "spring", stiffness: 100 }}
          className="absolute top-6 -ml-px w-0.5 h-6 bg-foreground overflow-visible flex flex-col items-center"
        >
          <div className="w-2 h-2 bg-foreground rounded-full -mt-1 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
           <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Fear/Greed</p>
           <p className="text-sm font-bold text-foreground uppercase italic">{sentiment > 70 ? 'Extreme Greed' : sentiment > 50 ? 'Greed' : 'Fear'}</p>
        </div>
        <div className="text-center">
           <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">AI Conviction</p>
           <p className="text-sm font-bold text-emerald-500 uppercase italic">Strong Buy</p>
        </div>
      </div>
    </div>
  );
};

const SmartInsight = ({ text, category }: { text: string, category: string }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-gray-800">
    <div className="w-1.5 h-10 bg-indigo-500/20 rounded-full flex flex-col justify-end overflow-hidden group-hover:bg-indigo-500/40 transition-colors">
       <div className="w-full bg-indigo-500 h-1/2" />
    </div>
    <div>
      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">{category}</p>
      <p className="text-xs text-muted leading-relaxed font-medium group-hover:text-foreground transition-colors italic">"{text}"</p>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    
    const fetchInsights = async () => {
      try {
        const result = await getSmartInsights();
        setInsights(result);
      } catch (error) {
        console.error("Insights error:", error);
      } finally {
        setLoadingInsights(false);
      }
    };
    
    fetchInsights();
    return () => unsubscribe();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMarketIndex, setSelectedMarketIndex] = useState<{ symbol: string, name: string, price: number }>({
    symbol: '^GSPC',
    name: 'S&P 500',
    price: 5240.50
  });

  const { history: chartHistory } = useRealTimePrice(selectedMarketIndex.price, 0.001, selectedMarketIndex.symbol);
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio'>('market');

  const indices = [
    { symbol: '^GSPC', name: 'S&P 500 Index', price: 5240.50 },
    { symbol: '^IXIC', name: 'Nasdaq Composite', price: 16445.20 },
    { symbol: '^DJI', name: 'Dow Jones Industrial', price: 39592.15 },
    { symbol: '^RUT', name: 'Russell 2000', price: 2004.30 }
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search/${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.quotes && data.quotes.length > 0) {
        const topResult = data.quotes[0];
        // Fetch current price for this symbol to update the view
        const priceRes = await fetch(`/api/price/${encodeURIComponent(topResult.symbol)}`);
        const priceData = await priceRes.json();
        
        setSelectedMarketIndex({
          symbol: topResult.symbol,
          name: topResult.shortname || topResult.longname || topResult.symbol,
          price: priceData.price || 0
        });
        setSearchQuery('');
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-[1700px] mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <Cpu className="text-white w-6 h-6" />
             </div>
             <h1 className="text-4xl font-serif font-bold text-foreground tracking-tighter italic">Alpha Terminal</h1>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] pl-14">Cognitive Financial Intelligence Hub</p>
        </motion.div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative group hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              placeholder="Omni-search assets (AAPL, BTC, ^GSPC)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isSearching}
              className="bg-brand-card border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-xs text-foreground focus:outline-none focus:border-indigo-500/50 w-80 transition-all shadow-inner disabled:opacity-50"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <RefreshCcw className="w-3 h-3 text-indigo-500 animate-spin" />
              </div>
            )}
          </form>
          <button className="p-3 bg-brand-card border border-gray-800 rounded-xl text-gray-400 hover:text-foreground hover:border-gray-700 transition-all relative shadow-sm">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-brand-bg transition-colors" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-foreground italic tracking-tight">{user?.displayName || 'Guest User'}</p>
                <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{user ? 'Premium Tier' : 'Standard Access'}</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase italic overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  (user?.displayName?.[0] || 'G')
                )}
             </div>
          </div>
        </div>
      </div>

      <MarketTicker />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {indices.map((index) => (
          <motion.div 
            key={index.symbol}
            variants={itemVariants}
            onClick={() => setSelectedMarketIndex({ symbol: index.symbol, name: index.name, price: index.price })}
            className="cursor-pointer"
          >
            <div className={cn(
              "transition-all",
              selectedMarketIndex.symbol === index.symbol ? "ring-2 ring-indigo-500/50 rounded-2xl scale-[1.02]" : ""
            )}>
              <StatCard 
                title={index.name} 
                value={index.price.toString()} 
                change="+0.45%" 
                trend="up" 
                basePrice={index.price} 
                symbol={index.symbol}
                icon={Activity} 
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-8 space-y-6"
        >
          <div className="p-8 rounded-3xl bg-brand-card border border-gray-800 shadow-2xl relative overflow-hidden group transition-colors duration-300">
            <div className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-1 h-6 bg-indigo-500 rounded-full" />
                <h2 className="text-xl font-bold text-foreground tracking-tight italic">
                  Market Pulse: {selectedMarketIndex.name}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 font-mono">
                    <RefreshCcw className="w-3 h-3 animate-spin-slow" /> Real-time Index Feed
                 </div>
              </div>
            </div>

            <div className="h-[450px]">
               <FinancialChart key={selectedMarketIndex.symbol} symbol={selectedMarketIndex.symbol} data={chartHistory} color="#6366f1" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-800/50">
               {[
                 { l: 'Symbol', v: selectedMarketIndex.symbol },
                 { l: 'Volatility', v: '12.4%' },
                 { l: 'Index Weight', v: 'Macro' },
                 { l: 'Correlation', v: 'High' }
               ].map((s, i) => (
                 <div key={i}>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">{s.l}</p>
                    <p className="text-sm font-bold text-foreground font-mono italic">{s.v}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-8 rounded-3xl bg-brand-card border border-gray-800 space-y-6 shadow-lg">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] italic flex items-center gap-2">
                   <Target className="w-4 h-4 text-indigo-500" /> Smart Watchlist
                </h3>
                <div className="space-y-4">
                   {[
                     { s: 'AAPL', p: 192.53, c: '+1.24%', t: 1 },
                     { s: 'BTC', p: 66245.80, c: '+2.45%', t: 1 },
                     { s: 'GC=F', p: 2315.40, c: '-0.12%', t: 0 }
                   ].map((asset, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-black/40 border border-transparent hover:border-gray-800 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center font-bold text-xs group-hover:text-indigo-400 transition-colors uppercase italic">{asset.s[0]}</div>
                           <div>
                              <p className="text-xs font-bold text-foreground tracking-tight italic">{asset.s}</p>
                              <p className="text-[9px] text-gray-500 font-bold uppercase">Asset Grade A+</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-mono font-bold text-foreground">${asset.p.toLocaleString()}</p>
                           <p className={cn("text-[9px] font-bold font-mono", asset.t ? "text-emerald-400" : "text-rose-400")}>{asset.c}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <button className="w-full py-3 bg-brand-bg text-[10px] font-bold text-gray-500 uppercase tracking-widest rounded-xl hover:text-foreground hover:bg-white/5 transition-all outline-none border border-gray-800/50">Manage Watchlist</button>
             </div>

             <div className="p-8 rounded-3xl bg-brand-card border border-gray-800 space-y-6 shadow-lg">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] italic flex items-center gap-2">
                   <Sparkles className="text-indigo-500 w-4 h-4" /> Smart Insights
                </h3>
                <div className="space-y-4">
                    {loadingInsights ? (
                        [1,2,3].map(i => (
                            <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl" />
                        ))
                    ) : (
                        insights.map((insight, i) => (
                            <SmartInsight 
                                key={i}
                                category={insight.category} 
                                text={insight.text} 
                            />
                        ))
                    )}
                 </div>
             </div>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-4 space-y-6"
        >
          <SentimentGauge />

          <div className="p-8 rounded-3xl bg-brand-card border border-gray-800 space-y-8 shadow-2xl">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] italic flex items-center gap-2 border-b border-gray-800 pb-4">
              <BarChart3 className="w-4 h-4 text-indigo-500" /> Sector Weighting
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Cloud Infrastructure', value: 34.2, color: 'bg-indigo-500' },
                { label: 'Decentralized Finance', value: 18.5, color: 'bg-indigo-400' },
                { label: 'Semiconductors', value: 12.1, color: 'bg-indigo-300' },
                { label: 'Clean Energy', value: 10.4, color: 'bg-indigo-200' },
                { label: 'Others', value: 24.8, color: 'bg-gray-700' }
              ].map((sector, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                     <span className="text-gray-500">{sector.label}</span>
                     <span className="text-foreground">{sector.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/10 dark:bg-gray-900 rounded-full overflow-hidden">
                     <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${sector.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn("h-full", sector.color)} 
                     />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
