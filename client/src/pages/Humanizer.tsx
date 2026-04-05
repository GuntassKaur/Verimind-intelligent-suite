import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wand2,
    Loader2,
    CheckCircle2,
    RotateCcw,
    Fingerprint,
    ShieldCheck,
    AlertCircle,
    Zap,
    Activity,
    Download
} from 'lucide-react';
import api from '../services/api';
import { UniversalEditor } from '../components/UniversalEditor';

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

    const runHumanization = useCallback(async () => {
        if (!content.trim()) {
            setError('Neural substrate required for linguistic flux.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/api/ai/humanize', { text: content });
            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || 'Linguistic transformation failed.');
            }
        } catch (err: unknown) {
             setError('Neural interrupt detected in Humanizer module.');
        } finally {
            setLoading(false);
        }
    }, [content]);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 pb-40 space-y-12">
            {/* Header Redesign */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400"
                    >
                        <Fingerprint size={12} className="animate-pulse" /> Humanizer Prime • Verimind S3
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none font-display">
                            Neural <span className="text-purple-500 italic">DNA Audit</span>.
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-sm italic">Injecting High-Dimensional Entropy into Digital Text</p>
                    </div>
                </div>

                <div className="hidden lg:flex gap-4">
                     <div className="px-8 py-5 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-2xl text-center">
                        <div className="text-2xl font-black text-white">99%</div>
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Humanization Threshold</div>
                     </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Transformation Controller */}
                <div className="lg:col-span-12">
                    <div className="p-8 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/20 to-transparent" />
                        
                        <UniversalEditor 
                            value={content}
                            onChange={setContent}
                            placeholder="Paste AI-generated manuscript for linguistic flux optimization..."
                            minHeight="300px"
                            isDark={true}
                        />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col p-2">
                                     <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1">Entropy Level</span>
                                     <span className="text-xs font-black text-white uppercase tracking-widest leading-none">Maximum Displacement</span>
                                </div>
                                <div className="w-px h-10 bg-white/5" />
                                <div className="flex items-center gap-3">
                                     <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Link SECURE</span>
                                </div>
                            </div>

                            <button
                                onClick={runHumanization}
                                disabled={loading || !content.trim()}
                                className="px-16 py-6 bg-purple-600 hover:bg-purple-500 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-purple-600/20 transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:scale-110 transition-transform" />}
                                {loading ? 'Auditing DNA...' : 'Humanize DNA'}
                            </button>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-[10px] font-black uppercase tracking-widest">
                                    <AlertCircle size={16} /> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Audit Results Overlay */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-12 min-h-[500px] flex flex-col items-center justify-center space-y-12 bg-white/[0.01] rounded-[4rem] border border-white/5 border-dashed">
                             <div className="relative w-32 h-32">
                                  <div className="absolute inset-0 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-[spin_2s_linear_infinite]" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                       <Fingerprint size={40} className="text-purple-500/40 animate-pulse" />
                                  </div>
                             </div>
                             <div className="text-center space-y-4">
                                  <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.6em] animate-pulse">Analyzing DNA Strands</h4>
                                  <p className="text-slate-500 font-bold italic text-sm">Varying sentence cadence and linguistic entropy...</p>
                             </div>
                        </motion.div>
                    ) : result ? (
                        <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-12 grid grid-cols-12 gap-10">
                            {/* DNA Dashboard */}
                            <div className="col-span-12 lg:col-span-4 space-y-10">
                                <div className="p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl flex flex-col items-center justify-center text-center group">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-10">Human Confidence</h3>
                                    <div className="relative w-56 h-56 flex items-center justify-center mb-8">
                                         <div className="absolute inset-0 bg-purple-500/10 blur-[60px] rounded-full shadow-[0_0_100px_rgba(168,85,247,0.2)]" />
                                         <div className="relative z-10">
                                              <span className="text-7xl font-black italic tracking-tighter text-white">{100 - result.ai_probability}%</span>
                                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2">Natural Score</p>
                                         </div>
                                         <svg className="absolute inset-0 w-full h-full -rotate-90">
                                             <circle cx="50%" cy="50%" r="46%" fill="none" strokeWidth="10" className="stroke-white/5" />
                                             <circle cx="50%" cy="50%" r="46%" fill="none" strokeWidth="10" className="stroke-purple-500 transition-all duration-1000" strokeDasharray="289" strokeDashoffset={289 - (289 * (100 - result.ai_probability) / 100)} />
                                         </svg>
                                    </div>
                                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] bg-purple-500/10 px-6 py-2 rounded-full border border-purple-500/20">
                                        LINGUISTIC FLUX SYNCED
                                    </p>
                                </div>

                                <div className="p-10 rounded-[3rem] bg-white/[0.01] border border-white/5 space-y-6">
                                     <div className="flex items-center gap-4 text-purple-400">
                                          <ShieldCheck size={18} />
                                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Audit Manifest</h4>
                                     </div>
                                     <p className="text-sm font-bold text-slate-500 italic leading-relaxed">
                                          "{result.explanation}"
                                     </p>
                                </div>
                            </div>

                            {/* Humanized Output */}
                            <div className="col-span-12 lg:col-span-8 space-y-10">
                                <div className="p-12 rounded-[4rem] bg-[#0F172A]/40 border border-white/5 backdrop-blur-3xl relative overflow-hidden group min-h-full">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 blur-[120px] pointer-events-none" />
                                    
                                    <header className="flex items-center justify-between mb-12 border-b border-white/5 pb-8 relative z-10">
                                         <div className="flex items-center gap-5">
                                              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                                   <Wand2 size={24} />
                                              </div>
                                              <div>
                                                   <h3 className="text-2xl font-black text-white tracking-tight">Fluxized Content</h3>
                                                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] font-mono">STATUS: HIGH ENTROPY</p>
                                              </div>
                                         </div>
                                         <div className="flex gap-4">
                                              <button 
                                                   onClick={() => { navigator.clipboard.writeText(result.humanized_text); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} 
                                                   className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-all active:scale-95"
                                              >
                                                  {copied ? 'Captured' : 'Capture Flux'}
                                              </button>
                                              <button className="p-4 bg-purple-600 text-white rounded-2xl shadow-2xl shadow-purple-600/30 hover:scale-110 active:scale-90 transition-all">
                                                   <Download size={20} />
                                              </button>
                                         </div>
                                    </header>

                                    <div className="space-y-12 relative z-10">
                                        <p className="text-3xl md:text-5xl font-bold text-slate-300 italic leading-[1.1] selection:bg-purple-500/30">
                                            "{result.humanized_text}"
                                        </p>

                                        <div className="flex items-center gap-10 pt-10 border-t border-white/5">
                                             <div className="flex items-center gap-3">
                                                  <Activity size={16} className="text-purple-400" />
                                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Entropy: 9.4</span>
                                             </div>
                                             <div className="flex items-center gap-3">
                                                  <CheckCircle2 size={16} className="text-emerald-500" />
                                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Readability: Grade 12</span>
                                             </div>
                                        </div>
                                    </div>
                                    
                                    <footer className="mt-12 flex items-center justify-between">
                                        <button onClick={() => { setContent(result.humanized_text); setResult(null); }} className="flex items-center gap-3 text-[10px] font-black text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest bg-purple-500/5 px-6 py-3 rounded-full border border-purple-500/10">
                                            <RotateCcw size={14} /> Redraft original
                                        </button>
                                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Thread ID: VM-HMN-X9</span>
                                    </footer>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-12 py-32 flex flex-col items-center text-center opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                            <div className="w-32 h-32 bg-purple-500/5 rounded-full flex items-center justify-center mb-10 border border-purple-500/10 relative">
                                <div className="absolute inset-0 bg-purple-500/5 rounded-full blur-2xl pulse" />
                                <Fingerprint size={56} className="text-slate-800 relative z-10" />
                            </div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.6em] mb-4">Neural Scanner Offline</h3>
                            <p className="text-xs font-bold italic text-slate-600 max-w-xs leading-relaxed">Input manuscript to begin DNA auditing and linguistic humanization.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

