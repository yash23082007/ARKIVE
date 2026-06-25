import React, { useEffect, useState } from "react";
import { audio } from "../utils/audio";
import { api } from "../services/api";
import { FolderOpen, Download, Trash2, Calendar, FileText, AlertTriangle, ShieldCheck } from "lucide-react";

export default function Archives({ onSelectArchive }) {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadArchives = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listArchives();
      setArchives(data);
    } catch (e) {
      setError("Failed to fetch compiled archives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchives();
  }, []);

  const handleDelete = async (archiveId, e) => {
    e.stopPropagation();
    audio.playAlert();
    if (!window.confirm("ARE YOU SURE YOU WANT TO CORRUPT AND DE-ALLOCATE THIS KNOWLEDGE BLOCK?")) {
      return;
    }
    
    try {
      await api.deleteArchive(archiveId);
      audio.playChime();
      loadArchives(); // reload lists
    } catch (e) {
      setError("Deletion failed.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 py-4 font-mono select-none">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-cyan-950 pb-2">
        <div>
          <h2 className="text-neonCyan text-lg uppercase tracking-widest font-bold">
            ARCHIVE REGISTRY DIRECTORY
          </h2>
          <p className="text-[10px] text-cyan-600">LISTING RESTORED AND COMPILED DATA NODES</p>
        </div>
        <button
          onClick={() => { audio.playClick(); loadArchives(); }}
          className="px-3 py-1 border border-cyan-800 text-cyan-500 hover:border-cyan-500 text-xs rounded bg-cyan-950 bg-opacity-20"
        >
          REFRESH CACHE
        </button>
      </div>

      {loading && (
        <div className="text-center py-12 text-neonAmber animate-pulse uppercase text-xs">
          Reading archive index sectors...
        </div>
      )}

      {error && (
        <div className="hud-panel p-4 border border-neonRed text-neonRed text-xs uppercase text-center rounded">
          {error}
        </div>
      )}

      {!loading && !error && archives.length === 0 && (
        <div className="hud-panel p-12 border border-cyan-950 rounded text-center text-slate-500 text-xs flex flex-col items-center gap-3">
          <FolderOpen className="w-10 h-10 text-cyan-900" />
          <span>NO COMPILED KNOWLEDGE BLOCKS FOUND IN LOCAL INDEX.</span>
        </div>
      )}

      {/* Grid of Archives */}
      {!loading && archives.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {archives.map((arch) => (
            <div
              key={arch.id}
              onClick={() => { audio.playBeep(); onSelectArchive(arch.id); }}
              className="hud-panel p-4 border border-cyan-800 hover:border-cyan-400 bg-slate-950 bg-opacity-70 rounded flex flex-col justify-between gap-4 cursor-pointer transition-all duration-300 relative group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[8px] text-slate-500 uppercase">Archive Node</span>
                  <span className="text-neonGreen text-[9px] font-bold flex items-center gap-1 border border-neonGreen border-opacity-30 px-1.5 py-0.5 rounded-sm bg-green-950 bg-opacity-20">
                    <ShieldCheck className="w-3.5 h-3.5" /> SURVIVAL: {arch.survival_score}Y
                  </span>
                </div>
                <h3 className="text-white text-sm font-bold group-hover:text-neonCyan transition-colors">
                  {arch.title}
                </h3>
                <div className="flex gap-4 text-[9px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {arch.created_at || "N/A"}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> {(arch.original_size / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-cyan-950 pt-3">
                <span className="text-[8px] text-cyan-700 tracking-wider">SECURE_BLOCK_{arch.id.slice(0, 8).toUpperCase()}</span>
                <div className="flex gap-2">
                  <a
                    href={api.getDownloadUrl(arch.id)}
                    onClick={(e) => { e.stopPropagation(); audio.playClick(); }}
                    download
                    className="p-1.5 border border-cyan-800 text-cyan-500 hover:border-cyan-500 hover:bg-cyan-950 hover:bg-opacity-20 rounded"
                    title="Download Packed Binary"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={(e) => handleDelete(arch.id, e)}
                    className="p-1.5 border border-neonRed text-neonRed hover:bg-neonRed hover:text-slate-950 rounded"
                    title="Purge Archive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
