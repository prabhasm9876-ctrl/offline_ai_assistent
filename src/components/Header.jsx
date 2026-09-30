import React, { useState } from 'react';
import { Menu, Settings, Trash2, Activity, Cpu, RefreshCw, Zap, Play, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function Header({
  healthStatus,
  onCheckHealth,
  avgLatency,
  onClearCurrentChat,
  onOpenSettings,
  onToggleSidebar,
  installedModels,
  activeModel,
  onSelectModel,
  onActivateModel,
  isActivating
}) {
  const [customModelInput, setCustomModelInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const isOnline = healthStatus.fastapi === 'online';
  const isOllamaOnline = healthStatus.ollama === 'online';

  const handleActivateCustom = () => {
    if (customModelInput.trim()) {
      onActivateModel(customModelInput.trim());
      setCustomModelInput('');
      setShowCustomInput(false);
    }
  };

  return (
    <header className="px-4 md:px-6 py-3 flex flex-wrap items-center justify-between glass-panel rounded-none border-x-0 border-t-0 border-b border-[var(--border-color)] bg-black/50 z-30 shrink-0 gap-3">
      {/* Left: Mobile Toggle & Engine Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs font-semibold text-gray-200">
              API: {isOnline ? 'Active' : 'Offline'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-gray-300">
              Ollama: {isOllamaOnline ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Model Tester Selector & Activator */}
      <div className="flex items-center gap-2 bg-indigo-950/40 p-1.5 rounded-2xl border border-indigo-500/30">
        <div className="flex items-center gap-1.5 px-2 text-indigo-300">
          <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider hidden lg:inline">Model : </span>
        </div>

        {showCustomInput ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={customModelInput}
              onChange={(e) => setCustomModelInput(e.target.value)}
              placeholder="e.g. llama3:latest, phi3"
              className="px-2.5 py-1 text-xs bg-black/60 border border-indigo-500/40 rounded-xl text-white font-mono focus:outline-none w-36"
              onKeyDown={(e) => e.key === 'Enter' && handleActivateCustom()}
            />
            <button
              onClick={handleActivateCustom}
              className="px-2 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Set
            </button>
            <button
              onClick={() => setShowCustomInput(false)}
              className="px-1.5 py-1 text-[11px] text-[var(--text-dim)] hover:text-white"
            >
              Cancel
            </button>
          </div>
        ) : (
          <select
            value={activeModel}
            onChange={(e) => {
              if (e.target.value === '__custom__') {
                setShowCustomInput(true);
              } else {
                onSelectModel(e.target.value);
              }
            }}
            className="bg-black/60 border border-indigo-500/40 text-white text-xs font-mono font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer max-w-[160px] sm:max-w-[200px] truncate"
          >
            {installedModels.length > 0 ? (
              installedModels.map((m) => (
                <option key={m.name} value={m.name} className="bg-gray-900 text-white">
                  {m.name} ({m.size_gb}GB)
                </option>
              ))
            ) : (
              <option value="mistral:instruct" className="bg-gray-900 text-white">
                mistral:instruct
              </option>
            )}
            <option value="__custom__" className="bg-indigo-900 text-indigo-200">
              + Type Custom Model...
            </option>
          </select>
        )}

        {/* Activate Model Button */}
        <button
          onClick={() => onActivateModel(activeModel)}
          disabled={isActivating}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all ${isActivating
              ? 'bg-amber-500/30 border border-amber-500/40 text-amber-300 cursor-wait'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black shadow-emerald-500/20 hover:scale-105 active:scale-95'
            }`}
          title="Preload and activate model in Ollama memory without terminals"
        >
          {isActivating ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
              <span>Activating...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Activate Model</span>
            </>
          )}
        </button>
      </div>

      {/* Right: Telemetry & Controls */}
      <div className="flex items-center gap-2">
        {avgLatency > 0 && (
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium">{avgLatency}ms avg</span>
          </div>
        )}

        <button
          onClick={onCheckHealth}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors"
          title="Refresh Ollama Models & Health"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button
          onClick={onClearCurrentChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 border border-white/10 text-xs font-medium text-[var(--text-muted)] hover:text-red-300 transition-all"
          title="Clear current chat"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </header>
  );
}
