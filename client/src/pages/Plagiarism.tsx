import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    Zap, 
    Loader2, 
    Activity, 
    ShieldAlert, 
    FileText, 
    Cpu,
    ArrowRight,
    Info
} from 'lucide-react';
import api from '../services/api';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';

interface PlagiarismData {
    plagiarism_score: number;
    summary: string;
    suspicious_segments: string[];
    explanation: string;
}

export default function Plagiarism() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PlagiarismData | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (result) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { 
                 wpm: 0, 
                 suggestions: ["Identify source overlap", "Refine attribution", "Trace digital fingerprint"] 
              } 
            }));
        }
    }, [result]);

    const runAudit = useCallback(async () => {
        if (!content.trim()) {
            setError('Studio input required for authenticity audit.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/api/plagiarism/check', { text: content });
            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || 'Spectrum analysis failed.');
            }
        } catch (err: unknown) {
             const axiosError = err as { response?: { data?: { error?: string } } };
             setError(axiosError.response?.data?.error || 'System interrupt in Plagiarism module.');
        } finally {
            setLoading(false);
        }
    }, [content]);

    return (
        <div className="workspace-center-content">
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper mb-10">
                      <button className="modern-tool-btn active">
                         <ShieldCheck size={20} className="text-rose-400" />
                         <span>Authenticity Audit</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/workspace'}>
                         <Cpu size={20} className="text-indigo-400" />
                         <span>Studio Main</span>
                      </button>
                </div>

                <div className="smart-gpt-editor bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-6 px-4 opacity-40">
                         <div className="flex items-center gap-3">
                             <FileText size={16} className="text-rose-400" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Audit Manifest Input</span>
                         </div>
                         <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Integrity Sync Active</span>
                         </div>
                    </div>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste text for deep-spectrum authenticity verification and digital footprint tracing..."
                        className="custom-scrollbar h-[250px]"
                    />

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={runAudit}
                            disabled={loading || !content.trim()}
                            className="premium-btn-primary bg-rose-600 hover:bg-rose-700 shadow-rose-600/20 py-6 px-16 rounded-3xl group transition-all flex items-center gap-4"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="group-hover:rotate-45" />}
                            <span className="text-xs font-black uppercase tracking-[0.3em] font-sans">{loading ? 'Auditing...' : 'Initiate Audit'}</span>
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center text-rose-500 text-[10px] font-black uppercase tracking-widest">
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <section className="output-bottom-area pb-20">
                 <AnimatePresence mode="wait">
                    {!result ? (
                         !loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                                <ShieldCheck size={64} className="text-slate-800 mb-8 grayscale" />
                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.5em]">No Integrity Data Detected</p>
                            </motion.div>
                         )
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                             <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                <div className="flex items-center gap-4">
                                     <Activity size={22} className="text-rose-400" />
                                     <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">Integrity Manifest manifested</h3>
                                </div>
                                <div className="flex gap-4">
                                     <button onClick={() => { navigator.clipboard.writeText(result.summary); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="px-6 py-2.5 bg-white/5 border border-white/5 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                                         {copied ? 'SYNCHRONIZED' : 'Copy Manifest'}
                                     </button>
                                     <button onClick={() => generatePDF()} className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20">Print Stream</button>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                  <div className="modern-card p-12 flex flex-col items-center justify-center bg-rose-500/5 border-rose-500/10 text-center relative overflow-hidden group">
                                       <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                                            <ShieldAlert size={100} className="text-rose-400" />
                                       </div>
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 block">Overlap Ratio</span>
                                       <div className="text-7xl font-black text-white italic tracking-tighter mb-4">{result.plagiarism_score}%</div>
                                       <p className="text-[10px] text-rose-400 font-bold uppercase tracking-[0.3em]">Integrity Breach Level</p>
                                  </div>
                                  <div className="modern-card md:col-span-3 p-12 bg-white/[0.01]">
                                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 border-l-4 border-rose-500 pl-6">Executive Abstract</h4>
                                       <p className="text-2xl text-slate-200 font-serif italic leading-relaxed selection:bg-rose-500/20">"{result.summary}"</p>
                                  </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="modern-card p-10 bg-black/40 border-white/5">
                                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 flex items-center gap-4"><ShieldAlert size={18} className="text-rose-400" /> Duplicate Spectrum Nodes</h4>
                                      <div className="space-y-4">
                                          {result.suspicious_segments.map((seg: string, i: number) => (
                                              <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                                  <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed">"{seg}"</p>
                                              </div>
                                          ))}
                                      </div>
                                  </div>

                                  <div className="modern-card p-10 bg-black/40 border-white/5">
                                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 flex items-center gap-4"><Info size={18} className="text-rose-400" /> Protocol Explanation</h4>
                                      <p className="text-xl text-slate-300 font-serif italic leading-relaxed">"{result.explanation}"</p>
                                  </div>
                             </div>

                             <div className="modern-card border-white/5 p-10 bg-rose-500/5">
                                 <div className="flex items-start gap-6">
                                     <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                                         <Info size={24} className="text-rose-400" />
                                     </div>
                                     <div>
                                         <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-3">Audit Protocol</h5>
                                         <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">Deep-spectrum scan uses semantic nodes to establish overlap. Ratings above 20% indicate potential non-biological origin or duplication protocol.</p>
                                     </div>
                                 </div>
                             </div>
                        </motion.div>
                    )}
                 </AnimatePresence>
            </section>

            {result && <IntelligenceReport data={result} type="general" content={content} />}
        </div>
    );
}
