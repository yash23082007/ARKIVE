import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { extractConcepts, generateArchive } from '../utils/api';
import { audio } from '../utils/audio';
import { FileText, Cpu, Download, ArrowRight, Loader } from 'lucide-react';

export default function Encoder() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [concepts, setConcepts] = useState([]);
  const [redundancyLevel, setRedundancyLevel] = useState(3);
  
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [archiveReady, setArchiveReady] = useState(false);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    if (!inputText || !inputText.trim()) {
      setError("Please paste a text corpus first.");
      return;
    }
    audio.playClick();
    setLoading(true);
    setError('');
    setStatusText('Running spaCy concept identification...');
    
    try {
      const data = await extractConcepts(inputText);
      audio.playChime();
      setConcepts(data.concepts);
      if (data.concepts.length === 0) {
        setError("No significant concepts identified. Try inputting longer text with scientific terms.");
      }
    } catch (e) {
      audio.playAlert();
      setError(e.message || "Failed to identify concepts.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateArchive = async () => {
    if (concepts.length === 0) return;
    audio.playClick();
    setLoading(true);
    setError('');
    setStatusText('Compiling binary structures and prime-indexed dictionary hashes...');

    try {
      const safeTitle = title.trim() || 'Civilization Archive';
      const response = await generateArchive(concepts, safeTitle, redundancyLevel);
      
      audio.playChime();
      
      // Try to read the custom archive ID header from axios response headers
      // If not exposed, generate a fallback or query list
      const archiveId = response.headers['x-archive-id'] || 'offline';
      
      // Trigger download of the .cmem file
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${safeTitle.replace(/\s+/g, '_')}.cmem`;
      a.click();
      
      setArchiveReady(true);
      
      // Delay navigation slightly so user sees download starting
      setTimeout(() => {
        if (archiveId && archiveId !== 'offline') {
          navigate(`/archives/${archiveId}`);
        } else {
          navigate('/archives');
        }
      }, 1500);

    } catch (e) {
      audio.playAlert();
      setError(e.message || "Failed to generate .cmem archive.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 py-4 font-mono select-none">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-light text-white mb-1 uppercase tracking-widest text-neonCyan">Knowledge Encoder</h1>
        <p className="text-[10px] text-muted uppercase">
          Encode raw text documents into a civilization-independent .cmem binary backup.
        </p>
      </div>

      {/* Main editor form */}
      <div className="hud-panel p-5 border border-aurora bg-cosmos bg-opacity-80 rounded-xl space-y-4">
        
        {/* Archive Title */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-muted uppercase block">Archive Identification Title</label>
          <input
            type="text"
            placeholder="e.g. Fundamental Laws of Photosynthesis"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-void border border-aurora focus:border-signal rounded-lg p-2.5 text-xs text-text"
          />
        </div>

        {/* Text Input Area */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-muted uppercase block">Knowledge Source Document (Text Corpus)</label>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste any knowledge here — a scientific paper, a Wikipedia article, a book chapter..."
            className="w-full h-44 bg-void border border-aurora rounded-lg p-3 text-text text-xs resize-none focus:outline-none focus:border-signal font-sans leading-relaxed"
          />
        </div>

        {/* Redundancy Config Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center border-t border-aurora pt-3">
          <div className="space-y-1">
            <span className="text-[10px] text-muted uppercase block font-bold">XOR Parity Redundancy Level</span>
            <span className="text-[9px] text-slate-500 block">Increases file size to insulate against rad-decay bitrot.</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="5"
              value={redundancyLevel}
              onChange={(e) => { audio.playClick(); setRedundancyLevel(parseInt(e.target.value)); }}
              className="flex-1 accent-signal"
            />
            <span className="w-16 text-center text-xs border border-aurora p-1 text-signal font-bold rounded">
              Lvl {redundancyLevel}
            </span>
          </div>
        </div>

        <button
          onClick={handleExtract}
          disabled={loading || !inputText.trim()}
          className="w-full py-2.5 bg-cosmos border border-signal hover:bg-void hover:text-signal text-text font-bold text-xs tracking-wider rounded-lg transition-all uppercase"
        >
          {loading ? 'Analyzing Content...' : 'Extract Concepts →'}
        </button>
      </div>

      {/* Loading overlay panel */}
      {loading && (
        <div className="hud-panel p-4 border border-warn bg-void rounded-xl flex items-center gap-3">
          <Loader className="w-5 h-5 text-warn animate-spin" />
          <span className="text-[10px] text-warn font-bold uppercase animate-pulse">{statusText}</span>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="hud-panel p-4 border border-neonRed bg-void rounded-xl text-xs text-neonRed uppercase text-center font-bold">
          {error}
        </div>
      )}

      {/* Extracted Concepts Display */}
      {concepts.length > 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="border-b border-aurora pb-2 flex justify-between items-center select-none">
            <h2 className="text-base font-light text-white uppercase tracking-wider">
              {concepts.length} Concepts Identified
            </h2>
            <span className="text-[9px] text-muted">COMPILER READY</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {concepts.map((c) => (
              <div key={c.name} className="bg-cosmos border border-aurora rounded-xl p-3.5 space-y-1">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white text-xs lowercase text-signal">#{c.name}</span>
                  <span className="text-[8px] font-mono border border-warn text-warn border-opacity-40 px-1 py-0.5 rounded-sm uppercase bg-warn bg-opacity-5">
                    Layer {c.layer}
                  </span>
                </div>
                <p className="text-muted text-[11px] font-sans leading-relaxed">{c.definition}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerateArchive}
            className="w-full py-4 bg-warn text-void font-bold text-xs tracking-widest rounded-lg hover:bg-yellow-400 transition-all uppercase shadow-[0_0_12px_rgba(240,165,0,0.35)]"
          >
            Generate .cmem Archive →
          </button>
        </motion.div>
      )}

    </div>
  );
}
