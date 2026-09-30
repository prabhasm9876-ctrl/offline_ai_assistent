import React from 'react';
import { Activity, Cpu, ShieldCheck, Zap } from 'lucide-react';

export default function TelemetryBar({ totalMessages, avgLatency, healthStatus, activeModel }) {
  const isOnline = healthStatus.fastapi === 'online';

  return (
    <footer className="h-8 px-4 glass-panel rounded-none border-x-0 border-b-0 border-t border-[var(--border-color)] bg-black/80 flex items-center justify-between text-[11px] text-[var(--text-dim)] shrink-0 z-30">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 font-medium">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-500'}`} />
          Engine Status: <strong className="text-gray-200">{isOnline ? 'Active' : 'Offline'}</strong>
        </span>

        <span className="hidden sm:flex items-center gap-1">
          <Cpu className="w-3 h-3 text-indigo-400" />
          Active Model: <strong className="text-gray-300 font-mono">{activeModel || 'mistral:instruct'}</strong>
        </span>
      </div>

      <div className="flex items-center gap-4">
        {avgLatency > 0 && (
          <span className="flex items-center gap-1 text-indigo-300 font-mono font-medium">
            <Zap className="w-3 h-3 text-indigo-400" />
            Avg Latency: <strong>{avgLatency}ms</strong>
          </span>
        )}

        <span className="hidden md:flex items-center gap-1">
          Messages Processed: <strong className="text-gray-200 font-mono">{totalMessages}</strong>
        </span>

        <span className="flex items-center gap-1 text-emerald-400 font-medium">
          <ShieldCheck className="w-3 h-3" /> Offline Privacy
        </span>
      </div>
    </footer>
  );
}
