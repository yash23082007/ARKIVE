import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getArchive, getSimulationSteps } from '../utils/api';
import { audio } from '../utils/audio';
import KnowledgeGraph from '../components/visualization/KnowledgeGraph';
import { ChevronLeft, Download, ShieldCheck, Cpu, Database, AlertCircle, FileText, Binary } from 'lucide-react';

export default function ArchiveDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [archive, setArchive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    
    getArchive(id)
      .then(data => {
        setArchive(data);
      })
      .catch(e => {
        setError("Failed to load archive details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAction = (path) => {
    audio.playClick();
    navigate(path);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-warn animate-pulse uppercase text-xs font-mono">
        Retrieving binary layers from database... verifying signatures...
      </div>
    );
  }

  if (error || !archive) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4 font-mono">
        <div className="hud-panel p-6 border border-neonRed text-neonRed text-xs uppercase rounded-lg">
          {error || "Archive could not be resolved."}
        </div>
        <button onClick={() => navigate('/archives')} className="text-xs text-signal hover:underline">
          &lt; Return to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 py-4 font-mono select-none">
      
      {/* Top action header */}
      <div className="flex justify-between items-center border-b border-aurora pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAction('/archives')}
            className="p-1 border border-aurora text-muted hover:border-signal hover:text-text rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-white text-base font-bold uppercase">{archive.name}</h2>
            <p className="text-[9px] text-muted">SECURED BLOCK: {archive.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`http://localhost:8000/api/archive/${archive.id}/download`}
            onClick={() => audio.playClick()}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-bold border border-warn text-warn hover:bg-warn hover:text-void rounded transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Download .cmem
          </a>
        </div>
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Stats and detail */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Metadata Card */}
          <div className="hud-panel p-4 border border-aurora bg-cosmos bg-opacity-70 rounded-xl space-y-3">
            <h3 className="text-white text-xs uppercase tracking-widest border-b border-aurora pb-2 font-bold">
              Archive Diagnostics
            </h3>
            
            <div className="space-y-2 text-[10px] text-muted">
              <div className="flex justify-between">
                <span>Original Corpus Size:</span>
                <span className="text-text">{archive.original_size_bytes} Bytes</span>
              </div>
              <div className="flex justify-between">
                <span>Compressed Package:</span>
                <span className="text-text">{archive.compressed_size_bytes} Bytes</span>
              </div>
              <div className="flex justify-between">
                <span>Compression Savings:</span>
                <span className="text-glow font-bold">
                  {Math.round((1 - (archive.compressed_size_bytes / (archive.original_size_bytes || 1))) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Concept Nodes:</span>
                <span className="text-text">{archive.knowledge_nodes.length} nodes</span>
              </div>
              <div className="flex justify-between">
                <span>Logical Edges:</span>
                <span className="text-text">{archive.knowledge_edges.length} connections</span>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                onClick={() => handleAction(`/survival/${archive.id}`)}
                className="w-full py-2 bg-glow bg-opacity-5 hover:bg-opacity-20 border border-glow text-glow text-[10px] font-bold tracking-wider uppercase rounded"
              >
                SURVIVAL GRADE: {archive.survival_score?.grade} ({archive.survival_score?.survival_years} Y)
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2">
            <button
              onClick={() => handleAction(`/simulate/${archive.id}`)}
              className="w-full py-3 bg-signal text-void font-bold text-xs tracking-wider rounded-lg hover:bg-blue-400 transition-all uppercase flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" /> Watch Reconstruction Simulation
            </button>
          </div>

          {/* Concept Detail Node viewer */}
          <div className="hud-panel p-4 border border-aurora bg-cosmos bg-opacity-70 rounded-xl min-h-[140px] flex flex-col justify-center">
            {selectedNode ? (
              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between border-b border-aurora pb-1">
                  <span className="text-signal uppercase font-bold font-mono">#{selectedNode.id}</span>
                  <span className="text-warn border border-warn border-opacity-40 px-1 py-0.5 rounded-sm">Layer {selectedNode.layer}</span>
                </div>
                <p className="text-text font-sans text-xs leading-relaxed">
                  {selectedNode.definition || "No definition loaded."}
                </p>
              </div>
            ) : (
              <div className="text-center text-muted italic text-[11px] uppercase font-mono">
                Click a node on the topological map to inspect its conceptual blueprint
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Graph view */}
        <div className="md:col-span-2">
          <KnowledgeGraph
            nodes={archive.knowledge_nodes}
            edges={archive.knowledge_edges}
            onNodeClick={handleNodeSelect => setSelectedNode(handleNodeSelect)}
          />
        </div>
      </div>

    </div>
  );
}
