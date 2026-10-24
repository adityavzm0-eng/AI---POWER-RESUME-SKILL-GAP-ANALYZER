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
  Pin
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  if (isDrawer && !isCopilotOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    sendChatMessage(input);
    setInput('');
  };

  const handlePromptClick = (promptText: string) => {
    sendChatMessage(promptText);
  };

  // Dataset schema-aware quick prompts
  const samplePrompts = [
    `What is the average ${dataset?.dashboard?.metadata?.primary_metric || 'metric'}?`,
    `Which ${dataset?.dashboard?.metadata?.primary_dimension || 'category'} performed best?`,
    'Show monthly revenue trends',
    'Are there missing values or data quality issues?',
    `Create a chart showing ${dataset?.dashboard?.metadata?.primary_metric || 'value'} by ${dataset?.dashboard?.metadata?.primary_dimension || 'category'}`,
    'Explain the most important findings'
  ];

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
      {/* Copilot Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">InsightAI Copilot</h2>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Conversational dataset queries, aggregations & chart synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset Chat Session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {isDrawer && (
            <button
              onClick={() => setIsCopilotOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-none shadow-sm'
                }`}
              >
                {/* Markdown content rendering */}
                <div
                  className="prose prose-xs dark:prose-invert max-w-none space-y-2 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdown(msg.content)
                  }}
                />

                {/* Inline Synthesized Chart */}
                {msg.chart_suggestion && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-indigo-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Generated Visualization
                      </span>
                      <button
                        onClick={() => addCustomChart(msg.chart_suggestion!)}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-500 transition-colors"
                      >
                        <Pin className="w-3 h-3" />
                        <span>Pin to Dashboard</span>
                      </button>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                      <ChartCard chart={msg.chart_suggestion} />
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up Prompts */}
                {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Suggested Follow-ups:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggested_followups.map((fPrompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePromptClick(fPrompt)}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-500 transition-all text-[11px] flex items-center gap-1"
                        >
                          <span>{fPrompt}</span>
                          <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 text-[10px] opacity-40 text-right">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="rounded-2xl rounded-tl-none p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>Analyzing schema & computing Pandas aggregations...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 overflow-x-auto flex gap-2">
        {samplePrompts.slice(0, 3).map((prompt, i) => (
          <button
            key={i}
            onClick={() => handlePromptClick(prompt)}
            className="px-2.5 py-1 rounded-full text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-500 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question, request metrics, or generate a chart..."
          className="flex-1 text-xs px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );

  if (isDrawer) {
    return (
      <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] z-50 shadow-2xl animate-in slide-in-from-right duration-200">
        {content}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-200">
      {content}
    </div>
  );
};

// Simple Markdown parser for clean formatted answers
function formatMarkdown(text: string): string {
  let html = text
    .replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-slate-900 dark:text-white mb-1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-base font-bold text-slate-900 dark:text-white mb-1.5">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px] text-indigo-500">$1</code>');

  return html;
}
