import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Loader2, CheckCircle, Wand2, Sparkles, Printer, Zap, Cpu, FileText, Globe, Info } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';
import { VoiceInput } from '../components/VoiceInput';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';

const TONES = [
    { id: 'Professional', label: 'Pro', icon: '💼' },
    { id: 'Casual', label: 'Casual', icon: '🍃' },
    { id: 'Academic', label: 'Study', icon: '🎓' },
    { id: 'Creative', label: 'Art', icon: '🎨' },
    { id: 'Technical', label: 'Tech', icon: '⚙️' }
];

export default function Humanizer() {
    const [text, setText] = useState('');
    const [tone, setTone] = useState('Professional');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ humanized_text: string; confidence_score?: number } | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    // Update assistant panel
    useEffect(() => {
        if (result) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { wpm: 0, suggestions: ["Check readability", "Natural flow test", "Vocabulary check"] } 
            }));
        }
    }, [result]);

    const handleHumanize = useCallback(async () => {
        if (!text.trim()) {
            setError("Please provide content to humanize.");
            return;
        }

        setLoading(true);
        setResult(null);
        setError('');

        try {
            const { data } = await api.post('/api/humanize', { text, tone });
            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || "Processing failed.");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Connection failed.");
        } finally {
            setLoading(false);
        }
    }, [text, tone]);

    return (
        <div className="workspace-center-content">
            {/* TOP INPUT AREA */}
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper">
                      <button className="modern-tool-btn active">
                         <Wand2 size={20} className="text-purple-400" />
                         <span>Humanize</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/analyzer'}>
                         <Cpu size={20} className="text-blue-400" />
                         <span>Audit</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/generator'}>
                         <Sparkles size={20} className="text-indigo-400" />
                         <span>Generate</span>
                      </button>
                </div>

                <div className="smart-gpt-editor">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 px-4 opacity-50">
                        <div className="flex gap-2">
                            {TONES.map(t => (
                                <button 
                                  key={t.id} 
                                  onClick={() => setTone(t.id)}
                                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${tone === t.id ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                             <SmartProcessingToolbar onTextExtracted={setText} />
                        </div>
                    </div>
                    
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste AI-generated content to humanize..."
                        className="custom-scrollbar"
                    />

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleHumanize}
                            disabled={loading || !text.trim()}
                            className="premium-btn-primary flex items-center gap-4 py-4 px-10 rounded-2xl group transition-all"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={18} /> Re-aligning linguistics...</>
                            ) : (
                                <><Wand2 size={18} className="group-hover:scale-125 transition-transform" /> HUMANIZE CONTENT</>
                            )}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex justify-center text-rose-400 text-[10px] font-black uppercase tracking-widest">
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* BOTTOM OUTPUT AREA */}
            <section className="output-bottom-area">
                <AnimatePresence mode="wait">
                    {!result && !loading ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-30">
                             <Wand2 size={64} className="text-slate-800 mb-6" />
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Synthesizer offline</p>
                        </motion.div>
                    ) : loading ? (
                        <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
                             <div className="w-16 h-16 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-6" />
                             <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest animate-pulse">Refining Linguistic Matrix...</span>
                        </motion.div>
                    ) : (
                        <motion.div key="res" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto pb-20">
                             <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                <div className="flex items-center gap-3">
                                   <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                   <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Optimized Output Cluster</h4>
                                </div>
                                <div className="flex gap-4">
                                     <button onClick={() => { navigator.clipboard.writeText(result.humanized_text); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2">
                                         {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                         {copied ? 'Copied' : 'Copy'}
                                     </button>
                                     <button onClick={() => generatePDF()} className="px-5 py-2.5 bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/20">
                                         <Printer size={14} /> Download PDF
                                     </button>
                                </div>
                             </div>

                             <div className="modern-card p-10 md:p-14 bg-[#0D1117] border-white/5 relative overflow-hidden group">
                                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                    <Wand2 size={180} className="text-purple-400" />
                                 </div>
                                 <div className="relative z-10">
                                     <p className="text-slate-200 font-serif text-xl md:text-2xl leading-[2] whitespace-pre-wrap selection:bg-purple-500/30">
                                         {result.humanized_text}
                                     </p>
                                 </div>
                             </div>

                             <div className="modern-card border-purple-500/10 py-8 bg-purple-500/[0.03]">
                                 <div className="flex items-start gap-5 px-4 text-center sm:text-left">
                                     <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20 mx-auto sm:mx-0">
                                         <Info size={20} className="text-purple-400" />
                                     </div>
                                     <div className="flex-1">
                                         <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Style Transformation Report</h5>
                                         <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed">System has successfully normalized {tone} linguistic markers while maintaining core semantic entropy. Document is now optimized for human readability.</p>
                                     </div>
                                 </div>
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {result && <IntelligenceReport data={result} type="humanize" content={text} />}
        </div>
    );
}
