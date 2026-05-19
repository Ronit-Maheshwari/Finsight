import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, signInWithGoogle } from '../lib/firebase';
import { collection, onSnapshot, query, where, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, PieChart, Wallet, TrendingUp, DollarSign, Lock, Award, Eye, EyeOff, ArrowUpRight, ArrowDownRight, Sparkles, ShieldCheck, AlertCircle, X, ExternalLink } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { analyzePortfolio, PortfolioInsight } from '../services/geminiService';

export const Portfolio: React.FC = () => {
    const [holdings, setHoldings] = useState<any[]>([]);
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(auth.currentUser);
    const [insight, setInsight] = useState<PortfolioInsight | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDiversificationOpen, setIsDiversificationOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
    const [newAsset, setNewAsset] = useState({ symbol: '', quantity: '', price: '', type: 'stock' });

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(u => setUser(u));
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!user) {
            setHoldings([]);
            setWatchlist([]);
            setLoading(false);
            return;
        }

        // Portfolio Listener
        const qPortfolio = query(collection(db, 'users', user.uid, 'portfolio'));
        const unsubscribePortfolio = onSnapshot(qPortfolio, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setHoldings(data);
            setLoading(false);
        });

        // Watchlist Listener
        const qWatchlist = query(collection(db, 'users', user.uid, 'watchlist'));
        const unsubscribeWatchlist = onSnapshot(qWatchlist, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWatchlist(data);
        });

        return () => {
            unsubscribePortfolio();
            unsubscribeWatchlist();
        };
    }, [user]);

    useEffect(() => {
        const fetchInsight = async () => {
            if (holdings.length > 0 && !isAnalyzing) {
                setIsAnalyzing(true);
                try {
                    const result = await analyzePortfolio(holdings);
                    setInsight(result);
                } catch (error) {
                    console.error("Analysis error:", error);
                } finally {
                    setIsAnalyzing(false);
                }
            }
        };
        
        const timeout = setTimeout(fetchInsight, 1000); // Debounce to allow multiple updates
        return () => clearTimeout(timeout);
    }, [holdings]);

    const handleTransaction = async () => {
        if (!user || !newAsset.symbol || !newAsset.quantity || !newAsset.price) return;
        
        try {
            const qty = parseFloat(newAsset.quantity);
            const price = parseFloat(newAsset.price);
            const symbol = newAsset.symbol.toUpperCase();

            // Find existing holding
            const existing = holdings.find(h => h.symbol === symbol);

            if (transactionType === 'buy') {
                if (existing) {
                    // Update existing
                    const newTotalQty = existing.quantity + qty;
                    const newAvgPrice = ((existing.quantity * existing.averagePrice) + (qty * price)) / newTotalQty;
                    
                    await deleteDoc(doc(db, 'users', user.uid, 'portfolio', existing.id)); // Simple way to "update" for this demo or use updateDoc
                    await addDoc(collection(db, 'users', user.uid, 'portfolio'), {
                        userId: user.uid,
                        symbol,
                        assetType: newAsset.type,
                        quantity: newTotalQty,
                        averagePrice: newAvgPrice,
                        updatedAt: serverTimestamp()
                    });
                } else {
                    // New asset
                    await addDoc(collection(db, 'users', user.uid, 'portfolio'), {
                        userId: user.uid,
                        symbol,
                        assetType: newAsset.type,
                        quantity: qty,
                        averagePrice: price,
                        updatedAt: serverTimestamp()
                    });
                }
            } else {
                // Sell logic
                if (existing) {
                    const newTotalQty = Math.max(0, existing.quantity - qty);
                    await deleteDoc(doc(db, 'users', user.uid, 'portfolio', existing.id));
                    
                    if (newTotalQty > 0) {
                        await addDoc(collection(db, 'users', user.uid, 'portfolio'), {
                            userId: user.uid,
                            symbol,
                            assetType: existing.assetType,
                            quantity: newTotalQty,
                            averagePrice: existing.averagePrice,
                            updatedAt: serverTimestamp()
                        });
                    }
                }
            }

            setIsAddOpen(false);
            setNewAsset({ symbol: '', quantity: '', price: '', type: 'stock' });
        } catch (error) {
            console.error("Error processing transaction:", error);
        }
    };

    const toggleWatchlist = async (asset: any) => {
        if (!user) return;
        const inWatchlist = watchlist.find(w => w.symbol === asset.symbol);
        if (inWatchlist) {
            await deleteDoc(doc(db, 'users', user.uid, 'watchlist', inWatchlist.id));
        } else {
            await addDoc(collection(db, 'users', user.uid, 'watchlist'), {
                userId: user.uid,
                symbol: asset.symbol,
                assetType: asset.assetType,
                createdAt: serverTimestamp()
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'portfolio', id));
    };

    const COLORS = ['#10b981', '#059669', '#34d399', '#064e3b', '#6ee7b7'];
    const chartData = holdings.reduce((acc: any[], current) => {
        const value = current.quantity * current.averagePrice;
        const exists = acc.find(item => item.name === current.symbol);
        if (exists) {
            exists.value += value;
        } else {
            acc.push({ name: current.symbol, value: value });
        }
        return acc;
    }, []);

    const totalValue = chartData.reduce((a, b) => a + b.value, 0);

    if (!user) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-brand-card rounded-3xl border border-gray-800 shadow-2xl transition-colors duration-300">
                <div className="w-16 h-16 bg-emerald-600/10 rounded-sm flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2 italic tracking-tighter">Secure Assets</h2>
                <p className="text-gray-500 max-w-sm mb-8 text-xs font-medium">Connect your account to access real-time personal wealth tracking and AI-powered diversification analysis.</p>
                <button onClick={signInWithGoogle} className="px-10 py-3 bg-emerald-600 rounded text-xs font-bold text-white hover:bg-emerald-500 transition-all uppercase tracking-widest shadow-lg shadow-emerald-900/20">Connect Wallet</button>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground italic tracking-tighter uppercase">My Portfolio</h1>
                    <p className="text-gray-500 mt-1 text-sm font-medium tracking-tight">Real-time wealth distribution.</p>
                </div>
                <button 
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 rounded text-xs font-bold text-white hover:bg-emerald-500 transition-colors uppercase tracking-widest shadow-lg shadow-emerald-900/20"
                >
                    <Plus className="w-4 h-4" /> Add Asset
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-brand-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl transition-colors">
                        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-brand-bg transition-colors">
                            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Active Holdings
                            </h3>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Current Market</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-[10px] text-gray-500 uppercase font-bold tracking-widest border-b border-gray-800 bg-brand-sidebar/30 transition-colors">
                                        <th className="px-6 py-4">Asset</th>
                                        <th className="px-6 py-4 text-center">Class</th>
                                        <th className="px-6 py-4 text-right">Qty</th>
                                        <th className="px-6 py-4 text-right">Avg Price</th>
                                        <th className="px-6 py-4 text-right">Value</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                    {holdings.map((h) => (
                                        <tr key={h.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-sm bg-brand-bg border border-gray-800 flex items-center justify-center font-bold text-[10px] text-emerald-500 italic">
                                                        {h.symbol[0]}
                                                    </div>
                                                    <span className="font-bold text-xs text-foreground group-hover:text-emerald-400 transition-colors">{h.symbol}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-2 py-0.5 border border-gray-800 text-[9px] font-bold text-gray-500 rounded uppercase">
                                                    {h.assetType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-xs font-bold text-gray-400">{h.quantity}</td>
                                            <td className="px-6 py-4 text-right font-mono text-xs font-bold text-gray-400">${h.averagePrice}</td>
                                            <td className="px-6 py-4 text-right font-mono text-xs font-bold text-emerald-400">${(h.quantity * h.averagePrice).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => toggleWatchlist(h)}
                                                        className={cn(
                                                            "p-1 transition-colors",
                                                            watchlist.some(w => w.symbol === h.symbol) ? "text-emerald-500" : "text-gray-700 hover:text-gray-400"
                                                        )}
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(h.id)}
                                                        className="p-1 hover:text-rose-500 text-gray-700 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {holdings.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium italic text-xs bg-brand-card transition-colors">
                                                Your vault is currently empty. Start adding assets to monitor growth.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-brand-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl transition-colors">
                        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-brand-bg transition-colors">
                            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex items-center gap-2">
                                <Eye className="w-3.5 h-3.5 text-indigo-500" /> Market Watchlist
                            </h3>
                            <span className="text-[9px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-bold uppercase tracking-widest">{watchlist.length} Tracked</span>
                        </div>
                        <div className="p-6">
                            {watchlist.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {watchlist.map((item) => (
                                        <div key={item.id} className="p-4 rounded-xl bg-brand-bg border border-gray-800 flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-brand-card border border-gray-800 flex items-center justify-center font-bold text-[10px] text-indigo-400 italic">
                                                    {item.symbol[0]}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-foreground group-hover:text-indigo-400 transition-colors">{item.symbol}</p>
                                                    <p className="text-[8px] text-gray-500 uppercase font-bold">{item.assetType}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-right">
                                                <div>
                                                    <p className="text-xs font-mono font-bold text-foreground">$0.00</p>
                                                    <p className="text-[8px] text-emerald-400 font-bold flex items-center justify-end gap-1"><ArrowUpRight className="w-2 h-2" /> 0.0%</p>
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); toggleWatchlist(item); }}
                                                    className="p-1.5 rounded-lg bg-brand-card border border-gray-800 text-gray-500 hover:text-rose-500 transition-colors"
                                                >
                                                    <EyeOff className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center bg-brand-bg/50 rounded-xl border border-dashed border-gray-800">
                                    <Eye className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">No assets in watchlist</p>
                                    <p className="text-[9px] text-gray-600 mt-1">Add items from your holdings or market search to track them here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-8 bg-brand-card border border-gray-800 rounded-2xl shadow-xl transition-colors">
                        <div className="flex items-center gap-2 mb-6 uppercase tracking-widest text-[10px] font-bold text-gray-500">
                            <PieChart className="w-4 h-4 text-emerald-500" />
                            Asset Allocation
                        </div>
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={chartData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <ReTooltip 
                                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: '#1f2937', borderRadius: '4px' }}
                                        itemStyle={{ color: 'var(--foreground)', fontSize: '10px', textTransform: 'uppercase' }}
                                    />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-8">
                            <div className="p-5 rounded-xl bg-brand-bg border border-gray-800 transition-colors">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Estimated Net Worth</p>
                                <p className="text-3xl font-mono font-bold text-foreground italic tracking-tighter">${totalValue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className={cn(
                        "brand-gradient p-8 rounded-2xl border relative overflow-hidden group shadow-2xl transition-all duration-500",
                        isAnalyzing ? "animate-pulse border-emerald-500/30" : "border-gray-700 hover:border-emerald-500/50"
                    )}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                           <Award className="w-16 h-16 text-foreground" />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className={cn("w-5 h-5", isAnalyzing ? "text-indigo-400" : "text-emerald-400")} />
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest italic">Stocky Predictions</h3>
                        </div>
                        <div className="space-y-4 relative z-10">
                           <div className="text-xs text-gray-400 leading-relaxed font-medium">
                            <span className={cn("font-bold mr-1", isAnalyzing ? "text-indigo-400" : "text-emerald-400")}>
                                {isAnalyzing ? 'Analyzing Portfolio...' : 'AI Insight:'}
                            </span> 
                            {isAnalyzing ? (
                                'Stocky is scanning market trends and your allocation for potential risks...'
                            ) : (
                                insight?.summary || 'Your portfolio composition analysis will appear here shortly.'
                            )}
                           </div>
                           
                           {insight && !isAnalyzing && (
                               <div className="flex items-center gap-4 py-2 border-y border-white/5">
                                   <div>
                                       <p className="text-[9px] uppercase font-bold text-gray-500 mb-0.5">Risk Profile</p>
                                       <p className={cn(
                                           "text-xs font-bold font-mono",
                                           insight.riskLevel === 'Low' ? 'text-emerald-400' : 
                                           insight.riskLevel === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                                       )}>{insight.riskLevel}</p>
                                   </div>
                                   <div className="w-px h-8 bg-white/10" />
                                   <div>
                                       <p className="text-[9px] uppercase font-bold text-gray-500 mb-0.5">D-Score</p>
                                       <p className="text-xs font-bold text-indigo-400 font-mono">{insight.diversificationScore}/100</p>
                                   </div>
                               </div>
                           )}

                           <button 
                               onClick={() => setIsDiversificationOpen(true)}
                               disabled={!insight || isAnalyzing}
                               className="w-full py-2.5 bg-white/5 border border-white/10 text-foreground rounded text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-emerald-500/30"
                            >
                                Diversification Tool
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Diversification Tool Modal */}
            <AnimatePresence>
                {isDiversificationOpen && insight && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDiversificationOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-brand-card border border-gray-800 rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden transition-colors duration-300"
                        >
                            <div className="p-8 border-b border-gray-800 flex items-center justify-between bg-brand-bg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground italic tracking-tighter uppercase">AI Strategy Room</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Powered by Gemini Pro Intelligence</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsDiversificationOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-foreground"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl bg-brand-bg border border-gray-800 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5">
                                            <ShieldCheck className="w-12 h-12 text-emerald-400" />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Diversification Score</p>
                                        <div className="flex items-end gap-3">
                                            <p className="text-4xl font-mono font-bold text-indigo-400 italic">{insight.diversificationScore}</p>
                                            <p className="text-xs font-bold text-gray-600 mb-1.5 uppercase">/ 100</p>
                                        </div>
                                        <div className="mt-4 h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${insight.diversificationScore}%` }}
                                                className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-brand-bg border border-gray-800 relative overflow-hidden group">
                                         <div className="absolute top-0 right-0 p-4 opacity-5">
                                            <AlertCircle className="w-12 h-12 text-rose-400" />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Risk Assessment</p>
                                        <p className={cn(
                                            "text-4xl font-mono font-bold italic",
                                            insight.riskLevel === 'Low' ? 'text-emerald-400' : 
                                            insight.riskLevel === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                                        )}>{insight.riskLevel}</p>
                                        <p className="text-[9px] font-bold text-gray-500 mt-2 uppercase tracking-widest">
                                            {insight.riskLevel === 'High' ? 'Aggressive Exposure Detected' : 
                                             insight.riskLevel === 'Medium' ? 'Balanced Market Positioning' : 'Defensive Stability Guard'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-foreground uppercase tracking-widest italic flex items-center gap-2">
                                        <ArrowDownRight className="w-4 h-4 text-emerald-400" /> Recommended Adjustments
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        {insight.suggestions.map((s, i) => (
                                            <div key={i} className="p-5 rounded-2xl bg-brand-bg border border-gray-800 hover:border-indigo-500/30 transition-all group">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 font-bold text-[10px] text-indigo-400">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground mb-1 italic group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{s.asset}</p>
                                                        <p className="text-xs text-gray-500 leading-relaxed font-medium">{s.reason}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl brand-gradient border border-white/5">
                                    <p className="text-xs text-foreground font-medium leading-relaxed italic opacity-80">
                                        "This analysis is based on real-time market sector correlations. Increasing exposure to uncorrelated assets can significantly lower your beta to the broader market index."
                                    </p>
                                    <div className="flex items-center gap-2 mt-4">
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                            <Sparkles className="w-3 h-3 text-emerald-400" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stocky AI Core</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-gray-800 bg-brand-bg/50 flex gap-4 transition-colors">
                                <button 
                                    onClick={() => setIsDiversificationOpen(false)}
                                    className="flex-1 py-4 bg-brand-bg border border-gray-800 rounded-xl text-xs font-bold text-gray-500 hover:text-foreground transition-all uppercase tracking-widest"
                                >
                                    Dismiss Analysis
                                </button>
                                <button 
                                    onClick={() => { setIsDiversificationOpen(false); setIsAddOpen(true); }}
                                    className="flex-1 py-4 bg-indigo-600 rounded-xl text-xs font-bold text-white hover:bg-indigo-500 transition-all uppercase tracking-widest shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2"
                                >
                                    Rebalance Now <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Asset Modal */}
            <AnimatePresence>
                {isAddOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-brand-card border border-gray-800 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl transition-colors duration-300"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-foreground uppercase tracking-tighter italic">Execute Transaction</h3>
                                <div className="flex p-1 bg-brand-bg border border-gray-800 rounded-lg">
                                    <button 
                                        onClick={() => setTransactionType('buy')}
                                        className={cn(
                                            "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                                            transactionType === 'buy' ? "bg-emerald-600 text-white shadow-lg" : "text-gray-500"
                                        )}
                                    >
                                        Buy
                                    </button>
                                    <button 
                                        onClick={() => setTransactionType('sell')}
                                        className={cn(
                                            "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                                            transactionType === 'sell' ? "bg-rose-600 text-white shadow-lg" : "text-gray-500"
                                        )}
                                    >
                                        Sell
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Asset Identifier</label>
                                    <input 
                                        value={newAsset.symbol}
                                        onChange={e => setNewAsset({ ...newAsset, symbol: e.target.value })}
                                        placeholder="e.g. AAPL or BTCUSD"
                                        className="w-full bg-brand-bg border border-gray-800 rounded px-4 py-3 text-xs text-foreground focus:border-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Amount ({transactionType})</label>
                                        <input 
                                            type="number"
                                            value={newAsset.quantity}
                                            onChange={e => setNewAsset({ ...newAsset, quantity: e.target.value })}
                                            placeholder="0.00"
                                            className="w-full bg-brand-bg border border-gray-800 rounded px-4 py-3 text-xs text-foreground focus:border-emerald-500/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Execution Price</label>
                                        <input 
                                            type="number"
                                            value={newAsset.price}
                                            onChange={e => setNewAsset({ ...newAsset, price: e.target.value })}
                                            placeholder="0.00"
                                            className="w-full bg-brand-bg border border-gray-800 rounded px-4 py-3 text-xs text-foreground focus:border-emerald-500/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Asset Classification</label>
                                    <select 
                                        value={newAsset.type}
                                        onChange={e => setNewAsset({ ...newAsset, type: e.target.value })}
                                        className="w-full bg-brand-bg border border-gray-800 rounded px-4 py-3 text-xs text-foreground focus:border-emerald-500/50 outline-none transition-all cursor-pointer"
                                    >
                                        <option value="stock">Stock</option>
                                        <option value="mutual_fund">Mutual Fund</option>
                                        <option value="crypto">Crypto</option>
                                        <option value="commodity">Commodity</option>
                                        <option value="forex">Forex</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-6">
                                    <button onClick={() => setIsAddOpen(false)} className="flex-1 py-4 bg-brand-bg border border-gray-800 rounded text-xs font-bold text-gray-500 hover:text-foreground transition-all uppercase tracking-widest">Abort</button>
                                    <button 
                                        onClick={handleTransaction} 
                                        className={cn(
                                            "flex-1 py-4 rounded text-xs font-bold text-white transition-all uppercase tracking-widest shadow-lg",
                                            transactionType === 'buy' ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20" : "bg-rose-600 hover:bg-rose-500 shadow-rose-900/20"
                                        )}
                                    >
                                        {transactionType === 'buy' ? 'Confirm Purchase' : 'Execute Sale'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
