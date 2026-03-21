import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Zap, 
    Loader2, 
    Activity, 
    ShieldCheck, 
    Globe, 
    Cpu,
    ArrowRight,
    Info
} from 'lucide-react';
import api from '../services/api';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';

interface ResearchData {
    summary: string;
    sources: { title: string; url: string; credibility: number }[];
    insights: string[];
}

export default function Research() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ResearchData | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (result) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { 
                 wpm: 0, 
                 suggestions: ["Deepen source audit", "Synthesize findings", "Verify cross-nodes"] 
              } 
            }));
        }
    }, [result]);

    const runResearch = useCallback(async () => {
        if (!query.trim()) {
            setError('Neural query node required.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/api/ai/research', { query });
            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || 'Deep-spectrum scan failed.');
            }
        } catch (err: unknown) {
             const axiosError = err as { response?: { data?: { error?: string } } };
             setError(axiosError.response?.data?.error || 'System interrupt in Research module.');
        } finally {
            setLoading(false);
        }
    }, [query]);

    return (
        <div className="workspace-center-content">
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper mb-10">
                      <button className="modern-tool-btn active">
                         <Search size={20} className="text-cyan-400" />
                         <span>Neural Scan</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/workspace'}>
                         <Cpu size={20} className="text-indigo-400" />
                         <span>Studio Main</span>
                      </button>
                </div>

                <div className="smart-gpt-editor bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-6 px-4 opacity-40">
                         <div className="flex items-center gap-3">
                             <Globe size={16} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Open-Spectrum Query Node</span>
                         </div>
                         <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Global Sync Active</span>
                         </div>
                    </div>

                    <div className="relative group mb-10">
                         <Search className="absolute left-6 top-6 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={24} />
                         <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Initialize query for real-time intelligence gathering..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-20 pr-10 py-6 text-xl font-serif italic text-white outline-none focus:border-cyan-500/30 transition-all placeholder:text-slate-800"
                         />
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={runResearch}
                            disabled={loading || !query.trim()}
                            className="premium-btn-primary bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20 py-6 px-16 rounded-3xl group transition-all flex items-center gap-4"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="group-hover:rotate-45" />}
                            <span className="text-xs font-black uppercase tracking-[0.3em] font-sans">{loading ? 'Scanning Spectrum...' : 'Initiate Scan'}</span>
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center text-rose-500 text-[10px] font-black uppercase tracking-widest">
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <section className="output-bottom-area pb-20">
                 <AnimatePresence mode="wait">
                    {!result ? (
                         !loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                                <Search size={64} className="text-slate-800 mb-8 grayscale" />
                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.5em]">Spectrum Stream Empty</p>
                            </motion.div>
                         )
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                             <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                <div className="flex items-center gap-4">
                                     <Activity size={22} className="text-cyan-400" />
                                     <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">Intelligence Stream Manifested</h3>
                                </div>
                                <div className="flex gap-4">
                                     <button onClick={() => { navigator.clipboard.writeText(result.summary); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="px-6 py-2.5 bg-white/5 border border-white/5 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                                         {copied ? 'SYNCHRONIZED' : 'Sync to Neural Link'}
                                     </button>
                                     <button onClick={() => generatePDF()} className="px-6 py-2.5 bg-cyan-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/20">Capture Manifest</button>
                                </div>
                             </div>

                             <div className="modern-card p-12 bg-cyan-500/5 border-cyan-500/10">
                                  <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-10 border-l-4 border-cyan-500 pl-6">Core Intelligence Abstract</h4>
                                  <p className="text-3xl text-slate-200 font-serif italic leading-relaxed selection:bg-cyan-500/30">"{result.summary}"</p>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="modern-card p-10 bg-black/40 border-white/5">
                                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 flex items-center gap-4"><ShieldCheck size={18} className="text-cyan-400" /> Verified Spectrum Sources</h4>
                                      <div className="space-y-6">
                                          {result.sources.map((source, i) => (
                                              <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="block p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <span className="text-xs font-black text-white italic group-hover:text-cyan-400 transition-colors uppercase">{source.title}</span>
                                                       <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full">{source.credibility}% RATING</span>
                                                  </div>
                                                  <p className="text-[9px] font-bold text-slate-500 truncate lowercase tracking-widest italic">{source.url}</p>
                                              </a>
                                          ))}
                                      </div>
                                  </div>

                                  <div className="modern-card p-10 bg-black/40 border-white/5">
                                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 flex items-center gap-4"><Zap size={18} className="text-cyan-400" /> Secondary Insights</h4>
                                      <div className="space-y-4">
                                          {result.insights.map((insight, i) => (
                                              <div key={i} className="p-6 bg-white/5 border-l-4 border-cyan-500 rounded-r-2xl">
                                                  <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed">{insight}</p>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                             </div>

                             <div className="modern-card border-white/5 p-10 bg-cyan-500/5">
                                 <div className="flex items-start gap-6">
                                     <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                                         <Info size={24} className="text-cyan-400" />
                                     </div>
                                     <div>
                                         <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-3">Protocol Metadata</h5>
                                         <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">Broad-spectrum crawl completed across established neural indices. Findings are weight-rated by credibility protocols.</p>
                                     </div>
                                 </div>
                             </div>

                        </motion.div>
                    )}
                 </AnimatePresence>
            </section>

            {result && <IntelligenceReport data={result} type="general" content={query} />}
        </div>
    );
}
