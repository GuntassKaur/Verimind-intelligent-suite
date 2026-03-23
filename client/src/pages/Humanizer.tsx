import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wand2,
    Loader2,
    Printer,
    CheckCircle2,
    RotateCcw,
    Fingerprint,
    ShieldCheck,
    AlertCircle,
    Zap
} from 'lucide-react';
import api from '../services/api';
import { generatePDF } from '../utils/pdfExport';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { UniversalEditor } from '../components/UniversalEditor';
import { useTheme } from '../contexts/ThemeContext';

interface HumanizerData {
    humanized_text: string;
    readability_score: number;
    ai_probability: number;
    explanation: string;
}

export default function Humanizer() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
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
             const axiosError = err as { response?: { data?: { error?: string } } };
             setError(axiosError.response?.data?.error || 'Neural interrupt detected.');
        } finally {
            setLoading(false);
        }
    }, [content]);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 pb-40 relative">
            {/* Background Glow */}
            <div className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] -z-10 ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'}`} />

            <header className="mb-16 md:mb-24 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-8 ${
                        isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-100 text-purple-600'
                    }`}
                >
                    <Fingerprint size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Detection & Humanization</span>
                </motion.div>
                <h1 className={`text-4xl md:text-7xl font-black tracking-tight mb-6 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Writing <span className="text-gradient">DNA</span>.
                </h1>
                <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto italic leading-relaxed">
                    "Audit AI fingerprints and inject human-like entropy into your manuscript with neural-link precision."
                </p>
            </header>

            <div className="space-y-12">
                {/* Editor Section */}
                <div className="space-y-10">
                    <UniversalEditor 
                        label="Source Manuscript"
                        value={content}
                        onChange={setContent}
                        minHeight="350px"
                        isDark={isDark}
                    />
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <button
                            onClick={runHumanization}
                            disabled={loading}
                            className={`px-16 py-8 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center gap-4 ${
                                loading ? 'opacity-50' : 'premium-btn-primary bg-purple-600 hover:bg-purple-700 shadow-2xl hover:scale-[1.02]'
                            }`}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                            {loading ? 'Analyzing DNA...' : 'Inject Human Flux'}
                        </button>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] flex items-center justify-center gap-4 text-rose-400 text-xs font-black uppercase tracking-widest shadow-xl"
                        >
                            <AlertCircle size={20} />
                            {error}
                        </motion.div>
                    )}
                </div>

                {/* Results Section */}
                <AnimatePresence mode="wait">
                    {result && !loading ? (
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                  {/* Detection Score */}
                                  <div className={`p-10 rounded-[3rem] border flex flex-col items-center justify-center text-center ${isDark ? 'bg-[#1E293B] border-white/5' : 'bg-white border-slate-200 shadow-clean'}`}>
                                       <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-10 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Detection Quotient</h3>
                                       <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                                            <div className="absolute inset-0 bg-purple-500/10 blur-[50px] rounded-full animate-pulse" />
                                            <div className="relative z-10">
                                                 <span className={`text-6xl font-black italic tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{100 - result.ai_probability}%</span>
                                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Human Confidence</p>
                                            </div>
                                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                <circle cx="50%" cy="50%" r="46%" fill="none" strokeWidth="6" className={isDark ? 'stroke-white/5' : 'stroke-slate-100'} />
                                                <circle cx="50%" cy="50%" r="46%" fill="none" strokeWidth="6" className="stroke-purple-500" strokeDasharray="289" strokeDashoffset={289 - (289 * (100 - result.ai_probability) / 100)} />
                                            </svg>
                                       </div>
                                       <p className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>AI PROBABILITY: {result.ai_probability}%</p>
                                  </div>

                                  {/* Humanized Content */}
                                  <div className={`lg:col-span-2 p-12 rounded-[3.5rem] border relative overflow-hidden flex flex-col ${isDark ? 'bg-[#1E293B] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-clean'}`}>
                                       <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />
                                       <header className="flex items-center justify-between mb-10 border-b border-white/5 pb-8 relative z-10">
                                            <div className="flex items-center gap-4">
                                                 <div className={`p-3 rounded-2xl ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                                                      <Wand2 size={24} />
                                                 </div>
                                                 <div>
                                                      <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Naturalized Output</h3>
                                                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Linguistic Flux Optimized</p>
                                                 </div>
                                            </div>
                                            <div className="flex gap-3">
                                                 <button onClick={() => { navigator.clipboard.writeText(result.humanized_text); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-slate-300 hover:text-white border border-white/5' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                                                     {copied ? 'SYNCHRONIZED' : 'Copy Flux'}
                                                 </button>
                                                 <button onClick={() => generatePDF()} className="p-3 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-600/20 hover:scale-110 transition-transform"><Printer size={18} /></button>
                                            </div>
                                       </header>

                                       <div className="flex-1 relative z-10 flex items-center">
                                            <p className={`text-xl md:text-3xl font-bold italic leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                                "{result.humanized_text}"
                                            </p>
                                       </div>

                                       <footer className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-3">
                                                 <CheckCircle2 size={16} className="text-emerald-500" />
                                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Natural Entropy Applied</span>
                                            </div>
                                            <button onClick={() => { setContent(result.humanized_text); setResult(null); }} className="flex items-center gap-2 text-[10px] font-black text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest">
                                                <RotateCcw size={14} /> Redraft original
                                            </button>
                                       </footer>
                                  </div>
                             </div>

                             {/* Metadata & Suggestions */}
                             <div className={`p-10 rounded-[3rem] border flex items-center gap-8 ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white shadow-soft text-indigo-600'}`}>
                                       <ShieldCheck size={32} />
                                  </div>
                                  <div>
                                       <h4 className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Audit Summary</h4>
                                       <p className="text-sm text-slate-500 font-medium italic leading-relaxed">
                                            {result.explanation}
                                       </p>
                                  </div>
                             </div>
                        </motion.div>
                    ) : loading ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-8">
                             <div className="relative w-24 h-24">
                                  <div className="absolute inset-0 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                       <Fingerprint size={32} className="text-purple-400 animate-pulse" />
                                  </div>
                             </div>
                             <div className="text-center">
                                  <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] mb-2">Analyzing DNA Strands</h4>
                                  <p className="text-slate-500 italic text-sm">Identifying robotic linguistic markers and restructuring cadence...</p>
                             </div>
                        </div>
                    ) : (
                         <div className="py-32 flex flex-col items-center text-center">
                              <div className="w-32 h-32 bg-purple-500/5 rounded-full flex items-center justify-center mb-10 border border-purple-500/10 relative">
                                   <div className="absolute inset-0 bg-purple-500/5 rounded-full blur-2xl animate-pulse" />
                                   <Fingerprint size={56} className="text-slate-800 opacity-20 relative z-10" />
                              </div>
                              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Neural Scanner Offline</h3>
                              <p className="text-slate-500 italic text-sm max-w-xs leading-relaxed">Input manuscript to begin DNA auditing and linguistic humanization.</p>
                         </div>
                    )}
                </AnimatePresence>
            </div>
            
            {result && <IntelligenceReport data={result} type="humanize" content={content} />}
        </div>
    );
}
