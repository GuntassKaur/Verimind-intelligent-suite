import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Loader2, CheckCircle, Wand2, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';
import { VoiceInput } from '../components/VoiceInput';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';
import { Printer } from 'lucide-react';

const TONES = [
    { id: 'Professional', label: 'Professional', icon: '💼' },
    { id: 'Casual', label: 'Casual', icon: '🍃' },
    { id: 'Academic', label: 'Academic', icon: '🎓' },
    { id: 'Creative', label: 'Creative', icon: '🎨' },
    { id: 'Technical', label: 'Technical', icon: '⚙️' }
];

export default function Humanizer() {
    const [text, setText] = useState('');
    const [tone, setTone] = useState('Professional');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ humanized_text: string; confidence_score?: number } | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleHumanize = useCallback(async () => {
        const trimmedText = text.trim();
        if (!trimmedText) {
            setError("Please provide content to humanize.");
            return;
        }

        if (loading) return;

        setError('');
        setLoading(true);
        setResult(null);

        try {
            const { data } = await api.post('/api/humanize', { text: trimmedText, tone });
            setResult(data);
        } catch (err: unknown) {
            console.error("Humanization failure:", err);
            if (err instanceof Error && err.name === "CanceledError") return;
            setError("Failed to process content. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [text, tone, loading]);

    const handleCopy = useCallback(() => {
        if (!result?.humanized_text) return;
        navigator.clipboard.writeText(result.humanized_text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [result?.humanized_text]);

    const toneSelector = useMemo(() => (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            {TONES.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${tone === t.id
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                        : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                        }`}
                >
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">{t.label}</span>
                </button>
            ))}
        </div>
    ), [tone]);

    return (
        <div className="tool-container">
            <header className="mb-8 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 md:mb-6"
                >
                    <Logo variant="icon" className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Stylistic refactor</span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Humanizer</h1>
                <p className="text-slate-400 font-medium text-base md:text-lg max-w-2xl">Rewrite AI-generated content to sound more natural, fluid, and authentically human.</p>
            </header>

            <div className="laptop-mock">
                <div className="laptop-screen overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px] md:h-[800px] divide-y md:divide-y-0 md:divide-x divide-white/5">
                        {/* INPUT PANE */}
                        <div className="p-6 md:p-10 flex flex-col bg-[#0d1117]/30 overflow-y-auto custom-scrollbar">
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Draft Content</label>
                                    <div className="flex items-center gap-2">
                                        <VoiceInput onTranscription={(t) => setText(prev => prev ? `${prev} ${t}` : t)} />
                                        <SmartProcessingToolbar onTextExtracted={setText} />
                                    </div>
                                </div>

                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste content here to humanize..."
                                    className="custom-editor flex-1 min-h-[250px] mb-8"
                                />

                                <div className="space-y-4 mb-8">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center sm:text-left">Select Transformation Tone</label>
                                    {toneSelector}
                                </div>

                                {error && (
                                    <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold text-center">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleHumanize}
                                disabled={loading || !text.trim()}
                                className="premium-btn-primary w-full flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-indigo-600 to-violet-600"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Wand2 size={20} /> HUMANIZE CONTENT</>}
                            </button>
                        </div>

                        {/* OUTPUT PANE */}
                        <div className="p-6 md:p-10 bg-black/40 flex flex-col overflow-y-auto custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {!result && !loading ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center text-center py-20"
                                    >
                                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5">
                                            <Sparkles size={48} className="text-slate-700" />
                                        </div>
                                        <p className="text-slate-500 font-medium italic text-sm">Transformation output will appear here.</p>
                                    </motion.div>
                                ) : loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col space-y-6"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="shimmer w-32 h-6 rounded-full opacity-40" />
                                                <div className="shimmer w-20 h-4 rounded-full opacity-20" />
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
                                                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                                                    Status: Optimized
                                                </div>
                                                <div className="hidden sm:block text-[10px] font-black text-slate-500 uppercase tracking-widest border-l border-white/10 pl-3">
                                                    Style: {tone}
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

                                        <div className="glass-panel p-6 md:p-8 flex-1 bg-white/[0.02] border-white/5 font-sans leading-relaxed text-slate-200 text-base md:text-lg">
                                            {result?.humanized_text}
                                        </div>

                                        <div className="mt-8 p-6 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-2xl flex items-start gap-4">
                                            <Wand2 size={18} className="text-indigo-400 mt-1 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Editor Note</p>
                                                <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed">
                                                    This content has been refactored for natural linguistic patterns. Minor manual adjustments may still be needed for context-specific nuances.
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
            {result && <IntelligenceReport data={result} type="humanize" content={text} />}
        </div>
    );
}
