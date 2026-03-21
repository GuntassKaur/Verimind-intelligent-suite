import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, 
    Loader2, 
    Activity, 
    Cpu,
    ArrowRight,
    MessageSquare,
    Printer,
    CheckCircle
} from 'lucide-react';
import api from '../services/api';
import { generatePDF } from '../utils/pdfExport';
import { IntelligenceReport } from '../components/IntelligenceReport';

export default function Generate() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (result) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { 
                 wpm: 0, 
                 suggestions: ["Refine semantic resonance", "Synthesize additional nodes", "Check logical consistency"] 
              } 
            }));
        }
    }, [result]);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Neural prompt required for synthesis.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/api/ai/generate', { prompt });
            if (data.success) {
                setResult(data.answer);
            } else {
                setError(data.error || 'Synthesis cycle failed.');
            }
        } catch (err: unknown) {
             const axiosError = err as { response?: { data?: { error?: string } } };
             setError(axiosError.response?.data?.error || 'System interrupt in Synthesis module.');
        } finally {
            setLoading(false);
        }
    }, [prompt]);

    return (
        <div className="workspace-center-content">
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper mb-10">
                      <button className="modern-tool-btn active">
                         <Zap size={20} className="text-amber-400" />
                         <span>Nexus Synthesis</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/workspace'}>
                         <Cpu size={20} className="text-indigo-400" />
                         <span>Studio Main</span>
                      </button>
                </div>

                <div className="smart-gpt-editor bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6 px-4 opacity-40">
                         <div className="flex items-center gap-3">
                             <MessageSquare size={16} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">High-Fidelity Prompt Node</span>
                         </div>
                         <div className="flex items-center gap-6">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Spectrum Status: Optimal</span>
                         </div>
                    </div>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Initialize prompt for broad-spectrum intelligence synthesis..."
                        className="custom-scrollbar h-[200px]"
                    />

                    <div className="flex justify-center mt-12">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className="premium-btn-primary flex items-center gap-4 py-6 px-16 rounded-3xl group shadow-2xl transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="group-hover:rotate-45" />}
                            <span className="text-xs font-black uppercase tracking-[0.3em] font-sans">{loading ? 'Synthesizing...' : 'Initiate Synthesis'}</span>
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
                                <Zap size={64} className="text-slate-800 mb-8 grayscale" />
                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.5em]">Nexus Cache Empty</p>
                            </motion.div>
                         )
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                             <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                <div className="flex items-center gap-4">
                                     <CheckCircle size={22} className="text-amber-400" />
                                     <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">Synthesized manifest manifested</h3>
                                </div>
                                <div className="flex gap-4">
                                     <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="px-6 py-2.5 bg-white/5 border border-white/5 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                                         {copied ? 'SYNCHRONIZED' : 'Copy Manifest'}
                                     </button>
                                     <button onClick={() => generatePDF()} className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20"><Printer size={14} className="inline mr-2" /> Capture Result</button>
                                </div>
                             </div>

                             <div className="modern-card p-16 bg-white/[0.01] border-white/5">
                                  <div className="prose prose-invert max-w-none prose-p:text-xl prose-p:font-serif prose-p:italic prose-p:leading-relaxed prose-p:text-slate-300">
                                      {result.split('\n').map((para, i) => (
                                          <p key={i} className="mb-8 font-serif italic text-2xl">"{para}"</p>
                                      ))}
                                  </div>
                             </div>

                             <div className="modern-card border-white/5 p-10 bg-amber-500/5">
                                 <div className="flex items-start gap-6">
                                     <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                         <Activity size={24} className="text-amber-400" />
                                     </div>
                                     <div>
                                         <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-3">Protocol Metadata</h5>
                                         <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">Output synthesized through GPT-4o Spectrum. Temporal resonance: Stable. Cognitive alignment: High-Fidelity.</p>
                                     </div>
                                 </div>
                             </div>
                        </motion.div>
                    )}
                 </AnimatePresence>
            </section>

            {result && <IntelligenceReport data={{ answer: result }} type="general" content={prompt} />}
        </div>
    );
}
