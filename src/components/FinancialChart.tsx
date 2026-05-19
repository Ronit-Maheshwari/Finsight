import React, { useMemo, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import { format } from 'date-fns';
import { RotateCcw, Maximize2 } from 'lucide-react';

export interface DataPoint {
  time: string;
  price: number;
}

interface FinancialChartProps {
  symbol: string;
  data?: DataPoint[];
  color?: string;
  height?: number;
  hideAxes?: boolean;
}

// Generate some Yahoo Finance-like mock history if none is provided
const generateHistoricalData = (basePrice: number, points: number = 30): DataPoint[] => {
  let currentPrice = basePrice * 0.95;
  const now = new Date();
  return Array.from({ length: points }).map((_, i) => {
    const change = (Math.random() - 0.45) * (basePrice * 0.01);
    currentPrice += change;
    const time = new Date(now.getTime() - (points - i) * 60 * 1000);
    return {
      time: format(time, 'HH:mm'),
      price: parseFloat(currentPrice.toFixed(2))
    };
  });
};

export const FinancialChart: React.FC<FinancialChartProps> = ({ 
  symbol, 
  data, 
  color = "#10b981",
  height = 400,
  hideAxes = false
}) => {
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [left, setLeft] = useState<string | null>(null);
  const [right, setRight] = useState<string | null>(null);

  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    
    // Fallback base prices
    const basePrices: Record<string, number> = {
      'AAPL': 192.53,
      'MSFT': 415.20,
      'GOOGL': 145.30,
      'BTC': 65420,
      'ETH': 3450,
      'SPY': 524.50,
      'USD': 278.45
    };
    
    const key = symbol.includes(':') ? symbol.split(':').pop() || '' : symbol;
    const base = basePrices[key] || 100;
    return generateHistoricalData(base);
  }, [symbol, data]);

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === null) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    // Sort labels to ensure proper range
    const [l, r] = [refAreaLeft, refAreaRight].sort((a, b) => {
      const indexA = chartData.findIndex(d => d.time === a);
      const indexB = chartData.findIndex(d => d.time === b);
      return indexA - indexB;
    }) as [string, string];

    setLeft(l);
    setRight(r);
    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  const zoomOut = () => {
    setLeft(null);
    setRight(null);
    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  const filteredData = useMemo(() => {
    if (!left || !right) return chartData;
    const startIndex = chartData.findIndex(d => d.time === left);
    const endIndex = chartData.findIndex(d => d.time === right);
    return chartData.slice(startIndex, endIndex + 1);
  }, [chartData, left, right]);

  const prices = filteredData.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-card border border-gray-800 p-3 rounded-xl shadow-2xl transition-colors backdrop-blur-md bg-opacity-90">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <p className="text-sm font-mono font-bold text-foreground">
              ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const isMini = height <= 150 || hideAxes;

  return (
    <div className="w-full relative group/chart select-none" style={{ height: hideAxes ? '100%' : height }}>
      {left && !isMini && (
        <button 
          onClick={(e) => { e.stopPropagation(); zoomOut(); }}
          className="absolute top-4 left-4 z-20 p-2 bg-brand-bg/90 border border-gray-800 rounded-lg text-gray-400 hover:text-foreground hover:border-gray-600 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm shadow-xl"
        >
          <RotateCcw className="w-3 h-3" /> Reset Zoom
        </button>
      )}

      {!isMini && !left && (
        <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-0 group-hover/chart:opacity-100 transition-opacity flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          <Maximize2 className="w-3 h-3 text-indigo-400" /> Click & Drag to Zoom
        </div>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={chartData} 
          margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
          onMouseDown={(e) => !isMini && e && setRefAreaLeft(e.activeLabel ? String(e.activeLabel) : null)}
          onMouseMove={(e) => !isMini && refAreaLeft && e && setRefAreaRight(e.activeLabel ? String(e.activeLabel) : null)}
          onMouseUp={zoom}
        >
          <defs>
            <linearGradient id={`colorPrice-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          {!isMini && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2e39" opacity={0.3} />}
          <XAxis 
            dataKey="time" 
            hide={isMini}
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#707584', fontSize: 10, fontWeight: 500 }}
            minTickGap={40}
            domain={left && right ? [left, right] : ['auto', 'auto']}
          />
          <YAxis 
            domain={[minPrice, maxPrice]} 
            hide={isMini}
            orientation="right"
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#707584', fontSize: 10, fontWeight: 500 }}
            tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val.toFixed(2)}
            allowDataOverflow
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#colorPrice-${symbol})`}
            animationDuration={300}
            isAnimationActive={true}
            activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 2 }}
          />
          {refAreaLeft && refAreaRight ? (
            <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill="#6366f1" fillOpacity={0.1} />
          ) : null}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

