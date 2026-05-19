import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, TrendingUp, TrendingDown, ChevronRight, Landmark, PieChart, Shield, Activity, BarChart3 } from 'lucide-react';
import { FinancialChart } from '../components/FinancialChart';
import { useRealTimePrice } from '../hooks/useRealTimePrice';
import { cn } from '../lib/utils';

const fundData = [
  { symbol: 'VFIAX', name: 'Vanguard 500 Index Fund', basePrice: 485.45, category: 'Large Blend', expenseRatio: '0.04%' },
  { symbol: 'VTSAX', name: 'Vanguard Total Stock Market', basePrice: 125.32, category: 'Large Blend', expenseRatio: '0.04%' },
  { symbol: 'VIGAX', name: 'Vanguard Growth Index Fund', basePrice: 168.90, category: 'Large Growth', expenseRatio: '0.05%' },
  { symbol: 'FXAIX', name: 'Fidelity 500 Index Fund', basePrice: 182.34, category: 'Large Blend', expenseRatio: '0.015%' },
  { symbol: 'SWTSX', name: 'Schwab Total Stock Market', basePrice: 88.54, category: 'Large Blend', expenseRatio: '0.03%' },
  { symbol: 'VIIIX', name: 'Vanguard Instl Index Fund', basePrice: 425.60, category: 'Large Blend', expenseRatio: '0.02%' },
  { symbol: 'VWUSX', name: 'Vanguard US Growth Fund', basePrice: 58.20, category: 'Large Growth', expenseRatio: '0.38%' },
  { symbol: 'VBTLX', name: 'Vanguard Total Bond Market', basePrice: 9.45, category: 'Intermediate Core Bond', expenseRatio: '0.05%' },
  { symbol: 'VEXAX', name: 'Vanguard Extended Market', basePrice: 112.30, category: 'Mid-Cap Blend', expenseRatio: '0.06%' },
  { symbol: 'VTIAX', name: 'Vanguard Total Intl Stock', basePrice: 31.85, category: 'Foreign Large Blend', expenseRatio: '0.11%' }
];

const FundCard = ({ symbol, name, basePrice, category, expenseRatio, isSelected, onClick, onDeepDive }: { 
  symbol: string, 
  name: string, 
  basePrice: number,
  category: string,
  expenseRatio: string,
  isSelected?: boolean,
  onClick?: () => void,
  onDeepDive?: () => void
}) => {
  const { price, change, changePercent, history } = useRealTimePrice(basePrice, 0.0002, symbol); // Lowest volatility for funds
  const isUp = change >= 0;

  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ y: -4 }}
      className={cn(
        "p-6 rounded-3xl bg-brand-card border transition-all cursor-pointer relative shadow-lg",
        isSelected ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.02] z-10" : "border-gray-800 hover:border-gray-700"
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-3">
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-gray-500 border border-gray-800 uppercase tracking-tighter">Mutual Fund</span>
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
          {isUp ? '+' : ''}{change.toFixed(4)} ({changePercent.toFixed(4)}%)
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
        <div className="flex flex-col">
            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Cat: {category}</span>
            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Exp: {expenseRatio}</span>
        </div>
        {isSelected && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDeepDive?.(); }}
            className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1 group hover:text-emerald-300 transition-colors"
          >
            Deep Dive <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

const FundDetail = ({ symbol, name, basePrice, category, expenseRatio, onBack }: { 
  symbol: string, 
  name: string, 
  basePrice: number, 
  category: string, 
  expenseRatio: string,
  onBack: () => void 
}) => {
  const { price, change, changePercent, history } = useRealTimePrice(basePrice, 0.0002, symbol);
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
          className="p-2 rounded-xl bg-brand-sidebar text-gray-400 hover:text-foreground hover:bg-white/5 transition-all border border-gray-800"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight italic">{name} ({symbol})</h1>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Institutional Asset Grade • Passive Index Tracking</p>
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
                {['1M', '3M', '6M', 'YTD', '1Y', '5Y', 'MAX'].map(t => (
                  <button key={t} className={cn(
                    "px-3 py-1 rounded text-[10px] font-bold transition-all",
                    t === 'YTD' ? "bg-emerald-600 text-white" : "bg-brand-bg text-gray-500 hover:text-foreground border border-gray-800"
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
               { l: 'Expense Ratio', v: expenseRatio },
               { l: 'Turnover Rate', v: '4%' },
               { l: 'Total Assets', v: '1.2T' },
               { l: 'Min Investment', v: '$3,000' },
               { l: 'Cat. Rank', v: 'Top 5%' },
               { l: 'Morningstar', v: '★★★★★' },
               { l: 'Beta (3Y)', v: '1.00' },
               { l: 'Sharpe Ratio', v: '0.85' }
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
             <h3 className="text-xs font-bold text-foreground uppercase tracking-widest italic border-b border-gray-800 pb-4">Top Holdings</h3>
             <div className="space-y-4">
                {[
                  { n: 'Apple Inc.', s: '7.2%', p: 72 },
                  { n: 'Microsoft Corp.', s: '6.8%', p: 68 },
                  { n: 'NVIDIA Corp.', s: '5.1%', p: 51 },
                  { n: 'Amazon.com', s: '3.9%', p: 39 },
                  { n: 'Meta Platforms', s: '2.4%', p: 24 }
                ].map((holding, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span className="text-gray-400">{holding.n}</span>
                      <span className="text-foreground">{holding.s}</span>
                    </div>
                    <div className="h-1 w-full bg-brand-bg rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${holding.p}%` }} />
                    </div>
                  </div>
                ))}
             </div>
           </div>

           <div className="p-8 rounded-3xl brand-gradient border border-gray-800 shadow-xl space-y-6 text-center">
             <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
               <Shield className="text-emerald-400 w-8 h-8" />
             </div>
             <div>
               <h4 className="text-sm font-bold text-white uppercase tracking-widest italic">Alpha Analysis</h4>
               <p className="text-[10px] text-gray-400 leading-relaxed mt-2 italic">Institutional correlation reports and macro exposure scoring for your mutual fund portfolio.</p>
             </div>
             <button className="w-full py-3 bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest rounded hover:bg-emerald-500 transition-all shadow-xl">Apply Filter</button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export const MutualFunds: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('VFIAX');
  const [viewDetail, setViewDetail] = useState(false);

  const selectedFund = fundData.find(f => f.symbol === selectedSymbol) || fundData[0];

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
      {!viewDetail ? (
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-emerald-500 rounded-full" />
                <h1 className="text-5xl font-serif italic font-bold text-foreground tracking-tight">Mutual Funds</h1>
              </div>
              <p className="text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase pl-4">Diversified institutional asset tracking.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  placeholder="Filter funds..." 
                  className="w-full bg-brand-card border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-xs text-foreground focus:outline-none focus:border-indigo-500/50 transition-all transition-colors duration-300"
                />
              </div>
              <button className="p-3.5 bg-brand-card border border-gray-800 rounded-xl text-gray-500 hover:text-foreground hover:border-gray-700 transition-all transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fundData.map((fund) => (
              <FundCard 
                key={fund.symbol}
                {...fund}
                isSelected={selectedSymbol === fund.symbol}
                onClick={() => setSelectedSymbol(fund.symbol)}
                onDeepDive={() => setViewDetail(true)}
              />
            ))}
          </div>
        </div>
      ) : (
        <FundDetail 
          {...selectedFund} 
          onBack={() => setViewDetail(false)} 
        />
      )}
    </div>
  );
};
