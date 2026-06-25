import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSimulationSteps, getArchive } from '../utils/api';
import { audio } from '../utils/audio';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, ShieldCheck } from 'lucide-react';

export default function Simulator() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [archiveName, setArchiveName] = useState('Default Demo Archive');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSteps = async () => {
      setLoading(true);
      try {
        const archiveId = id && id !== 'default' ? id : null;
        if (archiveId) {
          const arch = await getArchive(archiveId);
          setArchiveName(arch.name);
        }
        
        const data = await getSimulationSteps(archiveId);
        setSteps(data.steps || []);
      } catch (e) {
        console.error("Failed to load simulation steps:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSteps();
  }, [id]);

  // Auto-play interval triggers
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        audio.playBeep();
        setCurrentStep(s => s + 1);
      } else {
        setIsPlaying(false);
        audio.playChime();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  const togglePlay = () => {
    audio.playClick();
    if (currentStep === steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    audio.playClick();
    setCurrentStep(s => Math.max(0, s - 1));
  };

  const handleNext = () => {
    audio.playClick();
    setCurrentStep(s => Math.min(steps.length - 1, s + 1));
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-warn animate-pulse uppercase text-xs font-mono">
        Pre-assembling civilization decoding matrices...
      </div>
    );
  }

  const step = steps[currentStep] || {};

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
            <h2 className="text-white text-base font-bold uppercase">Civilization Decoder Simulation</h2>
            <p className="text-[9px] text-muted">DECODING CORPUS: {archiveName}</p>
          </div>
        </div>
      </div>

      <p className="text-muted text-xs text-center border-b border-aurora border-opacity-35 pb-2 leading-relaxed">
        "You are a scholar 800 years in the future. The digital world has turned to dust. You find a physical nickel disk. Watch your civilization reconstruct human knowledge step by step."
      </p>

      {/* Progress Timeline */}
      <div className="flex gap-1 bg-void p-1 border border-aurora rounded-lg">
        {steps.map((s, i) => (
          <div key={i}
            className={`h-2 flex-1 rounded-sm transition-all duration-500 ${
              i <= currentStep ? 'bg-warn shadow-[0_0_6px_#f0a500]' : 'bg-aurora'
            }`}
            title={s.title}
          />
        ))}
      </div>

      {/* Main step container */}
      <div className="hud-panel p-6 border border-aurora bg-cosmos bg-opacity-70 rounded-xl min-h-[260px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center text-[9px] text-warn tracking-widest uppercase">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>Layer {step.layer}</span>
            </div>
            
            <h2 className="text-2xl font-light text-white font-sans">{step.title}</h2>
            
            <p className="text-text text-sm leading-relaxed font-sans font-light select-text">
              {step.description}
            </p>

            {/* Unlocked concepts */}
            {step.concepts_unlocked && step.concepts_unlocked.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[9px] text-muted uppercase mr-1">Unlocked:</span>
                {step.concepts_unlocked.map(c => (
                  <span key={c} className="px-2.5 py-0.5 border border-warn border-opacity-30 text-warn bg-warn bg-opacity-5 rounded text-[10px]">
                    {c}
                  </span>
                ))}
              </div>
            )}

            {/* Emotional Weight blockquote */}
            {step.emotional_weight && (
              <blockquote className="border-l-2 border-warn pl-4 text-muted italic text-[11px] font-sans pt-2">
                "{step.emotional_weight}"
              </blockquote>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center items-center">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-6 py-2 border border-aurora rounded-lg hover:border-signal text-text hover:text-signal disabled:opacity-30 text-xs uppercase"
        >
          ← Previous
        </button>
        <button
          onClick={togglePlay}
          className={`px-8 py-2 font-bold text-void rounded-lg uppercase text-xs tracking-wider transition-all border ${
            isPlaying 
              ? 'bg-warn border-warn shadow-[0_0_8px_rgba(240,165,0,0.3)]' 
              : 'bg-signal border-signal shadow-[0_0_8px_rgba(79,142,247,0.3)]'
          }`}
        >
          {isPlaying ? 'Pause' : 'Auto Play'}
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="px-6 py-2 border border-aurora rounded-lg hover:border-signal text-text hover:text-signal disabled:opacity-30 text-xs uppercase"
        >
          Next →
        </button>
      </div>

    </div>
  );
}
