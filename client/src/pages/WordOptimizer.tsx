import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Type,
    Sparkles,
    Copy,
    Loader2,
    CheckCircle,
    Replace,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import api from '../services/api';

interface WordSuggestion {
    original: string;
    suggestions: string[];
    context: string;
    index?: number;
}

export default function WordOptimizer() {
    const [text, setText] = useState('');
    const [suggestions, setSuggestions] = useState<WordSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleAnalyze = useCallback(async () => {
        if (!text.trim()) {
            setError("Please provide some text to optimize.");
            return;
        }

        setLoading(true);
        setError('');
        setSuggestions([]);

        try {
            const { data } = await api.post('/api/improve-words', { text });

            // Expected format from AI: list of objects
            let analysis = data.analysis;
            if (typeof analysis === 'string') {
                try {
                    // Extract JSON if AI wrapped it in markdown
                    const match = analysis.match(/\[.*\]/s);
                    if (match) analysis = JSON.parse(match[0]);
                } catch {
                    analysis = [];
                }
            }

            if (Array.isArray(analysis)) {
                setSuggestions(analysis);
            } else {
                setError("Optimization returned an unexpected format. Please try again.");
            }
        } catch {
            setError("Analysis failed. Please check your connection.");
        } finally {
            setLoading(false);
        }
    }, [text]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const applySuggestion = (original: string, replacement: string) => {
        // Simple case-insensitive replacement for now
        // A more advanced version would use indexes from the backend
        const newText = text.replace(new RegExp(original, 'i'), replacement);
        setText(newText);
    };

    return (
        <div className="tool-container">
            <header className="mb-8 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4 md:mb-6"
                >
                    <Type size={14} className="text-violet-400" />
                    <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em]">Linguistic Suite</span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Word Optimizer</h1>
                <p className="text-slate-400 font-medium text-base md:text-lg max-w-2xl">Detect weak vocabulary and replace it with high-impact, contextually superior alternatives.</p>
            </header>

            <div className="laptop-mock">
                <div className="laptop-screen overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px] md:h-[800px] divide-y md:divide-y-0 md:divide-x divide-white/5">
                        {/* INPUT PANE */}
                        <div className="p-6 md:p-10 flex flex-col bg-[#0d1117]/30 overflow-y-auto custom-scrollbar">
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block leading-none">Input Draft</label>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                                        title="Copy current text"
                                    >
                                        {copied ? <CheckCircle size={16} className="text-emerald-400" /> : <Copy size={16} className="text-slate-500 group-hover:text-white" />}
                                    </button>
                                </div>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste your text here to identify weak words and improve vocabulary..."
                                    className="custom-editor flex-1 min-h-[350px] mb-8 shadow-inner"
                                />

                                {error && (
                                    <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold text-center">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !text.trim()}
                                className="premium-btn-primary w-full flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-violet-600 to-indigo-600 shadow-violet-600/10"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={20} /> SCAN FOR WEAK WORDS</>}
                            </button>
                        </div>

                        {/* OUTPUT PANE */}
                        <div className="p-6 md:p-10 bg-black/40 flex flex-col overflow-y-auto custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {!suggestions.length && !loading ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center text-center py-20"
                                    >
                                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                                            <Replace size={48} className="text-slate-700" />
                                        </div>
                                        <p className="text-slate-500 font-medium italic text-sm">Improvement suggestions will appear here.</p>
                                    </motion.div>
                                ) : loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col space-y-8"
                                    >
                                        <div className="shimmer w-48 h-6 rounded-full opacity-40 mb-4" />
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="glass-panel p-8 space-y-4 bg-white/[0.01] border-white/5">
                                                <div className="flex justify-between">
                                                    <div className="skeleton-text w-1/4" />
                                                    <div className="skeleton-text w-8 h-8 rounded-lg" />
                                                </div>
                                                <div className="skeleton-text w-full" />
                                                <div className="flex gap-2">
                                                    <div className="skeleton-text w-20 h-8 rounded-full" />
                                                    <div className="skeleton-text w-20 h-8 rounded-full" />
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-8"
                                    >
                                        <header className="flex items-center justify-between mb-2">
                                            <div className="px-4 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-[10px] font-black uppercase tracking-widest">
                                                {suggestions.length} Semantic Improvements
                                            </div>
                                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                Linguistic Scan Complete
                                            </div>
                                        </header>

                                        {suggestions.map((s, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="glass-panel p-8 bg-white/[0.02] border-white/5 hover:border-violet-500/30 transition-all group relative overflow-hidden"
                                            >
                                                {/* Left accent */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500 opacity-0 group-hover:opacity-40 transition-opacity" />

                                                <div className="flex items-start justify-between relative z-10 gap-4">
                                                    <div>
                                                        <span className="text-[9px] font-black text-rose-400/60 uppercase tracking-widest block mb-2">Identify: Weak Semantics</span>
                                                        <span className="text-xl md:text-2xl font-black text-white line-through decoration-rose-500/40 opacity-70 group-hover:opacity-90 transition-opacity whitespace-normal break-words">
                                                            {s.original}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-slate-500 hover:text-white"
                                                    >
                                                        {expandedIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </button>
                                                </div>

                                                <div className="mt-8 relative z-10">
                                                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-4">Precision Replacements</span>
                                                    <div className="flex flex-wrap gap-3">
                                                        {s.suggestions.map((option, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => applySuggestion(s.original, option)}
                                                                className="px-5 py-2.5 bg-emerald-500/5 hover:bg-emerald-500 border border-emerald-500/10 hover:border-emerald-500 text-emerald-400 hover:text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-emerald-500/0 hover:shadow-emerald-500/20"
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {expandedIndex === i && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="mt-8 pt-8 border-t border-white/5">
                                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Contextual Intelligence</span>
                                                                <p className="text-sm text-slate-400 font-medium italic leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                                                                    "{s.context}"
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}

                                        <div className="mt-10 p-8 bg-violet-500/[0.03] border border-violet-500/10 rounded-3xl flex items-start gap-5">
                                            <div className="w-10 h-10 bg-violet-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-violet-500/20">
                                                <Sparkles size={20} className="text-violet-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1 leading-none">Vocabulary Optimization Engine</p>
                                                <p className="text-xs text-slate-400 font-medium italic leading-relaxed">
                                                    Recommendations are based on semantic impact and reading level optimization. Click an alternative to instantly replace the weak word in your draft.
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
        </div>
    );
}
