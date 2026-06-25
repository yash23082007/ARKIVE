import React from "react";
import { HelpCircle, Shield, Compass, BookOpen } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 py-4 font-mono select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-white text-lg uppercase tracking-widest font-bold flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-signal" /> PROTOCOL SPECIFICATION DOSSIER
        </h2>
        <p className="text-[10px] text-muted uppercase">SYSTEM ARCHITECTURE SPECIFICATION PAPER</p>
      </div>

      {/* Dossier Body */}
      <div className="hud-panel p-6 border border-aurora bg-cosmos bg-opacity-70 rounded-xl space-y-6 font-sans text-sm text-text leading-relaxed">
        
        <div className="space-y-2 border-b border-aurora border-opacity-35 pb-4">
          <h3 className="text-signal font-bold uppercase tracking-wider font-mono text-xs">Page 1: The Problem</h3>
          <p>
            Every civilization that has ever collapsed has taken its knowledge with it. We have never solved this. We assume the digital cloud is permanent, but it rests on a complex, brittle stack of physical grids, geopolitical stability, and continuous electric power. The Library of Alexandria had no backup. Neither does the internet. ARKIVE is the first engineering attempt to build a backup that can survive without its host.
          </p>
        </div>

        <div className="space-y-2 border-b border-aurora border-opacity-35 pb-4">
          <h3 className="text-signal font-bold uppercase tracking-wider font-mono text-xs">Page 2: The Insight</h3>
          <p>
            The Rosetta Stone decoded an extinct language because it repeated the same content in three scripts. ARKIVE uses **mathematics**—the only language guaranteed to hold identical meaning to any future intelligence—as its universal decoder. By starting with prime numbers (detectable by any scientific mind) and building up to arithmetic, geometry, chemical elements, and logic gates, we construct a self-explaining semantic primer from first principles.
          </p>
        </div>

        <div className="space-y-4 border-b border-aurora border-opacity-35 pb-4">
          <h3 className="text-signal font-bold uppercase tracking-wider font-mono text-xs">Page 3: The System Spec</h3>
          <p className="text-xs text-muted font-mono leading-tight">
            The .cmem archive stores concepts in a structured binary stream categorized into six progressive layers:
          </p>
          
          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-2.5 border border-aurora bg-void rounded">
              <span className="text-warn font-bold block uppercase text-[10px] mb-0.5">Layer 0: Prime Sequence Header</span>
              First 8 primes in binary (2, 3, 5, 7, 11, 13, 17, 19). Signal check beacon establishing intelligent origin.
            </div>
            
            <div className="p-2.5 border border-aurora bg-void rounded text-xs">
              <span className="text-signal font-bold block uppercase text-[10px] mb-0.5">Layer 1 & 2: Physics and Chemistry</span>
              Gravitational models, speed of light, and molecular formulations of universal substances like water.
            </div>

            <div className="p-2.5 border border-aurora bg-void rounded text-xs">
              <span className="text-glow font-bold block uppercase text-[10px] mb-0.5">Layer 3 & 4: Biological and Cognitive Codes</span>
              Cell reproduction, DNA base pairs (A, T, C, G), memory constraints, and grammar logic guides.
            </div>

            <div className="p-2.5 border border-aurora bg-void rounded text-xs">
              <span className="text-text font-bold block uppercase text-[10px] mb-0.5">Layer 5: Civilization Almanacs</span>
              Socio-agricultural guidelines, coordinate maps of natural structures, crop rotations, and medical axioms.
            </div>
          </div>
        </div>

        <div className="space-y-2 border-b border-aurora border-opacity-35 pb-4">
          <h3 className="text-signal font-bold uppercase tracking-wider font-mono text-xs">Page 4: The Impact</h3>
          <p>
            Preserving human knowledge across civilizational cycles is not just a storage challenge—it is an information theory problem. By mapping semantic concept connections rather than just text corpora, we preserve **how ideas connect**, ensuring that future readers do not just inherit facts, but rebuild our entire scientific framework.
          </p>
        </div>

        <div className="text-center font-mono text-warn text-xs italic tracking-wider py-2 select-text">
          "We do not know when the next Alexandria will burn. We know that ARKIVE will survive it."
        </div>

      </div>
    </div>
  );
}
