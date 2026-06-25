import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Components
import Navbar from './components/layout/Navbar';

// Pages
import Home from './pages/Home';
import Encoder from './pages/Encoder';
import Archive from './pages/Archive';
import ArchiveDetail from './pages/ArchiveDetail';
import Simulator from './pages/Simulator';
import SurvivalScore from './pages/SurvivalScore';
import About from './pages/About';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-void text-text font-mono relative crt flex flex-col justify-between">
          
          {/* Background scanline HUD layers */}
          <div className="absolute inset-0 hud-grid pointer-events-none z-0"></div>
          <div className="absolute inset-0 hud-sweep pointer-events-none z-0"></div>
          
          <div className="z-10 flex flex-col flex-1">
            <Navbar />
            <main className="flex-1 px-6 py-6 max-w-6xl mx-auto w-full">
              <Routes>
                <Route path="/"               element={<Home />} />
                <Route path="/encode"         element={<Encoder />} />
                <Route path="/archives"       element={<Archive />} />
                <Route path="/archives/:id"   element={<ArchiveDetail />} />
                <Route path="/simulate/:id"   element={<Simulator />} />
                <Route path="/survival/:id"   element={<SurvivalScore />} />
                <Route path="/about"          element={<About />} />
              </Routes>
            </main>
          </div>

          <footer className="z-10 border-t border-aurora bg-cosmos bg-opacity-95 px-6 py-3 select-none text-[9px] text-muted flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>ARKIVE Platform // Civilizational Information Backup Protocol</span>
            <span>SYSTEM TIME: {new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC</span>
          </footer>

        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
