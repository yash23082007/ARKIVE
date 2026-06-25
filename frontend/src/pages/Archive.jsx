import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { audio } from "../utils/audio";
import { getArchives, deleteArchive } from "../utils/api";
import { FolderOpen, Download, Trash2, Calendar, FileText, ShieldCheck } from "lucide-react";

export default function Archive() {
  const navigate = useNavigate();
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRegistry = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getArchives();
      setArchives(data);
    } catch (e) {
      setError("Failed to resolve compiled archives index.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistry();
  }, []);

  const handleCardClick = (id) => {
    audio.playBeep();
    navigate(`/archives/${id}`);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    audio.playAlert();
    if (!window.confirm("ARE YOU SURE YOU WANT TO CORRUPT AND DE-ALLOCATE THIS KNOWLEDGE SECTOR?")) {
      return;
    }
    try {
      await deleteArchive(id);
      audio.playChime();
      loadRegistry();
    } catch (e) {
      setError("Failed to de-allocate archive.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 py-4 font-mono select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-aurora pb-2">
        <div>
          <h2 className="text-white text-lg uppercase tracking-widest font-bold">
            ARCHIVE REGISTRY DIRECTORY
          </h2>
          <p className="text-[10px] text-muted">LISTING COMPILED .CMEM SECURED KNOWLEDGE FILES</p>
        </div>
        <button
          onClick={() => { audio.playClick(); loadRegistry(); }}
          className="px-3 py-1 border border-aurora text-muted hover:border-signal hover:text-text text-xs rounded bg-cosmos bg-opacity-20"
        >
          REFRESH INDEX
        </button>
      </div>

      {loading && (
        <div className="text-center py-16 text-warn animate-pulse uppercase text-xs">
          Scanning database index tracks...
        </div>
      )}

      {error && (
        <div className="hud-panel p-4 border border-neonRed text-neonRed text-xs uppercase text-center rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && archives.length === 0 && (
        <div className="hud-panel p-12 border border-aurora rounded-xl text-center text-muted text-xs flex flex-col items-center gap-3">
          <FolderOpen className="w-10 h-10 text-aurora" />
          <span>NO SECURED ARCHIVES REGISTERED IN CLOUD DATABASE.</span>
        </div>
      )}

      {/* Grid of Archive Cards */}
      {!loading && archives.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {archives.map((arch) => (
            <div
              key={arch.id}
              onClick={() => handleCardClick(arch.id)}
              className="hud-panel p-4 border border-aurora hover:border-signal bg-cosmos bg-opacity-70 rounded-xl flex flex-col justify-between gap-4 cursor-pointer transition-all duration-300 relative group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[8px] text-muted uppercase">Secure Sector</span>
                  <span className="text-glow text-[9px] font-bold flex items-center gap-1 border border-glow border-opacity-30 px-1.5 py-0.5 rounded bg-glow bg-opacity-5">
                    <ShieldCheck className="w-3.5 h-3.5" /> SURVIVAL: {arch.survival_score?.survival_years || 50}Y
                  </span>
                </div>
                <h3 className="text-text text-sm font-bold group-hover:text-signal transition-colors font-sans">
                  {arch.name}
                </h3>
                <div className="flex gap-4 text-[9px] text-muted font-mono">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-aurora" /> {arch.created_at ? new Date(arch.created_at).toISOString().split('T')[0] : 'N/A'}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-aurora" /> {(arch.compressed_size_bytes / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between border-t border-aurora pt-3">
                <span className="text-[8px] text-aurora tracking-wider">BLOCK_ID_{arch.id.slice(0, 8).toUpperCase()}</span>
                <div className="flex gap-2">
                  <a
                    href={`http://localhost:8000/api/archive/${arch.id}/download`}
                    onClick={(e) => { e.stopPropagation(); audio.playClick(); }}
                    download
                    className="p-1.5 border border-aurora text-muted hover:border-signal hover:text-text rounded bg-void bg-opacity-20"
                    title="Download .cmem File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={(e) => handleDelete(arch.id, e)}
                    className="p-1.5 border border-neonRed text-neonRed hover:bg-neonRed hover:text-void rounded"
                    title="De-allocate Sector"
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
