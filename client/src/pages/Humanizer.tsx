import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wand2,
    Loader2,
    Activity,
    Cpu,
    Target,
    Printer,
    CheckCircle,
    RotateCcw
} from 'lucide-react';
import api from '../services/api';
import { generatePDF } from '../utils/pdfExport';
import { IntelligenceReport } from '../components/IntelligenceReport';

interface HumanizerData {
    humanized_text: string;
    readability_score: number;
    ai_probability: number;
    explanation: string;
}

export default function Humanizer() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<HumanizerData | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (result) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { 
                 wpm: 0, 
                 suggestions: ["Naturalize sentence cadence", "Vary linguistic entropy", "Remove repetitive markers"] 
              } 
            }));
        }
    }, [result]);

    const runHumanization = useCallback(async () => {
        if (!content.trim()) {
            setError('Studio substrate required for naturalization.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/api/ai/humanize', { text: content });
            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || 'Linguistic cycle failed.');
            }
        } catch (err: unknown) {
             const axiosError = err as { response?: { data?: { error?: string } } };
             setError(axiosError.response?.data?.error || 'System interrupt in Humanization module.');
        } finally {
            setLoading(false);
        }
    }, [content]);

    return (
        <div className="workspace-center-content">
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper mb-10">
                      <button className="modern-tool-btn active">
                         <Wand2 size={20} className="text-purple-400" />
                         <span>Naturalization Core</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/workspace'}>
                         <Cpu size={20} className="text-indigo-400" />
                         <span>Studio Main</span>
                      </button>
                </div>

                <div className="smart-gpt-editor bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-6 px-4 opacity-40">
                         <div className="flex items-center gap-3">
                             <Target size={16} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Naturalization Substrate</span>
                         </div>
                         <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Tone Sync Active</span>
                         </div>
                    </div>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste AI-generated content for linguistic naturalization and entropy enhancement..."
                        className="custom-scrollbar h-[250px]"
                    />

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={runHumanization}
                            disabled={loading || !content.trim()}
                            className="premium-btn-primary bg-purple-600 hover:bg-purple-700 shadow-purple-600/20 py-6 px-16 rounded-3xl group transition-all flex items-center gap-4"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Activity size={20} className="group-hover:rotate-45" />}
                            <span className="text-xs font-black uppercase tracking-[0.3em] font-sans">{loading ? 'Naturalizing...' : 'Initialize Flux'}</span>
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
                                <Wand2 size={64} className="text-slate-800 mb-8 grayscale" />
                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.5em]">Naturalization Cache Empty</p>
                            </motion.div>
                         )
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                             <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                <div className="flex items-center gap-4">
                                     <CheckCircle size={22} className="text-purple-400" />
                                     <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">Linguistic Flux manifested</h3>
                                </div>
                                <div className="flex gap-4">
                                     <button onClick={() => { navigator.clipboard.writeText(result.humanized_text); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="px-6 py-2.5 bg-white/5 border border-white/5 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                                         {copied ? 'SYNCHRONIZED' : 'Copy to Stream'}
                                     </button>
                                     <button onClick={() => generatePDF()} className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"><Printer size={14} className="inline mr-2" /> Capture Flux</button>
                                     <button onClick={() => { setContent(result.humanized_text); setResult(null); }} className="p-3 bg-white/5 border border-white/10 text-slate-500 rounded-xl hover:text-white transition-all" title="Recall to Editor"><RotateCcw size={16} /></button>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                  <div className="modern-card p-12 flex flex-col items-center justify-center bg-purple-500/5 border-purple-500/10 text-center relative overflow-hidden group">
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 block">Naturalization Rate</span>
                                       <div className="text-7xl font-black text-white italic tracking-tighter mb-4">{result.readability_score}%</div>
                                       <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.3em]">Protocol flux active</p>
                                  </div>
                                  <div className="modern-card md:col-span-3 p-12 bg-white/[0.01]">
                                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 border-l-4 border-purple-500 pl-6">Naturalized Output</h4>
                                       <p className="text-2xl text-slate-200 font-serif italic leading-relaxed selection:bg-purple-500/20">"{result.humanized_text}"</p>
                                  </div>
                             </div>

                             <div className="modern-card border-white/5 p-10 bg-purple-500/5">
                                 <div className="flex items-start gap-6">
                                     <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                                         <Activity size={24} className="text-purple-400" />
                                     </div>
                                     <div>
                                         <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-3">Protocol Metadata</h5>
                                         <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">Flux engine successfully naturalized {content.split(' ').length} linguistic nodes. AI probability reduced to {result.ai_probability}%.</p>
                                     </div>
                                 </div>
                             </div>
                        </motion.div>
                    )}
                 </AnimatePresence>
            </section>

            {result && <IntelligenceReport data={result} type="humanize" content={content} />}
        </div>
    );
}
