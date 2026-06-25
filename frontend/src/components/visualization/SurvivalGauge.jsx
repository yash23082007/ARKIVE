import React from "react";
import { ShieldAlert, Zap, ThermometerSnowflake, Orbit, AlertTriangle } from "lucide-react";

export default function SurvivalGauge({ survivalData }) {
  // Default fallback data
  const defaultData = survivalData || {
    overall_years: 450,
    overall_score_percentage: 75,
    factors: {
      decoder_complexity_kb: 12.0,
      redundancy_count: 4,
      media_independence: true,
      bootstrap_completeness: 95.0,
      compression_ratio: 2.45,
      math_anchors: 15
    },
    scenarios: [
      { name: "Solar Flare / EMP Pulse", score: 100, status: "EXCELLENT", description: "Survivable on physical plates." },
      { name: "Nuclear Winter / Grid Collapse", score: 75, status: "GOOD", description: "Can run local SQLite node." }
    ]
  };

  const percentage = Math.min(100, defaultData.overall_score_percentage);
  
  // SVG circular properties
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Icon mapper for scenarios
  const getScenarioIcon = (name) => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes("emp") || lowercase.includes("solar")) return <Zap className="w-5 h-5 text-neonCyan" />;
    if (lowercase.includes("winter") || lowercase.includes("grid")) return <ThermometerSnowflake className="w-5 h-5 text-cyan-400" />;
    if (lowercase.includes("space") || lowercase.includes("voyag")) return <Orbit className="w-5 h-5 text-neonAmber" />;
    return <ShieldAlert className="w-5 h-5 text-neonGreen" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "EXCELLENT": return "text-neonGreen border-neonGreen bg-green-950 bg-opacity-20";
      case "GOOD": return "text-cyan-400 border-cyan-400 bg-cyan-950 bg-opacity-20";
      case "MODERATE": return "text-neonAmber border-neonAmber bg-amber-950 bg-opacity-20";
      default: return "text-neonRed border-neonRed bg-red-950 bg-opacity-20";
    }
  };

  return (
    <div className="hud-panel p-5 border border-cyan-800 bg-slate-950 bg-opacity-70 rounded flex flex-col gap-6">
      {/* Top Title */}
      <div className="border-b border-cyan-950 pb-2 flex items-center justify-between">
        <div>
          <h3 className="text-neonCyan text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" /> ARCHIVE SURVIVAL RADAR
          </h3>
          <p className="text-[10px] text-slate-500">ESTIMATED LONGEVITY AND SCENARIO INDEX</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Radial Progress Gauge */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-cyan-400 transition-all duration-1000 ease-out"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0px 0px 4px #00e5ff)" }}
              />
            </svg>
            <div className="absolute text-center">
              <span className="block text-2xl font-bold font-mono text-neonAmber neon-glow-amber">
                {defaultData.overall_years}
              </span>
              <span className="text-[9px] text-cyan-500 uppercase tracking-widest font-mono font-bold block">
                YEARS
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 text-center font-mono mt-2 uppercase tracking-wide">
            LONGEVITY PROFILE INDEX: {percentage}%
          </div>
        </div>

        {/* Longevity factors */}
        <div className="md:col-span-2 grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 border border-cyan-950 bg-slate-900 bg-opacity-30 rounded">
            <span className="text-slate-500 block uppercase text-[9px]">Hardware Independence</span>
            <span className="text-neonGreen font-bold">{defaultData.factors.media_independence ? "YES (PASSIVE PRINT)" : "NO (ELECTRONIC)"}</span>
          </div>
          <div className="p-2 border border-cyan-950 bg-slate-900 bg-opacity-30 rounded">
            <span className="text-slate-500 block uppercase text-[9px]">Redundancy Sectors</span>
            <span className="text-neonCyan font-bold">{defaultData.factors.redundancy_count} Parity Blocks</span>
          </div>
          <div className="p-2 border border-cyan-950 bg-slate-900 bg-opacity-30 rounded">
            <span className="text-slate-500 block uppercase text-[9px]">Rosetta Primer Completeness</span>
            <span className="text-neonAmber font-bold">{defaultData.factors.bootstrap_completeness}%</span>
          </div>
          <div className="p-2 border border-cyan-950 bg-slate-900 bg-opacity-30 rounded">
            <span className="text-slate-500 block uppercase text-[9px]">Mathematical Anchors</span>
            <span className="text-neonCyan font-bold">{defaultData.factors.math_anchors} anchors</span>
          </div>
        </div>
      </div>

      {/* Scenario breakdown */}
      <div className="space-y-3 border-t border-cyan-950 pt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">CATASTROPHE SCENARIO ANALYTICS</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {defaultData.scenarios.map((sc, idx) => (
            <div key={idx} className="p-3 border border-cyan-950 bg-slate-900 bg-opacity-40 rounded flex flex-col gap-2 relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getScenarioIcon(sc.name)}
                  <span className="text-xs font-bold font-mono text-neonCyan">{sc.name}</span>
                </div>
                <span className={`text-[8px] font-mono font-bold px-2 py-0.5 border rounded-sm uppercase ${getStatusColor(sc.status)}`}>
                  {sc.status}
                </span>
              </div>
              
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                {sc.description}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 h-1 rounded overflow-hidden mt-1 border border-cyan-950">
                <div
                  className="bg-cyan-400 h-full rounded"
                  style={{ width: `${sc.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
