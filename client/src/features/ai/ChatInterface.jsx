import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, Send, Trash2, RotateCcw, Copy, 
  Check, ArrowRight, MessageSquare, Terminal, HelpCircle
} from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../hooks/useToast';
import ReactMarkdown from 'react-markdown';

const ChatInterface = () => {
  const [searchParams] = useSearchParams();
  const activeTopicContext = searchParams.get('context') || '';

  const { 
    messages, loading, streamingContent, 
    sendMessage, clearConversation, regenerateResponse 
  } = useAI();
  
  const confirm = useConfirm();
  const toast = useToast();

  const [input, setInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const bottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Handle preset prompt clicks
  const handlePresetClick = (presetText) => {
    setInput('');
    sendMessage(presetText, activeTopicContext);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input, activeTopicContext);
    setInput('');
  };

  const handleClearHistory = async () => {
    const approved = await confirm({
      title: 'Clear Chat History?',
      description: 'This will wipe out all messages from this session. This action cannot be undone.',
      variant: 'danger'
    });
    if (approved) {
      clearConversation();
    }
  };

  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success('Response copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const presets = [
    { text: 'Explain Kubernetes Ingress', icon: Terminal },
    { text: 'Deployment vs StatefulSet', icon: HelpCircle },
    { text: 'How does Terraform state work?', icon: Terminal },
    { text: 'Create a Jenkins pipeline for MERN', icon: Terminal },
    { text: 'Explain Docker networking', icon: HelpCircle }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] rounded-xl glass-panel overflow-hidden">
      {/* Chat header toolbar */}
      <div className="p-4 border-b border-slate-200/50 dark:border-[#202020] flex items-center justify-between gap-4 bg-slate-50/20 dark:bg-[#050505]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
          <div>
            <h3 className="font-bold text-sm">DevOps AI Learning Assistant</h3>
            {activeTopicContext && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ Context Loaded: {activeTopicContext.replace('-', ' ')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 select-none">
          <button
            onClick={regenerateResponse}
            disabled={loading || messages.length <= 1}
            title="Regenerate last response"
            className="p-2 rounded-lg border border-slate-200/50 dark:border-[#202020] hover:bg-slate-100 dark:hover:bg-[#151515] text-slate-500 disabled:opacity-50 flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleClearHistory}
            disabled={messages.length <= 1}
            title="Clear Chat History"
            className="p-2 rounded-lg border border-slate-200/50 dark:border-[#202020] hover:bg-red-500/10 hover:text-red-500 text-slate-500 disabled:opacity-50 flex items-center justify-center transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Feed window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={idx} 
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Profile letter */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                isUser ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-[#050505] text-slate-500 border border-slate-200/50 dark:border-[#202020]'
              }`}>
                {isUser ? 'U' : 'AI'}
              </div>

              {/* Bubble */}
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-3 shadow-sm ${
                isUser 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' 
                  : 'bg-slate-50/50 dark:bg-[#111111]/80 border-slate-200/50 dark:border-[#202020] text-slate-800 dark:text-slate-200'
              }`}>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Bubble Footer Action */}
                {!isUser && (
                  <div className="flex justify-end pt-1 border-t border-slate-200/20">
                    <button
                      onClick={() => handleCopyMessage(msg.content, idx)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white transition flex items-center gap-1 text-[9px] font-bold"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Response
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live typing/streaming placeholder bubble */}
        {streamingContent && (
          <div className="flex gap-3 max-w-3xl mr-auto">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#050505] text-slate-500 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200/50 dark:border-[#202020]">
              AI
            </div>
            <div className="p-4 rounded-2xl border border-slate-200/50 dark:border-[#202020] bg-slate-50/50 dark:bg-[#111111]/80 text-xs leading-relaxed space-y-3 shadow-sm">
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{streamingContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Quick Prompts pills */}
      {messages.length === 1 && !streamingContent && (
        <div className="p-4 border-t border-slate-200/50 dark:border-[#202020] select-none">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2.5">Suggested tutoring topics</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handlePresetClick(preset.text)}
                className="px-3.5 py-2 rounded-xl border border-slate-200/50 dark:border-[#202020] hover:bg-slate-100 dark:hover:bg-[#151515] dark:bg-zinc-800 dark:text-zinc-500  dark:hover:text-zinc-100 text-[11px] font-bold text-slate-600 dark:text-zinc-200 transition flex items-center gap-1.5"
              >
                <preset.icon className="w-3.5 h-3.5 text-slate-450" />
                {preset.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input panel form */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-200/50 dark:border-[#202020] flex gap-3 bg-slate-50/20 dark:bg-[#050505]">
        <input
          type="text"
          placeholder="Ask a DevOps question... (e.g. How do cgroups differ from namespaces?)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 p-2.5 rounded-lg border border-slate-200/50 dark:border-[#202020] bg-white dark:bg-[#0A0A0A] text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-slate-450 text-slate-800 dark:text-slate-100"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/15 transition"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
