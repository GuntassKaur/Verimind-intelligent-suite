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
        <div className="max-w-5xl mx-auto py-16 px-6 lg:px-12 space-y-12">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-100 px-6 py-2.5 rounded-full mb-6">
                    <ShieldCheck size={16} className="text-blue-500" />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600">Truth Engine · Claim Verifier</span>
                </div>
                <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-4">Factual <span className="text-gradient">Audit</span>.</h1>
                <p className="text-slate-500 font-medium max-w-xl mx-auto">Paste any text and VeriMind's Truth Engine will verify each claim against its knowledge base, scoring credibility with precision.</p>
            </div>

            {/* Input Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(99,102,241,0.08)] p-10">
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-50">
                    <FileText size={18} className="text-slate-300" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Audit Input · Paste or type text</span>
                    <div className="ml-auto flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Engine Active</span>
                    </div>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste text for claim verification and factual auditing..."
                    className="w-full h-64 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-300 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.06)] transition-all placeholder:text-slate-300 resize-none"
                />

                <div className="flex items-center justify-between mt-6">
                    <span className="text-[11px] text-slate-400 font-medium">{content.trim().split(/\s+/).filter(Boolean).length} words</span>
                    <button
                        onClick={runAnalysis}
                        disabled={loading || !content.trim()}
                        className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:scale-110 transition-transform" />}
                        <span>{loading ? 'Auditing...' : 'Run Truth Audit'}</span>
                        {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                            <ShieldAlert size={16} className="text-rose-500 shrink-0" />
                            <span className="text-[12px] font-semibold text-rose-600">{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft p-20 flex flex-col items-center gap-8">
                        <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
                        <div className="text-center">
                            <p className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Verifying Claims</p>
                            <p className="text-xs text-slate-400 font-medium">Cross-referencing knowledge manifests...</p>
                        </div>
                    </motion.div>
                )}

                {result && !loading && (
                    <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25 }} className="space-y-8">
                        {/* Score Banner */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-200">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center">
                                    <Bot size={32} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-white/60 uppercase tracking-widest mb-1">Truth Engine Score</p>
                                    <div className="text-6xl font-black text-white tracking-tighter">{result.data.credibility_score}<span className="text-2xl text-white/60">%</span></div>
                                </div>
                            </div>
                            <div className="flex-1 max-w-sm">
                                <p className="text-sm font-medium text-white/80 leading-relaxed italic">"{result.data.summary}"</p>
                            </div>
                            <button onClick={() => generatePDF()} className="px-8 py-4 bg-white text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl shrink-0">Export PDF</button>
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
