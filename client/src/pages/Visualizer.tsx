import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Network,
    Loader2, 
    Zap,
    ArrowRight,
    FileText,
    GitBranch,
    BarChart3,
    BookOpen,
    Download,
    Share2,
    Cpu
} from 'lucide-react';
import api from '../services/api';
import { Mermaid } from '../components/Mermaid';

interface VisualizeData {
    summary: string;
    mermaid_diagrams?: { type: string; code: string }[];
}

interface ResultState {
    type: string;
    data: VisualizeData;
}

const DIAGRAM_TYPES = [
    { key: 'flowchart', label: 'Neural Flow', icon: GitBranch },
    { key: 'mindmap',   label: 'Synaptic Map',  icon: Network },
    { key: 'timeline',  label: 'Temporal Line',  icon: BarChart3 },
    { key: 'summary',   label: 'Core Abstract',   icon: BookOpen },
];

export default function Visualizer() {
    const [content, setContent] = useState('');
    const [type, setType] = useState('flowchart');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ResultState | null>(null);
    const [error, setError] = useState('');

    const runVisualize = useCallback(async () => {
        if (!content.trim()) {
            setError('Neural substrate required for mapping.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/api/ai/visualize', { text: content, type });
            if (data.success) {
                setResult({ type: 'visualize', data: data.data });
            } else {
                setError(data.error || 'Visualization failure across nodes.');
            }
        } catch (err: unknown) {
            setError('Neural link interrupt. Bridge visualizer module offline.');
        } finally {
            setLoading(false);
        }
    }, [content, type]);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 space-y-12 pb-32">
            {/* Header Redesign */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400"
                    >
                        <Cpu size={12} className="animate-spin-slow" /> Logic Flow • V4.0 Prime
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none font-display">
                            Logic <span className="text-purple-500">Stream</span>.
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-sm">Transforming Narrative into Neural Architecture</p>
                    </div>
                </div>

                <div className="hidden lg:flex gap-4">
                     <div className="px-8 py-5 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-2xl text-center">
                        <div className="text-2xl font-black text-white">4.2s</div>
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Diagram Latency</div>
                     </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Workflow Controller */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-10 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        
                        <div>
                            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6">Protocol Type</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {DIAGRAM_TYPES.map((d) => (
                                    <button
                                        key={d.key}
                                        onClick={() => setType(d.key)}
                                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all gap-3 ${
                                            type === d.key
                                                ? 'bg-purple-600 border-purple-500 text-white shadow-xl shadow-purple-600/20 active:scale-95'
                                                : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <d.icon size={20} />
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Input Substrate</h3>
                                <FileText size={14} className="text-slate-700" />
                            </div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste your logical manuscript here..."
                                className="w-full h-48 bg-black/20 border border-white/5 rounded-2xl p-6 text-sm font-medium text-slate-300 outline-none focus:border-purple-500/30 transition-all placeholder:text-slate-800 resize-none scrollbar-hide"
                            />
                        </div>

                        <button
                            onClick={runVisualize}
                            disabled={loading || !content.trim()}
                            className="w-full py-6 bg-purple-600 hover:bg-purple-500 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:scale-110 transition-transform" />}
                            {loading ? 'Synthesizing...' : 'Initialize Logic'}
                        </button>

                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-[10px] font-black uppercase tracking-widest">
                                    <Share2 size={14} /> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-8 rounded-[3rem] bg-indigo-600/5 border border-indigo-500/10 flex items-center justify-between group cursor-pointer overflow-hidden">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1 italic">Premium Node</span>
                            <span className="text-sm font-black text-white tracking-tighter">Live SVG Sync</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                             <ArrowRight size={16} className="text-indigo-400" />
                        </div>
                    </div>
                </div>

                {/* Live Canvas Output */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full min-h-[600px] rounded-[4rem] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-8 relative overflow-hidden backdrop-blur-3xl">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                                <div className="w-24 h-24 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin shadow-[0_0_40px_rgba(168,85,247,0.2)]" />
                                <div className="text-center relative z-10">
                                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.5em] mb-3 animate-pulse">Neural Mapping Active</p>
                                    <p className="text-slate-500 font-bold italic text-sm">Structuring cross-node logical connections...</p>
                                </div>
                            </motion.div>
                        ) : result ? (
                            <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25 }} className="space-y-10">
                                {/* Core Abstract */}
                                <div className="p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative group">
                                     <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                     <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5 relative z-10">
                                          <div className="flex items-center gap-4">
                                               <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                                    <BookOpen size={20} />
                                               </div>
                                               <div>
                                                    <h3 className="text-xl font-black text-white tracking-tight">Executive Abstract</h3>
                                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Protocol Result S1</p>
                                               </div>
                                          </div>
                                          <button className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all shadow-2xl active:scale-95">
                                               <Download size={18} />
                                          </button>
                                     </div>
                                     <p className="text-2xl md:text-3xl font-bold text-slate-200 italic leading-relaxed relative z-10">"{result.data.summary}"</p>
                                </div>

                                {/* Diagram Canvas */}
                                {result.data.mermaid_diagrams?.map((d, i) => (
                                    <div key={i} className="rounded-[4rem] bg-[#0F172A]/40 border border-white/5 overflow-hidden shadow-2xl relative group">
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 animate-[shimmer_2s_infinite]" />
                                        <div className="flex items-center justify-between px-12 py-8 border-b border-white/5 bg-white/[0.02]">
                                            <div className="flex items-center gap-4">
                                                <GitBranch size={20} className="text-purple-400" />
                                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">{d.type} Schema</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                 <div className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] font-black text-purple-400 uppercase tracking-widest">
                                                     Live Render
                                                 </div>
                                                 <Share2 size={16} className="text-slate-700 hover:text-white cursor-pointer transition-colors" />
                                            </div>
                                        </div>
                                        <div className="p-12 overflow-x-auto custom-scrollbar flex items-center justify-center min-h-[400px]">
                                            <Mermaid code={d.code} />
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[600px] rounded-[4rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-center opacity-30 shadow-inner">
                                <Network size={80} className="mb-10 text-slate-800" />
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-3">Awaiting Knowledge Matrix</h3>
                                <p className="text-xs font-bold italic max-w-xs leading-relaxed">Structural diagrams will materialize here after neural synchronization.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

