import React from "react";
import { Download, FileCode, CheckCircle, Percent } from "lucide-react";

export default function CompressionStats({ stats, codebook, onDownload }) {
  const original = stats?.original_size || 1024;
  const compressed = stats?.packed_size || 350;
  
  const savings = Math.max(0, Math.round((1 - (compressed / original)) * 100));
  const ratio = (original / Math.max(1, compressed)).toFixed(2);

  // Take top 8 characters from codebook to display bit distributions
  const codebookEntries = Object.entries(codebook || {})
    .sort((a, b) => a[1].length - b[1].length)
    .slice(0, 8);

  return (
    <div className="hud-panel p-5 border border-cyan-800 bg-slate-950 bg-opacity-70 rounded flex flex-col gap-4">
      {/* Title */}
      <div className="border-b border-cyan-950 pb-2 flex justify-between items-center">
        <div>
          <h3 className="text-neonCyan text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Percent className="w-5 h-5" /> COMPRESSION METRICS
          </h3>
          <p className="text-[10px] text-slate-500">HUFFMAN AND LZ77 REDUCTION STATS</p>
        </div>
        {onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold border border-neonAmber text-neonAmber hover:bg-neonAmber hover:text-slate-950 rounded transition-all"
          >
            <Download className="w-3.5 h-3.5" /> DOWNLOAD .ARKIVE
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Progress bar comparison */}
        <div className="space-y-4">
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>ORIGINAL SOURCE:</span>
              <span className="text-white">{(original / 1024).toFixed(2)} KB ({original} B)</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded border border-cyan-950">
              <div className="bg-cyan-500 h-full rounded" style={{ width: "100%" }} />
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>COMPRESSED .ARKIVE:</span>
              <span className="text-neonGreen">{(compressed / 1024).toFixed(2)} KB ({compressed} B)</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded border border-cyan-950">
              <div 
                className="bg-neonGreen h-full rounded transition-all duration-700" 
                style={{ width: `${Math.max(5, (compressed / original) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono pt-1">
            <div className="p-2 border border-cyan-950 bg-slate-900 bg-opacity-30 rounded">
              <span className="text-slate-500 block text-[9px] uppercase">Space Savings</span>
              <span className="text-neonGreen text-sm font-bold">{savings}%</span>
            </div>
            <div className="p-2 border border-cyan-950 bg-slate-900 bg-opacity-30 rounded">
              <span className="text-slate-500 block text-[9px] uppercase">Compression Ratio</span>
              <span className="text-neonCyan text-sm font-bold">{ratio}:1</span>
            </div>
          </div>
        </div>

        {/* Huffman Codebook visual table */}
        <div className="border border-cyan-950 p-3 bg-slate-900 bg-opacity-25 rounded flex flex-col font-mono text-[10px]">
          <div className="text-slate-500 pb-1 mb-2 border-b border-cyan-950 flex justify-between uppercase">
            <span>Character</span>
            <span>Prefix bit-code</span>
          </div>
          {codebookEntries.length === 0 ? (
            <div className="text-cyan-700 flex-1 flex items-center justify-center italic">No codebook loaded</div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 overflow-y-auto max-h-[105px] pr-1">
              {codebookEntries.map(([char, bitstr]) => (
                <div key={char} className="flex justify-between border-b border-cyan-950 border-opacity-30 pb-0.5">
                  <span className="text-cyan-400">
                    {char === " " ? "[space]" : char === "\n" ? "[newline]" : char}
                  </span>
                  <span className="text-neonAmber font-bold">{bitstr}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
