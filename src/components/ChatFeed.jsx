import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import QuickPrompts from './QuickPrompts';
import { Bot, Sparkles, Zap, Shield, Terminal } from 'lucide-react';

export default function ChatFeed({
  messages,
  isLoading,
  speakingMessageId,
  onToggleSpeak,
  onSelectPrompt
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-5xl mx-auto w-full">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 my-auto">
          {/* Hero Banner */}
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 p-0.5 shadow-2xl shadow-indigo-500/30 animate-float">
              <div className="w-full h-full bg-[var(--bg-dark)] rounded-[22px] flex items-center justify-center">
                <Bot className="w-10 h-10 text-indigo-400" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-black shadow-lg">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          <div className="max-w-lg space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Offline AI Assistant Workbench
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Powered by local <span className="text-indigo-400 font-semibold">FastAPI + Ollama (Mistral:Instruct)</span>. 
              Zero cloud telemetry, instant low-latency inference on your local hardware.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl text-left">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">100% Private</h4>
                <p className="text-[11px] text-[var(--text-dim)]">Runs completely offline</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <Zap className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Low Latency</h4>
                <p className="text-[11px] text-[var(--text-dim)] font-mono">Fast response times</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <Terminal className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Code Studio</h4>
                <p className="text-[11px] text-[var(--text-dim)]">Syntax highlighting & copy</p>
              </div>
            </div>
          </div>

          {/* Quick Prompts Selection */}
          <div className="w-full pt-4">
            <QuickPrompts onSelectPrompt={onSelectPrompt} />
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isSpeaking={speakingMessageId === msg.id}
              onToggleSpeak={() => onToggleSpeak(msg.id, msg.text)}
            />
          ))}

          {/* Loading / Thinking animation */}
          {isLoading && (
            <div className="flex gap-3 p-4 rounded-2xl glass-panel max-w-[85%] animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-300 font-medium">
                <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Generating response...</span>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
