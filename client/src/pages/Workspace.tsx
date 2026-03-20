import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wand2, ShieldCheck,
    Sparkles,
    RotateCcw, Copy,
    BarChart3, Activity,
    ShieldAlert, Network,
    Upload, Cpu
} from 'lucide-react';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';
import { VoiceInput } from '../components/VoiceInput';
import { Mermaid } from '../components/Mermaid';
import api from '../services/api';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';
import { Logo } from '../components/Logo';

/* ─── Types ─────────────────────────────────────────── */
interface PlagiarismData {
    score: number;
    verdict: string;
    explanation: string;
    suspicious_segments?: { sentence: string; reason: string }[];
}
interface TruthData {
    credibility_score: number;
    summary: string;
    claims: { verdict: string; confidence: number; claim: string; reasoning: string }[];
}
interface VisualizeData {
    summary: string;
    mermaid_diagrams?: { type: string; code: string }[];
}

interface ResultState {
    type: string;
    data: PlagiarismData | TruthData | VisualizeData | any;
}

export default function Workspace() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState<string | null>(null);
    const [result, setResult] = useState<ResultState | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    useEffect(() => {
        const timer = setTimeout(() => {
           window.dispatchEvent(new CustomEvent('typing_update', { 
             detail: { wpm: Math.round(wordCount / 2), suggestions: result ? ["Audit findings", "Export as PDF"] : ["Initialize analysis", "Check plagiarism"] } 
           }));
        }, 500);
        return () => clearTimeout(timer);
    }, [wordCount, result]);

    const runAction = useCallback(async (type: string) => {
        if (!content.trim() && type !== 'generate') {
            setError('Please supply content in the studio editor first.');
            return;
        }
        setLoading(type);
        setError('');

        try {
            let endpoint = '';
            let payload: { text?: string; query?: string; response_type?: string; type?: string } = {};

            switch (type) {
                case 'generate': endpoint = '/api/generate'; payload = { query: content, response_type: 'Full Article' }; break;
                case 'analyze': endpoint = '/api/analyze'; payload = { text: content }; break;
                case 'plagiarism': endpoint = '/api/plagiarism'; payload = { text: content }; break;
                case 'humanize': endpoint = '/api/humanize'; payload = { text: content }; break;
                case 'visualize': endpoint = '/api/ai/visualize'; payload = { text: content, type: 'flowchart' }; break;
            }

            const { data } = await api.post(endpoint, payload);
            
            if (['humanize', 'generate'].includes(type)) {
                const newText = data.data?.humanized_text || data.data?.answer || data.data?.text || content;
                setContent(newText);
                setResult(null);
            } else {
                setResult({ type, data: data.data || data });
            }
        } catch (err: any) {
            setError(err.response?.data?.error || `System failure in ${type} module.`);
        } finally {
            setLoading(null);
        }
    }, [content]);

    return (
        <div className="workspace-center-content">
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper">
                    {[
                        { key: 'generate', label: 'Produce', icon: Sparkles, color: 'text-indigo-400' },
                        { key: 'analyze', label: 'Audit', icon: ShieldAlert, color: 'text-blue-400' },
                        { key: 'plagiarism', label: 'Verify', icon: ShieldCheck, color: 'text-rose-400' },
                        { key: 'humanize', label: 'Naturalize', icon: Wand2, color: 'text-purple-400' },
                        { key: 'visualize', label: 'Structure', icon: Network, color: 'text-cyan-400' },
                    ].map((btn) => (
                        <button 
                          key={btn.key} 
                          onClick={() => runAction(btn.key)}
                          className={`modern-tool-btn transition-all ${loading === btn.key ? 'active scale-105' : ''}`}
                        >
                            <btn.icon size={20} className={btn.color} />
                            <span>{btn.label}</span>
                        </button>
                    ))}
                </div>

                <div className="smart-gpt-editor mt-8">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 px-4 opacity-50">
                        <div className="flex items-center gap-4">
                             <div className="flex items-center gap-2">
                                <Upload size={14} className="text-indigo-400 cursor-pointer" onClick={() => fileInputRef.current?.click()} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Global Studio Input</span>
                             </div>
                             <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                                 const f = e.target.files?.[0]; if(!f) return;
                                 const r = new FileReader(); r.onload=(ev) => setContent((ev.target?.result as string) || ''); r.readAsText(f);
                             }} />
                        </div>
                        <div className="flex items-center gap-4">
                            <VoiceInput onTranscription={(t) => setContent(prev => prev + ' ' + t)} />
                            <SmartProcessingToolbar onTextExtracted={setContent} />
                        </div>
                    </div>

                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        placeholder="Start typing your data or paste content here..."
                        className="custom-scrollbar"
                    />

                    <div className="flex items-center justify-between mt-6 px-6 opacity-30">
                        <span className="text-[9px] font-black uppercase tracking-widest">{wordCount} Words indexed</span>
                        <div className="flex gap-6">
                             <div className="cursor-pointer hover:text-white transition-colors flex items-center gap-2" onClick={() => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}>
                                {copied ? <span className="text-[9px] text-emerald-400">COPIED</span> : <Copy size={16} />}
                             </div>
                             <RotateCcw size={16} className="cursor-pointer hover:text-rose-400 transition-colors" onClick={() => { setContent(''); setResult(null); }} />
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex justify-center">
                            <span className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                                <BarChart3 size={14} /> {error}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <section className="output-bottom-area" id="ws-results">
                 <AnimatePresence mode="wait">
                    {!result && !loading ? (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                            <Logo variant="icon" className="w-16 h-16 text-slate-800 mb-8 grayscale" />
                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Neural Studio Inactive</p>
                        </motion.div>
                    ) : loading ? (
                        <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
                             <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-10" />
                             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">Establishing Logic Synchronization...</span>
                        </motion.div>
                    ) : (
                        <motion.div key="res" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 pb-20">
                             <div className="flex items-center justify-between px-2 opacity-80 border-b border-white/5 pb-8">
                                <div className="flex items-center gap-4">
                                     <Activity size={20} className="text-indigo-400" />
                                     <h3 className="text-[11px] font-black text-white uppercase tracking-widest italic">{result.type} Stream Manifested</h3>
                                </div>
                                <button onClick={() => generatePDF()} className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">Print Manifest</button>
                             </div>

                             {result.type === 'plagiarism' && <PlagiarismNode data={result.data as PlagiarismData} />}
                             {result.type === 'analyze' && <TruthNode data={result.data as TruthData} />}
                             {result.type === 'visualize' && <VisualizeNode data={result.data as VisualizeData} />}
                        </motion.div>
                    )}
                 </AnimatePresence>
            </section>

            {result && <IntelligenceReport data={result.data} type={result.type as 'plagiarism' | 'analyze' | 'generate' | 'humanize' | 'visualize' | 'general'} content={content} />}
        </div>
    );
}

function PlagiarismNode({ data }: { data: PlagiarismData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="modern-card p-10 flex flex-col items-center text-center bg-rose-500/5 border-rose-500/10">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Originality Spectrum</span>
                 <div className="text-6xl font-black text-rose-500 mb-4">{data.score}%</div>
                 <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">{data.verdict} Overlap</p>
            </div>
            <div className="modern-card md:col-span-2 p-10 bg-white/[0.01]">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 border-l-4 border-rose-500 pl-4">Audit Intelligence</h4>
                 <p className="text-xl text-slate-200 font-serif italic leading-relaxed">"{data.explanation}"</p>
            </div>
        </div>
    );
}

function TruthNode({ data }: { data: TruthData }) {
    return (
        <div className="space-y-10">
             <div className="modern-card bg-indigo-500/5 border-indigo-500/10 text-center py-16 px-10">
                 <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-4 block">Credibility Index Baseline</span>
                 <div className="text-8xl font-black text-white italic">{data.credibility_score}%</div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {data.claims.map((c, i) => (
                      <div key={i} className="modern-card p-8 border-white/5 hover:bg-white/[0.02]">
                          <div className="flex justify-between items-center mb-6">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${c.verdict === 'True' || c.verdict === 'Verified' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>{c.verdict}</span>
                              <div className="flex items-center gap-2">
                                  <Cpu size={14} className="text-indigo-400" />
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{c.confidence}% Confidence</span>
                              </div>
                          </div>
                          <p className="text-lg text-white font-serif italic mb-6 leading-snug">"{c.claim}"</p>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">{c.reasoning}</p>
                      </div>
                 ))}
             </div>
        </div>
    );
}

function VisualizeNode({ data }: { data: VisualizeData }) {
    return (
        <div className="space-y-12">
             <div className="modern-card p-10 bg-white/[0.01]">
                 <p className="text-xl text-slate-300 font-serif italic leading-relaxed">"{data.summary}"</p>
             </div>
             {data.mermaid_diagrams?.map((d, i) => (
                 <div key={i} className="modern-card bg-[#0D1117] p-12 overflow-x-auto custom-scrollbar shadow-2xl">
                     <Mermaid code={d.code} />
                 </div>
             ))}
        </div>
    );
}
