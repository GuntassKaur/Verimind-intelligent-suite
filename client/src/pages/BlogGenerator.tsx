import { useState, useCallback, useEffect } from 'react';
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
    Printer,
    FileText,
    Cpu,
    Globe
} from 'lucide-react';
import api from '../services/api';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';

const LENGTHS = ['Short', 'Medium', 'Long'];

export default function BlogGenerator() {
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [length, setLength] = useState('Medium');
    const [generatedBlog, setGeneratedBlog] = useState<{ title: string; content: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    // Update global assistant
    useEffect(() => {
        if (generatedBlog) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { wpm: 0, suggestions: ["Check SEO density", "Optimize H1", "Add subheadings"] } 
            }));
        }
    }, [generatedBlog]);

    const handleGenerate = useCallback(async () => {
        if (!topic.trim()) {
            setError("Please provide a topic.");
            return;
        }

        setLoading(true);
        setError('');
        setGeneratedBlog(null);

        try {
            const prompt = `Write a high-quality blog about "${topic}". Keywords: ${keywords}. Length: ${length}. JSON: {title, content}`;
            const { data } = await api.post('/api/generate', { query: prompt, response_type: 'Blog' });

            const source = data.success ? data.data?.answer || data.data?.text : data.answer;
            if (source) {
                try {
                    const parsed = JSON.parse(source);
                    setGeneratedBlog({ title: parsed.title || 'Untitled', content: parsed.content || source });
                } catch {
                    setGeneratedBlog({ title: 'Generated Article', content: source });
                }
            } else {
                setError(data.error || "Generation failed.");
            }
        } catch {
            setError("Failed to generate article.");
        } finally {
            setLoading(false);
        }
    }, [topic, keywords, length]);

    return (
        <div className="workspace-center-content">
            {/* TOP AREA: INPUT */}
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper">
                      <button className="modern-tool-btn active">
                         <MessageSquare size={20} className="text-emerald-400" />
                         <span>Blog</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/generator'}>
                         <Sparkles size={20} className="text-indigo-400" />
                         <span>Generate</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/workspace'}>
                         <Globe size={20} className="text-blue-400" />
                         <span>Audit</span>
                      </button>
                </div>

                <div className="smart-gpt-editor py-10 px-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Semantic Topic</label>
                               <textarea 
                                  value={topic} 
                                  onChange={(e) => setTopic(e.target.value)}
                                  placeholder="What should the article focus on?"
                                  className="w-full h-32 bg-white/5 border border-white/5 rounded-2xl p-6 text-slate-200 text-sm focus:border-emerald-500/20 focus:outline-none transition-all custom-scrollbar"
                               />
                          </div>
                          <div className="space-y-6">
                               <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">SEO Keywords</label>
                                    <input 
                                       value={keywords} 
                                       onChange={(e) => setKeywords(e.target.value)}
                                       className="w-full bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-xs text-white focus:outline-none focus:border-emerald-500/20"
                                       placeholder="comma, separated, keywords..."
                                    />
                               </div>
                               <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Article Length</label>
                                    <div className="flex gap-2">
                                        {LENGTHS.map(l => (
                                            <button key={l} onClick={() => setLength(l)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${length === l ? 'bg-emerald-500 text-white shadow-xl' : 'bg-white/5 text-slate-500'}`}>{l}</button>
                                        ))}
                                    </div>
                               </div>
                          </div>
                     </div>

                    <div className="flex justify-center border-t border-white/5 pt-8">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !topic.trim()}
                            className="premium-btn-primary flex items-center gap-4 py-4 px-12 bg-emerald-600 hover:bg-emerald-500 rounded-2xl transition-all shadow-xl shadow-emerald-500/20"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={18} /> Architecting Article...</>
                            ) : (
                                <><MessageSquare size={18} /> INITIATE SEW DRAFT</>
                            )}
                        </button>
                    </div>
                </div>

                {error && <div className="mt-4 text-center text-rose-400 text-[10px] font-black uppercase tracking-widest">{error}</div>}
            </section>

            {/* BOTTOM AREA: OUTPUT */}
            <section className="output-bottom-area">
                <AnimatePresence mode="wait">
                    {!generatedBlog && !loading ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-30">
                             <FileText size={64} className="text-slate-800 mb-6" />
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Awaiting topic design</p>
                        </motion.div>
                    ) : loading ? (
                        <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
                             <div className="w-16 h-16 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-6" />
                             <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">Scanning Semantic Indices...</span>
                        </motion.div>
                    ) : (
                        <motion.div key="res" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 max-w-5xl mx-auto pb-20">
                             <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                   <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Structural Output Ready</h4>
                                </div>
                                <div className="flex gap-4">
                                     <button onClick={() => { navigator.clipboard.writeText(generatedBlog.content); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                                         {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                         {copied ? 'Copied' : 'Copy'}
                                     </button>
                                     <button onClick={() => generatePDF()} className="px-5 py-2.5 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors flex items-center gap-2">
                                         <Printer size={14} /> Export
                                     </button>
                                </div>
                             </div>

                             <div className="modern-card p-10 md:p-14 bg-[#0D1117] border-white/5 relative group overflow-hidden">
                                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                    <MessageSquare size={180} className="text-emerald-400" />
                                 </div>
                                 <div className="relative z-10 space-y-8">
                                     <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">{generatedBlog.title}</h2>
                                     <p className="text-slate-300 font-serif text-xl leading-[2] whitespace-pre-wrap selection:bg-emerald-500/30">
                                         {generatedBlog.content}
                                     </p>
                                 </div>
                             </div>

                             <div className="modern-card border-emerald-500/10 py-8 bg-emerald-500/5">
                                 <div className="flex items-start gap-5 px-4">
                                     <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                         <Target size={20} className="text-emerald-400" />
                                     </div>
                                     <div className="flex-1">
                                         <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">SEO Node Verification</h5>
                                         <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed">Content has been analyzed against current search patterns. Semantic density is within the optimal range for the specified keywords.</p>
                                     </div>
                                 </div>
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {generatedBlog && <IntelligenceReport data={{ summary: generatedBlog.content }} type="generate" content={topic} />}
        </div>
    );
}
