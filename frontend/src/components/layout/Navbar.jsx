import React from "react";
import { Link, useLocation } from "react-router-dom";
import { audio } from "../../utils/audio";
import { Terminal, Shield, FolderOpen, HelpCircle } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleNavClick = () => {
    audio.playClick();
  };

  return (
    <header className="border-b border-aurora bg-void bg-opacity-95 px-6 py-3 select-none">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Brand Logo */}
        <Link to="/" onClick={handleNavClick} className="flex items-center gap-2.5">
          <div className="w-8 h-8 border border-signal bg-cosmos flex items-center justify-center font-bold text-signal text-sm shadow-[0_0_8px_rgba(79,142,247,0.3)]">
            AK
          </div>
          <div>
            <div className="text-text font-bold tracking-wider text-xs">ARKIVE PLATFORM</div>
            <div className="text-[9px] text-muted tracking-widest uppercase">Memory OS Protocol</div>
          </div>
        </Link>

        {/* Navigation Router Links */}
        <nav className="flex gap-2 text-[10px] font-bold uppercase">
          <Link
            to="/"
            onClick={handleNavClick}
            className={`px-3 py-1.5 border rounded-sm transition-all ${
              currentPath === "/"
                ? "bg-signal text-void border-signal"
                : "border-aurora text-muted hover:border-signal hover:text-text"
            }`}
          >
            Home Beacon
          </Link>
          <Link
            to="/encode"
            onClick={handleNavClick}
            className={`px-3 py-1.5 border rounded-sm transition-all ${
              currentPath === "/encode"
                ? "bg-signal text-void border-signal"
                : "border-aurora text-muted hover:border-signal hover:text-text"
            }`}
          >
            Compiler
          </Link>
          <Link
            to="/archives"
            onClick={handleNavClick}
            className={`px-3 py-1.5 border rounded-sm transition-all ${
              currentPath.startsWith("/archives")
                ? "bg-signal text-void border-signal"
                : "border-aurora text-muted hover:border-signal hover:text-text"
            }`}
          >
            Registry
          </Link>
          <Link
            to="/about"
            onClick={handleNavClick}
            className={`px-3 py-1.5 border rounded-sm transition-all ${
              currentPath === "/about"
                ? "bg-signal text-void border-signal"
                : "border-aurora text-muted hover:border-signal hover:text-text"
            }`}
          >
            Dossier Spec
          </Link>
        </nav>
      </div>
    </header>
  );
}
