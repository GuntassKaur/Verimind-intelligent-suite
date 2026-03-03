import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, AlertCircle, Cpu } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';
import { RiskMeter } from '../components/RiskMeter';
import { VoiceInput } from '../components/VoiceInput';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';

interface AnalysisResult {
    integrity_score: number;
    audit_verdict: string;
    educational_summary: string;
    sentences: Array<{
        text: string;
        hallucination_score: number;
        heat_grade: string;
        risk_label: string;
        explanation: string;
    }>;
    metrics?: {
        total_claims: number;
        false_claims: number;
    };
}

export default function Dashboard() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!query.trim() || !response.trim()) {
            setError("Please provide both an inquiry and the content to be analyzed.");
            return;
        }
        if (loading) return;

        setError('');
        setLoading(true);
        setResult(null);

        try {
            const { data } = await api.post('/api/analyze', {
                prompt: query,
                answer: response
            });

            if (data.error) throw new Error(data.error);
            setResult(data);
            setLoading(false);
        } catch (err: any) {
            console.error("Analysis failure:", err);
            if (err.message === "Duplicate request detected" || err.message === "canceled" || err.name === "CanceledError") {
                return;
            }
            setError(err.message || "Analysis failed. Please check your connection.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
            <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                    <Logo variant="icon" className="w-3 h-3 text-indigo-500" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Verification Active</span>
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Analyzer</h1>
                <p className="text-slate-500 font-medium font-sans">Professional verification tool for identifying content inconsistencies.</p>
            </header>

            <div className="laptop-mock">
                <div className="laptop-screen">
                    <div className="split-view">
                        {/* INPUT PANE */}
                        <div className="pane-input">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Inquiry</span>
                                <VoiceInput onTranscription={(t) => setQuery(prev => prev ? `${prev} ${t}` : t)} />
                            </div>
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Define the question or hypothesis to be verified..."
                                className="premium-input h-24 mb-6 resize-none"
                            />

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Content</span>
                                <div className="flex items-center gap-2">
                                    <VoiceInput onTranscription={(t) => setResponse(prev => prev ? `${prev} ${t}` : t)} />
                                    <SmartProcessingToolbar onTextExtracted={setResponse} />
                                </div>
                            </div>
                            <textarea
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                placeholder="Paste AI response here to verify authenticity..."
                                className="custom-editor h-[260px] resize-none"
                            />

                            {error && (
                                <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-xs font-bold italic">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="premium-btn-primary w-full mt-8 flex items-center justify-center gap-3 py-4"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Start
                                    </>
                                )}
                            </button>
                        </div>

                        {/* OUTPUT PANE */}
                        <div className="pane-output">
                            {!result && !loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                    <Cpu size={64} className="text-slate-700 mb-6" />
                                    <p className="text-slate-500 font-medium italic">Start verification to view results.</p>
                                </div>
                            ) : loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-center relative overflow-hidden rounded-2xl">
                                    <div className="absolute inset-0 shimmer opacity-50" />
                                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6 relative z-10" />
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest relative z-10">Analyzing Content...</p>
                                </div>

                            ) : result && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="glass-card p-8 flex flex-col items-center justify-center relative group">
                                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Integrity Score</h3>
                                            <RiskMeter score={result.integrity_score} riskLevel={result.integrity_score > 70 ? 'LOW' : result.integrity_score > 40 ? 'MEDIUM' : 'HIGH'} />
                                        </div>

                                        <div className="glass-card p-8 flex flex-col justify-center border-l-4 border-indigo-500/20">
                                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Verdict</h3>
                                            <div className="text-2xl font-black text-white leading-tight">
                                                {result.audit_verdict.toUpperCase()}
                                            </div>
                                            <div className="mt-6 flex gap-4 border-t border-white/5 pt-6">
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Segments</p>
                                                    <span className="text-lg font-black text-white">{result.sentences.length}</span>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                                                    <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded uppercase">Verified</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-card p-6 bg-indigo-500/[0.03] border-indigo-500/10">
                                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Summary</h4>
                                        <p className="text-sm text-slate-300 leading-relaxed font-sans font-medium whitespace-pre-wrap">{result.educational_summary}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Details</h4>
                                        {result.sentences.map((s, i) => (
                                            <div key={i} className="p-4 bg-black/30 border border-white/5 rounded-xl group hover:border-indigo-500/20 transition-all">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${s.heat_grade === 'Low' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                        {s.risk_label || s.heat_grade}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-600 uppercase">RISK: {s.hallucination_score}%</span>
                                                </div>
                                                <p className="text-sm text-white font-medium mb-2 leading-relaxed">{s.text}</p>
                                                <p className="text-[11px] text-slate-500 italic leading-relaxed font-medium">{s.explanation}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
