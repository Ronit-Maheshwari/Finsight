import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, ExternalLink, Clock, TrendingUp } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    title: "Global Markets Rally as Inflation Data Beats Expectations",
    summary: "Equity indices across Europe and Asia saw significant gains today as the latest consumer price index data suggests a cooling inflation trend.",
    source: "Financial Insight",
    time: "2h ago",
    category: "Markets",
    image: "https://images.unsplash.com/photo-1611974717482-48ec861749f1?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Nvidia Valuation Surges as AI Hardware Demand Peak Continues",
    summary: "Chipmaker Nvidia hits record market cap as global enterprises ramp up GPU procurement for generative AI infrastructure projects.",
    source: "Tech Journal",
    time: "3h ago",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Central Banks Signal Potential Rate Cut in Late Q3",
    summary: "Federal reserve officials hinted during a recent symposium that the current restrictive monetary policy might begin to ease by late summer.",
    source: "Global News",
    time: "5h ago",
    category: "Economy",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Bitcoin ETF Inflows Reach Historic Monthly Highs",
    summary: "Institutional investment into spot Bitcoin ETFs continues to accelerate, with BlackRock and Fidelity reporting record-breaking daily volumes.",
    source: "Crypto Pulse",
    time: "6h ago",
    category: "Crypto",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "Crude Oil Prices Stabilize Amid Regional Dialogue",
    summary: "Energy markets found support as major producers entered productive talks regarding supply quotas and regional safety protocols.",
    source: "Commodity Watch",
    time: "8h ago",
    category: "Commodities",
    image: "https://images.unsplash.com/photo-1518173946687-a4c8a9833d8e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Sustainable Aviation Fuel Initiatives Get Billion-Dollar Boost",
    summary: "A consortium of global airlines announces a massive investment into scaling production of environmentally friendly jet fuel by 2030.",
    source: "Sustainability Report",
    time: "10h ago",
    category: "Energy",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
  }
];

export const News: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tighter uppercase italic">World News</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Real-time global intelligence and headlines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {newsItems.map((news, i) => (
            <motion.div 
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-brand-card border border-gray-800 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col md:flex-row shadow-xl"
            >
              <div className="md:w-48 h-48 md:h-auto overflow-hidden shrink-0">
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-600/10 px-2 py-0.5 rounded">{news.category}</span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest"><Clock className="w-3 h-3" /> {news.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-emerald-400 transition-colors leading-tight">{news.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 font-medium">{news.summary}</p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800/50">
                  <span className="text-xs font-medium text-gray-500 italic">{news.source}</span>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 uppercase tracking-widest hover:underline">
                    Read Story <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-brand-card border border-gray-800 shadow-xl transition-colors">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-6 font-mono">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Trending Topics
            </div>
            <div className="space-y-3">
              {['#AIForecasting', '#RateHikes', '#DigitalGold', '#GreenEnergy', '#MarketVolatility'].map((tag) => (
                <div key={tag} className="flex items-center justify-between p-3 rounded-lg bg-brand-bg border border-gray-800 hover:border-emerald-500/20 transition-colors cursor-pointer group shadow-sm transition-all">
                  <span className="text-xs font-bold text-gray-400 group-hover:text-foreground transition-colors">{tag}</span>
                  <span className="text-[10px] text-gray-600 font-mono">1.2k reads</span>
                </div>
              ))}
            </div>
          </div>

          <div className="brand-gradient p-8 rounded-2xl border border-gray-700 shadow-2xl relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
             <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2 italic">Pro News Feed</h4>
             <p className="text-xs text-gray-400 leading-relaxed mb-4">Unlock 24/7 real-time terminal news and institutional research reports.</p>
             <button className="w-full py-3 bg-emerald-600 text-white rounded font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-lg">Upgrade Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};
