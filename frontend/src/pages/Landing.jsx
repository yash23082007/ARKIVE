import React, { useRef, useState } from "react";
import { audio } from "../utils/audio";
import { Terminal, UploadCloud, Database, Cpu, Compass, BookOpen } from "lucide-react";

export default function Landing({ onEnterTerminal, onFileDecoded }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [decoding, setDecoding] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const decodeFile = async (file) => {
    if (!file) return;
    audio.playClick();
    setDecoding(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/api/decode-file", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Verification failed. Checksum or Parity error.");
      }

      const data = await res.json();
      audio.playChime();
      if (onFileDecoded) {
        onFileDecoded(data);
      }
    } catch (e) {
      audio.playAlert();
      setError(e.message || "Failed to decode the .arkive payload.");
    } finally {
      setDecoding(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      decodeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      decodeFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 py-6 select-none font-mono">
      
      {/* Visual Title Header */}
      <div className="text-center space-y-3 py-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-neonCyan neon-glow-cyan">
          ARKIVE PROTOCOL
        </h1>
        <p className="text-neonAmber text-xs md:text-sm tracking-wider uppercase">
          Civilization Memory OS // Self-Decoding Knowledge Beacon
        </p>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
      </div>

      {/* Zero-to-One Insight Panel */}
      <div className="hud-panel p-5 border border-cyan-800 bg-slate-950 bg-opacity-70 rounded relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500 opacity-5 blur-2xl"></div>
        <h2 className="text-neonCyan text-sm font-bold uppercase tracking-widest border-b border-cyan-950 pb-2 mb-3">
          The Core Insight (Zero-to-One)
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
          Every collapsed civilization took its knowledge with it. We assume the internet is permanent—but it runs on physical infrastructure, power grids, and political stability. We have never built knowledge to survive without its host. The Library of Alexandria had no backup. Neither does the internet.
        </p>
        <div className="text-xs text-cyan-400 font-bold border-l-2 border-neonAmber pl-3 py-1 font-mono italic">
          "True knowledge preservation must be hardware-agnostic, language-agnostic, and self-decoding from mathematics and observation alone."
        </div>
      </div>

      {/* Dual Entry Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Boot System Terminal */}
        <div className="hud-panel p-5 border border-cyan-800 bg-slate-950 bg-opacity-70 rounded flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-neonCyan text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
              <Terminal className="w-5 h-5" /> Boot core console
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Enter the interactive dashboard to ingest textual inputs, tag math anchors, assemble knowledge graphs, and package files locally.
            </p>
          </div>
          <button
            onClick={() => { audio.playBeep(); onEnterTerminal(); }}
            className="w-full py-3 border border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 font-bold tracking-widest text-xs rounded transition-all uppercase"
          >
            Launch Encoder Console
          </button>
        </div>

        {/* Decoder drop zone */}
        <div className="hud-panel p-5 border border-cyan-800 bg-slate-950 bg-opacity-70 rounded flex flex-col gap-4">
          <h3 className="text-neonCyan text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <UploadCloud className="w-5 h-5" /> Decode Offline Archive
          </h3>
          
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`border border-dashed p-6 rounded flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
              dragActive ? "border-neonAmber bg-cyan-950 bg-opacity-10" : "border-cyan-900 bg-slate-900 bg-opacity-20 hover:border-cyan-500"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".arkive"
              className="hidden"
              onChange={handleFileChange}
            />
            {decoding ? (
              <div className="text-xs text-neonAmber animate-pulse font-mono uppercase">
                Validating Checksums + XOR Parity blocks...
              </div>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-cyan-500" />
                <span className="text-[10px] text-slate-400 text-center font-mono">
                  DRAG & DROP OR CLICK TO LOAD .ARKIVE FILE
                </span>
              </>
            )}
          </div>
          {error && <div className="text-[10px] text-neonRed font-bold text-center">{error}</div>}
        </div>
      </div>
      
      {/* Component highlights info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-cyan-950">
        <div className="text-center p-2 border border-cyan-950 bg-slate-900 bg-opacity-10 rounded">
          <Compass className="w-5 h-5 mx-auto text-neonAmber mb-1" />
          <div className="text-[9px] text-slate-500 uppercase">Layer 0 & 1</div>
          <div className="text-[10px] text-cyan-400 font-bold">Rosetta Prime Header</div>
        </div>
        <div className="text-center p-2 border border-cyan-950 bg-slate-900 bg-opacity-10 rounded">
          <Database className="w-5 h-5 mx-auto text-cyan-400 mb-1" />
          <div className="text-[9px] text-slate-500 uppercase">Layer 2</div>
          <div className="text-[10px] text-cyan-400 font-bold">Semantic Graph</div>
        </div>
        <div className="text-center p-2 border border-cyan-950 bg-slate-900 bg-opacity-10 rounded">
          <Cpu className="w-5 h-5 mx-auto text-neonGreen mb-1" />
          <div className="text-[9px] text-slate-500 uppercase">Layer 3</div>
          <div className="text-[10px] text-cyan-400 font-bold">LZ77 + Huffman</div>
        </div>
        <div className="text-center p-2 border border-cyan-950 bg-slate-900 bg-opacity-10 rounded">
          <BookOpen className="w-5 h-5 mx-auto text-neonCyan mb-1" />
          <div className="text-[9px] text-slate-500 uppercase">Layer 4</div>
          <div className="text-[10px] text-cyan-400 font-bold">XOR Parity ECC</div>
        </div>
      </div>
    </div>
  );
}
