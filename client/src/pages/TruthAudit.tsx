import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, AlertCircle, Cpu } from 'lucide-react';

import api from '../services/api';
import { RiskMeter } from '../components/RiskMeter';
import { VoiceInput } from '../components/VoiceInput';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';

interface Sentence {
    text: string;
    hallucination_score: number;
    heat_grade: string;
    risk_label: string;
    explanation: string;
}

interface AnalysisResult {
    integrity_score: number;
    audit_verdict: string;
    educational_summary: string;
    sentences: Sentence[];
    metrics?: {
        total_claims: number;
        false_claims: number;
    };
}

// Memoized Claim Card for performance
const ClaimCard = ({ sentence, index }: { sentence: Sentence; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="p-5 bg-white/5 border border-white/10 rounded-2xl group hover:border-indigo-500/30 transition-all"
    >
        <div className="flex items-center gap-2 mb-3">
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${sentence.heat_grade === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                sentence.heat_grade === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                {sentence.risk_label || sentence.heat_grade}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">RISK: {sentence.hallucination_score}%</span>
        </div>
        <p className="text-sm text-slate-100 font-medium mb-3 leading-relaxed">{sentence.text}</p>
        <p className="text-[11px] text-slate-500 italic leading-relaxed font-medium bg-black/20 p-3 rounded-lg border border-white/5">
            {sentence.explanation}
        </p>
    </motion.div>
);

export default function Dashboard() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState('');

    const handleAnalyze = useCallback(async () => {
        const trimmedQuery = query.trim();
        const trimmedResponse = response.trim();

        if (!trimmedQuery || !trimmedResponse) {
            setError("Please provide both an inquiry and the content to be analyzed.");
            return;
        }

        if (loading) return;

        setError('');
        setLoading(true);
        setResult(null);

        try {
            const { data } = await api.post('/api/analyze', {
                prompt: trimmedQuery,
                answer: trimmedResponse
            });

            if (data.error) throw new Error(data.error);
            setResult(data);
        } catch (err: unknown) {
            const errorObj = err as { message?: string; name?: string };
            console.error("Analysis failure:", errorObj);
            setError(errorObj.message || "Analysis failed. Please check your connection.");
        } finally {
            setLoading(false);
        }
    }, [query, response, loading]);

    const sentenceList = useMemo(() => {
        if (!result?.sentences) return null;
        return result.sentences.map((s, i) => (
            <ClaimCard key={`${i}-${s.text.slice(0, 10)}`} sentence={s} index={i} />
        ));
    }, [result?.sentences]);

    return (
        <div className="tool-container pb-40 relative">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />

            <header className="mb-12 md:mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6 md:mb-8 shadow-lg shadow-indigo-500/5"
                >
                    <Cpu size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Neural Verification Active</span>
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-none">
                    Claim <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Analyzer</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm md:text-lg max-w-2xl mx-auto italic font-sans leading-relaxed">
                    "Precision verification engine for identifying factual inconsistencies, hallucinations, and credibility risks with atomic resolution."
                </p>
            </header>

            <div className="max-w-[1400px] mx-auto">
                <div className="glass-card overflow-hidden border-white/5 shadow-2xl shadow-black/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px] divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                        {/* INPUT PANE */}
                        <div className="p-8 md:p-12 flex flex-col bg-slate-900/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -z-10" />
                            <div className="space-y-10 flex-1 relative z-10">
                                <div>
                                    <div className="flex items-center justify-between mb-5 px-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Core Inquiry Context</label>
                                        </div>
                                        <VoiceInput onTranscription={(t) => setQuery(prev => prev ? `${prev} ${t}` : t)} />
                                    </div>
                                    <textarea
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Define the primary question or hypothesis to be cross-verified..."
                                        className="premium-input min-h-[120px] resize-none text-lg placeholder:text-slate-800 bg-black/40 border-white/5 focus:border-indigo-500/40 transition-all rounded-3xl p-6"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-5 px-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Target Source Content</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <VoiceInput onTranscription={(t) => setResponse(prev => prev ? `${prev} ${t}` : t)} />
                                            <SmartProcessingToolbar onTextExtracted={setResponse} />
                                        </div>
                                    </div>
                                    <textarea
                                        value={response}
                                        onChange={(e) => setResponse(e.target.value)}
                                        placeholder="Paste the generated response or manuscript here for neural auditing..."
                                        className="custom-editor min-h-[350px] text-lg bg-black/40 border-white/5 focus:border-purple-500/40 transition-all rounded-3xl p-8"
                                    />
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-400 text-xs font-bold shadow-lg shadow-rose-900/10"
                                    >
                                        <AlertCircle size={18} />
                                        {error}
                                    </motion.div>
                                )}
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !query.trim() || !response.trim()}
                                className="premium-btn-primary w-full mt-12 flex items-center justify-center gap-4 py-8 text-sm tracking-[0.3em] font-black shadow-2xl shadow-indigo-500/20 hover:scale-[1.01] transition-all"
                                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
                            >
                                {loading ? (
                                    <><Loader2 className="animate-spin" size={20} /> SYNCHRONIZING...</>
                                ) : (
                                    <><Sparkles size={20} /> INITIATE DEEP AUDIT</>
                                )}
                            </button>
                        </div>

                        {/* OUTPUT PANE */}
                        <div className="p-8 md:p-12 bg-[#0a0f1d] flex flex-col overflow-y-auto custom-scrollbar relative">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
                            
                            <AnimatePresence mode="wait">
                                {!result && !loading ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center text-center py-20 relative z-10"
                                    >
                                        <motion.div 
                                            animate={{ 
                                                scale: [1, 1.05, 1],
                                                opacity: [0.3, 0.5, 0.3]
                                            }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                            className="w-40 h-40 bg-indigo-500/5 rounded-full flex items-center justify-center mb-10 border border-indigo-500/10 relative"
                                        >
                                            <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-2xl animate-pulse" />
                                            <Cpu size={64} className="text-slate-800 relative z-10" />
                                        </motion.div>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-3">System Awaiting Data</h3>
                                        <p className="text-slate-600 font-medium italic text-sm max-w-xs leading-relaxed">Cross-verification results will materialize here upon neural synchronization.</p>
                                    </motion.div>
                                ) : loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col space-y-10 relative z-10"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div className="shimmer h-56 w-full rounded-[3rem] border border-white/5" />
                                            <div className="shimmer h-56 w-full rounded-[3rem] border border-white/5" />
                                        </div>
                                        <div className="shimmer h-40 w-full rounded-[3rem] opacity-50 border border-white/5" />
                                        <div className="space-y-6 pt-6">
                                            <div className="shimmer h-4 w-40 opacity-30 rounded-full" />
                                            <div className="shimmer h-32 w-full rounded-[2.5rem] opacity-20 border border-white/5" />
                                            <div className="shimmer h-32 w-full rounded-[2.5rem] opacity-10 border border-white/5" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-10 relative z-10"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                            <div className="glass-panel p-10 flex flex-col items-center justify-center border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent rounded-[3rem] shadow-xl">
                                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Integrity Quotient</h3>
                                                <div className="relative">
                                                     <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                                                     <RiskMeter score={result!.integrity_score} riskLevel={result!.integrity_score > 70 ? 'LOW' : result!.integrity_score > 40 ? 'MEDIUM' : 'HIGH'} />
                                                </div>
                                            </div>

                                            <div className="glass-panel p-10 flex flex-col justify-center bg-gradient-to-br from-indigo-500/[0.05] to-purple-500/[0.05] border-indigo-500/20 rounded-[3rem] shadow-xl relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-500/20 transition-all" />
                                                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Neural Audit Verdict</h3>
                                                <div className="text-3xl md:text-5xl font-black text-white leading-none tracking-tighter mb-8">
                                                    {result!.audit_verdict.toUpperCase().replace('.', '')}
                                                </div>
                                                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                                                    <div>
                                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Atomic Segments</p>
                                                        <span className="text-2xl font-black text-white">{result!.sentences.length}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Audit State</p>
                                                        <span className="inline-flex items-center gap-1.5 text-[9px] font-black px-3 py-1 bg-emerald-500 text-white rounded-full uppercase tracking-tighter">
                                                            <div className="w-1 h-1 bg-white rounded-full animate-pulse" /> Verified
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="glass-panel p-10 bg-white/[0.02] border-white/5 rounded-[3rem] relative group hover:bg-white/[0.04] transition-all">
                                            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                                                <Sparkles size={16} /> EXECUTIVE SUMMARY
                                            </h4>
                                            <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-serif italic text-center px-4">
                                                "{result!.educational_summary}"
                                            </p>
                                        </div>

                                        <div className="space-y-6 pb-20">
                                            <div className="flex items-center justify-between px-2 mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 bg-indigo-500/20 rounded-full flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                                    </div>
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Atomic Factual Audit</h4>
                                                </div>
                                                <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest opacity-60">Probabilistic Mapping</span>
                                            </div>
                                            <div className="grid gap-4">
                                                {sentenceList}
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

