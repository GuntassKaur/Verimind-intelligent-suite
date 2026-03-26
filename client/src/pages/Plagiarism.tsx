import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    Zap, 
    Loader2, 
    Activity, 
    ShieldAlert, 
    FileText, 
    Terminal,
    Printer,
    Info
} from 'lucide-react';
import api from '../services/api';
import { generatePDF } from '../utils/pdfExport';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { UniversalEditor } from '../components/UniversalEditor';
import { useTheme } from '../contexts/ThemeContext';

interface PlagiarismData {
    plagiarism_score: number;
    summary: string;
    suspicious_segments: string[];
    explanation: string;
}

export default function Plagiarism() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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
        setResult(null);

        try {
            const { data } = await api.post('/api/plagiarism/check', { text: content });
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
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <header className="mb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-8 ${
                        isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-600'
                    }`}
                >
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Authenticity Audit</span>
                </motion.div>
                <h1 className={`text-4xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Origins <span className="text-rose-500 italic">Scan</span>.
                </h1>
                <p className="text-slate-500 font-medium text-lg max-w-2xl italic leading-relaxed">
                    "Deep-spectrum scan for digital fingerprints. Verify original biological authorship with neural-link precision."
                </p>
            </header>

            {/* Input Workspace */}
            <div className={`p-1 rounded-[3rem] border transition-all duration-500 bg-gradient-to-b ${isDark ? 'from-white/10 to-transparent border-white/5' : 'from-slate-200 to-transparent border-slate-100 shadow-xl'}`}>
                <div className={`p-6 rounded-[2.8rem] ${isDark ? 'bg-[#1E293B]' : 'bg-white'}`}>
                    <UniversalEditor 
                        value={content}
                        onChange={setContent}
                        placeholder="Paste manuscript for integrity audit..."
                        minHeight="150px"
                        maxHeight="350px"
                        isDark={isDark}
                    />
                    <div className="mt-8 flex items-center justify-between">
                         <div className="flex gap-4">
                              <span className={`text-[9px] font-black uppercase tracking-widest text-slate-500 italic`}>Integrity Sync: Active</span>
                         </div>
                         <button
                            onClick={runAudit}
                            disabled={loading || !content.trim()}
                            className={`px-12 py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-4 ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.05] premium-btn-primary bg-rose-600 hover:bg-rose-700 shadow-2xl shadow-rose-500/20'
                            }`}
                         >
                             {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                             {loading ? 'Scanning...' : 'Initiate Scan'}
                         </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-700'} flex items-center gap-4 text-xs font-bold shadow-lg`}>
                    <Terminal size={18} />
                    {error}
                </div>
            )}

            {/* Output Perspective */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center justify-center space-y-10">
                         <div className="relative w-32 h-32">
                              <div className="absolute inset-0 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-[spin_1.5s_linear_infinite]" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                   <ShieldCheck size={48} className="text-rose-400 animate-pulse" />
                              </div>
                         </div>
                         <div className="text-center">
                              <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.5em] mb-3">Syncing Semantic Nodes</h4>
                              <p className="text-slate-500 italic text-sm">Identifying robotic linguistic markers and source overlap...</p>
                         </div>
                    </motion.div>
                ) : result ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="space-y-12 pb-20"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                             {/* Score Card */}
                             <div className={`p-10 rounded-[3rem] border flex flex-col items-center justify-center text-center ${isDark ? 'bg-[#1E293B] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-clean'}`}>
                                  <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-10 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>Overlap Ratio</h3>
                                  <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                                       <div className="absolute inset-0 bg-rose-500/5 blur-[50px] rounded-full" />
                                       <div className="relative z-10">
                                            <span className={`text-6xl font-black italic tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{result.plagiarism_score}%</span>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Duplicate Density</p>
                                       </div>
                                       <svg className="absolute inset-0 w-full h-full -rotate-90">
                                           <circle cx="50%" cy="50%" r="46%" fill="none" strokeWidth="8" className={isDark ? 'stroke-white/5' : 'stroke-slate-100'} />
                                           <circle cx="50%" cy="50%" r="46%" fill="none" strokeWidth="8" className="stroke-rose-500" strokeDasharray="289" strokeDashoffset={289 - (289 * result.plagiarism_score / 100)} />
                                       </svg>
                                  </div>
                                  <p className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>INTEGRITY BREACH: {result.plagiarism_score}%</p>
                             </div>

                             {/* Abstract Card */}
                             <div className={`lg:col-span-2 p-12 rounded-[3.5rem] border relative overflow-hidden flex flex-col ${isDark ? 'bg-[#1E293B] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-clean'}`}>
                                  <header className="flex items-center justify-between mb-10 border-b border-white/5 pb-8 relative z-10">
                                       <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl ${isDark ? 'bg-rose-500/10 text-rose-400 border border-white/5' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                                 <FileText size={24} />
                                            </div>
                                            <div>
                                                 <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Executive Abstract</h3>
                                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Spectrum Audit Protocol</p>
                                            </div>
                                       </div>
                                       <div className="flex gap-4">
                                            <button 
                                                 onClick={() => { navigator.clipboard.writeText(result.summary); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} 
                                                 className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-slate-300 hover:text-white border border-white/5' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}
                                            >
                                                {copied ? 'Captured' : 'Copy'}
                                            </button>
                                            <button onClick={() => generatePDF()} className="p-3.5 bg-rose-600 text-white rounded-2xl shadow-xl shadow-rose-600/20 transition-transform hover:scale-110">
                                                 <Printer size={18} />
                                            </button>
                                       </div>
                                  </header>

                                  <div className="flex-1 relative z-10 flex items-center">
                                       <p className={`text-2xl md:text-4xl font-bold italic leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                           "{result.summary}"
                                       </p>
                                  </div>

                                  <footer className={`mt-12 pt-8 border-t border-white/5 flex items-center justify-between opacity-50 relative z-10`}>
                                       <div className="flex items-center gap-3">
                                            <Activity size={12} className="text-rose-500" />
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Integrity Sync Verified</span>
                                       </div>
                                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Trace ID: 8842-AXQ</span>
                                  </footer>
                             </div>
                        </div>

                        {/* Detailed Segments Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             <div className={`p-10 rounded-[3rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                                  <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}><ShieldAlert size={18} className="text-rose-500" /> Duplicate Spectrum Nodes</h4>
                                  <div className="space-y-6">
                                      {result.suspicious_segments.map((seg, i) => (
                                          <div key={i} className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                               <p className={`text-xs font-bold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>"{seg}"</p>
                                          </div>
                                      ))}
                                  </div>
                             </div>

                             <div className={`p-10 rounded-[3rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                                  <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}><Info size={18} className="text-rose-500" /> Protocol Explanation</h4>
                                  <div className={`p-8 rounded-[2.5rem] ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                       <p className={`text-lg font-bold italic leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            "{result.explanation}"
                                       </p>
                                  </div>
                             </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="py-24 flex flex-col items-center text-center opacity-30">
                        <div className="w-24 h-24 rounded-[2.5rem] border border-dashed border-slate-400 flex items-center justify-center mb-8">
                            <ShieldCheck size={40} />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-3">Awaiting Integrity Data</h3>
                        <p className="text-xs font-medium italic">Audit manifest materialize here after topic ingestion.</p>
                    </div>
                )}
            </AnimatePresence>

            {result && <IntelligenceReport data={result} type="general" content={content} />}
        </div>
    );
}
