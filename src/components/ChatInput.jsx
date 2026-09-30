import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, AlertCircle } from 'lucide-react';

export default function ChatInput({ onSendMessage, isLoading }) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setText(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setSpeechError(`Voice input issue: ${event.error}`);
        setTimeout(() => setSpeechError(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setSpeechError('Speech recognition is not supported in this browser.');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return;
    onSendMessage(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  return (
    <div className="p-4 glass-panel rounded-none border-x-0 border-b-0 border-t border-[var(--border-color)] bg-black/60 z-30 shrink-0">
      <div className="max-w-4xl mx-auto space-y-2">
        
        {/* Speech Error Banner */}
        {speechError && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{speechError}</span>
          </div>
        )}

        <div className="relative flex items-end gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          {/* Voice Speech Dictation Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40'
                : 'text-[var(--text-muted)] hover:text-white hover:bg-white/10'
            }`}
            title={isListening ? 'Stop voice recording' : 'Start voice dictation'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Prompt Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening... Speak into your microphone..." : "Ask your local AI assistant..."}
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-white text-sm placeholder-[var(--text-dim)] focus:outline-none resize-none py-2 px-1 max-h-40 font-sans"
          />

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isLoading}
            className={`p-2.5 rounded-xl font-medium transition-all ${
              text.trim() && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95'
                : 'bg-white/5 text-[var(--text-dim)] cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Sparkles className="w-5 h-5 animate-spin text-indigo-300" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-[var(--text-dim)] px-2">
          <span>Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-gray-300">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-white/10 text-gray-300">Shift + Enter</kbd> for line break</span>
          {isListening && (
            <span className="flex items-center gap-1.5 text-red-400 font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Live Dictation Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
