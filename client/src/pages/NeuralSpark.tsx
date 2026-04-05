import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Sparkles, 
    Globe, 
    Database, 
    Layers, 
    Zap, 
    ChevronRight, 
    ArrowRight,
    Loader2,
    ShieldCheck,
    Dna,
    Cpu,
    Activity,
    Maximize2,
    Share2,
    Download,
    Terminal,
    BarChart3,
    FileText,
    CheckCircle2
} from 'lucide-react';

interface SparkBlock {
    id: string;
    type: 'text' | 'chart' | 'code' | 'source';
    title: string;
    content: any;
}

interface ResearchResult {
    query: string;
    summary: string;
    confidence: number;
    blocks: SparkBlock[];
}

export default function NeuralSpark() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [agentsActive, setAgentsActive] = useState(false);
    const [result, setResult] = useState<ResearchResult | null>(null);
    const [step, setStep] = useState(0);

    const handleInquiry = useCallback(async () => {
        if (!query.trim()) return;
        setLoading(true);
        setAgentsActive(true);
        setStep(1);

        // Simulated Multi-Agent Research Sequence
        const steps = [
            "Initializing Quantum Research Node...",
            "Crawling 500M+ Academic Parallels...",
            "Synthesizing Cross-Referenced Consensus...",
            "Finalizing Spark Document..."
        ];

        for (let i = 0; i < steps.length; i++) {
            setStep(i + 1);
            await new Promise(r => setTimeout(r, 1200));
        }

        setResult({
            query,
            summary: "Extensive research indicates that the requested topic has a high-dimensional synergy with existing neural architectures, particularly in the realm of distributed inference and zero-latency synthesis.",
            confidence: 99.4,
            blocks: [
                { id: '1', type: 'text', title: 'Executive Summary', content: 'Distributed AI nodes are evolving beyond simple inference towards true autonomous synthesis. This shift marks the transition from Reactive AI to Proactive Neural Clusters.' },
                { id: '2', type: 'chart', title: 'Adoption Velocity', content: [65, 78, 92, 110, 145] },
                { id: '3', type: 'code', title: 'Synthesis Protocol', content: 'async function synth() {\n  const n = await verimind.connect();\n  return n.process({ mode: "spark" });\n}' },
                { id: '4', type: 'source', title: 'Primary Source: MDPI Research', content: 'https://doi.org/10.3390/ai100123' }
            ]
        });
        setLoading(false);
        setAgentsActive(false);
    }, [query]);

    return (
        <div className="max-w-[1600px] mx-auto py-12 px-6 lg:px-12 pb-40 space-y-16">
            {/* Header: More immersive than Genspark */}
            <header className="flex flex-col items-center text-center space-y-10">
                <div className="space-y-6 max-w-4xl">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-[10px] font-black uppercase tracking-[0.5em] text-purple-300"
                    >
                        <Dna size={12} className="animate-spin-slow" /> Neural Spark Engine • S-Grade AI
                    </motion.div>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-none">
                        Spark <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 italic">Research</span>.
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-sm max-w-2xl mx-auto italic">More than search. We synthesize, execute, and build your entire research architecture in one click.</p>
                </div>

                {/* Search / Command Input */}
                <div className="w-full max-w-3xl relative group">
                    <div className="absolute inset-0 bg-purple-500/20 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative p-1 rounded-[3.5rem] bg-gradient-to-b from-white/20 to-transparent border border-white/10 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-6 px-10 py-6 rounded-[3.4rem] bg-[#0F172A]/80">
                            <Search className="text-slate-500" size={24} />
                            <input 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleInquiry()}
                                placeholder="State your inquiry for neural synthesis..."
                                className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-white placeholder:text-slate-700"
                            />
                            <button 
                                onClick={handleInquiry}
                                disabled={loading || !query.trim()}
                                className="w-16 h-16 rounded-[2rem] bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50 group/btn"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={24} className="group-hover/btn:rotate-12 transition-transform" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Real-time Agent Manifest */}
                <AnimatePresence>
                    {agentsActive && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-10 mt-10 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl">
                             <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                       <Cpu size={20} className="text-purple-400 animate-pulse" />
                                  </div>
                                  <div className="text-left">
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Agent Cluster: 01-Omega</span>
                                       <span className="text-xs font-black text-white italic">Status: {step * 25}% Sync...</span>
                                  </div>
                             </div>
                             <div className="w-px h-12 bg-white/10" />
                             <div className="flex items-center gap-6">
                                  { [1,2,3,4].map(s => (
                                      <div key={s} className={`w-2 h-2 rounded-full transition-all duration-500 ${step >= s ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : 'bg-white/10'}`} />
                                  ))}
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* SPARK RESULT ENGINE */}
            <AnimatePresence mode="wait">
                {result ? (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-12 gap-10">
                        
                        {/* Sidebar: Source Context */}
                        <div className="col-span-12 lg:col-span-3 space-y-8 order-2 lg:order-1 outline-none scrollbar-hide">
                            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
                                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-3">
                                     <Layers size={14} className="text-purple-500" /> Research Context
                                 </h4>
                                 <div className="space-y-4">
                                      {['Global Knowledge Base', 'Academix Pro', 'Neural Corpus V3'].map((s, i) => (
                                          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                                               <span className="text-[10px] font-bold text-slate-400 group-hover:text-white">{s}</span>
                                               <CheckCircle2 size={12} className="text-emerald-500 opacity-0 group-hover:opacity-100" />
                                          </div>
                                      ))}
                                 </div>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-indigo-600/10 border border-indigo-500/20 space-y-6">
                                 <div className="flex items-center justify-between">
                                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Trust Coefficient</h4>
                                      <ShieldCheck size={14} className="text-indigo-400" />
                                 </div>
                                 <div className="text-4xl font-black text-white italic">{result.confidence}%</div>
                                 <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                      <div className="h-full bg-indigo-500" style={{ width: `${result.confidence}%` }} />
                                 </div>
                            </div>
                        </div>

                        {/* Main Spark Page */}
                        <div className="col-span-12 lg:col-span-9 space-y-12 order-1 lg:order-2">
                             <div className="p-12 md:p-20 rounded-[4rem] bg-[#0F172A]/60 border border-white/5 backdrop-blur-3xl shadow-2xl space-y-16 relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent" />
                                 
                                 {/* Interactive Control Header */}
                                 <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-5">
                                           <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                                <Zap size={24} />
                                           </div>
                                           <div>
                                                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none italic">Spark Manifest: {result.query}</h3>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono mt-1">GEN-ID: VM-SPARK-8PX</p>
                                           </div>
                                      </div>
                                      <div className="hidden md:flex gap-4">
                                           <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"><Share2 size={18} /></button>
                                           <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"><Download size={18} /></button>
                                      </div>
                                 </div>

                                 {/* Summary: Deep Insight */}
                                 <div className="relative group">
                                      <div className="absolute -left-10 top-0 bottom-0 w-1 bg-purple-500/50 group-hover:w-2 transition-all" />
                                      <p className="text-2xl md:text-4xl font-bold text-slate-200 leading-[1.3] italic selection:bg-purple-500/30">
                                          "{result.summary}"
                                      </p>
                                 </div>

                                 {/* Neural Intelligence Graph - The Genspark Killer Visual */}
                                 <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group/graph h-96">
                                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-6 flex items-center gap-3">
                                          <Dna size={14} className="text-purple-500" /> Neural Connection Graph
                                      </h4>
                                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                           <svg className="w-full h-full max-w-2xl opacity-40">
                                                <motion.path 
                                                     initial={{ pathLength: 0, opacity: 0 }}
                                                     animate={{ pathLength: 1, opacity: 1 }}
                                                     transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                                                     d="M 100,200 Q 300,100 500,200 T 900,200"
                                                     fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="5,5" 
                                                />
                                                <motion.path 
                                                     initial={{ pathLength: 0, opacity: 0 }}
                                                     animate={{ pathLength: 1, opacity: 1 }}
                                                     transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                                     d="M 150,150 Q 400,300 650,150 T 850,250"
                                                     fill="none" stroke="#6366f1" strokeWidth="1"
                                                />
                                                {[ 
                                                    { cx: 100, cy: 200, label: 'Node Alpha' },
                                                    { cx: 300, cy: 100, label: 'Correlation' },
                                                    { cx: 500, cy: 200, label: 'Synthesis' },
                                                    { cx: 900, cy: 200, label: 'Conclusion' } 
                                                ].map((n, i) => (
                                                    <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.2 }}>
                                                        <circle cx={n.cx} cy={n.cy} r="6" fill="#a855f7" className="animate-pulse" />
                                                        <text x={n.cx} y={n.cy + 20} fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">{n.label}</text>
                                                    </motion.g>
                                                ))}
                                           </svg>
                                      </div>
                                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
                                           <div className="text-[10px] font-black text-white/20 uppercase tracking-[1em] group-hover/graph:text-purple-400/40 transition-colors duration-1000">Syncing Logic Rails</div>
                                      </div>
                                 </div>

                                 {/* Spark Blocks */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                                      {result.blocks.map((block) => (
                                          <div key={block.id} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group/block relative overflow-hidden">
                                               <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{block.title}</span>
                                                    {block.type === 'chart' ? <BarChart3 size={16} className="text-indigo-400" /> : block.type === 'code' ? <Terminal size={16} className="text-emerald-400" /> : <FileText size={16} className="text-purple-400" /> }
                                               </div>

                                               {block.type === 'text' && <p className="text-lg font-bold text-slate-400 italic leading-relaxed">{block.content}</p>}
                                               
                                               {block.type === 'chart' && (
                                                   <div className="h-40 flex items-end gap-3 justify-center pb-4">
                                                        { (block.content as number[]).map((val, i) => (
                                                            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${val}%` }} className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-lg shadow-lg" />
                                                        ))}
                                                   </div>
                                               )}

                                               {block.type === 'code' && (
                                                   <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs text-emerald-400/80">
                                                        <pre><code>{block.content}</code></pre>
                                                   </div>
                                               )}

                                               {block.type === 'source' && (
                                                   <a href={block.content} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-indigo-400 text-sm font-black underline underline-offset-8 decoration-indigo-400/30 hover:decoration-indigo-400 transition-all">
                                                        Link Reference <ChevronRight size={14} />
                                                   </a>
                                               )}

                                               <div className="absolute bottom-6 right-6 opacity-0 group-hover/block:opacity-40 transition-opacity">
                                                    <Maximize2 size={14} className="text-white" />
                                               </div>
                                          </div>
                                      ))}
                                 </div>
                                 
                                 {/* Final Action Call */}
                                 <div className="pt-20 flex flex-col md:flex-row items-center justify-center gap-10">
                                      <button className="px-12 py-6 bg-purple-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-purple-600/30 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4 group">
                                           Build Full Spark Page <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                      </button>
                                      <button className="px-12 py-6 bg-white/5 border border-white/10 text-slate-400 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:text-white transition-all">
                                           Export Manifest
                                      </button>
                                 </div>
                             </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-40 flex flex-col items-center text-center">
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl opacity-40 hover:opacity-100 transition-opacity duration-1000">
                             {[
                                 { label: 'Neural Intelligence', icon: Activity },
                                 { label: 'Zero-Latency Edge', icon: Zap },
                                 { label: 'Cross-Node Search', icon: Globe },
                                 { label: 'Verified Database', icon: Database }
                             ].map((f, i) => (
                                 <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col items-center space-y-4">
                                      <f.icon size={24} className="text-slate-600 group-hover:text-purple-500" />
                                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{f.label}</span>
                                 </div>
                             ))}
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
