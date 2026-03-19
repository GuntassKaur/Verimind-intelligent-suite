import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Loader2, Search, CheckCircle2, AlertTriangle, Info, Printer, Cpu } from 'lucide-react';

import api from '../services/api';
import { VoiceInput } from '../components/VoiceInput';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';

interface Claim {
    claim: string;
    reasoning: string;
    verdict: 'Verified' | 'Potentially Misleading' | 'Uncertain';
    confidence: number;
}

interface AnalyzeResult {
    credibility_score: number;
    risk_level: 'Low' | 'Medium' | 'High';
    verdict: string;
    simple_explanation: string;
    reason_for_score: string;
    why_this_result: {
        problematic_parts: string[];
        analysis: string;
    };
    suggestions: string[];
    claims: Claim[];
}


export default function Analyzer() {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalyzeResult | null>(null);
    const [error, setError] = useState('');

    const handleAnalyze = useCallback(async () => {
        const trimmedText = text.trim();
        if (!trimmedText) {
            setError("Please provide content to analyze.");
            return;
        }

        if (loading) return;

        setError('');
        setLoading(true);
        setResult(null);

        try {
            const { data } = await api.post('/api/analyze', { text: trimmedText });
            setResult(data);
        } catch (err: unknown) {
            console.error("Analyzer scan failure:", err);
            if (err instanceof Error && err.name === "CanceledError") return;
            setError("Connection failed. Please check your network.");
        } finally {
            setLoading(false);
        }
    }, [text, loading]);

    return (
        <div className="tool-container pb-40 relative">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] -z-10" />

            <header className="mb-12 md:mb-20 text-center no-print px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 md:mb-8 shadow-lg shadow-blue-500/5"
                >
                    <ShieldAlert size={14} className="text-blue-400" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Truth Engine v5.0 Active</span>
                </motion.div>
                <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight mb-6 leading-none">
                    Manuscript <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Auditor</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm md:text-lg max-w-2xl mx-auto italic leading-relaxed">
                    "Deep semantic verification and hallucination detection for high-fidelity content integrity."
                </p>
            </header>

            <div className="max-w-[1400px] mx-auto no-print">
                <div className="glass-card overflow-hidden border-white/5 shadow-2xl shadow-black/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px] divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                        {/* INPUT PANE */}
                        <div className="p-8 md:p-12 flex flex-col bg-slate-900/40 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10" />
                             <div className="space-y-10 flex-1 relative z-10">
                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-6 px-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Audit Target Content</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <VoiceInput onTranscription={(t) => setText(prev => prev ? `${prev} ${t}` : t)} />
                                            <SmartProcessingToolbar onTextExtracted={setText} />
                                        </div>
                                    </div>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Paste content here to verify its claims and credibility..."
                                        className="custom-editor flex-1 min-h-[350px] mb-8 text-lg bg-black/40 border-white/5 focus:border-blue-500/40 transition-all rounded-[2.5rem] p-8"
                                    />

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mb-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-400 text-xs font-bold"
                                        >
                                            <AlertTriangle size={20} />
                                            {error}
                                        </motion.div>
                                    )}
                                </div>
                             </div>

                             <button
                                onClick={handleAnalyze}
                                disabled={loading || !text.trim()}
                                className="premium-btn-primary w-full flex items-center justify-center gap-4 py-8 text-sm tracking-[0.3em] font-black shadow-2xl shadow-blue-500/20 hover:scale-[1.01] transition-all"
                                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
                             >
                                {loading ? (
                                    <><Loader2 className="animate-spin" size={20} /> SYNCHRONIZING AUDIT...</>
                                ) : (
                                    <><ShieldAlert size={20} /> INITIATE DEEP AUDIT</>
                                )}
                             </button>
                        </div>

                        {/* OUTPUT PANE */}
                        <div className="p-8 md:p-12 bg-[#0a0f1d] flex flex-col overflow-y-auto custom-scrollbar relative">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
                            
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
                                            className="w-40 h-40 bg-blue-500/5 rounded-full flex items-center justify-center mb-10 border border-blue-500/10 relative"
                                        >
                                            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                                            <Search size={64} className="text-slate-800 relative z-10" />
                                        </motion.div>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-3">System Awaiting Audit Target</h3>
                                        <p className="text-slate-600 font-medium italic text-sm max-w-xs leading-relaxed mx-auto">Neural verification metrics will materialize here once content is synced with the global knowledge base.</p>
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
                                            <div className="shimmer h-56 w-full rounded-[3.5rem] border border-white/5" />
                                            <div className="shimmer h-56 w-full rounded-[3.5rem] border border-white/5" />
                                        </div>
                                        <div className="shimmer h-48 w-full rounded-[3.5rem] opacity-50 border border-white/5" />
                                        <div className="space-y-6 pt-6">
                                            <div className="shimmer h-4 w-48 opacity-30 rounded-full" />
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
                                        <div className="flex items-center justify-between border-b border-white/10 pb-6 no-print flex-wrap gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="px-5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/5">
                                                    Status: Neural Audit Complete
                                                </div>
                                            </div>
                                            <button
                                                onClick={generatePDF}
                                                className="flex items-center gap-3 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20 hover:scale-[1.05]"
                                            >
                                                <Printer size={16} /> DOWNLOAD AUDIT PDF
                                            </button>
                                        </div>

                                        {/* TOP STATS: Risk & Credibility */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                                            {/* Risk Level Card */}
                                            <div className={`glass-panel p-10 border-white/5 flex flex-col justify-center items-center rounded-[3.5rem] shadow-xl overflow-hidden relative group ${
                                                result?.risk_level === 'High' ? 'bg-rose-500/10' : 
                                                result?.risk_level === 'Medium' ? 'bg-amber-500/10' : 
                                                'bg-emerald-500/10'
                                            }`}>
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-4">Integrity Risk</span>
                                                <div className={`text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4 ${
                                                    result?.risk_level === 'High' ? 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 
                                                    result?.risk_level === 'Medium' ? 'text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 
                                                    'text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                                }`}>
                                                    {result?.risk_level}
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">{result?.verdict.replace('.', '')}</p>
                                            </div>

                                            {/* Credibility Score */}
                                            <div className="glass-panel p-10 border-blue-500/20 bg-gradient-to-br from-blue-500/[0.05] to-transparent flex flex-col justify-center items-center rounded-[3.5rem] shadow-xl relative group">
                                                <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full opacity-50" />
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-4">Credibility Index</span>
                                                <div className="text-5xl md:text-6xl font-black text-white leading-none tracking-tighter mb-6 relative">
                                                    {result?.credibility_score}%
                                                </div>
                                                <div className="w-full max-w-[150px] h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                                                    <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]" style={{ width: `${result?.credibility_score}%` }}></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SIMPLE EXPLANATION & REASON */}
                                        <div className="glass-panel p-10 bg-white/[0.02] border-white/5 rounded-[3.5rem] relative group hover:bg-white/[0.04] transition-all">
                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                                                <Info size={16} className="text-blue-500" /> EXECUTIVE FINDING
                                            </h4>
                                            <p className="text-2xl md:text-3xl text-white font-serif italic text-center px-4 mb-8 leading-tight">
                                                "{result?.simple_explanation}"
                                            </p>
                                            <div className="flex gap-4 p-6 bg-black/40 rounded-[2rem] border border-white/5 items-center justify-center">
                                                <div className="p-3 bg-blue-500/10 rounded-2xl">
                                                    <Cpu size={24} className="text-blue-400" />
                                                </div>
                                                <div className="max-w-md">
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-1">Reasoning Architecture</span>
                                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{result?.reason_for_score}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* WHY THIS RESULT & PROBLEM AREAS */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                                            {/* Deep Analysis */}
                                            <div className="glass-panel p-10 bg-indigo-500/[0.02] border-indigo-500/10 rounded-[3rem] shadow-xl">
                                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                                    <Search size={16} /> Expert Analysis
                                                </h4>
                                                <p className="text-sm md:text-base text-slate-300 leading-[1.8] font-medium italic opacity-80">
                                                    "{result?.why_this_result.analysis}"
                                                </p>
                                            </div>

                                            {/* Problematic Parts */}
                                            <div className="glass-panel p-10 bg-rose-500/[0.02] border-rose-500/10 rounded-[3rem] shadow-xl">
                                                <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                                    <AlertTriangle size={16} /> Logic Disruptors
                                                </h4>
                                                <div className="space-y-4">
                                                    {result?.why_this_result.problematic_parts.length === 0 ? (
                                                        <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5 text-center">
                                                            <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em]">0 Disruptions Detected</p>
                                                        </div>
                                                    ) : (
                                                        result?.why_this_result.problematic_parts.map((p, i) => (
                                                            <div key={i} className="flex gap-4 items-start p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 hover:bg-rose-500/10 transition-all">
                                                                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] mt-2 shrink-0" />
                                                                <span className="text-xs text-rose-100/70 font-bold leading-relaxed">"{p}"</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* SMART SUGGESTIONS */}
                                        <div className="glass-panel p-10 bg-emerald-500/[0.02] border-emerald-500/10 rounded-[3rem] shadow-xl">
                                            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-8">Optimization Strategies</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {result?.suggestions.map((s, i) => (
                                                    <div key={i} className="flex items-center gap-4 p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] group hover:bg-emerald-500/10 transition-all hover:scale-[1.02] cursor-pointer">
                                                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                                        </div>
                                                        <span className="text-xs text-emerald-100/90 font-black tracking-tighter uppercase">{s}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>


                                        <div className="space-y-6 pt-10">
                                            <div className="flex items-center justify-between px-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                                    </div>
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Atomic Factual Breakdown</h4>
                                                </div>
                                                <span className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] opacity-60">Neural Node Mapping</span>
                                            </div>
                                            <div className="grid gap-6">
                                                {result?.claims.map((claim: Claim, i: number) => (
                                                    <motion.div 
                                                        key={i} 
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        className="glass-panel p-8 bg-white/[0.01] rounded-[2.5rem] border-white/5 hover:border-blue-500/30 transition-all group"
                                                    >
                                                        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
                                                            <p className="text-xl text-white font-serif italic leading-relaxed md:w-2/3 group-hover:text-blue-200 transition-colors">"{claim.claim}"</p>
                                                            <div className={`shrink-0 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border ${claim.verdict === 'Verified' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                                    : claim.verdict === 'Potentially Misleading' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                                                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                                                } shadow-xl`}>
                                                                {claim.verdict}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-6 text-slate-400 bg-black/40 p-8 rounded-[2rem] border border-white/10 relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl" />
                                                            {claim.verdict === 'Verified' ? <CheckCircle2 size={24} className="text-emerald-500 shrink-0 mt-1" /> :
                                                                claim.verdict === 'Potentially Misleading' ? <AlertTriangle size={24} className="text-rose-500 shrink-0 mt-1" /> :
                                                                    <Info size={24} className="text-amber-500 shrink-0 mt-1" />}
                                                            <div className="flex-1">
                                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">AI Reasoning Path</div>
                                                                <p className="text-sm leading-relaxed font-medium text-slate-300">{claim.reasoning}</p>
                                                                <div className="mt-6 flex items-center gap-4">
                                                                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Neural Confidence</div>
                                                                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-blue-500/50" style={{ width: `${claim.confidence}%` }} />
                                                                    </div>
                                                                    <div className="text-[11px] font-black text-white">{claim.confidence}%</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
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
            {result && <IntelligenceReport data={result} type="analyze" content={text} />}
        </div>
    );
}
