import React, { useState } from 'react';
import { IFSConfig } from './types';
import { PAPER_DEFAULT_CONFIG, PRESET_CONFIGS } from './utils/math';
import { Navbar } from './components/Navbar';
import { SimulatorCanvas } from './components/SimulatorCanvas';
import { ParameterStudio } from './components/ParameterStudio';
import { PaperExplorer } from './components/PaperExplorer';
import { AiAssistant } from './components/AiAssistant';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'parameters' | 'paper' | 'ai'>('simulator');
  const [currentPresetKey, setCurrentPresetKey] = useState<string>('sierpinski_paper');
  const [config, setConfig] = useState<IFSConfig>(PAPER_DEFAULT_CONFIG);

  const handleSelectPreset = (key: string) => {
    setCurrentPresetKey(key);
    if (PRESET_CONFIGS[key]) {
      setConfig(PRESET_CONFIGS[key]);
    }
  };

  const handleResetDefault = () => {
    setCurrentPresetKey('sierpinski_paper');
    setConfig(PAPER_DEFAULT_CONFIG);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} configName={config.name} />

      <main className="flex-1">
        {activeTab === 'simulator' && (
          <SimulatorCanvas
            config={config}
            onSelectPreset={handleSelectPreset}
            currentPresetKey={currentPresetKey}
          />
        )}

        {activeTab === 'parameters' && (
          <ParameterStudio
            config={config}
            setConfig={setConfig}
            onResetDefault={handleResetDefault}
          />
        )}

        {activeTab === 'paper' && <PaperExplorer />}

        {activeTab === 'ai' && <AiAssistant />}
      </main>
    </div>
  );
}
