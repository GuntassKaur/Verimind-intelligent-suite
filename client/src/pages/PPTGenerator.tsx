import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Presentation, Download, Loader2, Sparkles, Wand2, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../services/api';

export default function PPTGenerator() {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Neural topic required for PPT synthesis.');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data } = await api.post('/api/ai/ppt/generate', { topic });
            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || 'Failed to generate PPT.');
            }
        } catch (err) {
            setError('Neural link failure. Spectral sync interrupted.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <header className="mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 mb-8 backdrop-blur-md">
                    <Presentation size={14} className="text-purple-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-200">Neural Presentation Engine</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                   PPT <span className="text-gradient-premium italic">Architect.</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed italic">
                    "Synthesize high-fidelity slide manifests from raw conceptual nodes."
                </p>
            </header>

            <div className={`p-1.5 rounded-[3rem] border bg-white/5 border-white/5 shadow-2xl max-w-4xl mx-auto mb-20 focus-within:border-purple-500/30 transition-all`}>
                <div className="bg-[#0b0f1a] rounded-[2.8rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
                    <div className="p-5 rounded-2xl bg-purple-600/10 text-purple-400 border border-purple-500/20">
                        <Wand2 size={24} />
                    </div>
                    <input 
                        type="text" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter presentation topic (e.g. Future of Quantum Computing)"
                        className="flex-1 bg-transparent border-none outline-none text-xl md:text-2xl font-bold text-white placeholder:text-slate-700"
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className="px-12 py-5 rounded-[2rem] premium-btn-primary shadow-2xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        {loading ? 'Synthesizing...' : 'Architect'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="max-w-2xl mx-auto mb-10 p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold text-center">
                    {error}
                </div>
            )}

            <AnimatePresence>
                {result && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto space-y-12"
                    >
                        <div className="glass-card glow-border p-12 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">Manifest Synthesized</h3>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Status: Stable</p>
                                    </div>
                                </div>
                                <a 
                                    href={import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${result.ppt_url}` : `http://localhost:5000${result.ppt_url}`}
                                    download
                                    className="px-10 py-4 bg-white text-[#0b0f1a] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                                >
                                    <Download size={16} /> Download .pptx
                                </a>
                            </div>

                            <div className="space-y-6">
                                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">Structural Outline</span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {result.slides.map((slide: any, i: number) => (
                                        <div key={i} className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all group">
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <span className="text-xs font-black text-slate-200 group-hover:text-white transition-colors">{slide.title}</span>
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">S{i+1}</span>
                                            </div>
                                            <ul className="space-y-2">
                                                {slide.content.map((point: string, pi: number) => (
                                                    <li key={pi} className="flex gap-2 text-[10px] text-slate-500 font-medium">
                                                        <ChevronRight size={10} className="mt-0.5 text-purple-500" />
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
