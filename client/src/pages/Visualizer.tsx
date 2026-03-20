import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Loader2, Sparkles,
    Info,
    BrainCircuit, ListChecks,
    Network, MousePointer2, Cpu, FileText
} from 'lucide-react';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';
import { Mermaid } from '../components/Mermaid';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';
import api from '../services/api';

interface VisualizerResult {
    summary: string;
    key_concepts?: string[];
    mermaid_diagrams?: { type: string; code: string }[];
    data_insights?: string;
}

export default function Visualizer() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VisualizerResult | null>(null);
    const [error, setError] = useState('');

    // Update global assistant
    useEffect(() => {
        if (result) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { wpm: 0, suggestions: ["Expand diagram", "Export as SVG", "Generate report"] } 
            }));
        }
    }, [result]);

    const handleVisualize = useCallback(async () => {
        if (!content.trim()) {
            setError("Please provide content to visualize.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/api/ai/visualize', { text: content });
            setResult(data.success ? data.data : data as unknown as VisualizerResult);
        } catch (err: any) {
            setError(err.response?.data?.error || "Visualization failed.");
        } finally {
            setLoading(false);
        }
    }, [content]);

    return (
        <div className="workspace-center-content">
            {/* TOP INPUT AREA */}
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper">
                      <button className="modern-tool-btn active">
                         <Network size={20} className="text-cyan-400" />
                         <span>Visualize</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/analyzer'}>
                         <BrainCircuit size={20} className="text-indigo-400" />
                         <span>Audit</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/generator'}>
                         <Zap size={20} className="text-amber-400" />
                         <span>Generate</span>
                      </button>
                </div>

                <div className="smart-gpt-editor">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 px-4 opacity-50">
                        <div className="flex items-center gap-2">
                             <Cpu size={14} className="text-cyan-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mapping Engine v2.0</span>
                        </div>
                        <div className="flex items-center gap-4">
                             <SmartProcessingToolbar onTextExtracted={setContent} />
                        </div>
                    </div>
                    
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste your research, data points, or logic here..."
                        className="custom-scrollbar"
                    />

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleVisualize}
                            disabled={loading || !content.trim()}
                            className="premium-btn-primary flex items-center gap-4 py-4 px-10 rounded-2xl group transition-all"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={18} /> Mapping Architecture...</>
                            ) : (
                                <><Network size={18} className="group-hover:rotate-45 transition-transform" /> INITIATE PROJECTION</>
                            )}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex justify-center text-rose-400 text-[10px] font-black uppercase tracking-widest">
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* BOTTOM OUTPUT AREA */}
            <section className="output-bottom-area">
                <AnimatePresence mode="wait">
                    {!result && !loading ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-30">
                             <Network size={64} className="text-slate-800 mb-6" />
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Knowledge projection offline</p>
                        </motion.div>
                    ) : loading ? (
                        <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
                             <div className="w-16 h-16 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-6" />
                             <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest animate-pulse">Scanning Logical Nodes...</span>
                        </motion.div>
                    ) : (
                        <motion.div key="res" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 max-w-6xl mx-auto">
                             <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                <div className="flex items-center gap-3">
                                   <Zap size={18} className="text-cyan-400" />
                                   <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Synthesis Complete</h4>
                                </div>
                                <div className="flex gap-4">
                                     <button onClick={() => setResult(null)} className="px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 transition-colors">Clear</button>
                                     <button onClick={() => generatePDF()} className="px-5 py-2.5 bg-cyan-600 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-cyan-700 transition-colors flex items-center gap-2 shadow-lg shadow-cyan-600/20">
                                         <FileText size={14} /> Export Map
                                     </button>
                                </div>
                             </div>

                             {/* MAIN SUMMARY */}
                             <div className="modern-card border-cyan-500/10">
                                 <h5 className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                    <Sparkles size={14} /> Executive Insight
                                 </h5>
                                 <p className="text-2xl text-slate-200 font-serif italic text-center px-4 leading-relaxed">
                                     "{result.summary}"
                                 </p>
                             </div>

                             {/* KEY CONCEPTS */}
                             <div className="modern-card">
                                 <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                                    <ListChecks size={14} className="text-indigo-400" /> Contextual Nodes
                                 </h5>
                                 <div className="flex flex-wrap gap-3">
                                     {result.key_concepts?.map((c, i) => (
                                         <span key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                             {c}
                                         </span>
                                     ))}
                                 </div>
                             </div>

                             {/* ENLARGED DIAGRAMS */}
                             <div className="space-y-12">
                                 {result.mermaid_diagrams?.map((diag, i) => (
                                     <div key={i} className="space-y-6">
                                         <div className="flex items-center justify-between px-2">
                                             <div className="flex items-center gap-4">
                                                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                                     <FileText size={18} className="text-cyan-400" />
                                                  </div>
                                                  <h4 className="text-sm font-black text-white uppercase tracking-widest">{diag.type} Projection</h4>
                                             </div>
                                             <div className="hidden sm:flex items-center gap-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
                                                <MousePointer2 size={12} /> Interactive Workspace
                                             </div>
                                         </div>
                                         <div className="modern-card bg-[#0D1117]/80 p-8 md:p-16 min-h-[600px] flex items-center justify-center overflow-x-auto custom-scrollbar border-white/5">
                                             <div className="w-full scale-110 transform-gpu">
                                                <Mermaid code={diag.code} />
                                             </div>
                                         </div>
                                     </div>
                                 ))}
                             </div>

                             {result.data_insights && (
                                 <div className="modern-card border-indigo-500/10 py-12">
                                     <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-3">
                                         <Info size={16} /> Architectural Logic
                                     </h5>
                                     <p className="text-slate-400 font-medium leading-relaxed italic text-sm">"{result.data_insights}"</p>
                                 </div>
                             )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {result && <IntelligenceReport data={{
                ...result,
                mermaid_diagrams: result.mermaid_diagrams
            }} type="visualize" content={content} />}
        </div>
    );
}
