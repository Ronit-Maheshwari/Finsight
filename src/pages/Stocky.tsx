import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Atom, Send, Sparkles, TrendingUp, AlertTriangle, User } from 'lucide-react';
import { getMarketAnalysis } from '../lib/gemini';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';

export const Stocky: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot' | 'system', content: string }[]>([
    { role: 'bot', content: "Hello! I'm Stocky, your personal AI financial advisor. Ask me anything about market trends, mutual fund comparisons, or your portfolio diversification." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
        const marketContext = "S&P 500 at 5240, Nasdaq 18300, USD/PKR at 278, Gold $2340. Tech sector is showing resilience while commodities are cooling.";
        const analysis = await getMarketAnalysis(`Query: ${userMessage}\nContext: ${marketContext}`);
        setMessages(prev => [...prev, { role: 'bot', content: analysis || "I'm sorry, I encountered an issue analyzing that." }]);
    } catch (error) {
        console.error("AI Error:", error);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tighter uppercase italic">Stocky AI Assistant</h1>
                <p className="text-gray-500 mt-1 text-sm font-medium">Neural market analysis & forecasting.</p>
            </div>
            <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-bg bg-emerald-600/20 flex items-center justify-center transition-colors">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                    </div>
                ))}
            </div>
        </div>

        <div className="flex-1 min-h-0 bg-brand-card rounded-3xl border border-gray-800 shadow-2xl flex flex-col overflow-hidden relative transition-all duration-300">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide relative z-10">
                {messages.map((msg, i) => (
                    <div key={i} className={cn(
                        "flex gap-4 max-w-[85%]",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}>
                        <div className={cn(
                            "w-10 h-10 rounded shadow-lg flex items-center justify-center shrink-0 mt-1",
                            msg.role === 'bot' ? "brand-gradient border border-gray-700" : "bg-emerald-600"
                        )}>
                            {msg.role === 'bot' ? <Atom className="text-emerald-500 w-5 h-5 animate-pulse" /> : <User className="text-white w-5 h-5" />}
                        </div>
                        <div className={cn(
                            "p-4 rounded-xl text-sm leading-relaxed",
                            msg.role === 'bot' ? "bg-brand-bg border border-gray-800 text-foreground shadow-xl transition-colors" : "bg-emerald-600 text-white font-medium"
                        )}>
                            <div className="markdown-body">
                                <Markdown>{msg.content}</Markdown>
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-4 mr-auto max-w-[85%] animate-pulse">
                        <div className="w-10 h-10 rounded brand-gradient border border-gray-700 flex items-center justify-center">
                            <Atom className="text-emerald-500 w-5 h-5" />
                        </div>
                        <div className="p-4 rounded-xl bg-brand-bg border border-gray-800 text-gray-400 text-sm italic transition-colors">
                            Stocky is analyzing market trends...
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-gray-800 bg-brand-bg relative z-20 transition-colors duration-300">
                <div className="flex items-center gap-3 bg-brand-card border border-gray-800 rounded-full pl-6 pr-2 py-2 focus-within:border-emerald-500/50 transition-all shadow-2xl">
                    <input 
                        placeholder="Ask Stocky Forecasts..." 
                        className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-gray-600"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="bg-emerald-600 p-2.5 rounded-full text-white hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
                { t: 'Investment Alpha', d: 'Get personalized picks based on your risk profile.' },
                { t: 'Technical Pulse', d: 'Analyze candle patterns and volume breakthroughs.' },
                { t: 'Wealth Forecast', d: 'Simulate portfolio growth over 5, 10, or 20 years.' }
            ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-brand-card border border-gray-800 hover:border-emerald-500/20 transition-all cursor-pointer group shadow-xl transition-colors">
                    <h4 className="text-foreground font-bold text-xs uppercase tracking-widest mb-2 group-hover:text-emerald-400 transition-colors">{item.t}</h4>
                    <p className="text-[11px] text-gray-500 leading-tight">{item.d}</p>
                </div>
            ))}
        </div>
    </div>
  );
};
