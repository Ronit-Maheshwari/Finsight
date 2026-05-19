import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, TrendingUp, TrendingDown, ChevronRight, Zap, Shield, Link, Coins, Activity } from 'lucide-react';
import { FinancialChart } from '../components/FinancialChart';
import { useRealTimePrice } from '../hooks/useRealTimePrice';
import { cn } from '../lib/utils';

const cryptoData = [
  { symbol: 'BTC', name: 'Bitcoin', basePrice: 66900.00, color: '#f7931a' },
  { symbol: 'ETH', name: 'Ethereum', basePrice: 3650.00, color: '#627eea' },
  { symbol: 'SOL', name: 'Solana', basePrice: 178.50, color: '#14f195' },
  { symbol: 'BNB', name: 'BNB', basePrice: 620.40, color: '#f3ba2f' },
  { symbol: 'XRP', name: 'XRP', basePrice: 0.5240, color: '#23292f' },
  { symbol: 'ADA', name: 'Cardano', basePrice: 0.4815, color: '#0033ad' },
  { symbol: 'DOGE', name: 'Dogecoin', basePrice: 0.1620, color: '#c2a633' },
  { symbol: 'TRX', name: 'TRON', basePrice: 0.1245, color: '#ef0027' },
  { symbol: 'DOT', name: 'Polkadot', basePrice: 7.20, color: '#e6007a' },
  { symbol: 'LTC', name: 'Litecoin', basePrice: 82.50, color: '#345d9d' },
  { symbol: 'NEAR', name: 'NEAR Protocol', basePrice: 8.10, color: '#000000' },
  { symbol: 'LINK', name: 'Chainlink', basePrice: 17.20, color: '#2a5ada' },
  { symbol: 'AVAX', name: 'Avalanche', basePrice: 38.50, color: '#e84142' }
];

const CryptoCard = ({ symbol, name, basePrice, color, isSelected, onClick, onDeepDive }: { 
  symbol: string, 
  name: string, 
  basePrice: number,
  color: string,
  isSelected?: boolean,
  onClick?: () => void,
  onDeepDive?: () => void
}) => {
  const { price, change, changePercent, history } = useRealTimePrice(basePrice, 0.003, symbol);
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
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] text-white font-bold" style={{ backgroundColor: color }}>
            {symbol[0]}
          </div>
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
          color={color} 
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Network Live</span>
        </div>
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

const CryptoDetail = ({ symbol, name, basePrice, color, onBack }: { symbol: string, name: string, basePrice: number, color: string, onBack: () => void }) => {
  const { price, change, changePercent, history } = useRealTimePrice(basePrice, 0.003, symbol);
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
          className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg text-white font-bold" style={{ backgroundColor: color }}>
            {symbol[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight italic">{name} ({symbol})</h1>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Decentralized Asset Valuation & On-Chain Intelligence</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-[#121217] border border-gray-800 shadow-2xl space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-5xl font-mono font-bold text-white italic tracking-tighter">${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <div className={cn(
                  "flex items-center gap-2 text-sm font-bold mt-2 font-mono",
                  isUp ? "text-emerald-500" : "text-rose-500"
                )}>
                  {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {isUp ? '+' : ''}{change.toFixed(4)} ({changePercent.toFixed(2)}%) Today
                </div>
              </div>
              <div className="flex gap-2">
                {['1H', '24H', '7D', '30D', '1Y', 'ALL'].map(t => (
                  <button key={t} className={cn(
                    "px-3 py-1 rounded text-[10px] font-bold transition-all",
                    t === '24H' ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-500 hover:text-white"
                  )}>{t}</button>
                ))}
              </div>
            </div>

            <div className="h-[400px] bg-black/20 rounded-2xl p-4 border border-gray-800/30">
              <FinancialChart symbol={symbol} data={history} color={color} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: 'Circ. Supply', v: '19.7M ' + symbol },
               { l: 'Max Supply', v: '21M ' + symbol },
               { l: 'Market Cap', v: '1.28T' },
               { l: 'Volume (24h)', v: '32.4B' },
               { l: 'Fully Diluted', v: '1.34T' },
               { l: 'Nodes Active', v: '15,420' },
               { l: 'ATH', v: '$73,737.94' },
               { l: 'ATL', v: '$67.81' }
             ].map((item, i) => (
               <div key={i} className="p-4 rounded-2xl bg-[#121217] border border-gray-800">
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{item.l}</p>
                 <p className="text-sm font-bold text-white font-mono">{item.v}</p>
               </div>
             ))}
          </div>
        </div>

        <div className="space-y-6">
           <div className="p-8 rounded-3xl bg-[#121217] border border-gray-800 shadow-xl space-y-6">
             <h3 className="text-xs font-bold text-white uppercase tracking-widest italic border-b border-gray-800 pb-4">Security Scrutiny</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Liquidity Score</span>
                    <span className="text-xs font-bold text-emerald-400">98/100</span>
                </div>
                <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[98%]" />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Centralization Risk</span>
                    <span className="text-xs font-bold text-indigo-400">Low</span>
                </div>
                <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[15%]" />
                </div>
             </div>
             <p className="text-xs text-gray-400 leading-relaxed italic pt-2">"On-chain analysis indicates significant institutional accumulation and low exchange reserve levels, suggesting strong bullish fundamental pressure."</p>
           </div>

           <div className="p-1 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl overflow-hidden">
                <div className="bg-[#0A0A0C] rounded-[23px] p-8 space-y-6">
                    <div className="flex items-center gap-4">
                        <Zap className="text-indigo-400 w-6 h-6" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest">Protocol Monitor</h4>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px]">
                            <span className="text-gray-500">Staking APY</span>
                            <span className="text-white font-bold">4.2%</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                            <span className="text-gray-500">Validator Count</span>
                            <span className="text-white font-bold">1,842</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                            <span className="text-gray-500">Emission Rate</span>
                            <span className="text-white font-bold">-0.12%</span>
                        </div>
                    </div>
                    <button className="w-full py-3 bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest rounded hover:bg-indigo-500 transition-all">Stake Assets</button>
                </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Crypto: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [viewDetail, setViewDetail] = useState(false);

  const selectedAsset = cryptoData.find(c => c.symbol === selectedSymbol) || cryptoData[0];

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
      {!viewDetail ? (
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-emerald-500 rounded-full" />
                <h1 className="text-5xl font-serif italic font-bold text-white tracking-tight">Crypto</h1>
              </div>
              <p className="text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase pl-4">Digital valuation & decentralized insights.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  placeholder="Filter assets..." 
                  className="w-full bg-[#121217] border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
              <button className="p-3.5 bg-[#121217] border border-gray-800 rounded-xl text-gray-500 hover:text-white hover:border-gray-700 transition-all">
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cryptoData.map((crypto) => (
              <CryptoCard 
                key={crypto.symbol}
                {...crypto}
                basePrice={crypto.basePrice}
                isSelected={selectedSymbol === crypto.symbol}
                onClick={() => setSelectedSymbol(crypto.symbol)}
                onDeepDive={() => setViewDetail(true)}
              />
            ))}
          </div>
        </div>
      ) : (
        <CryptoDetail 
          {...selectedAsset} 
          basePrice={selectedAsset.basePrice} 
          onBack={() => setViewDetail(false)} 
        />
      )}
    </div>
  );
};

