import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, TrendingUp, TrendingDown, ChevronRight, Newspaper, Clock, ExternalLink } from 'lucide-react';
import { FinancialChart } from '../components/FinancialChart';
import { useRealTimePrice } from '../hooks/useRealTimePrice';
import { cn } from '../lib/utils';

const stockData = [
  { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 191.04, sector: 'Technology', expenseRatio: 0 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', basePrice: 425.34, sector: 'Technology', expenseRatio: 0 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 176.92, sector: 'Technology', expenseRatio: 0 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', basePrice: 947.80, sector: 'Technology', expenseRatio: 0 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', basePrice: 174.95, sector: 'Consumer Cyclical', expenseRatio: 0 },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', basePrice: 183.54, sector: 'Consumer Cyclical', expenseRatio: 0 },
  { symbol: 'META', name: 'Meta Platforms, Inc.', basePrice: 468.85, sector: 'Communication Services', expenseRatio: 0 },
  { symbol: 'LLY', name: 'Eli Lilly and Company', basePrice: 805.54, sector: 'Healthcare', expenseRatio: 0 },
  { symbol: 'AVGO', name: 'Broadcom Inc.', basePrice: 1395.25, sector: 'Technology', expenseRatio: 0 },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', basePrice: 405.20, sector: 'Financial Services', expenseRatio: 0 },
  { symbol: 'COST', name: 'Costco Wholesale Corp.', basePrice: 785.45, sector: 'Consumer Defensive', expenseRatio: 0 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', basePrice: 195.34, sector: 'Financial Services', expenseRatio: 0 },
  { symbol: 'V', name: 'Visa Inc.', basePrice: 275.43, sector: 'Financial Services', expenseRatio: 0 },
  { symbol: 'WMT', name: 'Walmart Inc.', basePrice: 64.25, sector: 'Consumer Defensive', expenseRatio: 0 },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', basePrice: 480.20, sector: 'Index ETF', expenseRatio: 0.03 },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', basePrice: 445.60, sector: 'Index ETF', expenseRatio: 0.20 },
  { symbol: 'ARKK', name: 'ARK Innovation ETF', basePrice: 45.30, sector: 'Innovation ETF', expenseRatio: 0.75 }
];

const mockStockNews: Record<string, { title: string, source: string, time: string }[]> = {
  'AAPL': [
    { title: "Apple explores household robots as its next big thing", source: "Bloomberg", time: "1h ago" },
    { title: "iPhone sales show resilience in China despite competition", source: "Reuters", time: "3h ago" },
    { title: "WWDC 2024: What to expect from Apple's AI push", source: "The Verge", time: "5h ago" },
    { title: "Apple Vision Pro production scale-down rumors", source: "Nikkei Asia", time: "8h ago" },
    { title: "EU antitrust regulators step up pressure on Apple", source: "Financial Times", time: "12h ago" }
  ],
  'NVDA': [
    { title: "NVIDIA dominates AI chip market with Blackwell launch", source: "Wall Street Journal", time: "30m ago" },
    { title: "AI compute demand outstripping supply, says Jensen Huang", source: "CNBC", time: "2h ago" },
    { title: "Competitors struggle to match NVIDIA's CUDA software moat", source: "TechCrunch", time: "4h ago" },
    { title: "NVIDIA expands venture capital reach into healthcare AI", source: "Forbes", time: "6h ago" },
    { title: "Stock analysts raise target price following earnings beat", source: "Morgan Stanley", time: "9h ago" }
  ],
  'TSLA': [
    { title: "Tesla announces shift to next-gen 'unboxed' production process", source: "Electrek", time: "45m ago" },
    { title: "Robotaxi unveiling set for August 8th, Musk confirms", source: "Twitter/X", time: "3h ago" },
    { title: "Giga Berlin production hits new milestones despite setbacks", source: "Automotive News", time: "6h ago" },
    { title: "FSD V12 roll-out across North America gains momentum", source: "Teslarati", time: "10h ago" },
    { title: "Impact of Chinese EV competition on Tesla margins", source: "South China Morning Post", time: "1d ago" }
  ],
  'GENERAL': [
    { title: "Federal Reserve hints at interest rate path for H2 2024", source: "Associated Press", time: "1h ago" },
    { title: "Global markets rally as tech sector earnings impress", source: "MarketWatch", time: "2h ago" },
    { title: "S&P 500 hits fresh record highs on AI optimism", source: "Business Insider", time: "4h ago" },
    { title: "Commodity prices reflect cooling global inflation", source: "The Economist", time: "7h ago" },
    { title: "Institutional investors increase allocation to emerging markets", source: "Goldman Sachs", time: "11h ago" }
  ]
};

const StockNewsSection = ({ symbol }: { symbol: string }) => {
  const news = mockStockNews[symbol] || mockStockNews['GENERAL'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-card border border-gray-800 rounded-3xl overflow-hidden shadow-2xl transition-colors duration-300"
    >
      <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-brand-bg/50">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-widest italic flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-indigo-400" /> Recent Intelligence: {symbol}
          </h3>
          <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-bold uppercase tracking-widest">Top 5 Trending</span>
      </div>
      <div className="divide-y divide-gray-800">
        {news.map((item, i) => (
          <div key={i} className="p-6 hover:bg-white/5 transition-colors group cursor-pointer flex items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{item.source}</span>
                <div className="flex items-center gap-1 text-[9px] font-bold text-gray-700 uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> {item.time}
                </div>
              </div>
              <h4 className="text-sm font-bold text-foreground group-hover:text-indigo-400 transition-colors uppercase tracking-tight leading-snug">
                {item.title}
              </h4>
            </div>
            <div className="p-3 rounded-xl bg-brand-bg border border-gray-800 text-gray-500 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const StockCard = ({ symbol, name, basePrice, isSelected, onClick, onDeepDive }: { 
  symbol: string, 
  name: string, 
  basePrice: number,
  isSelected?: boolean,
  onClick?: () => void,
  onDeepDive?: () => void
}) => {
  const { price, change, changePercent, history } = useRealTimePrice(basePrice, 0.0005, symbol);
  const isUp = change >= 0;

  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ y: -4 }}
      className={cn(
        "p-6 rounded-3xl bg-brand-card border transition-all cursor-pointer relative shadow-lg",
        isSelected ? "border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02] z-10" : "border-gray-800 hover:border-gray-700"
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-3">
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-gray-500 border border-gray-800 uppercase tracking-tighter">Stock</span>
          <h3 className="text-xl font-bold text-foreground tracking-tight">{symbol}</h3>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-foreground">${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-[11px] text-gray-500 border-b border-dotted border-gray-700 pb-0.5">{name}</p>
        <div className={cn(
          "flex items-center gap-1 text-[11px] font-bold font-mono",
          isUp ? "text-emerald-500" : "text-rose-500"
        )}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isUp ? '+' : ''}{change.toFixed(6)} ({changePercent.toFixed(7)}%)
        </div>
      </div>

      <div className="h-28 mb-4">
        <FinancialChart 
          symbol={symbol} 
          data={history} 
          height={112} 
          color={isUp ? "#10b981" : "#f43f5e"} 
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Market Status: Open</span>
        {isSelected && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDeepDive?.(); }}
            className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1 group hover:text-indigo-300 transition-colors"
          >
            Deep Dive <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

const StockDetail = ({ symbol, name, basePrice, onBack }: { symbol: string, name: string, basePrice: number, onBack: () => void }) => {
  const { price, change, changePercent, history } = useRealTimePrice(basePrice, 0.0005, symbol);
  const isUp = change >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-xl bg-brand-sidebar text-gray-400 hover:text-foreground hover:bg-white/5 transition-all outline-none border border-gray-800"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight italic">{name} ({symbol})</h1>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Real-time Performance Metrics & Institutional Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-brand-card border border-gray-800 shadow-2xl space-y-6 transition-colors">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-5xl font-mono font-bold text-foreground italic tracking-tighter">${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <div className={cn(
                  "flex items-center gap-2 text-sm font-bold mt-2 font-mono",
                  isUp ? "text-emerald-500" : "text-rose-500"
                )}>
                  {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {isUp ? '+' : ''}{change.toFixed(4)} ({changePercent.toFixed(2)}%) Today
                </div>
              </div>
              <div className="flex gap-2">
                {['1H', '1D', '1W', '1M', '1Y', 'ALL'].map(t => (
                  <button key={t} className={cn(
                    "px-3 py-1 rounded text-[10px] font-bold transition-all",
                    t === '1D' ? "bg-indigo-600 text-white" : "bg-brand-bg text-gray-500 hover:text-foreground border border-gray-800"
                  )}>{t}</button>
                ))}
              </div>
            </div>

            <div className="h-[400px] bg-black/5 dark:bg-black/20 rounded-2xl p-4 border border-gray-800/30 transition-colors">
              <FinancialChart symbol={symbol} data={history} color={isUp ? "#10b981" : "#f43f5e"} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: 'Open', v: (basePrice * 0.99).toFixed(2) },
               { l: 'High', v: (basePrice * 1.02).toFixed(2) },
               { l: 'Low', v: (basePrice * 0.98).toFixed(2) },
               { l: 'Volume', v: '42.1M' },
               { l: 'Mkt Cap', v: '2.8T' },
               { l: 'P/E Ratio', v: '28.4' },
               { l: '52W High', v: (basePrice * 1.4).toFixed(2) },
               { l: '52W Low', v: (basePrice * 0.6).toFixed(2) }
             ].map((item, i) => (
               <div key={i} className="p-4 rounded-2xl bg-brand-card border border-gray-800 shadow-sm transition-colors">
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{item.l}</p>
                 <p className="text-sm font-bold text-foreground font-mono">{item.v}</p>
               </div>
             ))}
          </div>
        </div>

        <div className="space-y-6">
           <div className="p-8 rounded-3xl bg-brand-card border border-gray-800 shadow-xl space-y-6 transition-colors">
             <h3 className="text-xs font-bold text-foreground uppercase tracking-widest italic border-b border-gray-800 pb-4">Institutional Rating</h3>
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-600 flex items-center justify-center">
                   <span className="text-xl font-bold text-foreground italic">A+</span>
                </div>
                <div>
                   <p className="text-sm font-bold text-foreground">Strong Buy</p>
                   <p className="text-[10px] text-gray-500 font-medium">85% Analyst Consensus</p>
                </div>
             </div>
             <p className="text-xs text-muted leading-relaxed italic">"Fundamentals remain exceptionally strong with projected 15% revenue growth in the next fiscal year driven by AI integration..."</p>
           </div>

           <div className="p-8 rounded-3xl brand-gradient border border-gray-800 shadow-xl space-y-4">
             <h3 className="text-xs font-bold text-foreground uppercase tracking-widest italic">Price Targets</h3>
             <div className="space-y-3">
               {[
                 { b: 'GS', t: '$345', v: 'Overweight' },
                 { b: 'MS', t: '$310', v: 'Equal-weight' },
                 { b: 'JPM', t: '$380', v: 'Buy' }
               ].map((bank, i) => (
                 <div key={i} className="flex justify-between items-center text-xs">
                   <span className="text-gray-500 font-bold">{bank.b}</span>
                   <span className="text-foreground font-mono font-bold">{bank.t}</span>
                   <span className="text-[10px] px-2 py-0.5 bg-white/5 dark:bg-gray-800 rounded font-bold text-gray-400">{bank.v}</span>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Stocks: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [viewDetail, setViewDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [maxExpenseRatio, setMaxExpenseRatio] = useState<number | 'Any'>('Any');

  const sectors = ['All Sectors', ...new Set(stockData.map(s => s.sector))];
  const expenseRatios = ['Any', 0.05, 0.1, 0.2, 0.5, 1.0];

  const filteredStocks = stockData.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'All Sectors' || stock.sector === selectedSector;
    const matchesExpense = maxExpenseRatio === 'Any' || stock.expenseRatio <= (maxExpenseRatio as number);
    
    return matchesSearch && matchesSector && matchesExpense;
  });

  const selectedStock = stockData.find(s => s.symbol === selectedSymbol) || stockData[0];

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
      {!viewDetail ? (
        <div className="space-y-12">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-indigo-500 rounded-full" />
                <h1 className="text-5xl font-serif italic font-bold text-foreground tracking-tight">Stocks</h1>
              </div>
              <p className="text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase pl-4">High-fidelity listing & performance metrics.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative group w-full md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  placeholder="Filter stocks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-card border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-xs text-foreground focus:outline-none focus:border-indigo-500/50 transition-all shadow-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <select 
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="bg-brand-card border border-gray-800 rounded-xl py-3.5 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 cursor-pointer appearance-none min-w-[140px]"
                >
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select 
                  value={maxExpenseRatio}
                  onChange={(e) => setMaxExpenseRatio(e.target.value === 'Any' ? 'Any' : parseFloat(e.target.value))}
                  className="bg-brand-card border border-gray-800 rounded-xl py-3.5 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 cursor-pointer appearance-none min-w-[140px]"
                >
                  <option value="Any">Any Exp. Ratio</option>
                  {expenseRatios.filter(e => e !== 'Any').map(r => <option key={r} value={r}>Max {r}%</option>)}
                </select>

                <button className="p-3.5 bg-brand-card border border-gray-800 rounded-xl text-gray-500 hover:text-foreground hover:border-gray-700 transition-all group">
                  <SlidersHorizontal className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <StockCard 
                  key={stock.symbol}
                  {...stock}
                  basePrice={stock.basePrice}
                  isSelected={selectedSymbol === stock.symbol}
                  onClick={() => setSelectedSymbol(stock.symbol)}
                  onDeepDive={() => setViewDetail(true)}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <p className="text-gray-500 font-serif italic text-xl">No assets found matching your criteria</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSector('All Sectors');
                    setMaxExpenseRatio('Any');
                  }}
                  className="text-xs font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

          {filteredStocks.length > 0 && <StockNewsSection symbol={selectedSymbol} />}
        </div>
      ) : (
        <StockDetail 
          {...selectedStock} 
          basePrice={selectedStock.basePrice} 
          onBack={() => setViewDetail(false)} 
        />
      )}
    </div>
  );
};

