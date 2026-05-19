import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCcw, ArrowRightLeft, TrendingUp, AlertCircle, Repeat, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { FinancialChart } from '../components/FinancialChart';
import { useRealTimePrice } from '../hooks/useRealTimePrice';
import { cn } from '../lib/utils';

interface ExchangeRateProps {
    symbol: string;
    basePrice: number;
    trend: 'up' | 'down';
    change: string;
}

const LiveRateRow = ({ pair, isSelected, onClick }: { pair: ExchangeRateProps, isSelected: boolean, onClick: () => void }) => {
    const { price, changePercent } = useRealTimePrice(pair.basePrice, 0.0002, pair.symbol);
    const isUp = changePercent >= 0;

    return (
        <div 
            onClick={onClick}
            className={cn(
                "flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group",
                isSelected ? "bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/20" : "bg-brand-bg border-gray-800 hover:border-gray-700"
            )}
        >
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs italic transition-colors",
                    isSelected ? "bg-indigo-500 text-white" : "bg-brand-card border border-gray-800 text-indigo-400 group-hover:text-indigo-300"
                )}>
                    {pair.symbol.split('/')[0][0]}
                </div>
                <div>
                    <p className="text-sm font-bold text-foreground italic tracking-tight">{pair.symbol}</p>
                    <p className={cn("text-[10px] font-bold mt-0.5 flex items-center gap-1", isUp ? "text-emerald-400" : "text-rose-400")}>
                        {isUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                        {changePercent.toFixed(2)}%
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-lg font-mono font-bold text-foreground">{price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Interbank Rate</p>
            </div>
        </div>
    );
};

export const Forex: React.FC = () => {
    const [amount, setAmount] = useState('100');
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('PKR');
    
    const currencyPairs: ExchangeRateProps[] = [
        { symbol: 'USD / PKR', basePrice: 278.45, trend: 'down', change: '-0.12%' },
        { symbol: 'EUR / PKR', basePrice: 302.20, trend: 'up', change: '+0.45%' },
        { symbol: 'GBP / PKR', basePrice: 354.10, trend: 'up', change: '+0.23%' },
        { symbol: 'AED / PKR', basePrice: 75.82, trend: 'down', change: '-0.05%' },
        { symbol: 'SAR / PKR', basePrice: 74.25, trend: 'up', change: '+0.10%' },
        { symbol: 'CNY / PKR', basePrice: 38.45, trend: 'down', change: '-0.08%' }
    ];

    const [selectedPair, setSelectedPair] = useState(currencyPairs[0]);
    const { price: currentRate, history: forexHistory } = useRealTimePrice(selectedPair.basePrice, 0.0005, selectedPair.symbol);

    const currencies = ['USD', 'PKR', 'EUR', 'GBP', 'JPY', 'AED', 'SAR', 'CNY'];

    const result = (parseFloat(amount) * currentRate).toFixed(2);

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-foreground tracking-tighter uppercase italic">Forex Exchange</h1>
                    <p className="text-gray-500 mt-2 text-sm font-medium">Real-time global currency valuation and interbank liquidity monitoring.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-brand-card border border-gray-800 rounded-xl flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Network Status: <span className="text-emerald-400">High Speed</span></span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    {/* Currency Converter */}
                    <div className="p-8 rounded-3xl bg-brand-card border border-gray-800 shadow-2xl space-y-8 transition-colors duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex items-center gap-2">
                                <ArrowRightLeft className="w-4 h-4 text-emerald-500" /> Currency Converter
                            </h3>
                            <button className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest hover:underline">Fee Schedule</button>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Principal Amount</label>
                                <div className="relative group">
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-brand-bg border border-gray-800 rounded-xl px-6 py-4 text-lg font-mono font-bold text-foreground focus:border-emerald-500/50 outline-none transition-all placeholder:text-gray-700"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 uppercase">{from}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Source</label>
                                    <select 
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                        className="w-full bg-brand-bg border border-gray-800 rounded-xl px-4 py-3 text-sm text-foreground focus:border-emerald-500/50 outline-none cursor-pointer transition-colors"
                                    >
                                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <button 
                                    onClick={() => { const temp = from; setFrom(to); setTo(temp); }}
                                    className="mt-6 p-3 rounded-full bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 hover:rotate-180 transition-transform duration-500"
                                >
                                    <RefreshCcw className="w-4 h-4" />
                                </button>
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Target</label>
                                    <select 
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        className="w-full bg-brand-bg border border-gray-800 rounded-xl px-4 py-3 text-sm text-foreground focus:border-emerald-500/50 outline-none cursor-pointer transition-colors"
                                    >
                                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="p-8 rounded-2xl bg-brand-bg border border-gray-800 text-center relative overflow-hidden transition-colors">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3">Live Valuation</p>
                                <p className="text-4xl font-mono font-bold text-emerald-400 italic">
                                    {result} <span className="text-gray-500 text-lg not-italic pl-2">{to}</span>
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-800/50 flex justify-between items-center text-[10px] font-bold uppercase text-gray-600">
                                    <span>Rate: 1 {from} = {currentRate.toFixed(4)} {to}</span>
                                    <span>Spread: 0.02%</span>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-emerald-600 rounded-xl text-xs font-bold text-white hover:bg-emerald-500 transition-all uppercase tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95">Initiate Trade Order</button>
                        </div>
                    </div>

                    {/* Regional Benchmarks */}
                    <div className="p-8 rounded-3xl bg-brand-card border border-gray-800 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                             <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Live Counter-Rates</h3>
                             <Globe className="w-4 h-4 text-gray-700" />
                        </div>
                        <div className="space-y-4">
                            {currencyPairs.map((pair) => (
                                <LiveRateRow 
                                    key={pair.symbol} 
                                    pair={pair} 
                                    isSelected={selectedPair.symbol === pair.symbol}
                                    onClick={() => setSelectedPair(pair)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    {/* Real-time Chart */}
                    <div className="p-8 rounded-3xl border border-gray-800 bg-brand-card shadow-2xl space-y-6 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-foreground uppercase tracking-widest italic">{selectedPair.symbol} Market Performance</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Interbank Real-Time Streaming Data</p>
                            </div>
                            <div className="flex gap-2">
                                {['1H', '4H', '1D', '1W'].map(t => (
                                    <button key={t} className="px-3 py-1 bg-brand-bg border border-gray-800 rounded text-[10px] font-bold text-gray-500 hover:text-foreground transition-all">
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-[500px]">
                            <FinancialChart key={selectedPair.symbol} symbol={selectedPair.symbol} data={forexHistory} color="#10b981" />
                        </div>
                    </div>
                    
                    {/* Market Intelligence */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl bg-brand-card border border-gray-800 shadow-xl group hover:border-indigo-500/30 transition-all border-l-4 border-l-indigo-500">
                             <h3 className="text-xs font-bold text-foreground uppercase tracking-widest italic mb-4">Liquidity Depth</h3>
                             <div className="space-y-4">
                                <div className="h-1.5 w-full bg-brand-bg rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[85%]" />
                                </div>
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                    <span>Bid Depth: $1.2B</span>
                                    <span>Ask Depth: $0.9B</span>
                                </div>
                             </div>
                        </div>
                        <div className="p-8 rounded-3xl bg-brand-card border border-gray-800 shadow-xl group hover:border-emerald-500/30 transition-all border-l-4 border-l-emerald-500">
                             <h3 className="text-xs font-bold text-foreground uppercase tracking-widest italic mb-4">Central Bank Policy</h3>
                             <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                Markets pricing in 82% probability of rate hold in next MPC meeting. Interbank liquidity remains within optimal reserve corridors.
                             </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
