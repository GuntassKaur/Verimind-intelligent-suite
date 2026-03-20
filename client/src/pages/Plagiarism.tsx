import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Loader2, AlertTriangle, CheckCircle2, Search, Printer, Cpu, Activity, Zap, Info } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';
import { VoiceInput } from '../components/VoiceInput';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';

interface SuspiciousSegment {
    sentence: string;
    reason: string;
    risk: string;
}

interface PlagiarismResult {
    score: number;
    verdict: string;
    suspicious_segments: SuspiciousSegment[];
    explanation: string;
}

export default function Plagiarism() {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PlagiarismResult | null>(null);
    const [error, setError] = useState('');

    // Update global assistant
    useEffect(() => {
        if (result) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { 
                wpm: 0, 
                suggestions: result.score > 20 ? ["Run Humanizer", "Rewrite flagged segments", "Check citations"] : ["Originality verified", "Ready for publication"],
                tips: [`Similarity: ${result.score}%`, `Verdict: ${result.verdict} Risk`]
              } 
            }));
        }
    }, [result]);

    const handleScan = useCallback(async () => {
        if (!text.trim()) {
            setError("Please provide content to scan.");
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data } = await api.post('/api/plagiarism', { text });
            if (data.success) {
                setResult(data.data);
            } else {
                setResult(data); // Fallback if data is already the structure
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Connection failed.");
        } finally {
            setLoading(false);
        }
    }, [text]);

    const handleHumanize = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const { data } = await api.post('/api/humanize', { text, tone: "Professional" });
            const newText = data.success ? data.data?.humanized_text : (data.humanized_text || data);
            setText(newText);
            const scan = await api.post('/api/plagiarism', { text: newText });
            setResult(scan.data.success ? scan.data.data : scan.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="workspace-center-content">
            {/* TOP AREA: INPUT */}
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper">
                      <button className="modern-tool-btn active">
                         <Shield size={20} className="text-rose-400" />
                         <span>Audit</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/workspace'}>
                         <Cpu size={20} className="text-blue-400" />
                         <span>Studio</span>
                      </button>
                </div>

                <div className="smart-gpt-editor">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 px-4 opacity-50">
                        <div className="flex items-center gap-2">
                             <Shield size={14} className="text-rose-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Originality Lab v4.1</span>
                        </div>
                        <div className="flex items-center gap-4">
                             <SmartProcessingToolbar onTextExtracted={setText} />
                        </div>
                    </div>
                    
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste content to verify for semantic overlaps..."
                        className="custom-scrollbar"
                    />

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleScan}
                            disabled={loading || !text.trim()}
                            className="premium-btn-primary flex items-center gap-4 py-4 px-10 rounded-2xl group transition-all"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={18} /> Deep Neural Scan...</>
                            ) : (
                                <><Shield size={18} className="group-hover:scale-125 transition-transform" /> INITIATE AUDIT</>
                            )}
                        </button>
                    </div>
                </div>

                {error && <div className="mt-4 text-center text-rose-400 text-[10px] font-black uppercase tracking-widest">{error}</div>}
            </section>

            {/* BOTTOM AREA: OUTPUT */}
            <section className="output-bottom-area">
                <AnimatePresence mode="wait">
                    {!result && !loading ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-30">
                             <Search size={64} className="text-slate-800 mb-6" />
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Awaiting scan initiation</p>
                        </motion.div>
                    ) : loading ? (
                        <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
                             <div className="w-16 h-16 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-6" />
                             <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest animate-pulse">Establishing Semantic Baseline...</span>
                        </motion.div>
                    ) : (
                        <motion.div key="res" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 max-w-5xl mx-auto pb-20">
                             <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                <div className="flex items-center gap-4">
                                   <div className={`w-2 h-2 rounded-full ${result.score > 20 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
                                   <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Diagnostic Report Prepared</h4>
                                </div>
                                <div className="flex gap-4">
                                     {result.score > 10 && (
                                         <button onClick={handleHumanize} className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all">Auto-Refactor</button>
                                     )}
                                     <button onClick={() => generatePDF()} className="px-5 py-2.5 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20 flex items-center gap-2">
                                         <Printer size={14} /> Export
                                     </button>
                                </div>
                             </div>

                             {/* SCORE CARDS */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className={`modern-card p-10 flex flex-col items-center justify-center border-${result.score > 20 ? 'rose' : 'emerald'}-500/10 bg-${result.score > 20 ? 'rose' : 'emerald'}-500/5`}>
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Similarity Entropy</span>
                                       <div className={`text-5xl font-black ${result.score > 20 ? 'text-rose-500' : 'text-emerald-400'}`}>{result.score}%</div>
                                  </div>
                                  <div className={`modern-card p-10 flex flex-col items-center justify-center border-${result.verdict === 'Low' ? 'emerald' : 'rose'}-500/10 bg-${result.verdict === 'Low' ? 'emerald' : 'rose'}-500/5`}>
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Neural Verdict</span>
                                       <div className={`text-2xl font-black ${result.verdict === 'Low' ? 'text-emerald-400' : 'text-rose-500'}`}>{result.verdict} RISK</div>
                                  </div>
                             </div>

                             <div className="modern-card p-10 md:p-12 bg-white/[0.02]">
                                 <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                     <Activity size={16} /> Semantic Logic
                                 </h5>
                                 <p className="text-slate-300 font-medium leading-relaxed italic">"{result.explanation}"</p>
                             </div>

                             {result.suspicious_segments?.length > 0 && (
                                 <div className="space-y-6">
                                     <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-widest pl-2">Anomalous Segments Detected</h5>
                                     <div className="grid grid-cols-1 gap-4">
                                         {result.suspicious_segments.map((seg, i) => (
                                             <div key={i} className="modern-card p-6 border-rose-500/10 bg-rose-500/[0.03] group relative overflow-hidden">
                                                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
                                                 <p className="text-slate-200 font-medium mb-3 italic">"{seg.sentence}"</p>
                                                 <div className="flex items-center gap-2 text-[10px] font-black text-rose-400 uppercase tracking-widest">
                                                     <AlertTriangle size={12} /> {seg.reason}
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {result && <IntelligenceReport data={result} type="plagiarism" content={text} />}
        </div>
    );
}
