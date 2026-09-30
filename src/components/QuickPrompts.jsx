import React from 'react';
import { Code, Cpu, Sparkles, Terminal, BookOpen, Bug } from 'lucide-react';

const PRESET_PROMPTS = [
  {
    title: 'Write a Python Script',
    prompt: 'Write a Python function to parse JSON data and handle exceptions cleanly with comments.',
    icon: Code,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    title: 'Explain AI Agents',
    prompt: 'Explain the core architectural components of an Autonomous AI Agent in 4 clear bullet points.',
    icon: Cpu,
    color: 'from-purple-500 to-pink-600'
  },
  {
    title: 'FastAPI Endpoint',
    prompt: 'Create a production-ready FastAPI POST endpoint with Pydantic request validation.',
    icon: Terminal,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    title: 'Debug & Refactor',
    prompt: 'How do you prevent race conditions and memory leaks in asynchronous Python code?',
    icon: Bug,
    color: 'from-amber-500 to-orange-600'
  }
];

export default function QuickPrompts({ onSelectPrompt }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-3 text-center">
        Suggested Prompt Templates
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRESET_PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group p-3.5 rounded-xl glass-panel hover:bg-white/10 hover:border-indigo-500/40 text-left transition-all flex items-start gap-3 border border-white/10"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-tr ${item.color} text-white shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                  {item.prompt}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
