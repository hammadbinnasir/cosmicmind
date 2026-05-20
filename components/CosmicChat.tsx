"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ASTROPHYSICS_PRESETS } from '@/lib/mockData';
import { AIOrchestrator, OrchestrationTrace } from '@/lib/AIOrchestrator';
import { Send, Terminal, Sparkles, User, RefreshCw, Trash2, Cpu, ShieldAlert, Check, Layers, Clock } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

// A high-fidelity, custom Markdown & LaTeX inline math renderer
function MarkdownParser({ text }: { text: string }) {
  const parseInline = (chunk: string): React.ReactNode[] => {
    const pattern = /(\*\*|`|\$)/g;
    const result: React.ReactNode[] = [];
    let currentIdx = 0;
    let match;

    // Reset regex index
    pattern.lastIndex = 0;

    while ((match = pattern.exec(chunk)) !== null) {
      const matchIdx = match.index;
      const delimiter = match[0];

      // Add preceding plain text
      if (matchIdx > currentIdx) {
        result.push(<span key={`txt-${currentIdx}`}>{chunk.substring(currentIdx, matchIdx)}</span>);
      }

      // Find the closing boundary
      const startOfContent = matchIdx + delimiter.length;
      const closingIdx = chunk.indexOf(delimiter, startOfContent);

      if (closingIdx === -1) {
        // Unclosed token, render as text
        result.push(<span key={`unclosed-${matchIdx}`}>{delimiter}</span>);
        currentIdx = startOfContent;
      } else {
        const content = chunk.substring(startOfContent, closingIdx);
        if (delimiter === '**') {
          result.push(<strong key={`b-${matchIdx}`} className="font-extrabold text-white">{content}</strong>);
        } else if (delimiter === '`') {
          result.push(<code key={`code-${matchIdx}`} className="font-mono text-[10px] bg-white/10 px-1 py-0.5 rounded text-cyan-400 border border-white/5">{content}</code>);
        } else if (delimiter === '$') {
          result.push(<span key={`math-${matchIdx}`} className="font-mono text-xs italic text-emerald-300 font-semibold bg-emerald-500/5 px-1 rounded border border-emerald-500/10 inline-block">{content}</span>);
        }
        currentIdx = closingIdx + delimiter.length;
        pattern.lastIndex = currentIdx; // advance matching position
      }
    }

    if (currentIdx < chunk.length) {
      result.push(<span key={`txt-end-${currentIdx}`}>{chunk.substring(currentIdx)}</span>);
    }

    return result.length > 0 ? result : [<span key="empty">{chunk}</span>];
  };

  const rawLines = text.split(/\r?\n/);
  const blocks: any[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i].trim();

    // Check for Block Math
    if (line.startsWith('$$')) {
      let mathContent = line.slice(2);
      let j = i + 1;
      let foundEnd = false;
      while (j < rawLines.length) {
        const nextLine = rawLines[j].trim();
        if (nextLine.endsWith('$$')) {
          mathContent += '\n' + nextLine.slice(0, nextLine.length - 2);
          foundEnd = true;
          break;
        } else {
          mathContent += '\n' + rawLines[j];
          j++;
        }
      }
      blocks.push({
        type: 'math-block',
        content: mathContent.trim()
      });
      i = foundEnd ? j + 1 : j;
      continue;
    }

    // Check for divider
    if (line === '---' || line === '***') {
      blocks.push({ type: 'divider' });
      i++;
      continue;
    }

    // Check for headings
    if (line.startsWith('#')) {
      const match = line.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        blocks.push({
          type: 'heading',
          level: match[1].length,
          content: match[2]
        });
        i++;
        continue;
      }
    }

    // Check for table
    if (line.startsWith('|')) {
      const tableLines: string[] = [];
      let j = i;
      while (j < rawLines.length && rawLines[j].trim().startsWith('|')) {
        tableLines.push(rawLines[j].trim());
        j++;
      }
      blocks.push({
        type: 'table',
        lines: tableLines
      });
      i = j;
      continue;
    }

    // Check for list item
    if (line.startsWith('*') || line.startsWith('-') || /^\d+\.\s+/.test(line)) {
      const listLines: string[] = [];
      let j = i;
      while (
        j < rawLines.length &&
        (rawLines[j].trim().startsWith('*') ||
          rawLines[j].trim().startsWith('-') ||
          /^\d+\.\s+/.test(rawLines[j].trim()))
      ) {
        listLines.push(rawLines[j].trim());
        j++;
      }
      blocks.push({
        type: 'list',
        lines: listLines
      });
      i = j;
      continue;
    }

    // Empty lines or simple breaks
    if (line === '') {
      i++;
      continue;
    }

    // Default: grab consecutively filled paragraphs
    const paragraphLines: string[] = [];
    let j = i;
    while (
      j < rawLines.length &&
      rawLines[j].trim() !== '' &&
      !rawLines[j].trim().startsWith('#') &&
      !rawLines[j].trim().startsWith('|') &&
      !rawLines[j].trim().startsWith('*') &&
      !rawLines[j].trim().startsWith('-') &&
      !/^\d+\.\s+/.test(rawLines[j].trim()) &&
      !rawLines[j].trim().startsWith('$$') &&
      rawLines[j].trim() !== '---'
    ) {
      paragraphLines.push(rawLines[j]);
      j++;
    }

    if (paragraphLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        content: paragraphLines.join('\n')
      });
    }
    i = j;
  }

  return (
    <div className="space-y-3.5">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          const classes: { [key: number]: string } = {
            1: 'text-base font-sans font-extrabold text-[#F5F5F7] mt-5 mb-2.5 uppercase tracking-wide',
            2: 'text-sm font-sans font-bold text-white mt-4 mb-2 uppercase tracking-wide',
            3: 'text-xs font-mono font-bold text-emerald-400 border-l-2 border-emerald-500 pl-2 mt-4 mb-2 uppercase tracking-widest',
            4: 'text-[11px] font-mono font-bold text-gray-300 mt-3 mb-1.5 uppercase tracking-wider'
          };
          const headingClass = classes[block.level] || 'text-[11px] font-sans font-bold text-white mt-3';
          return (
            <h4 key={idx} className={headingClass}>
              {parseInline(block.content)}
            </h4>
          );
        }

        if (block.type === 'divider') {
          return <hr key={idx} className="border-t border-white/10 my-4" />;
        }

        if (block.type === 'math-block') {
          return (
            <div key={idx} className="my-5 p-4 bg-emerald-950/15 border border-emerald-500/20 rounded-xl flex flex-col items-center justify-center text-center shadow-md">
              <div className="font-mono text-xs tracking-wide text-emerald-300 font-semibold bg-black/60 px-5 py-3 rounded-lg border border-white/5 select-all overflow-x-auto max-w-full">
                {block.content}
              </div>
              <span className="text-[8px] font-mono text-gray-500 mt-1.5 uppercase tracking-widest font-bold">REDUCTION COMPUTED</span>
            </div>
          );
        }

        if (block.type === 'table') {
          const rows = block.lines.map((line: string) => {
            let parts = line.split('|');
            if (parts[0] === '') parts.shift();
            if (parts[parts.length - 1] === '') parts.pop();
            return parts.map(p => p.trim());
          });

          if (rows.length === 0) return null;

          const headerRow = rows[0];
          const bodyRows = rows.slice(1).filter((r: string[]) => !r.some(cell => cell.includes('---')));

          return (
            <div key={idx} className="overflow-x-auto my-3 border border-white/10 rounded-xl bg-black/40">
              <table className="min-w-full divide-y divide-white/10 text-left font-sans text-[11px]">
                <thead className="bg-white/5 font-mono text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                  <tr>
                    {headerRow.map((cell: string, cIdx: number) => (
                      <th key={cIdx} className="px-3.5 py-2.5 border-r border-white/5 last:border-0">
                        {parseInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {bodyRows.map((row: string[], rIdx: number) => (
                    <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                      {row.map((cell: string, cIdx: number) => (
                        <td key={cIdx} className="px-3.5 py-2 border-r border-white/5 last:border-0 align-top">
                          {parseInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={idx} className="list-disc pl-5 my-2.5 space-y-1.5 text-xs text-gray-300 font-sans">
              {block.lines.map((l: string, lIdx: number) => {
                const cleanLine = l.replace(/^[\s*-+]+|^\d+\.\s+/, '');
                return (
                  <li key={lIdx} className="leading-relaxed">
                    {parseInline(cleanLine)}
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={idx} className="text-xs font-sans text-gray-300 leading-relaxed my-2 select-text">
            {parseInline(block.content)}
          </p>
        );
      })}
    </div>
  );
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export default function CosmicChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      role: "model",
      text: "Hello! I am **CosmicMind AI**, your dedicated astrophysics intelligence assistant. I operate on advanced stellar reasoning templates. Ask me anything regarding Right Ascension variables, Keplerian orbit dynamics, or relativistic gravitational distortions. Or select a preset calculation above.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [userInput, setUserInput] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [lastTrace, setLastTrace] = useState<OrchestrationTrace | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const msgIdCounter = useRef<number>(0);

  // Initialize a mock trace on load so the sidebar is not blank initially
  useEffect(() => {
    AIOrchestrator.getInstance().orchestrateTask('astrophysics_reasoning', {
      name: "Stellar Initialization Query",
      userPrompt: "Systems Boot Tracer"
    }).then(res => {
      setLastTrace(res.trace);
    });
  }, []);

  // Auto-scroll chat window
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, generating]);

  const handleSubmit = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = (customText || userInput).trim();
    if (!query || generating) return;

    // Clear user input
    if (!customText) setUserInput("");

    msgIdCounter.current += 1;
    const userMsgId = `usr-${msgIdCounter.current}`;

    // Concat user message
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setGenerating(true);

    try {
      // Trigger live AI orchestration tracing concurrently
      const orchestratorPromise = AIOrchestrator.getInstance().orchestrateTask('astrophysics_reasoning', {
        name: "Interactive Solver Query",
        userPrompt: query
      });

      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const resPromise = fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: chatHistory
        })
      });

      // Await both processing streams
      const [orchResult, res] = await Promise.all([orchestratorPromise, resPromise]);
      
      if (orchResult.success) {
        setLastTrace(orchResult.trace);
      }

      const data = await res.json();
      
      msgIdCounter.current += 1;
      const modelMsgId = `ai-${msgIdCounter.current}`;

      const modelMsg: ChatMessage = {
        id: modelMsgId,
        role: 'model',
        text: data.message,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e: any) {
      console.error(e);
      msgIdCounter.current += 1;
      const errorMsgId = `ai-err-${msgIdCounter.current}`;

      const modelMsg: ChatMessage = {
        id: errorMsgId,
        role: 'model',
        text: "**System Deflection Warning**: Communication with the neural core was lost due to telemetry dispersion. Fallback calculations are temporarily unavailable.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, modelMsg]);
    } finally {
      setGenerating(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "initial-welcome",
        role: "model",
        text: "System refreshed. Let us begin a new observational vector analysis.",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  return (
    <div className="bg-black/30 border border-white/10 rounded-3xl p-6 flex flex-col h-full overflow-hidden backdrop-blur-sm shadow-2xl" id="cosmic-chat-root">
      {/* Terminal Title */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h2 className="font-sans font-semibold text-sm text-white tracking-wider uppercase flex items-center gap-2">
            <span>COSMIC CHAT ASSISTANT</span>
            <span className="hidden xs:inline-block px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded font-mono text-[9px] text-cyan-400">ORCHESTRATED LINK</span>
          </h2>
        </div>
        <button 
          onClick={handleClearHistory} 
          className="p-1 px-2.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded hover:text-white text-[10px] font-mono flex items-center gap-1.5 transition-colors"
          id="clear-chat-history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>FLUSH MEMORY</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Side: Interactive Chat Terminal (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col justify-between min-h-0">
          
          {/* Preset computational calculations */}
          <div className="mb-4 shrink-0">
            <span className="text-[10px] font-mono text-gray-500 uppercase block mb-2">ASTROPHYSICAL FORMULA TEMPLATES:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {ASTROPHYSICS_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(undefined, preset.prompt)}
                  disabled={generating}
                  className="p-2.5 bg-white/5 border border-white/5 hover:border-white/15 rounded-lg text-left text-xs transition-all hover:bg-emerald-500/5 duration-150 disabled:opacity-50"
                  id={`preset-prompt-${idx}`}
                >
                  <div className="flex items-center gap-1.5 text-emerald-400 font-mono mb-1 font-semibold text-[10px]">
                    <Sparkles className="w-3 h-3" />
                    <span>FORMULA {idx + 1}</span>
                  </div>
                  <p className="text-gray-300 font-sans line-clamp-1">{preset.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Terminal Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-black/40 border border-white/10 rounded-xl p-4 space-y-4 mb-4 min-h-[250px]"
            id="chat-messages-viewport"
          >
            {messages.map((m) => {
              const isModel = m.role === 'model';
              return (
                <div 
                  key={m.id} 
                  className={`flex gap-3 max-w-4xl p-3.5 rounded-xl border border-white/5 transition-all ${
                    isModel ? 'bg-white/5 border-emerald-500/10' : 'bg-emerald-500/10 border-emerald-500/20 ml-auto flex-row-reverse'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isModel ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-[#F5F5F7]'
                  }`}>
                    {isModel ? <Terminal className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] text-gray-400 font-bold uppercase">
                        {isModel ? "COSMICMIND CORE AI" : "OBSERVATORY INVESTIGATOR"}
                      </span>
                      <span className="font-mono text-[8px] text-gray-500">{m.timestamp}</span>
                    </div>
                    <div className="text-xs font-sans text-gray-200 leading-relaxed select-text selection:bg-emerald-500/20">
                      <MarkdownParser text={m.text} />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading computational response */}
            {generating && (
              <div className="flex gap-3 max-w-2xl bg-white/5 border border-white/5 p-4 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 animate-spin">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-gray-500 font-bold uppercase">DEMODULATING DEEP WAVE PROPAGATIONS AT SPEED C...</span>
                  <p className="text-xs font-sans text-[#F5F5F7] animate-pulse">Running neural routing retry mechanisms & database vector matching...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={(e) => handleSubmit(e)} className="flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Deploy a mathematical query or space inquiry..."
              className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-[#F5F5F7] focus:outline-none focus:border-emerald-500 placeholder-gray-500 tracking-wide font-sans transition-all"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={generating}
              id="chat-user-input"
            />
            <button
              type="submit"
              disabled={generating || !userInput.trim()}
              className="px-4 bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-40 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95"
              id="chat-submit-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Right Side: Palantir-Style AI Reasoning Telemetry Trace (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col justify-between overflow-y-auto space-y-4 font-mono text-[10px] text-gray-300">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-white font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI REASONING TRACE</span>
              </span>
              <span className="px-2 py-0.5 bg-green-500/15 text-green-400 border border-green-500/20 rounded-full font-bold uppercase text-[8px] animate-pulse">
                ACTIVE
              </span>
            </div>

            {lastTrace ? (
              <div className="space-y-4">
                {/* Confidence Meter */}
                <div className="space-y-1 bg-white/5 border border-white/5 p-3 rounded-lg">
                  <span className="text-gray-500 uppercase block text-[8px] tracking-wider">Neural Core Confidence Score:</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white text-lg font-bold tracking-tight">{lastTrace.confidenceScore}%</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          lastTrace.confidenceScore > 85 ? 'bg-cyan-400' : 'bg-yellow-450 text-yellow-500'
                        }`} 
                        style={{ width: `${lastTrace.confidenceScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Routing Details */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 p-2.5 rounded border border-white/5">
                    <span className="text-gray-500 block text-[8px] uppercase">PRIMARY MODEL:</span>
                    <span className="text-[#F5F5F7] font-bold block mt-0.5">{lastTrace.primaryModel}</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded border border-white/5">
                    <span className="text-gray-500 block text-[8px] uppercase">LATENCY SPEED:</span>
                    <span className="text-cyan-400 font-bold block mt-0.5">{lastTrace.durationMs}ms</span>
                  </div>
                </div>

                {/* Processing node details */}
                <div className="space-y-2 bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-gray-500 uppercase">TELEMETRY KEY:</span>
                    <span className="text-white">{lastTrace.securityHash}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-gray-500 uppercase">ACTIVE NODE:</span>
                    <span className="text-white font-bold">{lastTrace.processingNode}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-gray-500 uppercase">RETRY ATTEMPTS:</span>
                    <span className={lastTrace.retryAttempts > 0 ? "text-yellow-500 font-bold" : "text-gray-500"}>
                      {lastTrace.retryAttempts}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-gray-500 uppercase">MEMORY STATE:</span>
                    <span className="text-emerald-400 font-bold">STABILIZED</span>
                  </div>
                </div>

                {/* Semantic Space Database Hits */}
                <div className="space-y-2">
                  <span className="text-gray-500 uppercase text-[8px] tracking-widest block font-bold">
                    SEMANTIC VECTOR DATABASE RETRIEVAL HITS:
                  </span>
                  <div className="space-y-1.5">
                    {lastTrace.knowledgeBaseHits.length > 0 ? (
                      lastTrace.knowledgeBaseHits.map((hit, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/5 p-2 rounded flex justify-between items-center gap-2">
                          <span className="text-gray-300 truncate font-mono text-[9px]">{hit.doc}</span>
                          <span className="text-emerald-400 font-bold text-[8px] shrink-0">
                            {(hit.correlation * 100).toFixed(0)}% MATCH
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-3 text-gray-600 bg-white/5 rounded border border-white/5 italic">
                        No historical abstracts clustered.
                      </div>
                    )}
                  </div>
                </div>

                {/* Pipeline health status check */}
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between text-emerald-400 text-[9px] font-bold">
                  <span className="flex items-center gap-1.5 uppercase">
                    <Check className="w-3.5 h-3.5" />
                    <span>L3 Ingestion Engine Steady</span>
                  </span>
                  <span>100% HEALTHY</span>
                </div>

              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Clock className="w-6 h-6 mx-auto mb-2 text-gray-700 animate-spin" />
                <span>Demodulating telemetry...</span>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-3 text-[8px] text-gray-650 text-gray-500 leading-relaxed text-center">
            <span>COSMICMIND NEURAL LOGS VALIDATED BY NASA SYSTEM LIAISON CORE SECURED</span>
          </div>

        </div>

      </div>
    </div>
  );
}
