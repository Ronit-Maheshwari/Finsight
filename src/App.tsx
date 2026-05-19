import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Stocks } from './pages/Stocks';
import { Crypto } from './pages/Crypto';
import { Portfolio } from './pages/Portfolio';
import { Forex } from './pages/Forex';
import { Commodities } from './pages/Commodities';
import { Stocky } from './pages/Stocky';
import { News } from './pages/News';
import { MutualFunds } from './pages/MutualFunds';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'stocks': return <Stocks />;
      case 'crypto': return <Crypto />;
      case 'mutual-funds': return <MutualFunds />;
      case 'news': return <News />;
      case 'portfolio': return <Portfolio />;
      case 'forex': return <Forex />;
      case 'commodities': return <Commodities />;
      case 'stocky': return <Stocky />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
