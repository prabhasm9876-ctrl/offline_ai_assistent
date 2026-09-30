import React, { useState } from 'react';
import { X, Sliders, RotateCcw, Check, Cpu, Server, Sparkles } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  systemPrompt,
  setSystemPrompt,
  temperature,
  setTemperature,
  apiUrl,
  setApiUrl,
  onReset
}) {
  if (!isOpen) return null;

  const [localPrompt, setLocalPrompt] = useState(systemPrompt);
  const [localTemp, setLocalTemp] = useState(temperature);
  const [localUrl, setLocalUrl] = useState(apiUrl);

  const handleSave = () => {
    setSystemPrompt(localPrompt);
    setTemperature(localTemp);
    setApiUrl(localUrl);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-white/10 shadow-2xl space-y-5 animate-fade-in bg-[#0c101d]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Prompt & Engine Settings</h3>
              <p className="text-xs text-[var(--text-dim)]">Customize system behavior and model parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          
          {/* Custom System Prompt */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              System Prompt (Instructions)
            </label>
            <textarea
              value={localPrompt}
              onChange={(e) => setLocalPrompt(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-indigo-500/50 resize-none leading-relaxed"
              placeholder="Set how the model responds..."
            />
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-200">Temperature (Creativity)</label>
              <span className="font-mono text-indigo-400 font-bold">{localTemp}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={localTemp}
              onChange={(e) => setLocalTemp(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 bg-white/10 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-dim)]">
              <span>Precise / Focused (0.0)</span>
              <span>Balanced (0.7)</span>
              <span>Creative (1.0)</span>
            </div>
          </div>

          {/* API Server URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              FastAPI Server Endpoint
            </label>
            <input
              type="text"
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
