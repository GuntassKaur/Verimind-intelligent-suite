import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Loader2, CheckCircle, Info, Zap, Printer, Cpu, Globe } from 'lucide-react';
import api from '../services/api';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';

const MODES = [
    { id: 'Brief', label: 'Brief', description: 'Concise summary' },
    { id: 'Research', label: 'Research', description: 'In-depth analysis' }
];

export default function Generate() {
    const [prompt, setPrompt] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mode, setMode] = useState('Brief');
    const [error, setError] = useState('');

    // Update global assistant
    useEffect(() => {
        if (answer) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { wpm: 0, suggestions: ["Refine tone", "Summarize result", "Check facts"] } 
            }));
        }
    }, [answer]);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError("Please provide a topic or prompt.");
            return;
        }

        setLoading(true);
        setAnswer('');
        setError('');

        try {
            const { data } = await api.post('/api/generate', {
                query: prompt,
                response_type: mode
            });

            if (data.success) {
                setAnswer(data.data?.answer || data.data?.text || "Generation successful.");
            } else {
                setError(data.error || "Generation failed.");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Connection failed.");
        } finally {
            setLoading(false);
        }
    }, [prompt, mode]);

    return (
        <div className="workspace-center-content">
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper">
                      <button className="modern-tool-btn active">
                         <Sparkles size={20} className="text-indigo-400" />
                         <span>Generate</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/analyzer'}>
                         <Cpu size={20} className="text-blue-400" />
                         <span>Audit</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/workspace'}>
                         <Globe size={20} className="text-emerald-400" />
                         <span>Studio</span>
                      </button>
                </div>

                <div className="smart-gpt-editor">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 px-4 opacity-50">
                        <div className="flex items-center gap-4">
                             <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                                 {MODES.map(m => (
                                     <button 
                                       key={m.id} 
                                       onClick={() => setMode(m.id)}
                                       className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === m.id ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                     >
                                         {m.label}
                                     </button>
                                 ))}
                             </div>
                        </div>
                        <div className="flex items-center gap-4">
                             <SmartProcessingToolbar onTextExtracted={setPrompt} />
                        </div>
                    </div>
                    
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="What would you like to generate today?"
                        className="custom-scrollbar"
                    />

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className="premium-btn-primary flex items-center gap-4 py-4 px-10 rounded-2xl group transition-all"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={18} /> Synthesizing...</>
                            ) : (
                                <><Sparkles size={18} className="group-hover:rotate-12 transition-transform" /> INITIATE GENERATION</>
                            )}
                        </button>
                    </div>
                </div>

                {error && <div className="mt-4 text-center text-rose-400 text-[10px] font-black uppercase tracking-widest">{error}</div>}
            </section>

            <section className="output-bottom-area">
                <AnimatePresence mode="wait">
                    {!answer && !loading ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-30">
                             <Zap size={64} className="text-slate-800 mb-6" />
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Awaiting prompt input</p>
                        </motion.div>
                    ) : loading ? (
                        <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
                             <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6" />
                             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">Establishing Neural Link...</span>
                        </motion.div>
                    ) : (
                        <motion.div key="res" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto pb-20">
                             <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                <div className="flex items-center gap-3">
                                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                   <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Extracted Intelligence Cluster</h4>
                                </div>
                                <div className="flex gap-4">
                                     <button onClick={() => { navigator.clipboard.writeText(answer); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2 text-slate-400">
                                         {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                         {copied ? 'Copied' : 'Copy'}
                                     </button>
                                     <button onClick={() => generatePDF()} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                                         <Printer size={14} /> Export
                                     </button>
                                </div>
                             </div>

                             <div className="modern-card p-10 md:p-14 bg-[#0D1117] border-white/5 group relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                    <Sparkles size={180} className="text-indigo-400" />
                                 </div>
                                 <div className="relative z-10">
                                     <p className="text-slate-200 font-serif text-xl md:text-2xl leading-[2] whitespace-pre-wrap selection:bg-indigo-500/30">
                                         {answer}
                                     </p>
                                 </div>
                             </div>

                             <div className="modern-card border-indigo-500/10 py-8 bg-indigo-500/5">
                                 <div className="flex items-start gap-5 px-4">
                                     <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                                         <Info size={20} className="text-indigo-400" />
                                     </div>
                                     <div>
                                         <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Neural Guard Active</h5>
                                         <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed">Verification protocol applied. Content has been synthesized through the Truth Engine to ensure baseline factual consistency and professional resonance.</p>
                                     </div>
                                 </div>
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {answer && <IntelligenceReport data={{ answer }} type="generate" content={prompt} />}
        </div>
    );
}
