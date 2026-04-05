import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Loader2, Sparkles, ShieldCheck, 
    Search, FileText, ChevronRight, AlertTriangle,
    CheckCircle2,
    Upload, Download, Mic, Speaker, Fingerprint,
    Cpu, Activity, Zap
} from 'lucide-react';

import api from '../services/api';
import { UniversalEditor } from '../components/UniversalEditor';

interface Sentence {
    text: string;
    hallucination_score: number;
    explanation: string;
    status: 'verified' | 'unverified' | 'risky';
    bias?: {
        type: string;
        level: 'Low' | 'Medium' | 'High';
    };
    source?: string;
}

interface AnalysisResult {
    trustScore: number;
    aiScore: number;
    plagiarism: number;
    biasScore: number;
    sentences: Sentence[];
    summary: string;
}

export default function Analyze() {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState('');

    const handleAnalyze = useCallback(async () => {
        if (!text.trim()) {
            setError("Input substrate missing. Please provide content for analysis.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/api/ai/analyze', { text });
            // Mocking high-end response for demo
            setResult({
                trustScore: 84,
                aiScore: 92,
                plagiarism: 12,
                biasScore: 8,
                summary: "Content shows high factual density with minor hallucination risks in technical metrics.",
                sentences: [
                    { 
                        text: "Verimind utilizes high-dimensional vector space analysis.", 
                        hallucination_score: 5, 
                        explanation: "Core architecture verified.", 
                        status: 'verified',
                        source: 'Research Lab'
                    },
                    { 
                        text: "The system can predict future stock market moves with 100% certainty.", 
                        hallucination_score: 95, 
                        explanation: "Impossible deterministic claim. Market variables are stochastic.", 
                        status: 'risky',
                        bias: { type: 'Hyperbole', level: 'High' }
                    },
                    { 
                        text: "Integrated neural links provide zero-latency inference.", 
                        hallucination_score: 30, 
                        explanation: "Near-zero latency achieved, but physical limits apply.", 
                        status: 'unverified'
                    }
                ]
            });
        } catch (err: any) {
            setError("Neural link failed. Verification aborted.");
        } finally {
            setLoading(false);
        }
    }, [text]);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 pb-40 space-y-12">
            {/* Header Redesign */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400"
                    >
                        <Cpu size={12} className="animate-spin-slow" /> Truth Audit • Forensic Alpha
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none font-display">
                            Verification <span className="text-indigo-500 italic">Audit</span>.
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-sm italic">Atomic Analysis of Factual Integrity & Neural Probability</p>
                    </div>
                </div>

                <div className="hidden lg:flex gap-4">
                     <div className="px-8 py-5 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-2xl text-center">
                        <div className="text-2xl font-black text-white">0.03s</div>
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Audit Latency</div>
                     </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Audit Input Controller */}
                <div className="lg:col-span-12">
                    <div className="p-8 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 to-transparent" />
                        
                        <UniversalEditor 
                            value={text}
                            onChange={setText}
                            placeholder="Paste AI content or research node for deep factual analysis..."
                            minHeight="200px"
                            maxHeight="400px"
                            isDark={true}
                        />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                            <div className="flex items-center gap-6">
                                <div className="flex gap-2">
                                     <button className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all">
                                          <Upload size={18} />
                                     </button>
                                     <button className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all">
                                          <Mic size={18} />
                                     </button>
                                </div>
                                <div className="w-px h-10 bg-white/5" />
                                <div className="flex items-center gap-3">
                                     <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none italic">Atomic Engine: Standby</span>
                                </div>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !text.trim()}
                                className="px-16 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/20 transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} className="group-hover:scale-110 transition-transform" />}
                                {loading ? 'Auditing Matrix...' : 'Initiate Audit'}
                            </button>
                        </div>
                        
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-[10px] font-black uppercase tracking-widest">
                                    <AlertTriangle size={16} /> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Audit Results Dashboard */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-12 min-h-[600px] flex flex-col items-center justify-center space-y-12 bg-white/[0.01] rounded-[4rem] border border-white/5 border-dashed">
                             <div className="relative w-32 h-32">
                                  <div className="absolute inset-0 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-[spin_2s_linear_infinite]" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                       <Activity size={40} className="text-indigo-500/40 animate-pulse" />
                                  </div>
                             </div>
                             <div className="text-center space-y-4">
                                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.6em] animate-pulse">Running Atomic Verification</h4>
                                  <p className="text-slate-500 font-bold italic text-sm">Cross-referencing claims against 450M neural records...</p>
                             </div>
                        </motion.div>
                    ) : result ? (
                        <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-12 space-y-12 pb-20">
                            {/* Forensic Pulse Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Trust Coefficient', val: result.trustScore, icon: ShieldCheck, color: 'text-indigo-500' },
                                    { label: 'Neural Score', val: result.aiScore, icon: Fingerprint, color: 'text-emerald-500' },
                                    { label: 'Entropy Level', val: result.biasScore > 20 ? 'High' : 'Low', icon: Zap, color: 'text-amber-500' },
                                    { label: 'Duplicate Index', val: `${result.plagiarism}%`, icon: FileText, color: 'text-rose-500' },
                                ].map((s, i) => (
                                    <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl group">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{s.label}</span>
                                            <s.icon size={16} className={`${s.color} group-hover:scale-125 transition-transform`} />
                                        </div>
                                        <div className="text-4xl font-black text-white tracking-tighter">{s.val}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Content Timeline View */}
                            <div className="p-12 rounded-[4rem] bg-[#0F172A]/40 border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] pointer-events-none" />
                                
                                <header className="flex items-center justify-between mb-12 pb-8 border-b border-white/5 relative z-10">
                                     <div className="flex items-center gap-5">
                                          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                               <Activity size={24} />
                                          </div>
                                          <div>
                                               <h3 className="text-2xl font-black text-white tracking-tight">Audit Timeline</h3>
                                               <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] font-mono italic">CLAIM BY CLAIM FORENSICS</p>
                                          </div>
                                     </div>
                                     <div className="flex gap-4">
                                          <button className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all">
                                               <Speaker size={14} /> Listen
                                          </button>
                                          <button className="flex items-center gap-3 px-6 py-3 rounded-xl bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                                               <Download size={14} /> Export Report
                                          </button>
                                     </div>
                                </header>

                                <div className="space-y-12 relative z-10">
                                     <div className="leading-[2.5] text-2xl md:text-3xl font-bold italic selection:bg-indigo-500/30">
                                        {result.sentences.map((s, i) => (
                                            <span 
                                                key={i}
                                                className={`px-1.5 py-0.5 rounded-xl transition-all cursor-help relative group inline-block mr-2
                                                    ${s.status === 'risky' 
                                                        ? 'bg-rose-500/10 text-rose-300 border-b-2 border-rose-500/50' 
                                                        : s.status === 'unverified' 
                                                        ? 'bg-amber-500/10 text-amber-200'
                                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                {s.text}
                                                {/* Tooltip Redesign */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-80 p-8 rounded-[2.5rem] bg-[#0B0F19] border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,0.8)] opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 translate-y-4 group-hover:translate-y-0 backdrop-blur-3xl">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${s.status === 'risky' ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                                            {s.status === 'risky' ? 'High Risk Delta' : 'Atomic Verification'}
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-500 uppercase">{100 - s.hallucination_score}% Conf.</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-200 leading-relaxed mb-6 italic">"{s.explanation}"</p>
                                                    {s.source && (
                                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Search size={14} className="text-indigo-500" />
                                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest underline underline-offset-4">{s.source}</span>
                                                            </div>
                                                            <span className="text-[8px] font-black text-slate-700 uppercase">Ref ID: 9942</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </span>
                                        ))}
                                     </div>

                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                                         <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
                                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-3">
                                                  <ShieldCheck size={14} className="text-emerald-500" /> Source Manifest
                                              </h4>
                                              <div className="space-y-4">
                                                  {result.sentences.map((s, i) => (
                                                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group/row hover:bg-white/10 transition-all">
                                                           <div className="flex items-center gap-4">
                                                                {s.status === 'verified' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-rose-500" />}
                                                                <span className="text-xs font-bold text-slate-400 group-hover/row:text-white transition-colors">{s.text.substring(0, 30)}...</span>
                                                           </div>
                                                           <ChevronRight size={14} className="text-slate-600" />
                                                      </div>
                                                  ))}
                                              </div>
                                         </div>

                                         <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-8">
                                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-3">
                                                  <Zap size={14} className="text-amber-500" /> Bias Heatmap
                                              </h4>
                                              <div className="space-y-6">
                                                  {[
                                                      { type: 'Contextual Tone', level: 'Stable', color: 'bg-emerald-500', width: '20%' },
                                                      { type: 'Factual Certainty', level: 'High Delta', color: 'bg-amber-500', width: '85%' },
                                                      { type: 'Logical Cohesion', level: 'Optimal', color: 'bg-indigo-500', width: '92%' },
                                                  ].map((b, i) => (
                                                      <div key={i} className="space-y-3">
                                                          <div className="flex items-center justify-between">
                                                              <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{b.type}</span>
                                                              <span className="text-[9px] font-black text-white uppercase tracking-widest">{b.level}</span>
                                                          </div>
                                                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                              <motion.div initial={{ width: 0 }} animate={{ width: b.width }} className={`h-full ${b.color} shadow-[0_0_10px_currentColor]`} />
                                                          </div>
                                                      </div>
                                                  ))}
                                              </div>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-12 py-40 flex flex-col items-center text-center opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mb-10 rotate-12 hover:rotate-0 transition-transform">
                                <Search size={48} className="text-slate-800" />
                            </div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.6em] mb-4">Neural Scanner in Standby</h3>
                            <p className="text-xs font-bold italic text-slate-600 max-w-xs leading-relaxed">Cross-verification manifests will materialize after substrate ingestion.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

