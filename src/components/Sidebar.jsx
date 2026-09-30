import React from 'react';
import { Plus, MessageSquare, Trash2, Download, Bot, Cpu, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onExportSessions,
  isOpen,
  onToggleSidebar
}) {
  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out flex flex-col glass-panel rounded-none md:rounded-r-2xl border-r border-y-0 border-l-0 ${
        isOpen ? 'w-72 opacity-100 translate-x-0' : 'w-0 md:w-16 opacity-0 md:opacity-100 -translate-x-full md:translate-x-0'
      }`}
      style={{ minWidth: isOpen ? '280px' : '64px' }}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-[var(--border-color)]">
        {isOpen ? (
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
                Offline AI Agent
              </h1>
              <p className="text-[11px] text-[var(--text-dim)] font-medium">FastAPI + Ollama</p>
            </div>
          </div>
        ) : (
          <div className="p-2 mx-auto rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewSession}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs tracking-wide shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] ${
            !isOpen ? 'px-0' : ''
          }`}
        >
          <Plus className="w-4 h-4" />
          {isOpen && <span>New Conversation</span>}
        </button>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {isOpen && (
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">
            Chat Threads
          </div>
        )}

        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          const firstUserMsg = session.messages.find(m => m.sender === 'user')?.text || 'New Session';
          
          return (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`group relative flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all ${
                isActive
                  ? 'bg-indigo-600/20 border border-indigo-500/40 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-[var(--text-dim)]'}`} />
              
              {isOpen && (
                <>
                  <span className="text-xs truncate flex-1 font-medium">
                    {firstUserMsg}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      {isOpen && (
        <div className="p-3 border-t border-[var(--border-color)] bg-black/20 flex flex-col gap-2">
          <button
            onClick={onExportSessions}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-white hover:bg-white/5 border border-[var(--border-color)] transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Conversations</span>
          </button>
          
          <div className="flex items-center justify-between text-[11px] text-[var(--text-dim)] pt-1 px-1">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-emerald-400" /> mistral:instruct
            </span>
            <span className="flex items-center gap-1 text-indigo-400 font-semibold">
              <Sparkles className="w-3 h-3" /> Resume Edition
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
