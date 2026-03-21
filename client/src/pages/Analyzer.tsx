import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, ShieldAlert, 
    FileText, Zap, 
    Loader2, 
    Info, Cpu,
    CheckCircle2
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

    useEffect(() => {
        if (result) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { 
                 wpm: 0, 
                 suggestions: ["Refine audit findings", "Expand verification nodes", "Check cross-references"] 
              } 
            }));
        }
    }, [result]);

    const runAnalysis = useCallback(async () => {
        if (!content.trim()) {
            setError('Studio input required for auditing.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/api/analyze', { text: content });
            if (data.success) {
                setResult({ type: 'analyze', data: data.data });
            } else {
                setError(data.error || 'Diagnostic cycle failed.');
            }
        } catch (err: unknown) {
             const axiosError = err as { response?: { data?: { error?: string } } };
             setError(axiosError.response?.data?.error || 'System interrupt in auditing module.');
        } finally {
            setLoading(false);
        }
    }, [content]);

    return (
        <div className="workspace-center-content">
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper mb-10">
                      <button className="modern-tool-btn active">
                         <ShieldAlert size={20} className="text-blue-400" />
                         <span>Audit Module</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/workspace'}>
                         <Cpu size={20} className="text-indigo-400" />
                         <span>Studio Main</span>
                      </button>
                </div>

                <div className="smart-gpt-editor bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-6 px-4 opacity-40">
                         <div className="flex items-center gap-3">
                             <FileText size={16} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Neural Audit Input</span>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Synchronized</span>
                         </div>
                    </div>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste text for claim verification and factual auditing..."
                        className="custom-scrollbar h-[250px]"
                    />

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={runAnalysis}
                            disabled={loading || !content.trim()}
                            className="premium-btn-primary flex items-center gap-4 py-5 px-12 rounded-3xl group shadow-2xl transition-all"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={20} /> SYNCING LOGIC...</>
                            ) : (
                                <><Zap size={20} className="group-hover:rotate-45" /> INITIATE AUDIT</>
                            )}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center text-rose-400 text-[10px] font-black uppercase tracking-widest">
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <section className="output-bottom-area" id="audit-results">
                 <AnimatePresence mode="wait">
                    {!result ? (
                         !loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                                <ShieldAlert size={64} className="text-slate-800 mb-8 grayscale" />
                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.5em]">No Data Points Detected</p>
                            </motion.div>
                         )
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                             <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                <div className="flex items-center gap-4">
                                     <Activity size={22} className="text-indigo-400" />
                                     <h3 className="text-[14px] font-black text-white uppercase tracking-[0.2em] italic">Intelligence Assessment Manifested</h3>
                                </div>
                                <button onClick={() => generatePDF()} className="px-8 py-3 bg-indigo-600 border border-indigo-500/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30">Print Manifest</button>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                  <div className="modern-card p-12 flex flex-col items-center justify-center bg-indigo-500/5 border-indigo-500/10 text-center relative overflow-hidden group">
                                       <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                                            <ShieldAlert size={100} className="text-indigo-400" />
                                       </div>
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 block">Credibility baseline</span>
                                       <div className="text-7xl font-black text-white italic tracking-tighter mb-4">{result.data.credibility_score}%</div>
                                       <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.3em]">Protocol Authenticated</p>
                                  </div>
                                  <div className="modern-card md:col-span-3 p-12 bg-white/[0.01]">
                                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 border-l-4 border-indigo-500 pl-6">Executive Abstract</h4>
                                       <p className="text-2xl text-slate-200 font-serif italic leading-relaxed selection:bg-indigo-500/20">"{result.data.summary}"</p>
                                  </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {result.data.claims.map((claim: any, idx: number) => (
                                      <div key={idx} className="modern-card p-8 group border-white/5 hover:bg-white/[0.02] transition-colors">
                                          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                               <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${claim.verdict === 'True' || claim.verdict === 'Verified' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                                  {claim.verdict}
                                               </span>
                                               <div className="flex items-center gap-3">
                                                  <CheckCircle2 size={14} className="text-indigo-400" />
                                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{claim.confidence}% Precision</span>
                                               </div>
                                          </div>
                                          <h5 className="text-xl text-white font-serif italic mb-6 leading-snug tracking-tight">"{claim.claim}"</h5>
                                          <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                                             {claim.reasoning}
                                          </p>
                                      </div>
                                  ))}
                             </div>

                             <div className="modern-card border-white/5 p-10 bg-indigo-500/5">
                                 <div className="flex items-start gap-6">
                                     <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                         <Info size={24} className="text-indigo-400" />
                                     </div>
                                     <div>
                                         <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-3">Protocol Metadata</h5>
                                         <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">This manifest has been synthesized through the Truth Engine and represents a formal audit. Values above 90% indicate high-fidelity established logic.</p>
                                     </div>
                                 </div>
                             </div>
                        </motion.div>
                    )}
                 </AnimatePresence>
            </section>

            {result && <IntelligenceReport data={result.data} type="analyze" content={content} />}
        </div>
    );
}
