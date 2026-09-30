import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatFeed from './components/ChatFeed';
import ChatInput from './components/ChatInput';
import SettingsModal from './components/SettingsModal';
import TelemetryBar from './components/TelemetryBar';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const DEFAULT_SYSTEM_PROMPT = `You are an offline AI assistant.

Answer style rules:
- Be concise but complete
- Prefer step-by-step explanations or bullet points
- Provide full, working code snippets when asked for code
- Avoid unnecessary theory`;

export default function App() {
  // Session State with LocalStorage persistence
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('ai_agent_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved sessions:', e);
      }
    }
    return [{ id: 'default-1', title: 'New Conversation', messages: [] }];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return sessions[0]?.id || 'default-1';
  });

  // Settings & Model Tester State
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [temperature, setTemperature] = useState(0.7);
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8000');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Dynamic Model Tester State
  const [installedModels, setInstalledModels] = useState([]);
  const [activeModel, setActiveModel] = useState('mistral:instruct');
  const [isActivatingModel, setIsActivatingModel] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState({ fastapi: 'offline', ollama: 'offline' });
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  // Persist sessions to LocalStorage
  useEffect(() => {
    localStorage.setItem('ai_agent_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Initial load: fetch health and installed models
  useEffect(() => {
    checkHealth();
    fetchInstalledModels();
  }, [apiUrl]);

  const showToast = (text, type = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const checkHealth = async () => {
    try {
      const res = await fetch(`${apiUrl}/health`);
      if (res.ok) {
        const data = await res.json();
        setHealthStatus({
          fastapi: data.fastapi || 'online',
          ollama: data.ollama || 'online'
        });
      } else {
        setHealthStatus({ fastapi: 'offline', ollama: 'offline' });
      }
    } catch (e) {
      setHealthStatus({ fastapi: 'offline', ollama: 'offline' });
    }
  };

  const fetchInstalledModels = async () => {
    try {
      const res = await fetch(`${apiUrl}/assistant/models`);
      if (res.ok) {
        const data = await res.json();
        const modelsList = data.models || [];
        setInstalledModels(modelsList);
        if (modelsList.length > 0 && !modelsList.some(m => m.name === activeModel)) {
          setActiveModel(modelsList[0].name);
        }
      }
    } catch (e) {
      console.error('Failed to fetch local models:', e);
    }
  };

  const handleActivateModel = async (modelName) => {
    if (!modelName) return;
    setIsActivatingModel(true);
    showToast(`Activating model '${modelName}' into memory...`, 'info');

    try {
      const res = await fetch(`${apiUrl}/assistant/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelName })
      });

      if (res.ok) {
        const data = await res.json();
        setActiveModel(modelName);
        showToast(`Model '${modelName}' activated successfully (${data.load_latency_ms}ms)!`, 'success');
      } else {
        showToast(`Failed to activate '${modelName}'. HTTP ${res.status}`, 'error');
      }
    } catch (e) {
      showToast(`Error activating model: ${e.message}`, 'error');
    } finally {
      setIsActivatingModel(false);
      fetchInstalledModels();
    }
  };

  // Active Session helper
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [];

  // Calculate Average Latency
  const aiMessages = messages.filter(m => m.sender === 'assistant' && m.latency_ms);
  const avgLatency = aiMessages.length > 0
    ? Math.round(aiMessages.reduce((sum, m) => sum + m.latency_ms, 0) / aiMessages.length)
    : 0;

  // New Chat Session
  const handleNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSession = { id: newId, title: 'New Conversation', messages: [] };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  // Delete Session
  const handleDeleteSession = (id) => {
    if (sessions.length <= 1) {
      setSessions([{ id: 'default-1', title: 'New Conversation', messages: [] }]);
      setActiveSessionId('default-1');
      return;
    }
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0].id);
    }
  };

  // Export Sessions
  const handleExportSessions = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ai_agent_conversations_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Clear Current Chat
  const handleClearCurrentChat = () => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, messages: [] };
      }
      return s;
    }));
  };

  // Handle Send Message with active model
  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, messages: [...s.messages, userMessage] };
      }
      return s;
    }));

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          model: activeModel,
          system_prompt: systemPrompt,
          temperature: temperature
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      const aiMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: data.response || "No response received.",
        latency_ms: data.latency_ms || 0,
        model: data.model || activeModel,
        timestamp: new Date().toISOString()
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, aiMessage] };
        }
        return s;
      }));
    } catch (error) {
      console.error('Error contacting AI engine:', error);
      const errorMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ Connection Error: Unable to communicate with backend server at ${apiUrl}. Ensure FastAPI is running via 'uvicorn api.server:app --port 8000'.`,
        latency_ms: 0,
        timestamp: new Date().toISOString()
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, errorMessage] };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
      checkHealth();
    }
  };

  // Text-To-Speech read aloud handler
  const handleToggleSpeak = (msgId, text) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);
      setSpeakingMessageId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleResetSettings = () => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    setTemperature(0.7);
    setApiUrl('http://127.0.0.1:8000');
  };

  const totalMessagesProcessed = sessions.reduce((acc, s) => acc + s.messages.length, 0);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-dark)] relative">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl glass-panel border shadow-2xl animate-fade-in ${
          toastMessage.type === 'success' ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-200' :
          toastMessage.type === 'error' ? 'border-red-500/40 bg-red-950/80 text-red-200' :
          'border-indigo-500/40 bg-indigo-950/80 text-indigo-200'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> :
           toastMessage.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400" /> :
           <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onExportSessions={handleExportSessions}
        isOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Header with Model Tester Selector */}
        <Header
          healthStatus={healthStatus}
          onCheckHealth={() => { checkHealth(); fetchInstalledModels(); }}
          avgLatency={avgLatency}
          onClearCurrentChat={handleClearCurrentChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          installedModels={installedModels}
          activeModel={activeModel}
          onSelectModel={setActiveModel}
          onActivateModel={handleActivateModel}
          isActivating={isActivatingModel}
        />

        {/* Chat Stream Feed */}
        <ChatFeed
          messages={messages}
          isLoading={isLoading}
          speakingMessageId={speakingMessageId}
          onToggleSpeak={handleToggleSpeak}
          onSelectPrompt={handleSendMessage}
        />

        {/* Chat Input Bar */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />

        {/* Telemetry Footer Bar */}
        <TelemetryBar
          totalMessages={totalMessagesProcessed}
          avgLatency={avgLatency}
          healthStatus={healthStatus}
          activeModel={activeModel}
        />
      </div>

      {/* Settings Control Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        temperature={temperature}
        setTemperature={setTemperature}
        apiUrl={apiUrl}
        setApiUrl={setApiUrl}
        onReset={handleResetSettings}
        installedModels={installedModels}
        activeModel={activeModel}
        onActivateModel={handleActivateModel}
      />
    </div>
  );
}
