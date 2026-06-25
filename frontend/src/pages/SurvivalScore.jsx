import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArchive } from '../utils/api';
import { audio } from '../utils/audio';
import { ChevronLeft, ShieldCheck, Zap, ThermometerSnowflake, Orbit, AlertTriangle } from 'lucide-react';

export default function SurvivalScore() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [archive, setArchive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getArchive(id)
      .then(data => setArchive(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-24 text-warn animate-pulse uppercase text-xs font-mono">
        Calculating environmental threat resistance scores...
      </div>
    );
  }

  if (!archive || !archive.survival_score) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4 font-mono">
        <div className="hud-panel p-6 border border-neonRed text-neonRed text-xs uppercase rounded-lg">
          Survival analytics not available for this node.
        </div>
        <button onClick={() => navigate(-1)} className="text-xs text-signal hover:underline">
          &lt; Go Back
        </button>
      </div>
    );
  }

  const scoreData = archive.survival_score;
  const grade = scoreData.grade || 'B';
  const years = scoreData.survival_years || 200;
  const scenarios = scoreData.scenario_scores || {};

  const getGradeColor = (g) => {
    if (g === 'A') return 'text-glow border-glow bg-glow bg-opacity-10';
    if (g === 'B') return 'text-signal border-signal bg-signal bg-opacity-10';
    return 'text-warn border-warn bg-warn bg-opacity-10';
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 py-4 font-mono select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-aurora pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { audio.playClick(); navigate(-1); }}
            className="p-1 border border-aurora text-muted hover:border-signal hover:text-text rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-white text-base font-bold uppercase">Longevity & Durability Analysis</h2>
            <p className="text-[9px] text-muted">ARCHIVE NODE: {archive.name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Large Dial display */}
        <div className="hud-panel p-6 border border-aurora bg-cosmos bg-opacity-70 rounded-xl flex flex-col items-center justify-center gap-2 text-center md:col-span-1">
          <span className="text-[10px] text-muted uppercase font-bold block">Estimated Durability</span>
          <div className="text-5xl font-bold text-warn font-mono neon-glow-amber my-2">
            {years} Y
          </div>
          <span className={`text-xs px-3 py-1 border rounded-sm font-bold uppercase ${getGradeColor(grade)}`}>
            Survival Grade: {grade}
          </span>
          <p className="text-[9px] text-slate-500 pt-2 border-t border-aurora border-opacity-35 mt-2 leading-relaxed">
            Calculated under mathematical anchors density, redundancy parity, and hardware abstraction metrics.
          </p>
        </div>

        {/* Scenarios bar list */}
        <div className="hud-panel p-5 border border-aurora bg-cosmos bg-opacity-70 rounded-xl space-y-4 md:col-span-2 flex flex-col justify-between">
          <h3 className="text-white text-xs uppercase tracking-widest border-b border-aurora pb-1.5 font-bold">
            Catastrophe Scenario Scores
          </h3>

          <div className="space-y-3">
            {/* Solar EMP */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-signal" /> Solar Flare / EMP Pulse</span>
                <span className="text-text font-bold">{scenarios.solar_emp || 100}%</span>
              </div>
              <div className="w-full bg-void h-1.5 rounded overflow-hidden border border-aurora">
                <div className="bg-signal h-full" style={{ width: `${scenarios.solar_emp || 100}%` }} />
              </div>
            </div>

            {/* Nuclear Winter */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="flex items-center gap-1"><ThermometerSnowflake className="w-3.5 h-3.5 text-glow" /> Grid Collapse / Nuclear Winter</span>
                <span className="text-text font-bold">{scenarios.nuclear_winter || 80}%</span>
              </div>
              <div className="w-full bg-void h-1.5 rounded overflow-hidden border border-aurora">
                <div className="bg-glow h-full" style={{ width: `${scenarios.nuclear_winter || 80}%` }} />
              </div>
            </div>

            {/* Space Decay */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="flex items-center gap-1"><Orbit className="w-3.5 h-3.5 text-warn" /> Radiation / Space Voyage Decay</span>
                <span className="text-text font-bold">{scenarios.space_decay || 70}%</span>
              </div>
              <div className="w-full bg-void h-1.5 rounded overflow-hidden border border-aurora">
                <div className="bg-warn h-full" style={{ width: `${scenarios.space_decay || 70}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical comparisons & recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Recommendations */}
        <div className="hud-panel p-5 border border-aurora bg-cosmos bg-opacity-70 rounded-xl space-y-3">
          <h4 className="text-white text-xs uppercase tracking-widest border-b border-aurora pb-2 font-bold">
            Longevity Improvements
          </h4>
          <ul className="text-[10px] text-muted space-y-2 list-disc list-inside font-sans">
            {grade !== 'A' ? (
              <>
                <li className="leading-relaxed">
                  <span className="text-warn font-mono uppercase font-bold">Increase Redundancy:</span> Re-compile with a level 5 XOR parity wrapper to maximize resistance against space decay radiation.
                </li>
                <li className="leading-relaxed">
                  <span className="text-signal font-mono uppercase font-bold">Enhance Anchors:</span> Incorporate more mathematical constants ($\pi, e$) to facilitate cognitive recovery on Stage 5.
                </li>
              </>
            ) : (
              <li className="leading-relaxed text-glow">
                Maximum structural index reached. Your archive is configured with optimal layers and is ready for micro-chemical quartz etching.
              </li>
            )}
            <li className="leading-relaxed">
              <span className="text-text font-mono uppercase font-bold">Physical Print:</span> Output a high-contrast physical microfilm copy to ensure complete grid-loss resilience.
            </li>
          </ul>
        </div>

        {/* Historical comparison */}
        <div className="hud-panel p-5 border border-aurora bg-cosmos bg-opacity-70 rounded-xl space-y-3">
          <h4 className="text-white text-xs uppercase tracking-widest border-b border-aurora pb-2 font-bold">
            Historical Archive lifespans
          </h4>
          <div className="space-y-2 text-[10px] text-muted">
            <div className="flex justify-between border-b border-aurora border-opacity-25 pb-1">
              <span>Library of Alexandria (Burned):</span>
              <span className="text-text">~23 Years</span>
            </div>
            <div className="flex justify-between border-b border-aurora border-opacity-25 pb-1">
              <span>Digital Internet (Predicted grid-resilience):</span>
              <span className="text-neonRed font-bold">&lt; 10 Years</span>
            </div>
            <div className="flex justify-between border-b border-aurora border-opacity-25 pb-1">
              <span className="text-signal font-bold">ARKIVE Node (Your compilation):</span>
              <span className="text-warn font-bold">{years} Years</span>
            </div>
            <div className="flex justify-between border-b border-aurora border-opacity-25 pb-1">
              <span>Rosetta Project Disk (Quartz Etch):</span>
              <span className="text-text">10,000 Years</span>
            </div>
            <div className="flex justify-between">
              <span>Voyager Golden Record (Deep Space Plaque):</span>
              <span className="text-text">40,000 Years</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
