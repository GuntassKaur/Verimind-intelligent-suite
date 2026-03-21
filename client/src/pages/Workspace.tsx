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
    ArrowRight,
    Loader2,
    CheckCircle2,
    Database,
    Binary,
    FileSearch,
    Fingerprint,
    Info
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
    summary?: string;
    simple_explanation?: string;
    verdict?: string;
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

const PIPELINE_STEPS = [
    { label: "Neural Node Synced", icon: Cpu },
    { label: "Spectrum Scanning", icon: Search },
    { label: "Knowledge Audit", icon: Database },
    { label: "Manifesting Result", icon: CheckCircle2 }
];

export default function Workspace() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState<string | null>(null);
    const [loadStep, setLoadStep] = useState(0);
    const [result, setResult] = useState<ResultState | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    useEffect(() => {
        let interval: any;
        if (loading) {
            setLoadStep(0);
            interval = setInterval(() => {
                setLoadStep(prev => (prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev));
            }, 2000);
        } else {
            setLoadStep(0);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const runAction = useCallback(async (type: string) => {
        if (!content.trim() && type !== 'generate') {
            setError(`Synthesis Error: Please provide source text for the ${type} node.`);
            return;
        }
        setLoading(type);
        setError('');

        try {
            let endpoint = '';
            let payload: { text?: string; query?: string; prompt?: string; response_type?: string; type?: string } = {};

            switch (type) {
                case 'generate': endpoint = '/api/ai/generate'; payload = { prompt: content || 'Generate a professional research synthesis.' }; break;
                case 'analyze': endpoint = '/api/ai/analyze'; payload = { text: content }; break;
                case 'plagiarism': endpoint = '/api/ai/plagiarism/check'; payload = { text: content }; break;
                case 'humanize': endpoint = '/api/ai/humanize'; payload = { text: content }; break;
                case 'visualize': endpoint = '/api/ai/visualize'; payload = { text: content, type: 'flowchart' }; break;
            }

            const { data } = await api.post(endpoint, payload);
            
            if (data.success) {
                setResult({ type, data: (data.data || data) });
            } else {
                setError(data.error || "Neural Protocol Error. Please verify input data.");
            }

        } catch (err: any) {
             setError(err.response?.data?.error || `Sync Lost: ${type.toUpperCase()} module inaccessible. Ensure backend is operational.`);
        } finally {
            setLoading(null);
        }
    }, [content]);

    return (
        <div className="workspace-main relative">
            <div className="bg-animate fixed inset-0 z-0"><div className="bg-dot-pattern" /><div className="bg-blob bg-blob-1" /><div className="bg-blob bg-blob-2" /></div>

            {/* Neural Matrix Header */}
            <div className="sticky top-0 z-50 bg-[#05070A]/80 backdrop-blur-3xl border-b border-white/10 py-5 px-10 no-print flex items-center justify-between">
                 <div className="flex items-center gap-6">
                      <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                           <Logo variant="icon" className="w-8 h-8 text-indigo-500" />
                      </div>
                      <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white italic">
                          VeriMind Studio
                      </h2>
                 </div>
                 <div className="flex items-center gap-8">
                      <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
                      <div className="hidden md:flex flex-col items-end opacity-50">
                           <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Processing Spectrum</span>
                           <span className="text-[10px] font-black text-emerald-400">Stable Protocol</span>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981] animate-pulse" />
                 </div>
            </div>

            <main className="workspace-center-content relative z-10 w-full px-4 md:px-10">
                <section className="input-top-area no-print w-full">
                    {/* Project-Specific Tool Selector */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                        {[
                            { key: 'generate', label: 'Produce', icon: Sparkles, color: 'text-indigo-400', desc: 'AI Synthesis' },
                            { key: 'analyze', label: 'Audit', icon: ShieldAlert, color: 'text-blue-400', desc: 'Truth Scan' },
                            { key: 'plagiarism', label: 'Verify', icon: ShieldCheck, color: 'text-rose-400', desc: 'Plagiarism' },
                            { key: 'humanize', label: 'Naturalize', icon: Wand2, color: 'text-purple-400', desc: 'Writing DNA' },
                            { key: 'visualize', label: 'Structure', icon: Network, color: 'text-cyan-400', desc: 'Diagramming' },
                        ].map((btn) => (
                            <button 
                              key={btn.key} 
                              onClick={() => runAction(btn.key)}
                              className={`modern-tool-btn flex-col h-28 gap-2 items-center justify-center text-center ${loading === btn.key ? 'active shadow-indigo-500/20' : ''}`}
                            >
                                <btn.icon size={22} className={btn.color} />
                                <span className="text-[11px] font-black uppercase tracking-wider">{btn.label}</span>
                                <span className="text-[7px] opacity-30 font-bold uppercase tracking-widest">{btn.desc}</span>
                            </button>
                        ))}
                    </div>

                    {/* EXPANDING SMART EDITOR */}
                    <motion.div 
                        animate={{ height: result ? 450 : 320 }}
                        className="smart-gpt-editor group transition-all duration-700"
                    >
                        <div className="flex items-center justify-between mb-8 px-6 border-b border-white/5 pb-6">
                            <div className="flex items-center gap-6">
                                 <div className="flex items-center gap-3 cursor-pointer hover:opacity-100 opacity-40 transition-opacity" onClick={() => fileInputRef.current?.click()}>
                                    <Upload size={18} className="text-indigo-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Import Content</span>
                                 </div>
                                 <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                                     const f = e.target.files?.[0]; if(!f) return;
                                     const r = new FileReader(); r.onload=(ev) => setContent((ev.target?.result as string) || ''); r.readAsText(f);
                                 }} />
                            </div>
                            <div className="flex items-center gap-8">
                                <VoiceInput onTranscription={(t) => setContent(prev => prev + ' ' + t)} />
                                <SmartProcessingToolbar onTextExtracted={setContent} />
                            </div>
                        </div>

                        <textarea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder="Initialize your neural prompt or paste the data you want to audit..."
                            className="custom-scrollbar h-full w-full text-center"
                        />

                        <div className="flex items-center justify-between mt-8 px-6 border-t border-white/5 pt-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="flex items-center gap-4">
                                <Info size={14} className="text-indigo-400" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">{wordCount} Neural Nodes Indexed</span>
                            </div>
                            <div className="flex gap-10">
                                 <div className="cursor-pointer hover:text-white transition-colors flex items-center gap-3" onClick={() => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}>
                                    {copied ? <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">Copied!</span> : <Copy size={18} />}
                                 </div>
                                 <RotateCcw size={18} className="cursor-pointer hover:text-rose-400 transition-colors" onClick={() => { setContent(''); setResult(null); }} />
                            </div>
                        </div>
                    </motion.div>

                    {error && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 text-center text-rose-500 text-[10px] font-black uppercase tracking-[0.5em] bg-rose-500/5 py-4 border border-rose-500/10 rounded-2xl shadow-xl">
                             INTERRUPT: {error}
                        </motion.div>
                    )}
                </section>

                <section className="output-bottom-area pb-40" id="ws-results">
                     <AnimatePresence mode="wait">
                        {!result && !loading ? (
                             <div className="space-y-20 pt-16">
                                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-4 text-center opacity-40">
                                    <Logo variant="icon" className="w-16 h-16 text-slate-800 mb-8 grayscale" />
                                    <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.6em]">System Standby | Neural Studio Inactive</p>
                                </motion.div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
                                    <ToolServiceNode 
                                       title="Truth Engine" 
                                       label="AUDIT" 
                                       desc="Factual verification and claim detection."
                                       icon={ShieldAlert}
                                       color="text-indigo-400"
                                       onClick={() => runAction('analyze')}
                                    />
                                    <ToolServiceNode 
                                       title="Plagiarism Node" 
                                       label="VERIFY" 
                                       desc="Semantic scan for document originality."
                                       icon={FileSearch}
                                       color="text-rose-400"
                                       onClick={() => runAction('plagiarism')}
                                    />
                                    <ToolServiceNode 
                                       title="Writing DNA" 
                                       label="ANALYZE" 
                                       desc="Linguistic fingerprinting and style stylus."
                                       icon={Fingerprint}
                                       color="text-emerald-400"
                                       onClick={() => runAction('humanize')}
                                    />
                                </div>
                             </div>
                        ) : loading ? (
                            <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 bg-white/[0.01] rounded-[60px] border border-white/5 shadow-2xl">
                                 <div className="relative mb-20 scale-125">
                                      <div className="w-40 h-40 border-4 border-indigo-500/5 border-t-indigo-500 rounded-full animate-spin" />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                           <Zap size={40} className="text-indigo-400 animate-pulse" />
                                      </div>
                                 </div>
                                 <div className="space-y-6 w-full max-w-sm">
                                      {PIPELINE_STEPS.map((step, i) => (
                                          <div key={i} className={`pipeline-step ${i <= loadStep ? 'active' : ''} px-10 py-4 transition-all duration-700`}>
                                               <step.icon size={18} />
                                               <span className="text-[11px] font-black uppercase tracking-[0.2em]">{step.label}</span>
                                               {i < loadStep && <CheckCircle2 size={16} className="ml-auto text-emerald-400" />}
                                               {i === loadStep && <Loader2 size={16} className="ml-auto animate-spin text-indigo-400" />}
                                          </div>
                                      ))}
                                 </div>
                            </motion.div>
                        ) : (
                            <motion.div key="res" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25 }} className="space-y-16">
                                 <div className="flex items-center justify-between px-10 border-b border-white/5 pb-12">
                                    <div className="flex items-center gap-6">
                                         <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                                               <Activity size={32} className="text-indigo-400" />
                                         </div>
                                         <div>
                                              <h3 className="text-[13px] font-black text-white uppercase tracking-[0.4em] italic">{result?.type?.toUpperCase()} MANIFEST READY</h3>
                                              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural Sync Status: 100 percent Successful</span>
                                         </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <button onClick={() => { setContent(result.data?.answer || result.data?.humanized_text || result.data?.text || ''); setResult(null); }} className="px-10 py-4 bg-white/5 border border-white/5 text-slate-400 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-white hover:bg-white/10 transition-all font-sans">Import to Editor</button>
                                        <button onClick={() => generatePDF()} className="px-10 py-4 bg-indigo-600 border border-white/10 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-3xl shadow-indigo-500/40 font-sans">Extract Record (PDF)</button>
                                    </div>
                                 </div>

                                 {result?.type === 'plagiarism' && <PlagiarismNode data={result.data as PlagiarismData} />}
                                 {result?.type === 'analyze' && <TruthNode data={result.data as TruthData} />}
                                 {result?.type === 'visualize' && <VisualizeNode data={result.data as VisualizeData} />}
                                 {(result?.type === 'generate' || result?.type === 'humanize') && (
                                     <div className="modern-card p-20 bg-white/[0.01] border-white/10 shadow-3xl relative group overflow-hidden">
                                         <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                               <Cpu size={250} />
                                         </div>
                                         <div className="prose prose-invert max-w-none relative z-10">
                                             <p className="text-4xl font-serif font-light text-slate-100 leading-snug italic selection:bg-indigo-500/50">
                                                 "{result.data?.answer || result.data?.humanized_text || result.data?.text}"
                                             </p>
                                         </div>
                                         <div className="mt-20 flex items-center gap-6 border-t border-white/5 pt-12 opacity-40">
                                              <Zap size={22} className="text-indigo-400" />
                                              <span className="text-[11px] font-black uppercase tracking-[0.5em] italic text-slate-600">Generated Manifest Node | VeriMind Synthesis Node-73</span>
                                         </div>
                                     </div>
                                 )}
                            </motion.div>
                        )}
                     </AnimatePresence>
                </section>
            </main>

            {result && <IntelligenceReport data={result.data} type={result.type as any} content={content} />}
        </div>
    );
}

function ToolServiceNode({ title, label, desc, icon: Icon, color, onClick }: any) {
    return (
        <motion.div 
           whileHover={{ y: -12 }} 
           onClick={onClick}
           className="modern-card p-12 bg-[#0A0D14]/80 border-white/5 group border hover:border-white/20 transition-all cursor-pointer shadow-3xl relative overflow-hidden text-center"
        >
            <div className={`w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/30 transition-all ${color} group-hover:bg-white/10 mx-auto mb-10`}>
                 <Icon size={36} className="group-hover:scale-110 transition-transform" />
            </div>
            <div className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-2xl border border-white/5 mx-auto mb-8 inline-block">
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] font-sans ${color}`}>{label} NODE</span>
            </div>
            <h4 className="text-2xl font-black text-white uppercase tracking-[0.1em] italic font-sans mb-4">{title}</h4>
            <p className="text-[12px] text-slate-500 font-bold tracking-widest leading-relaxed uppercase selection:bg-indigo-500/30 line-clamp-2 mb-10">{desc}</p>
            <div className="flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400 group-hover:gap-8 transition-all">
                <span>Engage Node</span>
                <ArrowRight size={16} />
            </div>
        </motion.div>
    );
}

function PlagiarismNode({ data }: { data: PlagiarismData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="modern-card p-16 flex flex-col items-center text-center bg-rose-500/5 border-rose-500/20 shadow-3xl">
                 <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 font-sans">BREACH RATIO ACTIVE</span>
                 <div className="text-[120px] font-black text-rose-500 italic tracking-tighter leading-none mb-10">{data.score}%</div>
                 <div className="px-14 py-4 bg-rose-500/10 rounded-full border border-rose-500/30">
                     <p className="text-[12px] text-rose-400 font-black uppercase tracking-[0.6em] font-sans">{data.verdict} BREACH</p>
                 </div>
            </div>
            <div className="modern-card md:col-span-2 p-20 bg-white/[0.01] border-white/10 shadow-3xl">
                 <h4 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.6em] mb-16 border-l-4 border-rose-500 pl-10 font-sans italic">AUDIT SUMMATION MANIFEST</h4>
                 <p className="text-4xl text-slate-100 font-serif italic font-light leading-snug">"{data.explanation}"</p>
                 <div className="mt-16 pt-16 border-t border-white/5 opacity-50 flex items-center gap-6">
                      <FileSearch size={24} className="text-rose-400" />
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-600 italic">Neural Scan Spectrum: 2.4 High Intensity</span>
                 </div>
            </div>
        </div>
    );
}

function TruthNode({ data }: { data: TruthData }) {
    const claims = data.claims || [];
    return (
        <div className="space-y-16">
             <div className="modern-card bg-indigo-500/5 border-indigo-500/20 text-center py-32 px-10 relative overflow-hidden group shadow-[0_60px_150px_rgba(0,0,0,0.8)]">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                 <span className="text-[13px] font-black text-indigo-400 uppercase tracking-[1em] mb-12 block relative z-10 font-sans italic">CREDIBILITY BASELINE INDEX</span>
                 <div className="text-[160px] font-black text-white italic tracking-tighter relative z-10">{data.credibility_score}%</div>
                 <div className="mt-16 relative z-10 opacity-30 flex items-center justify-center gap-6">
                      <Shield size={20} className="text-indigo-400" />
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] font-sans">Global Knowledge Sync: Latency 44ms</span>
                 </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 {claims.map((c, i) => (
                      <div key={i} className="modern-card p-14 border-white/10 hover:bg-white/[0.02] transition-all shadow-3xl group">
                          <div className="flex justify-between items-center mb-16 px-2">
                               <div className="flex items-center gap-6">
                                   <div className={`w-4 h-4 rounded-full animate-pulse shadow-glow ${c.verdict === 'True' || c.verdict === 'Verified' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-rose-400 shadow-rose-400/50'}`} />
                                   <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.6em] font-sans italic">{c.verdict} NODE</span>
                               </div>
                              <div className="flex items-center gap-4 bg-white/5 px-6 py-2.5 rounded-2xl border border-white/5">
                                  <Cpu size={16} className="text-indigo-400" />
                                  <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.3em] italic font-sans">{c.confidence}% CONF</span>
                              </div>
                          </div>
                          <p className="text-4xl text-white font-serif italic mb-14 leading-[1.3] font-light transition-colors group-hover:text-indigo-100">"{c.claim}"</p>
                          <p className="text-[14px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-white/5 pl-12">{c.reasoning}</p>
                      </div>
                 ))}
                 {claims.length === 0 && (
                     <div className="col-span-2 py-20 text-center opacity-30 border border-dashed border-white/10 rounded-3xl">
                         <span className="text-[12px] font-black uppercase tracking-[0.5em]">No granular claims isolated. Showing baseline abstract.</span>
                     </div>
                 )}
             </div>
        </div>
    );
}

function VisualizeNode({ data }: { data: VisualizeData }) {
    return (
        <div className="space-y-24">
             <div className="modern-card p-24 bg-white/[0.01] border-white/10 shadow-3xl relative">
                 <h4 className="text-[12px] font-black text-slate-600 uppercase tracking-[0.8em] mb-16 italic font-sans text-center">KNOWLEDGE SYNTHESIS ABSTRACT MANIFEST</h4>
                 <p className="text-4xl text-slate-300 font-serif font-light italic leading-snug">"{data.summary}"</p>
             </div>
             {data.mermaid_diagrams?.map((d, i) => (
                 <div key={i} className="modern-card bg-[#030508] p-32 overflow-x-auto custom-scrollbar shadow-3xl border-white/15">
                     <div className="flex items-center justify-between mb-24 opacity-30">
                        <span className="text-[12px] font-black uppercase tracking-[0.8em] font-sans italic">HOLOGRAPHIC LOGIC: {d.type.toUpperCase()}</span>
                        <Network size={28} />
                     </div>
                     <div className="scale-125 origin-top min-h-[500px] flex items-center justify-center">
                        <Mermaid code={d.code} />
                     </div>
                 </div>
             ))}
        </div>
    );
}
