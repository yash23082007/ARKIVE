import React, { useState, useEffect, useRef } from "react";
import { audio } from "../../utils/audio";
import { Play, Volume2, Shield } from "lucide-react";

export default function RosettaBootstrap({ bootstrapData }) {
  const [activeStage, setActiveStage] = useState(1);
  const spiralCanvasRef = useRef(null);

  // Default fallback data if bootstrapData is loading/absent
  const defaultData = bootstrapData || {
    stage_1_quantity: {
      data: [
        { representation: "●", numeric: 1 },
        { representation: "● ●", numeric: 2 },
        { representation: "● ● ●", numeric: 3 },
        { representation: "● ● ● ●", numeric: 4 }
      ]
    },
    stage_2_primes: {
      primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
    },
    stage_3_operations: {
      equations: [
        { eq: "● + ● = ● ●", numerical: "1 + 1 = 2" },
        { eq: "● ● × ● ● = ● ● ● ●", numerical: "2 × 2 = 4" }
      ]
    },
    stage_4_geometry: {
      relations: [
        { name: "Pi (Circumference / Diameter)", symbol: "π", value: 3.14159 },
        { name: "Golden Ratio", symbol: "φ", value: 1.61803 }
      ]
    },
    stage_5_physics: {
      constants: [
        { symbol: "c", name: "Speed of Light", value: "299,792,458 m/s" },
        { symbol: "G", name: "Gravitational Constant", value: "6.6743 × 10^-11 m^3/kg/s^2" }
      ]
    },
    stage_6_symbols: {
      vocabulary: {
        "human": "웃", "earth": "🜨", "sun": "☉", "water": "H₂O", "atom": "⚛", "star": "★", "life": "🧬"
      }
    },
    stage_7_grammar: {
      rules: [
        { concept: "Subject-Verb-Object (SVO)", symbolic_example: "웃 → 🌾 => Humans cultivate food" }
      ]
    }
  };

  // Draw golden spiral and circle on Stage 4 mount
  useEffect(() => {
    if (activeStage !== 4) return;
    const canvas = spiralCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let angle = 0;
    let isRunning = true;
    
    const draw = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      // 1. Draw Circle (Pi representation)
      ctx.strokeStyle = "rgba(0, 229, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx - 70, cy, 50, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(cx - 70, cy);
      ctx.lineTo(cx - 70 + Math.cos(angle) * 50, cy + Math.sin(angle) * 50);
      ctx.strokeStyle = "#00e5ff";
      ctx.stroke();

      // 2. Draw Golden Spiral (Phi representation)
      ctx.strokeStyle = "#ffb000";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      let a = 0.15;
      let b = 0.17; // golden spiral growth coefficient
      
      ctx.moveTo(cx + 70, cy);
      for (let theta = 0; theta < angle * 2.5; theta += 0.05) {
        const r = a * Math.exp(b * theta);
        const x = cx + 70 + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      angle += 0.02;
      requestAnimationFrame(draw);
    };
    
    draw();
    return () => { isRunning = false; };
  }, [activeStage]);

  // Audio Playback of Primes
  const playPrimeSignal = () => {
    audio.playBeep();
    const primes = defaultData.stage_2_primes.primes;
    let index = 0;
    
    const playNext = () => {
      if (index >= primes.length) return;
      const p = primes[index];
      
      // Synthesize pulse beep for prime value
      let pulseCount = 0;
      const pulseInterval = setInterval(() => {
        if (pulseCount < p) {
          audio.playSignalFrequency(true);
          pulseCount++;
        } else {
          clearInterval(pulseInterval);
          index++;
          // Delay before next prime
          setTimeout(playNext, 400);
        }
      }, 100);
    };
    
    playNext();
  };

  const selectStage = (stageNum) => {
    audio.playClick();
    setActiveStage(stageNum);
  };

  return (
    <div className="hud-panel p-5 border border-cyan-800 flex flex-col h-full bg-slate-950 bg-opacity-70 rounded">
      {/* HUD Header */}
      <div className="border-b border-cyan-800 pb-3 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-neonCyan text-lg uppercase tracking-widest flex items-center gap-2 font-bold">
            <Shield className="w-5 h-5" /> ROSETTA BOOTSTRAP DECODER
          </h2>
          <p className="text-[10px] text-cyan-600">STAGE-BY-STAGE DECODER SCHEMATIC</p>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <button
              key={num}
              onClick={() => selectStage(num)}
              className={`w-7 h-7 text-xs font-mono border rounded ${
                activeStage === num
                  ? "bg-cyan-500 border-cyan-300 text-slate-950 font-bold"
                  : "border-cyan-800 hover:border-cyan-500 text-cyan-500 bg-cyan-950 bg-opacity-20"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Panel Viewer */}
      <div className="flex-1 flex flex-col justify-center min-h-[220px]">
        {activeStage === 1 && (
          <div className="space-y-3">
            <h3 className="text-neonCyan text-sm font-bold border-b border-cyan-950 pb-1">STAGE 1: QUANTITY DEFINITION</h3>
            <p className="text-xs text-slate-400">Deduces counting integers by mapping graphic tokens to unit numbers.</p>
            <div className="grid grid-cols-2 gap-2 max-w-sm pt-2">
              {defaultData.stage_1_quantity.data.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 border border-cyan-950 bg-slate-900 bg-opacity-40 font-mono text-sm">
                  <span className="text-neonAmber">{item.representation}</span>
                  <span className="text-cyan-400">= {item.numeric}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStage === 2 && (
          <div className="space-y-3">
            <h3 className="text-neonCyan text-sm font-bold border-b border-cyan-950 pb-1">STAGE 2: PRIME SEQUENCE SIGNAL</h3>
            <p className="text-xs text-slate-400">Universally recognizable signature proving artificial intelligent sender.</p>
            <div className="flex flex-wrap gap-2 py-2">
              {defaultData.stage_2_primes.primes.map((prime, idx) => (
                <span key={idx} className="px-3 py-1 border border-cyan-800 bg-cyan-950 bg-opacity-40 text-cyan-400 font-mono text-sm font-bold rounded animate-pulse">
                  {prime}
                </span>
              ))}
            </div>
            <button
              onClick={playPrimeSignal}
              className="flex items-center gap-2 text-xs border border-neonAmber text-neonAmber hover:bg-neonAmber hover:text-slate-950 px-3 py-1.5 rounded transition-all font-mono"
            >
              <Volume2 className="w-4 h-4 animate-bounce" /> PLAY MODULATED BEACON AUDIO
            </button>
          </div>
        )}

        {activeStage === 3 && (
          <div className="space-y-3">
            <h3 className="text-neonCyan text-sm font-bold border-b border-cyan-950 pb-1">STAGE 3: MATHEMATICAL OPERATORS</h3>
            <p className="text-xs text-slate-400">Derives mathematical operations (+, -, ×, ÷, =) from dot diagrams.</p>
            <div className="space-y-2 pt-2 max-w-md">
              {defaultData.stage_3_operations.equations.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 border border-cyan-950 bg-slate-900 bg-opacity-40 font-mono text-xs">
                  <span className="text-neonAmber">{item.eq}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-cyan-400">{item.numerical}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStage === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-neonCyan text-sm font-bold border-b border-cyan-950 pb-1">STAGE 4: GEOMETRIC PROPORTIONS</h3>
              <p className="text-xs text-slate-400">Maps circular metrics and golden growth spirals as geometric constants.</p>
              <div className="space-y-2">
                {defaultData.stage_4_geometry.relations.map((rel, idx) => (
                  <div key={idx} className="p-2 border border-cyan-950 bg-slate-900 bg-opacity-40 text-xs">
                    <div className="flex justify-between font-mono font-bold text-neonAmber mb-0.5">
                      <span>{rel.symbol} ({rel.name})</span>
                      <span>{rel.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center items-center">
              <canvas ref={spiralCanvasRef} width={200} height={140} className="border border-cyan-950 bg-slate-900 bg-opacity-20 rounded" />
            </div>
          </div>
        )}

        {activeStage === 5 && (
          <div className="space-y-3">
            <h3 className="text-neonCyan text-sm font-bold border-b border-cyan-950 pb-1">STAGE 5: SYSTEM PHYSICAL ANCHORS</h3>
            <p className="text-xs text-slate-400">Calibrates system physics against universal cosmic invariant values.</p>
            <div className="grid grid-cols-1 gap-2 pt-2">
              {defaultData.stage_5_physics.constants.map((c, idx) => (
                <div key={idx} className="p-2 border border-cyan-950 bg-slate-900 bg-opacity-40 font-mono text-xs flex justify-between">
                  <div className="text-neonCyan font-bold">{c.symbol} <span className="text-slate-500 font-normal">({c.name})</span></div>
                  <div className="text-neonAmber font-bold">{c.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStage === 6 && (
          <div className="space-y-3">
            <h3 className="text-neonCyan text-sm font-bold border-b border-cyan-950 pb-1">STAGE 6: SEMANTIC GLYPH DICTIONARY</h3>
            <p className="text-xs text-slate-400">Translates basic lexical nouns to universal symbols (Glyphs).</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1 max-h-[140px] overflow-y-auto">
              {Object.entries(defaultData.stage_6_symbols.vocabulary).map(([word, symbol]) => (
                <div key={word} className="p-1 px-2 border border-cyan-950 bg-slate-900 bg-opacity-40 font-mono text-xs flex items-center justify-between">
                  <span className="text-slate-400 capitalize">{word}</span>
                  <span className="text-neonGreen text-sm font-bold">{symbol}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStage === 7 && (
          <div className="space-y-3">
            <h3 className="text-neonCyan text-sm font-bold border-b border-cyan-950 pb-1">STAGE 7: LOGICAL GRAMMAR CODES</h3>
            <p className="text-xs text-slate-400">Maps structural logical operators to establish full sentence structures.</p>
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {defaultData.stage_7_grammar.rules.map((rule, idx) => (
                <div key={idx} className="p-2 border border-cyan-950 bg-slate-900 bg-opacity-40 text-xs font-mono">
                  <div className="text-neonCyan font-bold uppercase mb-0.5">{rule.concept}</div>
                  <div className="text-neonAmber">{rule.symbolic_example}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{rule.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
