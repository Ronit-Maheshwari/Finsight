import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import YahooFinance from 'yahoo-finance2';

// Robust initialization for yahoo-finance2 v3+ that works in both ESM and bundled CJS
let yahooFinance: any;
try {
    if (typeof YahooFinance === 'function') {
        yahooFinance = new (YahooFinance as any)();
    } else if ((YahooFinance as any).default && typeof (YahooFinance as any).default === 'function') {
        yahooFinance = new (YahooFinance as any).default();
    } else if ((YahooFinance as any).YahooFinance && typeof (YahooFinance as any).YahooFinance === 'function') {
        yahooFinance = new (YahooFinance as any).YahooFinance();
    } else {
        yahooFinance = YahooFinance;
    }
} catch (e) {
    console.error('Yahoo Finance Initialization Error:', e);
    yahooFinance = YahooFinance;
}

function normalizeSymbol(symbol: string): string {
    if (!symbol) return '';
    const upper = symbol.toUpperCase();
    
    if (upper.includes('/')) {
        // Forex handling for Yahoo Finance (e.g., USD/PKR -> USDPKR=X)
        const parts = upper.split('/');
        return `${parts[0].trim()}${parts[1].trim()}=X`;
    } 
    
    const cryptoSymbols = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'TRX', 'DOT', 'LTC', 'NEAR', 'LINK', 'AVAX'];
    if (cryptoSymbols.includes(upper)) {
        return `${upper}-USD`;
    }

    // Handle index symbols if they were passed without ^
    const commonIndices: Record<string, string> = {
        'SPX': '^GSPC',
        'GSPC': '^GSPC',
        'IXIC': '^IXIC',
        'DJI': '^DJI',
        'RUT': '^RUT',
        'VIX': '^VIX'
    };
    if (commonIndices[upper]) return commonIndices[upper];

    // Handle symbols like BRK.B -> BRK-B for Yahoo Finance
    if (symbol.includes('.')) {
        return symbol.replace('.', '-');
    }
    
    return symbol;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for JSON
  app.use(express.json());

  // Cache for prices to avoid rate limiting
  const priceCache: Record<string, { price: number; changePercent: number; lastUpdate: number }> = {};
  const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

  app.get("/api/price/:symbol", async (req, res) => {
    const { symbol } = req.params;
    const ySymbol = normalizeSymbol(symbol);
    
    // Check cache
    if (priceCache[ySymbol] && (Date.now() - priceCache[ySymbol].lastUpdate < CACHE_TTL)) {
      return res.json(priceCache[ySymbol]);
    }

    try {
      const quote: any = await yahooFinance.quote(ySymbol);
      if (!quote) {
        throw new Error(`No quote found for ${ySymbol}`);
      }
      const data = {
        price: quote.regularMarketPrice || quote.bid || quote.ask || quote.previousClose || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        lastUpdate: Date.now()
      };
      
      priceCache[ySymbol] = data;
      res.json(data);
    } catch (error: any) {
      console.error(`Error fetching price for ${ySymbol}:`, error);
      res.status(500).json({ error: error.message || "Failed to fetch price" });
    }
  });

  // History endpoint
  app.get("/api/history/:symbol", async (req, res) => {
    const { symbol } = req.params;
    const ySymbol = normalizeSymbol(symbol);

    try {
      const queryOptions = { period1: '2024-01-01' };
      const result: any = await yahooFinance.chart(ySymbol, queryOptions);
      
      if (!result || !result.quotes) {
        throw new Error(`No history data found for ${ySymbol}`);
      }

      const history = result.quotes.map((p: any) => ({
        time: new Date(p.date).toLocaleDateString(),
        price: p.close
      })).filter((p: any) => p.price != null);

      res.json(history);
    } catch (error: any) {
      console.error(`Error fetching history for ${ySymbol}:`, error);
      res.status(500).json({ 
        error: "Failed to fetch history", 
        details: error.message
      });
    }
  });

  // Search endpoint
  app.get("/api/search/:query", async (req, res) => {
    const { query } = req.params;
    try {
      const result = await yahooFinance.search(query);
      res.json(result);
    } catch (error: any) {
      console.error(`Search error for ${query}:`, error);
      res.status(500).json({ error: error.message || "Search failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
