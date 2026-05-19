import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';

export interface PricePoint {
  time: string;
  price: number;
}

export const useRealTimePrice = (initialPrice: number, volatility: number = 0.001, symbol?: string) => {
  const [price, setPrice] = useState(initialPrice);
  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [history, setHistory] = useState<PricePoint[]>([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    const fetchRealData = async () => {
      if (!symbol) return;
      try {
        const response = await fetch(`/api/price/${encodeURIComponent(symbol)}`);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
        const data = await response.json();
        if (data.price) {
          setPrice(data.price);
          setChangePercent(data.changePercent);
          setChange(data.price * (data.changePercent / 100));
        }
      } catch (error) {
        console.error(`Failed to fetch real-time price for ${symbol}:`, error);
      }
    };

    const fetchHistory = async () => {
      if (!symbol) return;
      try {
        const response = await fetch(`/api/history/${encodeURIComponent(symbol)}`);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setHistory(data);
        }
      } catch (error) {
        console.error(`Failed to fetch history for ${symbol}:`, error);
      }
    };

    if (!isInitialized.current) {
      if (symbol) {
        fetchRealData();
        fetchHistory();
      } else {
        // Seed initial simulation history if no symbol
        const now = new Date();
        const initialHistory = Array.from({ length: 30 }).map((_, i) => {
          const offset = (Math.random() - 0.5) * (initialPrice * 0.05);
          return {
            time: format(new Date(now.getTime() - (30 - i) * 60000), 'HH:mm'),
            price: parseFloat((initialPrice + offset).toFixed(2))
          };
        });
        setHistory(initialHistory);
      }
      isInitialized.current = true;
    }

    const intervalId = setInterval(() => {
      if (symbol) {
        fetchRealData();
      } else {
        const movement = (Math.random() - 0.5) * (initialPrice * volatility);
        setPrice(prev => {
          const newPrice = parseFloat((prev + movement).toFixed(2));
          const diff = newPrice - initialPrice;
          setChange(diff);
          setChangePercent((diff / initialPrice) * 100);
          
          setHistory(prevHistory => {
            const newPoint = {
              time: format(new Date(), 'HH:mm:ss'),
              price: newPrice
            };
            return [...prevHistory.slice(1), newPoint];
          });

          return newPrice;
        });
      }
    }, symbol ? 60000 : 5000); // Update every 60s for real data, 5s for simulation

    return () => clearInterval(intervalId);
  }, [initialPrice, volatility, symbol]);

  return { price, change, changePercent, history };
};
