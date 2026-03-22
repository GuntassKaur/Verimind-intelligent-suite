import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Loader2, Sparkles, AlertCircle, Cpu, 
    BookOpen, Briefcase, Wand2,
    ShieldCheck, CheckCircle2, AlertTriangle
} from 'lucide-react';

import api from '../services/api';
import { RiskMeter } from '../components/RiskMeter';
import { ClaimCard } from '../components/ClaimCard';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { UniversalEditor } from '../components/UniversalEditor';
import { useTheme } from '../contexts/ThemeContext';

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
}

const ClaimCard = ({ sentence, index, isDark }: { sentence: Sentence; index: number; isDark: boolean }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className={`p-6 rounded-[2rem] border transition-all group ${
            isDark 
            ? 'bg-white/5 border-white/5 hover:border-indigo-500/30' 
            : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'
        }`}
    >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${
                    sentence.hallucination_score < 20 ? 'bg-emerald-500/10 text-emerald-400' :
                    sentence.hallucination_score < 50 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                    {sentence.hallucination_score < 20 ? 'Verified' : sentence.hallucination_score < 50 ? 'Uncertain' : 'Hallucination'}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Risk: {sentence.hallucination_score}%
                </span>
            </div>
            {sentence.hallucination_score < 20 ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-rose-500" />}
        </div>
        <p className={`text-base font-medium mb-4 leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {sentence.text}
        </p>
        <div className={`p-4 rounded-2xl text-[11px] font-medium leading-relaxed italic ${isDark ? 'bg-black/40 text-slate-400 border border-white/5' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
            {sentence.explanation}
        </div>
    </motion.div>
);

export default function TruthAudit() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState('');

    const handleAnalyze = useCallback(async () => {
        if (!query.trim() || !response.trim()) {
            setError("Both Inquiry and Content are required for neural synchronization.");
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data } = await api.post('/api/analyze', {
                prompt: query,
                answer: response
            });
            setResult(data);
        } catch (err: any) {
            setError(err.response?.data?.error || "Neural link failed. Verification aborted.");
        } finally {
            setLoading(false);
        }
    }, [query, response]);

    const handleToolAction = (action: string) => {
        // In a real app, this would trigger a specific API call
        console.log(`Triggering AI action: ${action}`);
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 pb-40 relative">
            {/* Ambient Background */}
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] -z-10 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`} />
            
            <header className="mb-16 md:mb-24 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-8 ${
                        isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                    }`}
                >
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sovereign Verification Engine</span>
                </motion.div>
                <h1 className={`text-4xl md:text-7xl font-black tracking-tight mb-6 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Truth <span className="text-gradient">Audit</span>.
                </h1>
                <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto italic leading-relaxed">
                    "Identify hallucinations, factual inconsistencies, and credibility risks with atomic resolution using our state-of-the-art neural auditor."
                </p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Input Section */}
                <div className="xl:col-span-12 space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <UniversalEditor 
                            label="Core Inquiry / Hypothesis"
                            value={query}
                            onChange={setQuery}
                            minHeight="140px"
                            isDark={isDark}
                            placeholder="What claim are you investigating?"
                        />
                        <UniversalEditor 
                            label="Target Source Content"
                            value={response}
                            onChange={setResponse}
                            minHeight="140px"
                            isDark={isDark}
                            placeholder="Paste the generated response or manuscript here..."
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className={`flex-1 flex items-center justify-center gap-4 py-8 rounded-[2rem] text-sm font-black uppercase tracking-[0.3em] transition-all ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] premium-btn-primary shadow-2xl'
                            }`}
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={20} /> Auditing Network...</>
                            ) : (
                                <><Sparkles size={20} /> Initiate Deep Audit</>
                            )}
                        </button>

                        <div className="flex gap-3">
                            {[
                                { id: 'simple', icon: BookOpen, label: 'Explain Simple', color: 'bg-emerald-500/10 text-emerald-500' },
                                { id: 'pro', icon: Briefcase, label: 'Make Pro', color: 'bg-blue-500/10 text-blue-500' },
                                { id: 'improve', icon: Wand2, label: 'Improve Answer', color: 'bg-purple-500/10 text-purple-500' }
                            ].map((tool) => (
                                <button
                                    key={tool.id}
                                    onClick={() => handleToolAction(tool.id)}
                                    className={`p-5 rounded-[1.8rem] flex flex-col items-center gap-2 border border-transparent hover:border-current transition-all ${tool.color}`}
                                >
                                    <tool.icon size={20} />
                                    <span className="text-[8px] font-black uppercase tracking-widest">{tool.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] flex items-center gap-4 text-rose-400 text-xs font-bold shadow-lg"
                        >
                            <AlertCircle size={20} />
                            {error}
                        </motion.div>
                    )}
                </div>

                {/* Results Section */}
                <div className="xl:col-span-12">
                    <AnimatePresence mode="wait">
                        {!result && !loading ? (
                            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center text-center">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-100'}`}>
                                    <Cpu size={40} className="text-slate-400 animate-pulse" />
                                </div>
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Systems Hibernating</h3>
                                <p className="text-slate-400 text-sm italic">Audit reports will materialize here once data synchronization completes.</p>
                            </motion.div>
                        ) : loading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 py-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="shimmer h-64 rounded-[3rem]" />
                                    <div className="shimmer h-64 rounded-[3rem]" />
                                </div>
                                <div className="shimmer h-20 w-1/3 mx-auto rounded-full" />
                            </motion.div>
                        ) : result ? (
                            <motion.div key="result" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className={`p-10 rounded-[3rem] border flex flex-col items-center justify-center relative overflow-hidden ${
                                        isDark ? 'bg-[#1E293B] border-white/5 shadow-2xl' : 'bg-white border-slate-200'
                                    }`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10">Integrity Quotient</h3>
                                        <RiskMeter score={result.integrity_score} riskLevel={result.integrity_score > 70 ? 'LOW' : result.integrity_score > 40 ? 'MEDIUM' : 'HIGH'} />
                                    </div>

                                    <div className={`p-12 rounded-[3rem] border flex flex-col justify-center relative ${
                                        isDark ? 'bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 shadow-2xl' : 'bg-indigo-50 border-indigo-100 shadow-soft'
                                    }`}>
                                        <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-8 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                            Neural Audit Verdict
                                        </h3>
                                        <div className={`text-4xl md:text-6xl font-black leading-none tracking-tight mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {result.audit_verdict.toUpperCase().replace('.', '')}
                                        </div>
                                        <div className="flex items-center gap-6 pt-8 border-t border-current opacity-10">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Atomic Units</span>
                                                <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{result.sentences.length}</span>
                                            </div>
                                            <div className="ml-auto">
                                                <div className="px-5 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /> Verified State
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-10 md:p-14 rounded-[3.5rem] border relative overflow-hidden group ${
                                    isDark ? 'bg-white/5 border-white/5 hover:bg-white/[0.07]' : 'bg-slate-50 border-slate-200 hover:bg-white'
                                } transition-all duration-500`}>
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
                                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-8 text-center">Executive Intelligence Summary</h4>
                                    <p className={`text-xl md:text-3xl font-bold italic leading-relaxed text-center px-4 transition-transform group-hover:scale-[1.01] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                        "{result.educational_summary}"
                                    </p>
                                </div>

                                <div className="space-y-8 pt-10">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                                            <Wand2 size={16} className="text-indigo-500" /> Granular Fact Mapping
                                        </h4>
                                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">Probabilistic Confidence: High</span>
                                    </div>
                                    <div className="grid gap-6">
                                        {result.sentences.map((s, i) => (
                                            <ClaimCard key={i} sentence={s} index={i} isDark={isDark} />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>

            {result && <IntelligenceReport data={result} type="audit" content={response} />}
        </div>
    );
}
