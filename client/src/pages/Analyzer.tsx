import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, ShieldAlert, 
    FileText, Zap, 
    Loader2, 
    Info,
    CheckCircle2,
    ArrowRight,
    Bot
} from 'lucide-react';
import api from '../services/api';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';

interface AnalysisClaims {
    verdict: string;
    confidence: number;
    claim: string;
    reasoning: string;
}

interface AnalysisData {
    credibility_score: number;
    summary: string;
    claims: AnalysisClaims[];
}

interface ResultState {
    type: string;
    data: AnalysisData;
}

export default function Analyzer() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ResultState | null>(null);
    const [error, setError] = useState('');

    const runAnalysis = useCallback(async () => {
        if (!content.trim()) {
            setError('Please enter text to audit.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/api/analyze', { text: content });
            if (data.success) {
                setResult({ type: 'analyze', data: data.data });
            } else {
                setError(data.error || 'Audit cycle failed.');
            }
        } catch (err: unknown) {
             const axiosError = err as { response?: { data?: { error?: string } } };
             setError(axiosError.response?.data?.error || 'Audit module offline. Check backend connection.');
        } finally {
            setLoading(false);
        }
    }, [content]);

    return (
        <div className="max-w-5xl mx-auto py-10 md:py-16 px-4 md:px-6 lg:px-12 space-y-10 md:space-y-12">
            {/* Header */}
            <div className="text-center px-2">
                <div className="inline-flex items-center gap-2 md:gap-3 bg-blue-50 border border-blue-100 px-4 md:px-6 py-2 md:py-2.5 rounded-full mb-6">
                    <ShieldCheck size={16} className="text-blue-500" />
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-blue-600 italic">Truth Engine · Claim Verifier</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter mb-4 italic">Factual <span className="text-gradient">Audit</span>.</h1>
                <p className="text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto leading-relaxed px-4">Paste any text and VeriMind's Truth Engine will verify each claim against its knowledge base, scoring credibility with precision.</p>
            </div>

            {/* Input Card */}
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(99,102,241,0.08)] p-6 md:p-10">
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-50">
                    <FileText size={18} className="text-slate-300" />
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest italic">Audit Input</span>
                    <div className="ml-auto flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-[9px] md:text-[10px] font-bold text-blue-400 uppercase tracking-widest">Engine Active</span>
                    </div>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste text for claim verification and factual auditing..."
                    className="w-full h-48 md:h-64 bg-slate-50 border border-slate-100 rounded-2xl p-5 md:p-6 text-sm md:text-base font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-300 transition-all placeholder:text-slate-300 resize-none leading-relaxed shadow-inner"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                    <span className="text-[10px] md:text-[11px] text-slate-400 font-medium uppercase tracking-widest">{content.trim().split(/\s+/).filter(Boolean).length} words detected</span>
                    <button
                        onClick={runAnalysis}
                        disabled={loading || !content.trim()}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed group uppercase tracking-[0.1em]"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:scale-110 transition-transform" />}
                        <span>{loading ? 'Auditing...' : 'Run Truth Audit'}</span>
                        {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                            <ShieldAlert size={18} className="text-rose-500 shrink-0" />
                            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-tight">{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-soft p-12 md:p-20 flex flex-col items-center gap-8 border-dashed border-2">
                        <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-blue-50 border-t-blue-500 rounded-full animate-spin" />
                        <div className="text-center">
                            <p className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-2">Verifying Claims</p>
                            <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-widest italic">Cross-referencing knowledge manifests...</p>
                        </div>
                    </motion.div>
                )}

                {result && !loading && (
                    <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25 }} className="space-y-8">
                        {/* Score Banner */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl shadow-blue-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left z-10 w-full md:w-auto">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center border border-white/20 shadow-inner">
                                    <Bot size={40} className="text-white md:w-12 md:h-12" />
                                </div>
                                <div className="flex flex-col items-center md:items-start">
                                    <p className="text-[10px] md:text-[11px] font-black text-white/50 uppercase tracking-[0.4em] mb-2 md:mb-3 italic">Truth Engine Confidence</p>
                                    <div className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">{result.data.credibility_score}<span className="text-2xl md:text-4xl text-white/40 ml-1">%</span></div>
                                </div>
                            </div>
                            
                            <div className="flex-1 max-w-sm z-10">
                                <p className="text-sm md:text-base font-bold text-white leading-relaxed italic opacity-90 text-center md:text-left">"{result.data.summary}"</p>
                            </div>
                            
                            <button onClick={() => generatePDF()} className="w-full md:w-auto px-10 md:px-12 py-5 bg-white text-blue-600 rounded-2xl md:rounded-[1.5rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 transition-all shadow-2xl shrink-0 z-10 italic">Export PDF</button>
                        </div>

                        {/* Claims Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {result.data.claims?.map((claim, idx) => (
                                <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-soft hover:shadow-lux transition-all group">
                                    <div className="flex items-center justify-between mb-5">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            claim.verdict === 'True' || claim.verdict === 'Verified' 
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                                                : claim.verdict === 'Uncertain' 
                                                    ? 'bg-amber-50 border-amber-100 text-amber-600'
                                                    : 'bg-rose-50 border-rose-100 text-rose-600'
                                        }`}>
                                           {claim.verdict}
                                        </span>
                                        <div className="flex items-center gap-2">
                                           <CheckCircle2 size={14} className="text-blue-400" />
                                           <span className="text-[11px] font-bold text-slate-400">{claim.confidence}% confidence</span>
                                        </div>
                                    </div>
                                    <p className="text-lg font-bold text-slate-800 leading-snug mb-4 group-hover:text-blue-900 transition-colors">"{claim.claim}"</p>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed border-l-4 border-blue-50 pl-4 italic">{claim.reasoning}</p>
                                </div>
                            ))}
                        </div>

                        {/* Footer Note */}
                        <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100 flex items-start gap-5">
                            <div className="w-10 h-10 rounded-2xl bg-white border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                                <Info size={18} className="text-blue-500" />
                            </div>
                            <p className="text-sm text-blue-600/70 font-medium leading-relaxed italic">This audit is probabilistic. VeriMind's Truth Engine provides intelligence signals; critical decisions should be verified by domain experts.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {result && <IntelligenceReport data={result.data} type="analyze" content={content} />}
        </div>
    );
}
