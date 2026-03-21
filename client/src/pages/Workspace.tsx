import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wand2, ShieldCheck,
    Sparkles,
    RotateCcw, Copy,
    Activity,
    ShieldAlert, Network,
    Upload, Cpu,
    Zap, Shield, Search,
    ArrowRight
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
interface GeneralData {
    answer?: string;
    humanized_text?: string;
    text?: string;
}

interface ResultState {
    type: string;
    data: PlagiarismData | TruthData | VisualizeData | GeneralData | any;
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
            setError(`Please supply content for your ${type} node to initialize.`);
            return;
        }
        setLoading(type);
        setError('');

        try {
            let endpoint = '';
            let payload: { text?: string; query?: string; prompt?: string; response_type?: string; type?: string } = {};

            switch (type) {
                case 'generate': endpoint = '/api/ai/generate'; payload = { prompt: content || 'Generate an executive study about neural synthesis.' }; break;
                case 'analyze': endpoint = '/api/ai/analyze'; payload = { text: content }; break;
                case 'plagiarism': endpoint = '/api/ai/plagiarism/check'; payload = { text: content }; break;
                case 'humanize': endpoint = '/api/ai/humanize'; payload = { text: content }; break;
                case 'visualize': endpoint = '/api/ai/visualize'; payload = { text: content, type: 'flowchart' }; break;
            }

            const { data } = await api.post(endpoint, payload);
            
            if (data.success) {
                setResult({ type, data: data.data || data });
            } else {
                setError(data.error || `Synthesis protocol rejected. Please verify backend synchronization.`);
            }

        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { error?: string } } };
            setError(axiosError.response?.data?.error || `Nexus Interrupted: ${type.toUpperCase()} module failing. Ensure Render backend is fully synchronized with latest push.`);
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
                          className={`modern-tool-btn transition-all ${loading === btn.key ? 'active scale-105 shadow-xl shadow-white/5' : ''}`}
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
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Global Studio Input Node</span>
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
                        className="custom-scrollbar h-[300px]"
                    />

                    <div className="flex items-center justify-between mt-6 px-6 opacity-30">
                        <span className="text-[9px] font-black uppercase tracking-widest">{wordCount} Words indexed and cached</span>
                        <div className="flex gap-6">
                             <div className="cursor-pointer hover:text-white transition-colors flex items-center gap-2" onClick={() => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}>
                                {copied ? <span className="text-[9px] text-emerald-400">MANIFEST COPIED</span> : <Copy size={16} />}
                             </div>
                             <RotateCcw size={16} className="cursor-pointer hover:text-rose-400 transition-colors" onClick={() => { setContent(''); setResult(null); }} />
                        </div>
                    </div>
                </div>

                {error && <div className="mt-4 text-center text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-500/20 py-4 rounded-xl bg-rose-500/5">{error}</div>}
            </section>

            <section className="output-bottom-area" id="ws-results">
                 <AnimatePresence mode="wait">
                    {!result && !loading ? (
                         <div className="space-y-16 pt-10">
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-2 text-center opacity-40">
                                <Logo variant="icon" className="w-16 h-16 text-slate-800 mb-8 grayscale" />
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Integrated Intelligence Dashboard Manifested</p>
                            </motion.div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
                                <IntelligenceNode 
                                   img="/assets/graphics/verification_intelligence.png" 
                                   title="Truth Engine" 
                                   label="AUDIT" 
                                   desc="High-fidelity claim verification and semantic truth audit for broad spectrum data."
                                   icon={ShieldAlert}
                                   color="text-indigo-400"
                                   onClick={() => runAction('analyze')}
                                />
                                <IntelligenceNode 
                                   img="/assets/graphics/plagiarism_radar.png" 
                                   title="Plagiarism Radar" 
                                   label="VERIFY" 
                                   desc="Deep-spectrum scanning for duplicate text nodes and semantic overlaps."
                                   icon={ShieldCheck}
                                   color="text-rose-400"
                                   onClick={() => runAction('plagiarism')}
                                />
                                <IntelligenceNode 
                                   img="/assets/graphics/writing_dna.png" 
                                   title="Writing DNA" 
                                   label="ANALYZE" 
                                   desc="Linguistic style analysis and unique stylus identification nodes."
                                   icon={Search}
                                   color="text-emerald-400"
                                   onClick={() => runAction('humanize')}
                                />
                            </div>
                         </div>
                    ) : loading ? (
                        <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
                             <div className="w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin mb-10 shadow-2xl shadow-indigo-500/20" />
                             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse font-sans">Logic Synchronization and Neural Analysis Active...</span>
                        </motion.div>
                    ) : (
                        <motion.div key="res" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 pb-20">
                             <div className="flex items-center justify-between px-2 opacity-80 border-b border-white/5 pb-8">
                                <div className="flex items-center gap-4">
                                     <Activity size={20} className="text-indigo-400" />
                                     <h3 className="text-[11px] font-black text-white uppercase tracking-widest italic">{result?.type?.toUpperCase()} Manifest Successfully Synced</h3>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => { setContent(result.data?.answer || result.data?.humanized_text || result.data?.text || ''); setResult(null); }} className="px-6 py-2.5 bg-white/5 border border-white/5 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-indigo-400 transition-all font-sans">Import to Studio</button>
                                    <button onClick={() => generatePDF()} className="px-6 py-2.5 bg-indigo-600 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 font-sans">Export Record</button>
                                </div>
                             </div>

                             {result?.type === 'plagiarism' && <PlagiarismNode data={result.data as PlagiarismData} />}
                             {result?.type === 'analyze' && <TruthNode data={result.data as TruthData} />}
                             {result?.type === 'visualize' && <VisualizeNode data={result.data as VisualizeData} />}
                             {(result?.type === 'generate' || result?.type === 'humanize') && (
                                 <div className="modern-card p-16 bg-white/[0.02] border-white/10 relative group shadow-2xl overflow-hidden">
                                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                         <Logo variant="icon" className="w-80 h-80" />
                                     </div>
                                     <div className="prose prose-invert max-w-none relative z-10">
                                         <p className="text-2xl font-serif italic text-slate-200 leading-relaxed font-light">
                                             "{result.data?.answer || result.data?.humanized_text || result.data?.text}"
                                         </p>
                                     </div>
                                 </div>
                             )}
                        </motion.div>
                    )}
                 </AnimatePresence>
            </section>

            {result && <IntelligenceReport data={result.data} type={result.type as 'plagiarism' | 'analyze' | 'generate' | 'humanize' | 'visualize' | 'general'} content={content} />}
        </div>
    );
}

function IntelligenceNode({ img, title, label, desc, icon: Icon, color, onClick }: any) {
    return (
        <motion.div 
           whileHover={{ scale: 1.02, y: -8 }} 
           onClick={onClick}
           className="modern-card p-0 overflow-hidden bg-white/[0.01] border-white/5 group border hover:border-white/15 transition-all cursor-pointer shadow-lg hover:shadow-2xl"
        >
            <div className="h-48 overflow-hidden relative">
                <img 
                    src={img} 
                    alt={title} 
                    className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-100 transition-opacity" />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/80 backdrop-blur-md rounded-full border border-white/10">
                    <span className={`text-[8px] font-black uppercase tracking-[0.3em] font-sans ${color}`}>{label} NODE</span>
                </div>
            </div>
            <div className="p-10 relative">
                <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all ${color} group-hover:bg-white/10`}>
                         <Icon size={22} className="transition-transform group-hover:scale-110" />
                    </div>
                    <div>
                         <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic mb-1 font-sans">{title}</h4>
                         <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest font-sans">Operational Spectrum Active</span>
                    </div>
                </div>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest leading-relaxed uppercase selection:bg-indigo-500/30 line-clamp-2">{desc}</p>
                <div className="mt-8 flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-indigo-400/40 group-hover:text-indigo-400 transition-all">
                    <span className="font-sans">Initialize Neural Scan</span>
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
            </div>
        </motion.div>
    );
}

function PlagiarismNode({ data }: { data: PlagiarismData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="modern-card p-12 flex flex-col items-center text-center bg-rose-500/5 border-rose-500/15 shadow-xl">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 font-sans">OVERLAP SPECTRUM BASELINE</span>
                 <div className="text-8xl font-black text-rose-500 mb-6 italic tracking-tighter">{data.score}%</div>
                 <div className="px-10 py-3 bg-rose-500/10 rounded-full border border-rose-500/20">
                     <p className="text-[10px] text-rose-400 font-black uppercase tracking-[0.4em] font-sans">{data.verdict} BREACH</p>
                 </div>
            </div>
            <div className="modern-card md:col-span-2 p-14 bg-white/[0.01] border-white/10 shadow-xl">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-12 border-l-4 border-rose-500 pl-8 font-sans">INTELLIGENCE AUDIT MANIFEST</h4>
                 <p className="text-2xl text-slate-200 font-serif italic leading-relaxed font-light">"{data.explanation}"</p>
                 <div className="mt-12 flex items-center gap-4 py-8 border-t border-white/5 opacity-50">
                      <Zap size={18} className="text-rose-400" />
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] font-sans">VERIMIND PROTOCOL: SEMANTIC FINGERPRINT COMPARE 4.8</span>
                 </div>
            </div>
        </div>
    );
}

function TruthNode({ data }: { data: TruthData }) {
    return (
        <div className="space-y-12">
             <div className="modern-card bg-indigo-500/5 border-indigo-500/15 text-center py-24 px-10 relative overflow-hidden group shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                 <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.7em] mb-8 block relative z-10 font-sans">CREDIBILITY INDEX BASELINE SPECTRUM</span>
                 <div className="text-9xl font-black text-white italic tracking-tighter relative z-10 selection:bg-indigo-500/50">{data.credibility_score}%</div>
                 <div className="mt-10 relative z-10 opacity-40">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] font-sans">Neural Confidence Interval: +/- 0.04 percent</span>
                 </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {data.claims.map((c, i) => (
                      <div key={i} className="modern-card p-12 border-white/10 hover:bg-white/[0.03] transition-all shadow-xl">
                          <div className="flex justify-between items-center mb-12">
                               <div className="flex items-center gap-6">
                                   <div className={`w-3.5 h-3.5 rounded-full animate-pulse shadow-glow ${c.verdict === 'True' || c.verdict === 'Verified' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-rose-400 shadow-rose-400/50'}`} />
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] font-sans">{c.verdict} NODE</span>
                               </div>
                              <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-lg border border-white/5">
                                  <Cpu size={14} className="text-indigo-400" />
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic font-sans">{c.confidence}% CONFIDENCE</span>
                              </div>
                          </div>
                          <p className="text-2xl text-white font-serif italic mb-12 leading-tight font-medium">"{c.claim}"</p>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-white/10 pl-10">{c.reasoning}</p>
                      </div>
                 ))}
             </div>
        </div>
    );
}

function VisualizeNode({ data }: { data: VisualizeData }) {
    return (
        <div className="space-y-16">
             <div className="modern-card p-16 bg-white/[0.01] border-white/10 shadow-2xl">
                 <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-12 italic font-sans">KNOWLEDGE SYNTHESIS ABSTRACT MANIFEST</h4>
                 <p className="text-2xl text-slate-200 font-serif italic leading-relaxed selection:bg-cyan-500/20 font-light">"{data.summary}"</p>
             </div>
             {data.mermaid_diagrams?.map((d, i) => (
                 <div key={i} className="modern-card bg-[#0D1117] p-20 overflow-x-auto custom-scrollbar shadow-2xl border-white/15">
                     <div className="flex items-center justify-between mb-16 opacity-30">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] font-sans italic">HOLOGRAPHIC PROCESS MANIFEST: {d.type.toUpperCase()}</span>
                        <Network size={22} />
                     </div>
                     <div className="scale-110 origin-top">
                        <Mermaid code={d.code} />
                     </div>
                 </div>
             ))}
        </div>
    );
}
