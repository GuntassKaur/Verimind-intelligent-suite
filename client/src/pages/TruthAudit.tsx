import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Loader2, Sparkles, ShieldCheck, 
    Search, FileText, ChevronRight, AlertTriangle,
    CheckCircle2, XCircle,
    Upload, Download, Mic, Speaker, Fingerprint
} from 'lucide-react';

import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { UniversalEditor } from '../components/UniversalEditor';

interface Sentence {
    text: string;
    hallucination_score: number;
    explanation: string;
    status: 'verified' | 'unverified' | 'risky';
    bias?: {
        type: string;
        level: 'Low' | 'Medium' | 'High';
    };
    source?: string;
}

interface AnalysisResult {
    trustScore: number;
    aiScore: number;
    plagiarism: number;
    biasScore: number;
    sentences: Sentence[];
    summary: string;
}

export default function Analyze() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState('');

    const handleAnalyze = useCallback(async () => {
        if (!text.trim()) {
            setError("Input substrate missing. Please provide content for analysis.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/api/ai/analyze', { text });
            // Mocking the new structured response since backend is still being migrated
            setResult({
                trustScore: 84,
                aiScore: 92,
                plagiarism: 12,
                biasScore: 8,
                summary: "Content shows high factual density with minor hallucination risks in technical metrics.",
                sentences: [
                    { 
                        text: "The Great Wall is 21,196 km long.", 
                        hallucination_score: 5, 
                        explanation: "Factual consensus is high.", 
                        status: 'verified',
                        source: 'UNESCO'
                    },
                    { 
                        text: "It is visible from Mars with the naked eye.", 
                        hallucination_score: 95, 
                        explanation: "Common scientific inaccuracy. Distance makes visibility impossible.", 
                        status: 'risky',
                        bias: { type: 'Hyperbole', level: 'High' }
                    },
                    { 
                        text: "Construction began in the 7th century BC.", 
                        hallucination_score: 30, 
                        explanation: "Historical records show early structures started then, but the main wall is later.", 
                        status: 'unverified'
                    }
                ]
            });
        } catch (err: any) {
            setError("Neural link failed. Verification aborted.");
        } finally {
            setLoading(false);
        }
    }, [text]);

    return (
        <div className="max-w-6xl mx-auto py-10 px-8 space-y-12">
            {/* 1. COMPACT EDITOR (MAX 300PX) */}
            <div className={`p-1 rounded-[2.5rem] border bg-gradient-to-b ${isDark ? 'from-white/10 to-transparent border-white/5' : 'from-slate-200 to-transparent border-slate-100'}`}>
                <div className={`p-6 rounded-[2.4rem] ${isDark ? 'bg-[#1E293B]' : 'bg-white'}`}>
                    <UniversalEditor 
                        value={text}
                        onChange={setText}
                        placeholder="Paste AI content or research node for deep analysis..."
                        minHeight="120px"
                        maxHeight="300px"
                        isDark={isDark}
                    />
                    <div className="mt-6 flex items-center justify-between">
                         <div className="flex gap-4">
                              <button className={`p-3 rounded-xl transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                                   <Upload size={18} />
                              </button>
                              <button className={`p-3 rounded-xl transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                                   <Mic size={18} />
                              </button>
                         </div>
                         <button
                            onClick={handleAnalyze}
                            disabled={loading || !text.trim()}
                            className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-4 ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] premium-btn-primary shadow-2xl'
                            }`}
                         >
                             {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                             Initial Audit
                         </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-700'} flex items-center gap-4 text-xs font-bold shadow-lg`}>
                    <AlertTriangle size={20} />
                    {error}
                </div>
            )}

            {/* 2. RESULTS SECTION */}
            <AnimatePresence mode="wait">
                {result ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        className="space-y-12 pb-20"
                    >
                        {/* Summary Header */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Trust Score', val: result.trustScore, icon: ShieldCheck, color: 'text-indigo-500' },
                                { label: 'AI Score', val: result.aiScore, icon: Fingerprint, color: 'text-emerald-500' },
                                { label: 'Bias Level', val: result.biasScore > 20 ? 'High' : 'Low', icon: AlertTriangle, color: 'text-amber-500' },
                                { label: 'Plagiarism', val: `${result.plagiarism}%`, icon: FileText, color: 'text-rose-500' },
                            ].map((s, i) => (
                                <div key={i} className={`p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
                                        <s.icon size={14} className={s.color} />
                                    </div>
                                    <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.val}</div>
                                </div>
                            ))}
                        </div>

                        {/* Interactive Text Display (Highlights) */}
                        <div className={`p-10 rounded-[3rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
                            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                                <h3 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Content Forensics</h3>
                                <div className="flex gap-4">
                                     <button className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-indigo-400">
                                          <Speaker size={14} /> Listen
                                     </button>
                                     <button className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-indigo-400">
                                          <Download size={14} /> Export
                                     </button>
                                </div>
                            </div>

                            <div className="leading-[2.2] text-lg font-medium">
                                {result.sentences.map((s, i) => (
                                    <span 
                                        key={i}
                                        className={`px-1 rounded-lg transition-all cursor-help relative group
                                            ${s.hallucination_score > 60 
                                                ? (isDark ? 'bg-rose-500/20 text-rose-300 decoration-rose-500 underline underline-offset-4 decoration-2' : 'bg-rose-50 text-rose-700 decoration-rose-300 underline underline-offset-4 decoration-2') 
                                                : s.hallucination_score > 30 
                                                ? (isDark ? 'bg-amber-500/10 text-amber-200' : 'bg-amber-50 text-amber-700')
                                                : (isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-100')
                                            }`}
                                    >
                                        {s.text}{' '}
                                        {/* Tooltip */}
                                        <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 rounded-2xl border shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 translate-y-2 group-hover:translate-y-0 ${isDark ? 'bg-[#1E293B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${s.hallucination_score > 60 ? 'text-rose-500' : 'text-indigo-400'}`}>
                                                    {s.hallucination_score > 60 ? 'Hallucination Detected' : 'Atomic Audit'}
                                                </span>
                                                <span className="text-[10px] font-black">{100 - s.hallucination_score}% Conf.</span>
                                            </div>
                                            <p className="text-[11px] font-medium leading-relaxed mb-4">{s.explanation}</p>
                                            {s.source && (
                                                <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                                                    <Search size={10} className="text-slate-500" />
                                                    <span className="text-[10px] font-bold text-indigo-400 underline">{s.source}</span>
                                                </div>
                                            )}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Analysis Grid (Source & Bias) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Source Verification List */}
                            <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-slate-500`}>Source Verification</h4>
                                <div className="space-y-6">
                                    {result.sentences.filter(s => s.status === 'verified' || s.status === 'risky').map((s, i) => (
                                        <div key={i} className={`p-5 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                            <div className="flex items-center gap-4">
                                                {s.status === 'verified' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-rose-500" />}
                                                <div>
                                                    <p className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.text.substring(0, 40)}...</p>
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{s.status}</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-600" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bias Heatmap / List */}
                            <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-slate-500`}>Bias Detection Engine</h4>
                                <div className="space-y-6">
                                    {[
                                        { type: 'Political Position', level: 'Low', color: 'bg-emerald-500' },
                                        { type: 'Emotional Tone', level: 'Medium', color: 'bg-amber-500' },
                                        { type: 'Gender Language', level: 'Low', color: 'bg-emerald-500' },
                                    ].map((b, i) => (
                                        <div key={i} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{b.type}</span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>{b.level}</span>
                                            </div>
                                            <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: b.level === 'High' ? '90%' : b.level === 'Medium' ? '50%' : '15%' }}
                                                    className={`h-full ${b.color}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="py-20 flex flex-col items-center text-center opacity-30">
                        <div className="w-20 h-20 rounded-full border border-dashed border-slate-400 flex items-center justify-center mb-6">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-2">Awaiting Analysis</h3>
                        <p className="text-xs font-medium italic">Neural manifests materialize here after synchronization.</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
