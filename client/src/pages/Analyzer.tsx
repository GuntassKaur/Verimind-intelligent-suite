import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, Shield, Layout, Cpu, Activity, Zap, Info, Printer } from 'lucide-react';
import api from '../services/api';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';

interface Claim {
    claim: string;
    veracity: string;
    explanation: string;
    risk: string;
    verdict?: string;
    confidence?: number;
    reasoning?: string;
}

interface AnalyzerResult {
    plagiarism_score: number;
    analysis_text: string;
    suggestions: string[];
    claims: Claim[];
    simple_explanation?: string;
    credibility_score?: number;
    ai_probability?: number;
    risk_level?: string;
}

export default function Analyzer() {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalyzerResult | null>(null);
    const [error, setError] = useState('');

    // Global UI state sync
    useEffect(() => {
        if (result) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
                detail: { 
                  wpm: 0, 
                  suggestions: result.suggestions, 
                  tips: [`Claims: ${result.claims.length}`, `Plagiarism: ${result.plagiarism_score}%`] 
                } 
            }));
        }
    }, [result]);

    const handleAnalyze = useCallback(async () => {
        if (!text.trim()) {
            setError("Analysis requires content input.");
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data } = await api.post('/api/analyze', { text });
            if (data.success) {
                setResult(data.data);
            } else {
                setResult(data as unknown as AnalyzerResult);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Neural link failure.");
        } finally {
            setLoading(false);
        }
    }, [text]);

    const plagiarismDisplay = useMemo(() => {
        if (!result) return null;
        return (
            <div className="modern-card p-10 flex flex-col items-center justify-center bg-rose-500/5 border-rose-500/10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Plagiarism Entropy</span>
                <div className="text-5xl font-black text-rose-500">{result.plagiarism_score}%</div>
            </div>
        );
    }, [result]);

    return (
        <div className="workspace-center-content">
            {/* TOP AREA: INPUT */}
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper">
                      <button className="modern-tool-btn active">
                         <Shield size={20} className="text-indigo-400" />
                         <span>Analyze</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/workspace'}>
                         <Layout size={20} className="text-blue-400" />
                         <span>Studio</span>
                      </button>
                </div>

                <div className="smart-gpt-editor">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 px-4 opacity-50">
                        <div className="flex items-center gap-2">
                             <Activity size={14} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Atomic Analysis v5.0</span>
                        </div>
                    </div>
                    
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste content to initiate deep verification scan..."
                        className="custom-scrollbar"
                    />

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !text.trim()}
                            className="premium-btn-primary flex items-center gap-4 py-4 px-12 rounded-2xl group transition-all"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={18} /> Deep Neural Processing...</>
                            ) : (
                                <><Search size={18} className="text-white group-hover:scale-125 transition-transform" /> START ANALYSIS</>
                            )}
                        </button>
                    </div>
                </div>

                {error && <div className="mt-4 text-center text-rose-400 text-[10px] font-black uppercase tracking-widest">{error}</div>}
            </section>

            {/* BOTTOM AREA: OUTPUT */}
            <section className="output-bottom-area">
                <AnimatePresence mode="wait">
                    {!result && !loading ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-30">
                             <Search size={64} className="text-slate-800 mb-6" />
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Awaiting source material</p>
                        </motion.div>
                    ) : loading ? (
                        <div className="flex flex-col gap-8 opacity-50">
                             <div className="shimmer h-40 w-full rounded-3xl" />
                             <div className="shimmer h-64 w-full rounded-3xl" />
                        </div>
                    ) : (
                        <motion.div key="res" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 max-w-5xl mx-auto pb-20">
                             <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                   <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Verification Report Active</h4>
                                </div>
                                <button onClick={() => generatePDF()} className="px-5 py-2.5 bg-indigo-600 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                                    <Printer size={14} /> Export Report
                                </button>
                             </div>

                             {/* MAIN SCORE AREA */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {plagiarismDisplay}
                                  <div className="modern-card p-10 flex flex-col items-start bg-indigo-500/5 border-indigo-500/10">
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Integrity Summary</span>
                                       <p className="text-sm font-medium italic text-slate-300 leading-relaxed">"{result.analysis_text}"</p>
                                  </div>
                             </div>

                             {/* FACTUAL BREAKDOWN */}
                             <div className="space-y-6 pt-12">
                                  <div className="flex items-center gap-4 px-2">
                                      <h4 className="text-[11px] font-black text-white uppercase tracking-[0.5em] border-l-4 border-indigo-500 pl-4">Atomic Verification</h4>
                                  </div>
                                  <div className="grid gap-4">
                                      {result.claims.map((claim, i) => (
                                          <div key={i} className="modern-card bg-white/[0.01] hover:bg-white/[0.03] p-8 border-white/5 group relative overflow-hidden">
                                              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                                  <Cpu size={120} className="text-indigo-400" />
                                              </div>
                                              <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10">
                                                  <div className="max-w-xl">
                                                       <p className="text-base font-black text-white tracking-tight mb-4 italic leading-snug">"{claim.claim}"</p>
                                                       <div className="flex items-center gap-6">
                                                           <div className="flex items-center gap-2">
                                                                <Activity size={12} className="text-indigo-400" />
                                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence: {claim.veracity}</span>
                                                           </div>
                                                           <div className="flex items-center gap-2">
                                                                <Zap size={12} className="text-amber-500" />
                                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk: {claim.risk}</span>
                                                           </div>
                                                       </div>
                                                  </div>
                                                  <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${claim.veracity === 'True' || claim.veracity === 'Verified' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                                      {claim.veracity}
                                                  </div>
                                              </div>
                                              <div className="mt-8 pt-8 border-t border-white/5 text-[11px] font-medium text-slate-400 leading-relaxed italic flex gap-4">
                                                  <Info size={14} className="shrink-0 text-indigo-400" />
                                                  <p>{claim.explanation}</p>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                             </div>

                             {/* SUGGESTIONS CLUSTER */}
                             <div className="pt-12">
                                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8 pl-2">Optimization Streams</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       {result.suggestions.map((s, i) => (
                                           <div key={i} className="flex gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-all group">
                                                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 size={16} className="text-indigo-500" />
                                                </div>
                                                <span className="text-xs font-medium text-slate-400 leading-relaxed group-hover:text-slate-100 transition-colors">{s}</span>
                                           </div>
                                       ))}
                                  </div>
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {result && <IntelligenceReport data={{
                ...result,
                claims: result.claims.map(c => ({
                    claim: c.claim,
                    verdict: c.veracity,
                    reasoning: c.explanation,
                    confidence: c.veracity === 'True' ? 95 : 45
                }))
            }} type="analyze" content={text} />}
        </div>
    );
}
