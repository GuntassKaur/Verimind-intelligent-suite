import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Loader2,
    CheckCircle,
    Printer,
    Cpu,
    Activity
} from 'lucide-react';
import api from '../services/api';
import { generatePDF } from '../utils/pdfExport';
import { IntelligenceReport } from '../components/IntelligenceReport';

export default function EmailGenerator() {
    const [recipient, setRecipient] = useState('');
    const [purpose, setPurpose] = useState('');
    const [tone, setTone] = useState('Professional');
    const [loading, setLoading] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (generatedEmail) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { 
                 wpm: 0, 
                 suggestions: ["Add high-impact subject line", "Personalization nodes", "Clear action trigger"] 
              } 
            }));
        }
    }, [generatedEmail]);

    const handleGenerate = useCallback(async () => {
        if (!purpose.trim()) {
            setError('Neural purpose required for synthesis.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/api/ai/email', { recipient, purpose, tone });
            if (data.success) {
                setGeneratedEmail(data.email);
            } else {
                setError(data.error || 'Synthesis cycle failed.');
            }
        } catch (err: unknown) {
             const axiosError = err as { response?: { data?: { error?: string } } };
             setError(axiosError.response?.data?.error || 'System interrupt in Synthesis module.');
        } finally {
            setLoading(false);
        }
    }, [recipient, purpose, tone]);

    return (
        <div className="workspace-center-content">
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper mb-10">
                      <button className="modern-tool-btn active">
                         <Mail size={20} className="text-cyan-400" />
                         <span>Email Synthesis</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/workspace'}>
                         <Cpu size={20} className="text-indigo-400" />
                         <span>Studio Main</span>
                      </button>
                </div>

                <div className="smart-gpt-editor bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6 px-4 opacity-40">
                         <div className="flex items-center gap-3">
                             <Mail size={16} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Optimization Parameters</span>
                         </div>
                         <div className="flex items-center gap-6">
                              {['Professional', 'Friendly', 'Urgent'].map(t => (
                                  <button key={t} onClick={() => setTone(t)} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all border ${tone === t ? 'bg-indigo-500/10 border-indigo-500/30 text-white' : 'border-transparent text-slate-600'}`}>
                                      {t}
                                  </button>
                              ))}
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Neural Recipient</label>
                             <input
                                type="text"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder="Target entity identifier..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-lg font-serif italic text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800"
                             />
                        </div>
                        <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Communication Purpose</label>
                             <input
                                type="text"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                placeholder="Core intent for synthesis..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-lg font-serif italic text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800"
                             />
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !purpose.trim()}
                            className="premium-btn-primary flex items-center gap-4 py-6 px-16 rounded-3xl group shadow-2xl transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Activity size={20} className="group-hover:rotate-45" />}
                            <span className="text-xs font-black uppercase tracking-[0.3em]">{loading ? 'Synthesizing...' : 'Initiate Communication'}</span>
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
                    {!generatedEmail ? (
                         !loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                                <Mail size={64} className="text-slate-800 mb-8 grayscale" />
                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.5em]">Communication Cache Empty</p>
                            </motion.div>
                         )
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                             <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                <div className="flex items-center gap-4">
                                     <CheckCircle size={22} className="text-cyan-400" />
                                     <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">Email Manifest manifested</h3>
                                </div>
                                <div className="flex gap-4">
                                     <button onClick={() => { navigator.clipboard.writeText(generatedEmail); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="px-6 py-2.5 bg-white/5 border border-white/5 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                                         {copied ? 'SYNCHRONIZED' : 'Copy to Stream'}
                                     </button>
                                     <button onClick={() => generatePDF()} className="px-6 py-2.5 bg-cyan-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/20"><Printer size={14} className="inline mr-2" /> Capture Script</button>
                                </div>
                             </div>

                             <div className="modern-card p-16 bg-white/[0.01] border-white/5">
                                  <div className="prose prose-invert max-w-none prose-p:text-xl prose-p:font-serif prose-p:italic prose-p:leading-relaxed prose-p:text-slate-300">
                                      {generatedEmail.split('\n').map((para, i) => (
                                          <p key={i} className="mb-8">{para}</p>
                                      ))}
                                  </div>
                             </div>

                             <div className="modern-card border-white/5 p-10 bg-cyan-500/5">
                                 <div className="flex items-start gap-6">
                                     <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                                         <Activity size={24} className="text-cyan-400" />
                                     </div>
                                     <div>
                                         <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-3">Neural Trace</h5>
                                         <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">Communication synthesized through GPT-4o Spectrum with tone synchronization active. Target entity alignment confirmed.</p>
                                     </div>
                                 </div>
                             </div>
                        </motion.div>
                    )}
                 </AnimatePresence>
            </section>

            {generatedEmail && <IntelligenceReport data={{ summary: generatedEmail }} type="general" content={purpose} />}
        </div>
    );
}
