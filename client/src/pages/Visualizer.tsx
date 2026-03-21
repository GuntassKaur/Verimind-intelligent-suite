import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Network, Share2, 
    Loader2, 
    Layers, Cpu,
    History,
    Activity,
    Info
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

export default function Visualizer() {
    const [content, setContent] = useState('');
    const [type, setType] = useState('flowchart');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ResultState | null>(null);
    const [error, setError] = useState('');

    // Right side Assistant bridge
    useEffect(() => {
        if (result) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { 
                 wpm: 0, 
                 suggestions: ["Refine visualization", "Export as SVG", "Alter logic structure"] 
              } 
            }));
        }
    }, [result]);

    const runVisualize = useCallback(async () => {
        if (!content.trim()) {
            setError('Please provide studio input to visualize.');
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
             setError(axiosError.response?.data?.error || 'System interrupt in visualization module.');
        } finally {
            setLoading(false);
        }
    }, [content, type]);

    return (
        <div className="workspace-center-content">
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper mb-10">
                      <button className="modern-tool-btn active">
                         <Network size={20} className="text-cyan-400" />
                         <span>Structure Engine</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/workspace'}>
                         <Cpu size={20} className="text-indigo-400" />
                         <span>Studio Main</span>
                      </button>
                </div>

                <div className="smart-gpt-editor bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-6 px-4 opacity-40">
                         <div className="flex items-center gap-3">
                             <Layers size={16} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Structural Core Input</span>
                         </div>
                         <div className="flex gap-4">
                              {['flowchart', 'sequence', 'mindmap'].map((t) => (
                                  <button key={t} onClick={() => setType(t)} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${type === t ? 'bg-indigo-500 border-indigo-500 text-white shadow-xl shadow-indigo-500/30' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'}`}>{t}</button>
                              ))}
                         </div>
                    </div>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter complex text to be visually structured into logic flows..."
                        className="custom-scrollbar h-[250px]"
                    />

                    <div className="flex justify-center mt-8 gap-4">
                        <button
                            onClick={runVisualize}
                            disabled={loading || !content.trim()}
                            className="premium-btn-primary flex items-center gap-4 py-5 px-12 rounded-3xl group shadow-2xl transition-all"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={20} /> SYNCHRONIZING...</>
                            ) : (
                                <><Share2 size={20} className="group-hover:rotate-45" /> GENERATE STRUCTURE</>
                            )}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center text-rose-400 text-[10px] font-black tracking-widest uppercase">
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <section className="output-bottom-area" id="visual-results">
                 <AnimatePresence mode="wait">
                    {!result ? (
                         !loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                                <Activity size={64} className="text-slate-800 mb-8 grayscale" />
                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.5em]">No Structure Rendered</p>
                            </motion.div>
                         )
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                             <div className="flex items-center justify-between border-b border-white/5 pb-8 opacity-80">
                                <div className="flex items-center gap-4">
                                     <Activity size={22} className="text-indigo-400" />
                                     <h3 className="text-[14px] font-black text-white uppercase tracking-[0.2em] italic">Structural Manifest Manifested</h3>
                                </div>
                                <div className="flex items-center gap-4">
                                     <button onClick={() => generatePDF()} className="px-8 py-3 bg-indigo-600 border border-indigo-500/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30">Capture Diagram</button>
                                </div>
                             </div>

                             <div className="modern-card p-12 bg-white/[0.01] border-white/5">
                                  <div className="flex items-start gap-8">
                                       <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                            <History size={24} className="text-indigo-400" />
                                       </div>
                                       <div>
                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Core Interpretation Abstract</h4>
                                            <p className="text-2xl text-slate-200 font-serif italic leading-relaxed selection:bg-indigo-500/20">"{result.data.summary}"</p>
                                       </div>
                                  </div>
                             </div>

                             <div className="space-y-10">
                                  {result.data.mermaid_diagrams?.map((diagram, idx) => (
                                      <div key={idx} className="modern-card bg-black/40 border-white/5 p-12 overflow-x-auto custom-scrollbar group relative transition-all hover:bg-black/60 shadow-2xl">
                                           <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                               {diagram.type || 'Structure Node'}
                                           </div>
                                           <div className="p-10">
                                               <Mermaid code={diagram.code} />
                                           </div>
                                      </div>
                                  ))}
                             </div>

                             <div className="modern-card border-white/5 p-10 bg-indigo-500/5">
                                 <div className="flex items-start gap-6">
                                     <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                         <Info size={24} className="text-indigo-400" />
                                     </div>
                                     <div>
                                         <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-3">Structural Protocol</h5>
                                         <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">The visual architecture has been synthesized using Mermaid logic. If the diagram is complex, use the Capture feature for a high-fidelity snapshot.</p>
                                     </div>
                                 </div>
                             </div>
                        </motion.div>
                    )}
                 </AnimatePresence>
            </section>

            {result && <IntelligenceReport data={result.data} type="visualize" content={content} />}
        </div>
    );
}
