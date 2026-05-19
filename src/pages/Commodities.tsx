import React from 'react';
import { motion } from 'motion/react';
import { Flame, Dribbble, TrendingUp, BarChart3, Globe } from 'lucide-react';
import { FinancialChart } from '../components/FinancialChart';
import { useRealTimePrice } from '../hooks/useRealTimePrice';
import { cn } from '../lib/utils';

const CommodityCard = ({ name, symbol, basePrice, unit, icon: Icon, color }: { name: string, symbol: string, basePrice: number, unit: string, icon: any, color: string }) => {
    const { price, changePercent, history } = useRealTimePrice(basePrice, 0.002, symbol);
    const isUp = changePercent >= 0;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-brand-card border border-gray-800 shadow-xl group hover:border-emerald-500/30 transition-all flex flex-col h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center border border-gray-800 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest italic">{name}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{symbol}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-mono font-bold text-foreground italic">${price.toLocaleString()}</p>
                    <p className={cn("text-[10px] font-bold mt-1 font-mono", isUp ? "text-emerald-400" : "text-rose-400")}>
                        {isUp ? '+' : ''}{changePercent.toFixed(2)}%
                    </p>
                </div>
            </div>

            <div className="flex-1 h-32 mb-6 opacity-50 group-hover:opacity-100 transition-opacity">
                <FinancialChart symbol={symbol} data={history} color={color} hideAxes />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-800 mt-auto">
                <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Base Unit</p>
                    <p className="text-xs font-bold text-foreground">{unit}</p>
                </div>
                <button className="px-4 py-2 bg-brand-bg border border-gray-800 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:text-foreground transition-all">Details</button>
            </div>
        </motion.div>
    );
};

export const Commodities: React.FC = () => {
    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-foreground tracking-tighter uppercase italic">Commodities Market</h1>
                    <p className="text-gray-500 mt-2 text-sm font-medium">Global procurement index and material asset valuations.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-brand-card border border-gray-800 rounded-xl flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Index: <span className="text-foreground">2,410.5</span></span>
                    </div>
                    <div className="px-4 py-2 bg-emerald-600/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Bullish Sentiment</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <CommodityCard name="Gold (Spot)" symbol="GC=F" basePrice={2345.10} unit="per Ounce (t oz)" icon={BarChart3} color="#fbbf24" />
                <CommodityCard name="Crude Oil (WTI)" symbol="CL=F" basePrice={78.42} unit="per Barrel (bbl)" icon={Flame} color="#f43f5e" />
                <CommodityCard name="Brent Crude Oil" symbol="BZ=F" basePrice={82.65} unit="per Barrel (bbl)" icon={Flame} color="#e11d48" />
                <CommodityCard name="Silver" symbol="SI=F" basePrice={28.54} unit="per Ounce (t oz)" icon={Dribbble} color="#94a3b8" />
                <CommodityCard name="Natural Gas" symbol="NG=F" basePrice={1.84} unit="per MMBtu" icon={Flame} color="#10b981" />
                <CommodityCard name="Platinum" symbol="PL=F" basePrice={892.40} unit="per Ounce (t oz)" icon={BarChart3} color="#cbd5e1" />
                <CommodityCard name="Copper" symbol="HG=F" basePrice={4.12} unit="per Pound (lb)" icon={TrendingUp} color="#ea580c" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-brand-card border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-brand-bg/50">
                            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest italic flex items-center gap-2">
                                <Globe className="w-4 h-4 text-indigo-400" /> Commodity Intelligence Feed
                            </h3>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold">LIVE UPDATES</span>
                        </div>
                        <div className="divide-y divide-gray-800">
                            {[
                                {
                                    title: "Middle East Tension Escalation Impacts Crude Logistics",
                                    tag: "Geopolitical",
                                    time: "14m ago",
                                    impact: "High",
                                    desc: "Recent developments in shipping lanes are forcing rerouting, increasing transit times for Brent crude by average of 12 days."
                                },
                                {
                                    title: "Australian Mining Strike Threatens Iron Ore Supply",
                                    tag: "Supply Chain",
                                    time: "42m ago",
                                    impact: "Medium",
                                    desc: "Labor negotiations at key Pilbara sites stalled. Market participants anticipate localized price spikes if resolution isn't reached by EOD."
                                },
                                {
                                    title: "Central Bank Gold Reserves Jump 15% in Q1",
                                    tag: "Macro",
                                    time: "2h ago",
                                    impact: "High",
                                    desc: "Shift toward 'Safe Haven' assets continues as global inflation concerns persist. Institutional inflows hit multi-year highs."
                                },
                                {
                                    title: "New Battery Tech Reduces Cobalt Dependency",
                                    tag: "Tech",
                                    time: "5h ago",
                                    impact: "Low",
                                    desc: "Breakthrough in solid-state electrolytes may shift forward demand curves for lithium and nickel in the medium-term."
                                }
                            ].map((news, i) => (
                                <div key={i} className="p-6 hover:bg-white/5 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 uppercase tracking-widest">{news.tag}</span>
                                        <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{news.time}</span>
                                        <span className={cn(
                                            "text-[8px] font-bold px-2 py-0.5 rounded ml-auto uppercase tracking-widest",
                                            news.impact === 'High' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                                        )}>IMPACT: {news.impact}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-foreground group-hover:text-indigo-400 transition-colors mb-2 uppercase tracking-tight">{news.title}</h4>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{news.desc}</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 text-[10px] font-bold text-gray-500 hover:text-foreground transition-all uppercase tracking-widest border-t border-gray-800 bg-brand-bg/20">
                            Load Full Analysis Archive
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-10 rounded-3xl brand-gradient border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Globe className="w-48 h-48 text-foreground" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-foreground italic uppercase tracking-tighter mb-4">Supply Chain Intelligence</h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium mb-8">
                                Real-time monitoring of global trade flows and port congestion metrics.
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Volatility Index</p>
                                    <p className="text-xl font-mono font-bold text-foreground italic">14.2% <span className="text-rose-400 text-xs">▲</span></p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Open Interest</p>
                                    <p className="text-xl font-mono font-bold text-foreground italic">1.2M <span className="text-emerald-400 text-xs">▲</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
