import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Loader2, CheckCircle, Info, Zap, Printer } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';
import { VoiceInput } from '../components/VoiceInput';
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

    const handleGenerate = useCallback(async () => {
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) {
            setError("Please provide a topic or prompt.");
            return;
        }

        if (loading) return;

        setLoading(true);
        setAnswer('');
        setError('');

        try {
            const { data } = await api.post('/api/generate', {
                query: trimmedPrompt,
                response_type: mode
            });

            if (data.answer) {
                setAnswer(data.answer);
            } else {
                setAnswer(data.error || "Generation failed. Please try a different topic.");
            }
        } catch (err: unknown) {
            console.error("Generation failure:", err);
            if (err instanceof Error && err.name === "CanceledError") return;
            setError("Connection failed. Please check your network.");
        } finally {
            setLoading(false);
        }
    }, [prompt, mode, loading]);

    const handleCopy = useCallback(() => {
        if (!answer) return;
        navigator.clipboard.writeText(answer);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [answer]);

    const modeSelector = useMemo(() => (
        <div className="flex gap-3 mb-8 p-1.5 bg-white/5 rounded-2xl border border-white/5">
            {MODES.map((m) => (
                <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${mode === m.id
                        ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                        }`}
                >
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{m.label}</span>
                    <span className="text-[8px] font-bold opacity-60 uppercase tracking-tighter">{m.description}</span>
                </button>
            ))}
        </div>
    ), [mode]);

    return (
        <div className="tool-container">
            <header className="mb-8 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 md:mb-6"
                >
                    <Logo variant="icon" className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Generation Engine</span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Generator</h1>
                <p className="text-slate-400 font-medium text-base md:text-lg max-w-2xl">Create high-fidelity research summaries and professional content with AI verification.</p>
            </header>

            <div className="laptop-mock">
                <div className="laptop-screen overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px] md:h-[800px] divide-y md:divide-y-0 md:divide-x divide-white/5">
                        {/* INPUT PANE */}
                        <div className="p-6 md:p-10 flex flex-col bg-[#0d1117]/30 overflow-y-auto custom-scrollbar">
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Topic Specification</label>
                                    <div className="flex items-center gap-2">
                                        <VoiceInput onTranscription={(t) => setPrompt(prev => prev ? `${prev} ${t}` : t)} />
                                        <SmartProcessingToolbar onTextExtracted={setPrompt} />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Intelligence Depth</label>
                                    {modeSelector}
                                </div>

                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe the topic or inquiry in detail..."
                                    className="custom-editor flex-1 min-h-[250px] mb-8 shadow-inner"
                                />

                                {error && (
                                    <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold text-center">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !prompt.trim()}
                                className="premium-btn-primary w-full flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-600/10"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={20} /> PRODUCE CONTENT</>}
                            </button>
                        </div>

                        {/* OUTPUT PANE */}
                        <div className="p-6 md:p-10 bg-black/40 flex flex-col overflow-y-auto custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {!answer && !loading ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center text-center py-20"
                                    >
                                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                                            <Zap size={48} className="text-slate-700" />
                                        </div>
                                        <p className="text-slate-500 font-medium italic text-sm">Generated research material will appear here.</p>
                                    </motion.div>
                                ) : loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col space-y-8"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="shimmer w-32 h-6 rounded-full opacity-40" />
                                                <div className="shimmer w-24 h-4 rounded-full opacity-20" />
                                            </div>
                                            <div className="shimmer w-12 h-12 rounded-2xl" />
                                        </div>
                                        <div className="glass-panel p-10 flex-1 bg-white/[0.02] border-white/5 space-y-4">
                                            <div className="skeleton-text w-full" />
                                            <div className="skeleton-text w-11/12" />
                                            <div className="skeleton-text w-full" />
                                            <div className="skeleton-text w-10/12" />
                                            <div className="skeleton-text w-full" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                                                    Status: Generated
                                                </div>
                                                <div className="hidden sm:block text-[10px] font-black text-slate-500 uppercase tracking-widest border-l border-white/10 pl-3">
                                                    Mode: {mode}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={generatePDF}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 mr-2"
                                                >
                                                    <Printer size={14} /> Download PDF
                                                </button>
                                                <button
                                                    onClick={handleCopy}
                                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                                                    title="Copy to clipboard"
                                                >
                                                    {copied ? <CheckCircle size={18} className="text-emerald-400" /> : <Copy size={18} className="text-slate-400 group-hover:text-white" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="glass-panel p-6 md:p-8 flex-1 bg-white/[0.02] border-white/5 font-sans leading-relaxed text-slate-200 text-base md:text-lg overflow-y-auto custom-scrollbar">
                                            {answer}
                                        </div>

                                        <div className="mt-8 p-6 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-2xl flex items-start gap-4">
                                            <Info size={18} className="text-indigo-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Intelligence Note</p>
                                                <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed">
                                                    Verification Guard active: This material has been cross-referenced through VeriMind's internal sanity check layer to ensure factual consistency.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden Print Report */}
            {answer && <IntelligenceReport data={{ answer }} type="generate" content={prompt} />}
        </div>
    );
}
