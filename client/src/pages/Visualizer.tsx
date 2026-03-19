import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Loader2, Sparkles,
    Info, AlertCircle,
    Plus, BrainCircuit, ListChecks,
    Network, MousePointer2, Printer
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

    const handleVisualize = useCallback(async () => {
        if (!content.trim()) {
            setError("Please provide content to visualize.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/api/ai/visualize', { text: content });
            setResult(data);
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const e = err as { response?: { data?: { error?: string } } };
                setError(e.response?.data?.error || "Visualization failed.");
            } else {
                setError("Visualization failed.");
            }
        } finally {
            setLoading(false);
        }
    }, [content]);

    return (
        <div className="tool-container pb-40">
            <header className="mb-8 md:mb-12 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 md:mb-6"
                >
                    <BrainCircuit size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Advanced Visualizer</span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Visualizer</h1>
                <p className="text-slate-500 font-medium text-sm md:text-lg max-w-2xl mx-auto italic">Transform complex documents into concise summaries and visual knowledge maps.</p>
            </header>

            <div className="max-w-6xl mx-auto space-y-12">
                {/* INPUT SECTION */}
                {!result && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="glass-card p-1 relative overflow-hidden flex flex-col min-h-[400px]">
                            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4">Knowledge Source</span>
                                <SmartProcessingToolbar onTextExtracted={(t) => setContent(t)} />
                            </div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste your text, PDF content, or URL data here..."
                                className="flex-1 w-full p-8 bg-transparent text-slate-200 font-medium leading-relaxed resize-none focus:outline-none placeholder:text-slate-800 text-lg custom-scrollbar"
                            />
                            <div className="p-4 border-t border-white/5 bg-white/[0.02] flex justify-center">
                                <button
                                    onClick={handleVisualize}
                                    disabled={loading || !content.trim()}
                                    className="px-12 py-4 bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/30 disabled:opacity-50 flex items-center gap-3"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                                    Synthesize Knowledge
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-3">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* RESULTS - VISUALS */}
                <AnimatePresence>
                    {result && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setResult(null)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    <Plus size={14} className="rotate-45" /> New Analysis
                                </button>
                                <button
                                    onClick={generatePDF}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    <Printer size={14} /> Download PDF
                                </button>
                            </div>

                            {/* Summary & Key Concepts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                <div className="glass-card p-6 md:p-10 bg-indigo-500/[0.02]">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6 md:mb-8 flex items-center gap-3">
                                        <Sparkles size={16} /> Executive Summary
                                    </h4>
                                    <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed italic">"{result.summary}"</p>
                                </div>
                                <div className="glass-card p-6 md:p-10 bg-white/[0.02]">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 md:mb-8 flex items-center gap-3">
                                        <ListChecks size={16} className="text-indigo-400" /> Key Concepts
                                    </h4>
                                    <div className="flex flex-wrap gap-2 md:gap-3">
                                        {result.key_concepts?.map((c: string, i: number) => (
                                            <span key={i} className="px-4 py-2 md:px-5 md:py-2.5 bg-black/40 border border-white/10 rounded-2xl text-[10px] md:text-xs font-bold text-slate-300">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* DIAGRAMS */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                    <Network className="text-indigo-400" size={24} />
                                    <div>
                                        <h3 className="text-lg font-black text-white uppercase tracking-widest">Knowledge Mapping</h3>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] mt-1">Generated Schema: {result.mermaid_diagrams?.[0]?.type || 'Standard'}</p>
                                    </div>
                                </div>

                                {result.mermaid_diagrams?.map((diag: { type: string; code: string }, i: number) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} className="space-y-4">
                                        <div className="flex items-center justify-between px-6">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{diag.type} Projection</span>
                                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-700 uppercase tracking-widest">
                                                <MousePointer2 size={10} /> Interact with nodes
                                            </div>
                                        </div>
                                        <Mermaid code={diag.code} />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Data Insights */}
                            {result.data_insights && (
                                <div className="glass-card p-10 border-indigo-500/10">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-3">
                                        <Info size={16} className="text-indigo-400" /> Structural Insights
                                    </h4>
                                    <p className="text-slate-400 font-medium leading-relaxed">{result.data_insights}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Hidden Print Report */}
            {result && <IntelligenceReport data={result} type="visualize" content={content} />}

        </div>
    );
}
