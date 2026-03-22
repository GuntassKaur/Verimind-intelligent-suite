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
    BookOpen
} from 'lucide-react';
import api from '../services/api';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';
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
    { key: 'flowchart', label: 'Flowchart', icon: GitBranch },
    { key: 'mindmap',   label: 'Mind Map',  icon: Network },
    { key: 'timeline',  label: 'Timeline',  icon: BarChart3 },
    { key: 'summary',   label: 'Summary',   icon: BookOpen },
];

export default function Visualizer() {
    const [content, setContent] = useState('');
    const [type, setType] = useState('flowchart');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ResultState | null>(null);
    const [error, setError] = useState('');

    const runVisualize = useCallback(async () => {
        if (!content.trim()) {
            setError('Please provide text to visualize.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/api/ai/visualize', { text: content, type });
            if (data.success) {
                setResult({ type: 'visualize', data: data.data });
            } else {
                setError(data.error || 'Visualization failed.');
            }
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { error?: string } } };
            setError(axiosError.response?.data?.error || 'Visualizer module offline. Check backend connection.');
        } finally {
            setLoading(false);
        }
    }, [content, type]);

    return (
        <div className="max-w-5xl mx-auto py-16 px-6 lg:px-12 space-y-12">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-purple-50 border border-purple-100 px-6 py-2.5 rounded-full mb-6">
                    <Network size={16} className="text-purple-500" />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-purple-600">Brain Map · Knowledge Visualizer</span>
                </div>
                <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-4">Visual <span className="text-gradient">Intelligence</span>.</h1>
                <p className="text-slate-500 font-medium max-w-xl mx-auto">Transform complex text into beautiful, structured knowledge maps—flowcharts, mind maps, and timelines in seconds.</p>
            </div>

            {/* Input Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(168,85,247,0.08)] p-10">
                {/* Diagram Type Selector */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {DIAGRAM_TYPES.map((d) => (
                        <button
                            key={d.key}
                            onClick={() => setType(d.key)}
                            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border font-bold text-sm transition-all ${
                                type === d.key
                                    ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm'
                                    : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200'
                            }`}
                        >
                            <d.icon size={16} />
                            {d.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-50">
                    <FileText size={16} className="text-slate-300" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Input Text · Paste any content to visualize</span>
                    <div className="ml-auto flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Ready</span>
                    </div>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your text here — VeriMind will generate a structured visual diagram..."
                    className="w-full h-56 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-purple-300 focus:shadow-[0_0_0_4px_rgba(168,85,247,0.06)] transition-all placeholder:text-slate-300 resize-none"
                />

                <div className="flex items-center justify-between mt-6">
                    <span className="text-[11px] text-slate-400 font-medium">{content.trim().split(/\s+/).filter(Boolean).length} words</span>
                    <button
                        onClick={runVisualize}
                        disabled={loading || !content.trim()}
                        className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:scale-110 transition-transform" />}
                        <span>{loading ? 'Generating...' : 'Generate Visual'}</span>
                        {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                            <span className="text-[12px] font-semibold text-rose-600">{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2.5rem] border border-slate-100 p-20 flex flex-col items-center gap-8">
                        <div className="w-20 h-20 border-4 border-purple-100 border-t-purple-500 rounded-full animate-spin" />
                        <div className="text-center">
                            <p className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Mapping Knowledge</p>
                            <p className="text-xs text-slate-400 font-medium">Structuring logical connections...</p>
                        </div>
                    </motion.div>
                )}

                {result && !loading && (
                    <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25 }} className="space-y-8">
                        {/* Summary */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft p-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Network size={20} className="text-purple-500" />
                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Knowledge Summary</h3>
                                </div>
                                <button onClick={() => generatePDF()} className="px-6 py-3 bg-purple-50 border border-purple-100 text-purple-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-purple-100 transition-all">Export PDF</button>
                            </div>
                            <p className="text-2xl font-serif font-light text-slate-600 italic leading-relaxed">"{result.data.summary}"</p>
                        </div>

                        {/* Diagrams */}
                        {result.data.mermaid_diagrams?.map((d, i) => (
                            <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
                                <div className="flex items-center justify-between px-10 py-6 border-b border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <GitBranch size={18} className="text-purple-500" />
                                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">{d.type} Diagram</span>
                                    </div>
                                    <div className="px-4 py-1.5 bg-purple-50 border border-purple-100 rounded-full">
                                        <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">VeriMind Brain Map</span>
                                    </div>
                                </div>
                                <div className="p-8 overflow-x-auto">
                                    <Mermaid code={d.code} />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {result && <IntelligenceReport data={result.data} type="visualize" content={content} />}
        </div>
    );
}
