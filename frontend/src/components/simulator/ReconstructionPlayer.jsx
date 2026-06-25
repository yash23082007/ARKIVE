import React, { useState, useEffect } from "react";
import { audio } from "../../utils/audio";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, CheckCircle, Terminal } from "lucide-react";

export default function ReconstructionPlayer({ steps }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(2000); // 2 seconds per step

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      if (currentStep < steps.length - 1) {
        audio.playBeep();
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsPlaying(false);
        audio.playChime(); // Play double success chime at the end
      }
    }, playSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, currentStep, steps, playSpeed]);

  const togglePlay = () => {
    audio.playClick();
    if (currentStep === steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const resetSim = () => {
    audio.playClick();
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const stepForward = () => {
    audio.playClick();
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    audio.playClick();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!steps || steps.length === 0) {
    return <div className="text-cyan-500 font-mono text-xs">No simulation data available.</div>;
  }

  const active = steps[currentStep];

  return (
    <div className="hud-panel p-5 border border-cyan-800 flex flex-col gap-4 bg-slate-950 bg-opacity-70 rounded h-full">
      {/* Simulation Controls HUD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-cyan-950 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-cyan-500 bg-cyan-950 bg-opacity-25 flex items-center justify-center text-cyan-400 font-bold font-mono">
            {currentStep + 1}
          </div>
          <div>
            <h3 className="text-sm font-bold text-neonCyan uppercase tracking-widest">RECONSTRUCTION STEP COMPILER</h3>
            <p className="text-[10px] text-slate-500">SIMULATE FIRST-PRINCIPLES DECODING DE-COMPRESSION</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={stepBackward}
            disabled={currentStep === 0}
            className="p-1.5 border border-cyan-800 text-cyan-500 hover:border-cyan-500 disabled:opacity-30 rounded bg-cyan-950 bg-opacity-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={togglePlay}
            className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition-all border ${
              isPlaying
                ? "bg-neonAmber text-slate-950 border-neonAmber"
                : "bg-cyan-500 text-slate-950 border-cyan-400"
            }`}
          >
            {isPlaying ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5" />}
            {isPlaying ? "PAUSE SIM" : "PLAY AUTO"}
          </button>

          <button
            onClick={stepForward}
            disabled={currentStep === steps.length - 1}
            className="p-1.5 border border-cyan-800 text-cyan-500 hover:border-cyan-500 disabled:opacity-30 rounded bg-cyan-950 bg-opacity-20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={resetSim}
            className="p-1.5 border border-neonRed text-neonRed hover:bg-neonRed hover:text-slate-950 rounded bg-red-950 bg-opacity-10"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Steps Progress Timeline */}
      <div className="flex gap-1 w-full py-1 bg-slate-900 bg-opacity-50 px-1 border border-cyan-950 rounded">
        {steps.map((s, idx) => {
          let color = "bg-slate-800";
          if (idx < currentStep) color = "bg-neonGreen";
          if (idx === currentStep) color = "bg-cyan-400 animate-pulse";
          return (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-sm transition-colors duration-300 ${color}`}
              title={s.title}
            />
          );
        })}
      </div>

      {/* Step details dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Step details & system message */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-[10px] text-neonAmber tracking-widest uppercase font-mono">
              SYSTEM REPORT • SECTOR_{currentStep}
            </div>
            <h4 className="text-neonCyan text-base font-bold uppercase tracking-wider">
              {active.title}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {active.log}
            </p>
          </div>

          <div className="p-3 border border-cyan-950 bg-cyan-950 bg-opacity-10 rounded flex items-start gap-2.5">
            <CheckCircle className={`w-5 h-5 shrink-0 ${currentStep === steps.length - 1 ? 'text-neonGreen' : 'text-cyan-500 animate-spin'}`} />
            <div className="text-[10px] text-cyan-600 font-mono leading-tight">
              {currentStep === steps.length - 1 ? (
                <span className="text-neonGreen font-bold">DECODING COMPLETE. KNOWLEDGE GRID SUCCESSFULLY RESTORED TO COGNITIVE BASE.</span>
              ) : (
                <span>ASSEMBLING SUB-MODULE... PARSING CHECK-CHECKSUMS FOR BIT SECTORS. RUNNING MEMORY INTEGRATION.</span>
              )}
            </div>
          </div>
        </div>

        {/* Code / Visual state output */}
        <div className="border border-cyan-950 bg-slate-900 bg-opacity-50 p-4 rounded flex flex-col h-full min-h-[160px] relative font-mono text-[11px] leading-relaxed">
          <div className="absolute top-2 right-3 text-[8px] text-cyan-800 font-mono flex items-center gap-1 select-none">
            <Terminal className="w-3.5 h-3.5" /> COMPILED_CACHE_LOG
          </div>
          <div className="text-slate-500 border-b border-cyan-950 pb-1 mb-2 uppercase select-none">
            OUTPUT DATA BUFFER
          </div>
          <pre className="flex-1 overflow-auto text-neonGreen text-opacity-90 max-h-[150px] whitespace-pre-wrap">
            {active.code}
          </pre>
        </div>
      </div>
    </div>
  );
}
