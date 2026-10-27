import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Trash2,
  PlusCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Pin,
  Minimize2,
  Maximize2,
  MessageSquare
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { ChartCard } from './ChartCard';

interface AICopilotDrawerProps {
  isDrawer?: boolean;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({ isDrawer = false }) => {
  const {
    dataset,
    messages,
    isThinking,
    sendChatMessage,
    clearChat,
    isCopilotOpen,
    setIsCopilotOpen,
    addCustomChart
  } = useDashboard();

  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // If closed in drawer mode, return the bottom-left floating trigger
  if (isDrawer && !isCopilotOpen) {
    return (
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-5 left-5 z-40 px-4 py-2.5 rounded-full bg-black hover:bg-slate-900 border border-indigo-500/50 text-white shadow-2xl flex items-center gap-2.5 group transition-all duration-200 hover:scale-105"
        title="Open InsightAI Copilot"
      >
        <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
          <Bot className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-white tracking-wide">InsightAI Copilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </button>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    sendChatMessage(input);
    setInput('');
  };

  const handlePromptClick = (promptText: string) => {
    sendChatMessage(promptText);
  };

  // Schema-aware quick prompts
  const samplePrompts = [
    `What is the average ${dataset?.dashboard?.metadata?.primary_metric || 'metric'}?`,
    `Which ${dataset?.dashboard?.metadata?.primary_dimension || 'category'} performed best?`,
    'Show monthly revenue trends',
    'Are there missing values or data quality issues?',
    `Create a chart showing ${dataset?.dashboard?.metadata?.primary_metric || 'value'} by ${dataset?.dashboard?.metadata?.primary_dimension || 'category'}`,
    'Explain the most important findings'
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#000000] text-white overflow-hidden select-text border border-slate-800 rounded-2xl shadow-2xl">
      {/* Copilot Header — Pure Black & White */}
      <div className="px-4 py-3 border-b border-slate-800 bg-[#06080F] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-white tracking-tight">InsightAI Copilot</h2>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Deterministic calculations & inline chart synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
            title="Reset Chat Session"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {isDrawer && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          )}
          {isDrawer && (
            <button
              onClick={() => setIsCopilotOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title="Close Copilot"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Scroll Area — Pure Black background with crisp white typography */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#000000]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-full ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-3.5 text-xs leading-relaxed max-w-[85%] ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/30 font-medium'
                        : 'bg-[#0B0F19] text-white border border-slate-800/80 rounded-tl-none shadow-lg'
                    }`}
                  >
                    {/* Formatted Markdown Rendering with pure white text */}
                    <div
                      className="prose prose-xs max-w-none space-y-1.5 whitespace-pre-line text-white"
                      dangerouslySetInnerHTML={{
                        __html: formatMarkdown(msg.content)
                      }}
                    />

                    {/* Inline Synthesized Chart */}
                    {msg.chart_suggestion && (
                      <div className="mt-3.5 pt-3 border-t border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Synthesized Visualization
                          </span>
                          <button
                            onClick={() => addCustomChart(msg.chart_suggestion!)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition-colors shadow-sm"
                          >
                            <Pin className="w-2.5 h-2.5" />
                            <span>Pin to Dashboard</span>
                          </button>
                        </div>

                        <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#05070D]">
                          <ChartCard chart={msg.chart_suggestion} />
                        </div>
                      </div>
                    )}

                    {/* Suggested Follow-up Prompts */}
                    {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/70">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Follow-up Questions:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {msg.suggested_followups.map((fPrompt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handlePromptClick(fPrompt)}
                              className="px-2 py-0.5 rounded-lg bg-[#111726] border border-slate-700/80 text-slate-200 hover:border-indigo-400 hover:text-white transition-all text-[10px] flex items-center gap-1"
                            >
                              <span>{fPrompt}</span>
                              <ArrowRight className="w-2 h-2 opacity-60" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-1.5 text-[9px] text-slate-500 text-right font-mono">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex gap-2.5 max-w-xl">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-bounce" />
                </div>
                <div className="rounded-2xl rounded-tl-none p-3 bg-[#0B0F19] border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  <span>Computing factual aggregations & schema logic...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Pills */}
          <div className="px-3 py-1.5 border-t border-slate-800/80 bg-[#06080F] overflow-x-auto flex gap-1.5">
            {samplePrompts.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(prompt)}
                className="px-2.5 py-1 rounded-full text-[10px] bg-[#0E131F] border border-slate-700/80 text-white hover:border-indigo-400 hover:text-indigo-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          {/* Chat Input Bar — Pure Black with Crisp White Letters */}
          <form
            onSubmit={handleSubmit}
            className="p-2.5 border-t border-slate-800 bg-[#000000] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask data questions, request metrics, or generate charts..."
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-[#090C14] border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 transition-colors shadow-md shadow-indigo-600/30 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </>
      )}
    </div>
  );

  // Position: Left Side Down (Bottom Left)
  if (isDrawer) {
    return (
      <div
        className={`fixed bottom-4 left-4 sm:left-5 z-50 w-[95vw] sm:w-[480px] shadow-2xl transition-all duration-200 animate-in slide-in-from-bottom-5 ${
          isMinimized ? 'h-14' : 'h-[600px] max-h-[85vh]'
        }`}
      >
        {content}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] rounded-2xl border border-slate-800 shadow-xl overflow-hidden bg-black text-white animate-in fade-in duration-200">
      {content}
    </div>
  );
};

// Markdown formatter rendering crisp white text & headers
function formatMarkdown(text: string): string {
  let html = text
    .replace(/^### (.*$)/gim, '<h3 class="text-sm font-extrabold text-white mt-1 mb-1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-base font-extrabold text-white mt-1.5 mb-1.5">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-slate-200">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[#131A29] border border-slate-800 font-mono text-[11px] text-cyan-300">$1</code>')
    .replace(/^\| (.*) \|$/gim, (match) => {
      return `<div class="font-mono text-[10px] text-slate-200 py-0.5">${match}</div>`;
    });

  return html;
}
