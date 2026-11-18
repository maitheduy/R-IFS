import React from 'react';
import { Play, Sliders, BookOpen, Sparkles, Compass, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 'simulator' | 'parameters' | 'paper' | 'ai';
  setActiveTab: (tab: 'simulator' | 'parameters' | 'paper' | 'ai') => void;
  configName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, configName }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  R-IFS Sierpinski Explorer
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  RC-000004-RIS-M0
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                Active: <span className="text-indigo-300 font-medium">{configName}</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Chaos Game</span>
            </button>

            <button
              onClick={() => setActiveTab('parameters')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'parameters'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Parameter Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('paper')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'paper'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Research & Proofs</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>AI Consultant</span>
            </button>
          </nav>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden py-2 border-t border-slate-800 overflow-x-auto space-x-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'simulator' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Chaos Game</span>
          </button>
          <button
            onClick={() => setActiveTab('parameters')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'parameters' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Parameters</span>
          </button>
          <button
            onClick={() => setActiveTab('paper')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'paper' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Paper</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'ai' ? 'bg-purple-600 text-white' : 'text-slate-400 bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
