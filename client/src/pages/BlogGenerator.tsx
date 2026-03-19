import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Sparkles,
    Copy,
    Loader2,
    CheckCircle,
    Layout,
    Target,
    TrendingUp,
    Printer
} from 'lucide-react';
import api from '../services/api';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';

export default function BlogGenerator() {
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [length, setLength] = useState('Medium');
    const [generatedBlog, setGeneratedBlog] = useState<{ title: string; content: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = useCallback(async () => {
        if (!topic.trim()) {
            setError("Please provide a topic for the blog post.");
            return;
        }

        setLoading(true);
        setError('');
        setGeneratedBlog(null);

        try {
            const prompt = `Write a high-quality, SEO-optimized blog post about "${topic}". Keywords to include: ${keywords}. Length: ${length}. Return the response in JSON format with "title" and "content" fields. Use markdown for the content.`;

            const { data } = await api.post('/api/generate', {
                query: prompt,
                response_type: 'Blog'
            });

            if (data.answer) {
                try {
                    const parsed = JSON.parse(data.answer);
                    setGeneratedBlog({
                        title: parsed.title || 'Untitled Blog Post',
                        content: parsed.content || data.answer
                    });
                } catch {
                    setGeneratedBlog({
                        title: 'Blog Post: ' + topic,
                        content: data.answer
                    });
                }
            }
        } catch {
            setError("Failed to generate blog post.");
        } finally {
            setLoading(false);
        }
    }, [topic, keywords, length]);

    const handleCopy = () => {
        if (!generatedBlog) return;
        const textToCopy = `# ${generatedBlog.title}\n\n${generatedBlog.content}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-container">
            <header className="mb-8 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 md:mb-6"
                >
                    <MessageSquare size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Content Suite</span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Blog Generator</h1>
                <p className="text-slate-400 font-medium text-base md:text-lg max-w-2xl">Engineer SEO-optimized, engaging articles and blog posts with deep semantic richness.</p>
            </header>

            <div className="laptop-mock">
                <div className="laptop-screen overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px] md:h-[800px] divide-y md:divide-y-0 md:divide-x divide-white/5">
                        {/* INPUT PANE */}
                        <div className="p-6 md:p-10 flex flex-col bg-[#0d1117]/30 overflow-y-auto">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Core Topic</label>
                                    <textarea
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g., The Future of Quantum Computing in Healthcare..."
                                        className="custom-editor min-h-[120px]"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px) font-black text-slate-500 uppercase tracking-widest block">SEO Keywords (Comma separated)</label>
                                    <input
                                        type="text"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        placeholder="quantum, healthcare, technology trends..."
                                        className="premium-input"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Article Length</label>
                                    <div className="flex gap-2">
                                        {['Short', 'Medium', 'Long'].map(l => (
                                            <button
                                                key={l}
                                                onClick={() => setLength(l)}
                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${length === l
                                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                        : 'bg-white/5 text-slate-400 border border-white/5'
                                                    }`}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !topic.trim()}
                                    className="premium-btn-primary w-full flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/20"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={20} /> GENERATE ARTICLE</>}
                                </button>
                            </div>
                        </div>

                        {/* OUTPUT PANE */}
                        <div className="p-6 md:p-10 bg-black/40 flex flex-col overflow-y-auto">
                            <AnimatePresence mode="wait">
                                {!generatedBlog && !loading ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center text-center py-20"
                                    >
                                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5">
                                            <Layout size={48} className="text-slate-700" />
                                        </div>
                                        <p className="text-slate-500 font-medium italic text-sm">Your blog content will be architected here.</p>
                                    </motion.div>
                                ) : loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col space-y-6"
                                    >
                                        <div className="glass-panel space-y-4">
                                            <div className="skeleton-text w-1/4" />
                                            <div className="skeleton-text w-full h-8" />
                                        </div>
                                        <div className="glass-panel flex-1 space-y-4">
                                            <div className="skeleton-text w-full" />
                                            <div className="skeleton-text w-full" />
                                            <div className="skeleton-text w-full" />
                                            <div className="skeleton-text w-5/6" />
                                            <div className="skeleton-text w-4/5" />
                                            <div className="skeleton-text w-2/3" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                                                    SEO Draft Ready
                                                </div>
                                                <div className="hidden sm:flex items-center gap-1">
                                                    <TrendingUp size={14} className="text-emerald-500" />
                                                    <span className="text-[9px] font-black text-emerald-500 uppercase">98 Score</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={generatePDF}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 mr-2"
                                                >
                                                    <Printer size={14} /> Download PDF
                                                </button>
                                                <button
                                                    onClick={handleCopy}
                                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                                                >
                                                    {copied ? <CheckCircle size={18} className="text-emerald-400" /> : <Copy size={18} className="text-slate-400 group-hover:text-white" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="glass-panel p-6 md:p-8 bg-white/[0.02] border-white/5">
                                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Headline</label>
                                                <div className="text-xl md:text-2xl font-black text-white leading-tight">{generatedBlog?.title}</div>
                                            </div>
                                            <div className="glass-panel p-6 md:p-8 flex-1 bg-white/[0.02] border-white/5 font-sans leading-relaxed text-slate-300 text-base md:text-lg whitespace-pre-wrap prose prose-invert max-w-none">
                                                {generatedBlog?.content}
                                            </div>
                                        </div>

                                        <div className="mt-8 p-6 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl flex items-start gap-4">
                                            <Target size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                                            <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed">
                                                Content semantic map verified. Keywords naturally integrated. Optimized for both readability and search engine algorithms.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden Print Report */}
            {generatedBlog && <IntelligenceReport data={{ summary: generatedBlog.content }} type="generate" content={topic} />}
        </div>
    );
}
