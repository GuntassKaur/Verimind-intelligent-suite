import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Code2, 
    Terminal, 
    Zap, 
    CheckCircle2, 
    Play, 
    BrainCircuit,
    Database,
    ShieldCheck,
    Loader2,
    Sparkles,
    Braces
} from 'lucide-react';

interface ForgeResult {
    code: string;
    explanation: string;
    recommendations: string[];
    complexity: string;
    efficiency: number;
}

export default function NeuralForge() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ForgeResult | null>(null);
    const [copied, setCopied] = useState(false);

    const handleForge = useCallback(async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            // Simulated High-End Forge Output
            setTimeout(() => {
                setResult({
                    code: "async function optimizeNeuralLink(substrate) {\n  const entropy = await calculateEntropy(substrate);\n  return substrate.map(node => ({\n    ...node,\n    displacement: node.cadence * entropy,\n    status: 'fluxed'\n  }));\n}",
                    explanation: "Implementing a high-dimensional mapping function with asynchronous entropy collection to ensure linguistic flux consistency across the neural substrate.",
                    recommendations: [
                        "Use high-precision floating points for entropy.",
                        "Initialize substrate nodes with a seed value.",
                        "Implement flux-reversal for debugging."
                    ],
                    complexity: "O(n log n)",
                    efficiency: 98.4
                });
                setLoading(false);
            }, 1500);
        } catch (err) {
            setLoading(false);
        }
    }, [prompt]);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 pb-40 space-y-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400"
                    >
                        <Braces size={12} className="animate-pulse" /> Synthesis Engine • Verimind S3
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none font-display">
                            Neural <span className="text-emerald-500 italic">Forge</span>.
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-sm italic">High-Performance Neural Scripting & Logic Synthesis</p>
                    </div>
                </div>

                <div className="hidden lg:flex gap-4">
                     <div className="px-8 py-5 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-2xl text-center">
                        <div className="text-2xl font-black text-white">98.4%</div>
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Compile Success Ratio</div>
                     </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Forge Input */}
                <div className="lg:col-span-12">
                    <div className="p-10 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
                        
                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the neural logic or script required for synthesis..."
                                className="w-full h-40 bg-black/20 border border-white/5 rounded-3xl p-8 text-lg font-medium text-slate-300 outline-none focus:border-emerald-500/30 transition-all placeholder:text-slate-800 resize-none scrollbar-hide"
                            />
                            <div className="absolute bottom-6 right-6 flex gap-3 text-[9px] font-black uppercase tracking-widest text-slate-700">
                                <span className={prompt.length > 500 ? 'text-rose-500' : ''}>{prompt.length}</span>
                                <span>/ 2000</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                             <div className="flex items-center gap-6">
                                  <div className="flex flex-col">
                                       <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1">Synthesis Model</span>
                                       <span className="text-xs font-black text-white uppercase tracking-widest leading-none italic">Codex-4 Neural-Turbo</span>
                                  </div>
                                  <div className="w-px h-10 bg-white/5" />
                                  <div className="flex items-center gap-4">
                                       <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                            <Database size={12} /> Sync Context
                                       </button>
                                  </div>
                             </div>

                             <button
                                onClick={handleForge}
                                disabled={loading || !prompt.trim()}
                                className="px-16 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-emerald-600/20 transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:scale-110 transition-transform" />}
                                {loading ? 'Synthesizing...' : 'Ignite Forge'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Forge Output */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-12 min-h-[500px] flex flex-col items-center justify-center space-y-12 bg-white/[0.01] rounded-[4rem] border border-white/5 border-dashed">
                             <div className="relative w-32 h-32">
                                  <div className="absolute inset-0 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-[spin_2s_linear_infinite]" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                       <Code2 size={40} className="text-emerald-500/40 animate-pulse" />
                                  </div>
                             </div>
                             <div className="text-center space-y-4">
                                  <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.6em] animate-pulse">Running Logic Synthesis</h4>
                                  <p className="text-slate-500 font-bold italic text-sm">Drafting highly optimized neural scripting nodes...</p>
                             </div>
                        </motion.div>
                    ) : result ? (
                        <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-12 grid grid-cols-12 gap-10">
                            {/* Insight Dashboard */}
                            <div className="col-span-12 lg:col-span-4 space-y-10">
                                <div className="p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl flex flex-col items-center justify-center text-center group">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-10">Logic Efficiency</h3>
                                    <div className="relative w-56 h-56 flex items-center justify-center mb-8">
                                         <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] rounded-full shadow-[0_0_100px_rgba(16,185,129,0.2)]" />
                                         <div className="relative z-10">
                                              <span className="text-7xl font-black italic tracking-tighter text-white">{result.efficiency}%</span>
                                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2">Optimal Score</p>
                                         </div>
                                         <svg className="absolute inset-0 w-full h-full -rotate-90">
                                             <circle cx="50%" cy="50%" r="46%" fill="none" strokeWidth="10" className="stroke-white/5" />
                                             <circle cx="50%" cy="50%" r="46%" fill="none" strokeWidth="10" className="stroke-emerald-500 transition-all duration-1000" strokeDasharray="289" strokeDashoffset={289 - (289 * result.efficiency / 100)} />
                                         </svg>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 w-full">
                                         <div className="p-5 rounded-3xl bg-white/5 border border-white/5 text-center">
                                              <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] block mb-1">Time Complexity</span>
                                              <span className="text-sm font-black text-white italic">{result.complexity}</span>
                                         </div>
                                         <div className="p-5 rounded-3xl bg-white/5 border border-white/5 text-center">
                                              <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] block mb-1">Stability Rate</span>
                                              <span className="text-sm font-black text-emerald-400">Stable v1.0</span>
                                         </div>
                                    </div>
                                </div>

                                <div className="p-10 rounded-[3rem] bg-white/[0.01] border border-white/5 space-y-8">
                                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-3">
                                         <Sparkles size={14} className="text-emerald-500" /> Smart Protocols
                                     </h4>
                                     <div className="space-y-4">
                                         {result.recommendations.map((rec: string, i: number) => (
                                             <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                                                  <div className="mt-1"><CheckCircle2 size={12} className="text-emerald-500" /></div>
                                                  <p className="text-xs font-bold text-slate-400 italic leading-relaxed">{rec}</p>
                                             </div>
                                         ))}
                                     </div>
                                </div>
                            </div>

                            {/* Script Terminal */}
                            <div className="col-span-12 lg:col-span-8 space-y-10">
                                <div className="p-12 rounded-[4rem] bg-[#0F172A]/40 border border-white/5 backdrop-blur-3xl relative overflow-hidden group min-h-full">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[120px] pointer-events-none" />
                                    
                                    <header className="flex items-center justify-between mb-12 border-b border-white/5 pb-8 relative z-10">
                                         <div className="flex items-center gap-5">
                                              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                                                   <Terminal size={24} />
                                              </div>
                                              <div>
                                                   <h3 className="text-2xl font-black text-white tracking-tight">Synthesized Node</h3>
                                                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] font-mono">HASH: 88-LOGIC-FORGE</p>
                                              </div>
                                         </div>
                                         <div className="flex gap-4">
                                              <button 
                                                   onClick={() => { navigator.clipboard.writeText(result.code); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} 
                                                   className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-all active:scale-95"
                                              >
                                                  {copied ? 'HASH CAPTURED' : 'COPY SCRIPT'}
                                              </button>
                                              <button className="p-4 bg-emerald-600 text-white rounded-2xl border border-emerald-400/20 shadow-2xl shadow-emerald-500/30 hover:scale-110 active:scale-90 transition-all">
                                                   <Play size={20} fill="currentColor" />
                                              </button>
                                         </div>
                                    </header>

                                    <div className="space-y-10 relative z-10">
                                        <div className="p-10 rounded-[2.5rem] bg-black/40 border border-white/5 font-mono text-sm text-emerald-400 group overflow-x-auto custom-scrollbar">
                                             <pre className="selection:bg-emerald-500/30">
                                                  <code>{result.code}</code>
                                             </pre>
                                        </div>

                                        <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
                                             <div className="flex items-center gap-3">
                                                  <BrainCircuit size={16} className="text-emerald-500" />
                                                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Logic Abstract</h4>
                                             </div>
                                             <p className="text-lg md:text-2xl font-bold text-slate-300 italic leading-relaxed">
                                                  "{result.explanation}"
                                             </p>
                                        </div>
                                    </div>
                                    
                                    <footer className="mt-12 flex items-center justify-between opacity-30 text-[9px] font-black uppercase tracking-[0.3em]">
                                        <div className="flex items-center gap-3">
                                             <ShieldCheck size={12} className="text-emerald-500" />
                                             <span>Forge Certified • Logic Synthesis Grade S</span>
                                        </div>
                                        <span>Node ID: VM-FORGE-712</span>
                                    </footer>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-12 py-32 flex flex-col items-center text-center opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                            <div className="w-32 h-32 rounded-[3.5rem] bg-emerald-500/5 border border-dashed border-emerald-500/20 flex items-center justify-center mb-10 rotate-12 hover:rotate-0 transition-transform relative">
                                <div className="absolute inset-0 bg-emerald-500/10 blur-3xl pulse rounded-full" />
                                <Code2 size={48} className="text-slate-800 relative z-10" />
                            </div>
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.6em] mb-4">Awaiting Logical Substrate</h3>
                            <p className="text-xs font-bold italic text-slate-600 max-w-xs leading-relaxed">Describe the architecture or logic required to initiate neural synthesis.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
