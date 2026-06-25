import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { audio } from '../utils/audio';
import { getArchives } from '../utils/api';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ count: 0, years: 0 });

  useEffect(() => {
    // Load cumulative stats for the ticker
    getArchives().then(data => {
      const totalYears = data.reduce((acc, curr) => acc + (curr.survival_score?.survival_years || 0), 0);
      setStats({
        count: data.length,
        years: totalYears || 0
      });
    }).catch(() => {});
  }, []);

  const handleAction = (path) => {
    audio.playClick();
    navigate(path);
  };

  return (
    <div className="min-h-[85vh] bg-void text-text flex flex-col items-center justify-center px-8 relative font-mono select-none">
      
      {/* Hero Content Stark layout */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="text-center max-w-3xl space-y-6"
      >
        <p className="text-muted text-xs tracking-widest uppercase mb-4 animate-pulse">
          CIVILIZATION MEMORY OPERATING SYSTEM (M_OS)
        </p>
        
        <h1 className="text-4xl md:text-5xl font-light leading-tight tracking-wide text-text font-sans">
          Every civilization that has ever collapsed has taken its knowledge with it.
        </h1>
        
        <p className="text-xl text-muted leading-relaxed font-sans font-light">
          The internet is physical. It runs on grids, copper, and social stability. It has no survival protocol.
        </p>
        
        <p className="text-2xl text-warn font-semibold">
          We built one.
        </p>
        
        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => handleAction('/simulate/default')}
            className="px-8 py-3.5 bg-warn text-void font-bold rounded-lg hover:bg-yellow-400 transition-all uppercase text-xs tracking-widest shadow-[0_0_12px_rgba(240,165,0,0.3)]"
          >
            Watch the Simulation →
          </button>
          <button 
            onClick={() => handleAction('/encode')}
            className="px-8 py-3.5 border border-aurora text-text rounded-lg hover:border-signal hover:text-signal transition-all uppercase text-xs tracking-widest bg-cosmos bg-opacity-35"
          >
            Encode Knowledge
          </button>
        </div>
      </motion.div>

      {/* Real-time stats ticker */}
      <div className="absolute bottom-6 flex gap-12 text-center border-t border-aurora pt-6 w-full max-w-xl justify-center">
        <div>
          <p className="text-2xl font-light text-warn font-mono">{stats.count}</p>
          <p className="text-muted text-[10px] uppercase">Archives Created</p>
        </div>
        <div>
          <p className="text-2xl font-light text-warn font-mono">{stats.years} Y</p>
          <p className="text-muted text-[10px] uppercase">Knowledge Longevity</p>
        </div>
        <div>
          <p className="text-2xl font-light text-warn font-mono">0</p>
          <p className="text-muted text-[10px] uppercase">Prior Info Required</p>
        </div>
      </div>

    </div>
  );
}
