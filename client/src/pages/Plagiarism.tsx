import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    Zap, 
    Loader2, 
    Activity, 
    ShieldAlert, 
    Terminal,
    Printer,
    Info,
    Search,
    AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { UniversalEditor } from '../components/UniversalEditor';

interface PlagiarismData {
    plagiarism_score: number;
    analysis_text: string;
    suspicious_segments: string[];
    suggestions: string[];
    confidence_score?: number;
}

export default function Plagiarism() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PlagiarismData | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const runAudit = useCallback(async () => {
        if (!content.trim()) {
            setError('Studio input required for authenticity audit.');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data } = await api.post('/api/ai/plagiarism/check', { text: content });
            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || 'Spectrum analysis failed.');
            }
        } catch (err: any) {
             setError('System interrupt in Plagiarism module. Neural link failed.');
        } finally {
            setLoading(false);
        }
    }, [content]);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 pb-40 space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-rose-500/20 bg-rose-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-rose-400"
                    >
                        <ShieldCheck size={12} className="animate-pulse" /> Authenticity Protocol • Verimind S3
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none font-display">
                            Origins <span className="text-rose-500 italic">Scan</span>.
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-sm italic">Scanning Digital Fingerprints for Biological Authorship</p>
                    </div>
                </div>

                <div className="hidden lg:flex gap-4">
                     <div className="px-8 py-5 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-2xl text-center">
                        <div className="text-2xl font-black text-white">12.8M</div>
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Cross-Referenced Nodes</div>
                     </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-12">
                    <div className="p-8 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500/20 to-transparent" />
                        
                        <UniversalEditor 
                            value={content}
                            onChange={setContent}
                            placeholder="Paste manuscript for deep-spectrum integrity audit..."
                            minHeight="300px"
                            isDark={true}
                        />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col p-2">
                                     <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1">Scanning Depth</span>
                                     <span className="text-xs font-black text-white uppercase tracking-widest leading-none">Global Index • Alpha</span>
                                </div>
                                <div className="w-px h-10 bg-white/5" />
                                <div className="flex items-center gap-3">
                                     <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Link SECURE</span>
                                </div>
                            </div>

                            <button
                                onClick={runAudit}
                                disabled={loading || !content.trim()}
                                className="px-16 py-6 bg-rose-600 hover:bg-rose-500 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-rose-600/20 transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:scale-110 transition-transform" />}
                                {loading ? 'Scanning Spectrum...' : 'Initiate Scan'}
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

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-12 min-h-[500px] flex flex-col items-center justify-center space-y-12 bg-white/[0.01] rounded-[4rem] border border-white/5 border-dashed">
                             <div className="relative w-32 h-32">
                                  <div className="absolute inset-0 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-[spin_2s_linear_infinite]" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                       <Search size={40} className="text-rose-500/40 animate-pulse" />
                                  </div>
                             </div>
                             <div className="text-center space-y-4">
                                  <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.6em] animate-pulse">Syncing Semantic Nodes</h4>
                                  <p className="text-slate-500 font-bold italic text-sm">Identifying robotic linguistic markers and source overlap...</p>
                             </div>
                        </motion.div>
                    ) : result ? (
                        <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-12 grid grid-cols-12 gap-10">
                            <div className="col-span-12 lg:col-span-4 space-y-10">
                                <div className="p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl flex flex-col items-center justify-center text-center group">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-10">Overlap Quotient</h3>
                                    <div className="relative w-56 h-56 flex items-center justify-center mb-8">
                                         <div className={`absolute inset-0 rounded-full blur-[60px] opacity-20 ${result.plagiarism_score > 30 ? 'bg-rose-500 shadow-[0_0_100px_rgba(244,63,94,0.4)]' : 'bg-emerald-500'}`} />
                                         <div className="relative z-10">
                                              <span className="text-7xl font-black italic tracking-tighter text-white">{result.plagiarism_score}%</span>
                                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2">Duplicate Density</p>
                                         </div>
                                         <svg className="absolute inset-0 w-full h-full -rotate-90">
                                             <circle cx="50%" cy="50%" r="46%" fill="none" strokeWidth="10" className="stroke-white/5" />
                                             <circle cx="50%" cy="50%" r="46%" fill="none" strokeWidth="10" className="stroke-rose-500 transition-all duration-1000" strokeDasharray="289" strokeDashoffset={289 - (289 * result.plagiarism_score / 100)} />
                                         </svg>
                                    </div>
                                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] bg-rose-500/10 px-6 py-2 rounded-full border border-rose-500/20">
                                        {result.plagiarism_score > 20 ? 'INTEGRITY BREACH DETECTED' : 'ORIGINS VERIFIED'}
                                    </p>
                                </div>

                                <div className="p-10 rounded-[3rem] bg-white/[0.01] border border-white/5 space-y-6">
                                     <div className="flex items-center gap-4 text-rose-400">
                                          <ShieldAlert size={18} />
                                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Suggestions</h4>
                                     </div>
                                     <div className="space-y-2">
                                          {(result.suggestions || []).map((s, i) => (
                                              <div key={i} className="flex gap-2 text-xs font-bold text-slate-500 italic">
                                                  <div className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                                  {s}
                                              </div>
                                          ))}
                                     </div>
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-8 space-y-10">
                                <div className="p-12 rounded-[4rem] bg-[#0F172A]/40 border border-white/5 backdrop-blur-3xl relative overflow-hidden group min-h-full">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 blur-[120px] pointer-events-none" />
                                    
                                    <header className="flex items-center justify-between mb-12 border-b border-white/5 pb-8 relative z-10">
                                         <div className="flex items-center gap-5">
                                              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                                                   <Activity size={24} />
                                              </div>
                                              <div>
                                                   <h3 className="text-2xl font-black text-white tracking-tight">Executive Abstract</h3>
                                                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] font-mono">HASH: 4421-ORIGIN-X</p>
                                              </div>
                                         </div>
                                         <div className="flex gap-4">
                                              <button 
                                                   onClick={() => { navigator.clipboard.writeText(result.analysis_text); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} 
                                                   className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-all active:scale-95"
                                              >
                                                  {copied ? 'HASH CAPTURED' : 'COPY ABSTRACT'}
                                              </button>
                                              <button className="p-4 bg-rose-600 text-white rounded-2xl shadow-2xl shadow-rose-600/30 hover:scale-110 active:scale-90 transition-all">
                                                   <Printer size={20} />
                                              </button>
                                         </div>
                                    </header>

                                    <div className="space-y-12 relative z-10">
                                        <div className="text-xl md:text-2xl font-bold text-slate-300 italic leading-relaxed selection:bg-rose-500/30 whitespace-pre-wrap">
                                            {result.analysis_text}
                                        </div>

                                        <div className="space-y-6 pt-10 border-t border-white/5">
                                             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-3">
                                                 <Terminal size={14} /> Duplicate Spectrum Nodes
                                             </h4>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 {(result.suspicious_segments || []).map((seg, i) => (
                                                     <div key={i} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 group-hover:border-rose-500/20 transition-all cursor-crosshair">
                                                          <p className="text-xs font-bold text-slate-500 italic leading-relaxed group-hover:text-slate-300">"{seg}"</p>
                                                     </div>
                                                 ))}
                                             </div>
                                        </div>
                                    </div>
                                    
                                    <footer className="mt-12 flex items-center justify-between opacity-30 text-[9px] font-black uppercase tracking-[0.3em]">
                                        <div className="flex items-center gap-3">
                                             <Info size={12} className="text-rose-500" />
                                             <span>Integrity Sync Verified • Global Index V2</span>
                                        </div>
                                        <span>Node ID: VM-AUDIT-088 • Confidence: {result.confidence_score || 95}%</span>
                                    </footer>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-12 py-32 flex flex-col items-center text-center opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                            <div className="w-32 h-32 rounded-[3.5rem] border-2 border-dashed border-slate-700 flex items-center justify-center mb-10 rotate-12 hover:rotate-0 transition-transform">
                                <ShieldCheck size={48} className="text-slate-800" />
                            </div>
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.6em] mb-4">Awaiting Manuscript Ingestion</h3>
                            <p className="text-xs font-bold italic text-slate-600 max-w-xs leading-relaxed">The origins scanner remains in standby until neural substrate is provided.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
