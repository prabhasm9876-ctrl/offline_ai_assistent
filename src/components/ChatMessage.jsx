import React, { useState } from 'react';
import { Bot, User, Copy, Check, Volume2, VolumeX, Clock, Sparkles } from 'lucide-react';

export default function ChatMessage({ message, isSpeaking, onToggleSpeak }) {
  const isUser = message.sender === 'user';
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Custom Formatter for Markdown Code blocks, headers, bullet points, and inline code
  const renderFormattedText = (text) => {
    if (!text) return null;

    // Split text into code blocks ```lang ... ``` and regular text
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      // Check if code block
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        let language = 'code';

        // Check if first line contains language specification (e.g., ```python)
        if (lines[0] && !lines[0].includes(' ') && lines[0].length < 15) {
          language = lines.shift() || 'code';
        }

        const codeContent = lines.join('\n');

        return (
          <div key={index} className="code-block-wrapper my-3">
            <div className="code-header">
              <span className="font-mono text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                {language}
              </span>
              <button
                onClick={() => handleCopyCode(codeContent, index)}
                className="flex items-center gap-1 text-[11px] hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
              >
                {copiedCodeIndex === index ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="code-content">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Regular text parsing (bold, inline code, bullets)
      const paragraphs = part.split('\n');
      return (
        <div key={index} className="space-y-1.5">
          {paragraphs.map((line, pIdx) => {
            if (!line.trim()) return <div key={pIdx} className="h-2" />;

            // Bullet points
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
              const content = line.trim().substring(2);
              return (
                <div key={pIdx} className="flex items-start gap-2 pl-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{parseInlineStyles(content)}</span>
                </div>
              );
            }

            // Headings
            if (line.trim().startsWith('### ')) {
              return (
                <h4 key={pIdx} className="text-sm font-bold text-indigo-300 mt-2">
                  {parseInlineStyles(line.trim().substring(4))}
                </h4>
              );
            }
            if (line.trim().startsWith('## ')) {
              return (
                <h3 key={pIdx} className="text-base font-bold text-white mt-3">
                  {parseInlineStyles(line.trim().substring(3))}
                </h3>
              );
            }

            return <p key={pIdx}>{parseInlineStyles(line)}</p>;
          })}
        </div>
      );
    });
  };

  // Helper for **bold** and `inline code`
  const parseInlineStyles = (lineText) => {
    const tokens = lineText.split(/(\*\*.*?\*\*|`.*?`)/g);
    return tokens.map((tok, i) => {
      if (tok.startsWith('**') && tok.endsWith('**')) {
        return <strong key={i} className="font-semibold text-indigo-200">{tok.slice(2, -2)}</strong>;
      }
      if (tok.startsWith('`') && tok.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-mono text-xs">
            {tok.slice(1, -1)}
          </code>
        );
      }
      return tok;
    });
  };

  return (
    <div className={`flex gap-3 md:gap-4 p-4 md:p-5 rounded-2xl transition-all ${
      isUser
        ? 'bg-indigo-600/10 border border-indigo-500/20 ml-auto max-w-[85%] md:max-w-[75%]'
        : 'glass-panel mr-auto max-w-[95%] md:max-w-[88%] shadow-lg'
    }`}>
      {/* Avatar Icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
        isUser
          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
          : 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-500/20'
      }`}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Message Content & Metadata */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-white">
              {isUser ? 'You' : 'Offline AI Engine'}
            </span>
            {!isUser && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-medium">
                mistral:instruct
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {message.latency_ms > 0 && !isUser && (
              <span className="flex items-center gap-1 text-[10px] text-[var(--text-dim)] font-mono">
                <Clock className="w-3 h-3 text-indigo-400" />
                {message.latency_ms}ms
              </span>
            )}
            
            {!isUser && onToggleSpeak && (
              <button
                onClick={() => onToggleSpeak(message.text)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSpeaking
                    ? 'bg-emerald-500/20 text-emerald-400 animate-pulse'
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/10'
                }`}
                title={isSpeaking ? 'Stop speech' : 'Read aloud response'}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Formatted Message Output */}
        <div className="text-sm leading-relaxed text-gray-200">
          {renderFormattedText(message.text)}
        </div>
      </div>
    </div>
  );
}
