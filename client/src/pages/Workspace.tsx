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
    Binary
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

const PIPELINE_STEPS = [
    { label: "Initializing Neural Node", icon: Cpu },
    { label: "Decrypting Spectrum Input", icon: Binary },
    { label: "Establishing Truth Baseline", icon: Database },
    { label: "Finalizing Output Manifest", icon: Wand2 }
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
            }, 1500);
        } else {
            setLoadStep(0);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const runAction = useCallback(async (type: string) => {
        if (!content.trim() && type !== 'generate') {
            setError(`Protocol Interrupt: No input detected in {${type}} node.`);
            return;
        }
        setLoading(type);
        setError('');

        try {
            let endpoint = '';
            let payload: { text?: string; query?: string; prompt?: string; response_type?: string; type?: string } = {};

            switch (type) {
                case 'generate': endpoint = '/api/ai/generate'; payload = { prompt: content || 'Generate high-fidelity research abstract.' }; break;
                case 'analyze': endpoint = '/api/ai/analyze'; payload = { text: content }; break;
                case 'plagiarism': endpoint = '/api/ai/plagiarism/check'; payload = { text: content }; break;
                case 'humanize': endpoint = '/api/ai/humanize'; payload = { text: content }; break;
                case 'visualize': endpoint = '/api/ai/visualize'; payload = { text: content, type: 'flowchart' }; break;
            }

            const { data } = await api.post(endpoint, payload);
            
            if (data.success) {
                setResult({ type, data: data.data || data });
                // Slow down for feedback
                await new Promise(r => setTimeout(r, 800));
            } else {
                setError(data.error || `Synthesis protocol rejected.`);
            }

        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { error?: string } }, code?: string };
            if (axiosError.code === 'ECONNABORTED') {
                 setError("Neural Sync Timeout: Render backend taking too long. Please initiate again.");
            } else {
                 setError(axiosError.response?.data?.error || `Nexus Interrupted: Verify backend operational status.`);
            }
        } finally {
            setLoading(null);
        }
    }, [content]);

    return (
        <div className="workspace-main relative">
            <div className="bg-animate"><div className="bg-dot-pattern" /><div className="bg-blob bg-blob-1" /><div className="bg-blob bg-blob-2" /></div>

            {/* Header Mini Dashboard */}
            <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 py-4 px-10 no-print flex items-center justify-between">
                 <div className="flex items-center gap-6">
                      <Logo variant="icon" className="w-8 h-8" />
                      <div className="h-6 w-[1px] bg-white/10" />
                      <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-gradient">
                          VeriMind Intelligence Studio
                      </h2>
                 </div>
                 <div className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
                      <div className="flex flex-col items-end">
                           <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Node Status</span>
                           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Optimal Sync</span>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
                 </div>
            </div>

            <main className="workspace-center-content relative z-10 w-full">
                <section className="input-top-area no-print w-full">
                    {/* Tool Selector - Large & Grid-friendly */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
                        {[
                            { key: 'generate', label: 'Produce', icon: Sparkles, color: 'text-indigo-400', desc: 'AI Synthesis' },
                            { key: 'analyze', label: 'Audit', icon: ShieldAlert, color: 'text-blue-400', desc: 'Truth Scan' },
                            { key: 'plagiarism', label: 'Verify', icon: ShieldCheck, color: 'text-rose-400', desc: 'Overlap Scan' },
                            { key: 'humanize', label: 'Naturalize', icon: Wand2, color: 'text-purple-400', desc: 'Stylus' },
                            { key: 'visualize', label: 'Structure', icon: Network, color: 'text-cyan-400', desc: 'Logic Flow' },
                        ].map((btn) => (
                            <button 
                              key={btn.key} 
                              onClick={() => runAction(btn.key)}
                              className={`modern-tool-btn flex-col h-24 gap-1 items-start px-6 ${loading === btn.key ? 'active' : ''}`}
                            >
                                <btn.icon size={18} className={btn.color} />
                                <span className="text-[10px] font-black">{btn.label}</span>
                                <span className="text-[7px] opacity-40 font-bold lowercase tracking-normal">{btn.desc}</span>
                            </button>
                        ))}
                    </div>

                    <div className="smart-gpt-editor group">
                        <div className="flex items-center justify-between mb-8 px-2 border-b border-white/5 pb-6">
                            <div className="flex items-center gap-5">
                                 <div className="flex items-center gap-3 cursor-pointer hover:opacity-100 opacity-60 transition-opacity" onClick={() => fileInputRef.current?.click()}>
                                    <Upload size={16} className="text-indigo-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Spectrum Input</span>
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
                            placeholder="Initialize your neural prompt or audit data..."
                            className="custom-scrollbar min-h-[180px]"
                        />

                        <div className="flex items-center justify-between mt-10 px-4 opacity-20 group-hover:opacity-60 transition-opacity">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">{wordCount} Nodes Indexed</span>
                            <div className="flex gap-8">
                                 <div className="cursor-pointer hover:text-white transition-colors flex items-center gap-2" onClick={() => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}>
                                    {copied ? <span className="text-[9px] text-emerald-400 font-black">SYNC_COPIED</span> : <Copy size={16} />}
                                 </div>
                                 <RotateCcw size={16} className="cursor-pointer hover:text-rose-400 transition-colors" onClick={() => { setContent(''); setResult(null); }} />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center text-rose-500 text-[10px] font-black uppercase tracking-[0.4em] bg-rose-500/5 py-4 border border-rose-500/10 rounded-2xl">
                            {error}
                        </motion.div>
                    )}
                </section>

                <section className="output-bottom-area pb-32" id="ws-results">
                     <AnimatePresence mode="wait">
                        {!result && !loading ? (
                             <div className="space-y-20 pt-10">
                                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-2 text-center opacity-30">
                                    <Logo variant="icon" className="w-16 h-16 text-slate-800 mb-8 grayscale" />
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">Global Intelligence Node Inactive</p>
                                </motion.div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
                                    <IntelligenceNode 
                                       img="/assets/graphics/verification_intelligence.png" 
                                       title="Truth Engine" 
                                       label="AUDIT" 
                                       desc="Real-time multi-dimensional claim verification."
                                       icon={ShieldAlert}
                                       color="text-indigo-400"
                                       onClick={() => runAction('analyze')}
                                    />
                                    <IntelligenceNode 
                                       img="/assets/graphics/plagiarism_radar.png" 
                                       title="Neural Radar" 
                                       label="VERIFY" 
                                       desc="Tracing linguistic origins and semantic overlaps."
                                       icon={ShieldCheck}
                                       color="text-rose-400"
                                       onClick={() => runAction('plagiarism')}
                                    />
                                    <IntelligenceNode 
                                       img="/assets/graphics/writing_dna.png" 
                                       title="Writing DNA" 
                                       label="ANALYZE" 
                                       desc="Dynamic fingerprinting of stylistic data nodes."
                                       icon={Search}
                                       color="text-emerald-400"
                                       onClick={() => runAction('humanize')}
                                    />
                                </div>
                             </div>
                        ) : loading ? (
                            <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 bg-white/[0.01] rounded-[60px] border border-white/5">
                                 <div className="relative mb-20">
                                      <div className="w-32 h-32 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_50px_rgba(99,102,241,0.2)]" />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                           <Zap size={32} className="text-indigo-400 animate-pulse" />
                                      </div>
                                 </div>
                                 <div className="space-y-6 w-full max-w-sm px-10">
                                      {PIPELINE_STEPS.map((step, i) => (
                                          <div key={i} className={`pipeline-step ${i <= loadStep ? 'active' : ''}`}>
                                               <step.icon size={16} />
                                               <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                                               {i < loadStep && <CheckCircle2 size={14} className="ml-auto text-emerald-400" />}
                                               {i === loadStep && <Loader2 size={14} className="ml-auto animate-spin text-indigo-400" />}
                                          </div>
                                      ))}
                                 </div>
                            </motion.div>
                        ) : (
                            <motion.div key="res" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 20 }} className="space-y-12">
                                 <div className="flex items-center justify-between px-6 opacity-80 border-b border-white/5 pb-10">
                                    <div className="flex items-center gap-5">
                                         <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                               <Activity size={24} className="text-indigo-400" />
                                         </div>
                                         <div>
                                              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] font-sans italic">{result?.type?.toUpperCase()} Manifest Processed</h3>
                                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Temporal Log: {new Date().toLocaleTimeString()}</span>
                                         </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <button onClick={() => { setContent(result.data?.answer || result.data?.humanized_text || result.data?.text || ''); setResult(null); }} className="px-8 py-3 bg-white/5 border border-white/5 text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:text-white transition-all shadow-xl">Re-Index Nodes</button>
                                        <button onClick={() => generatePDF()} className="px-8 py-3 bg-indigo-600 border border-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/20">Capture Record</button>
                                    </div>
                                 </div>

                                 {result?.type === 'plagiarism' && <PlagiarismNode data={result.data as PlagiarismData} />}
                                 {result?.type === 'analyze' && <TruthNode data={result.data as TruthData} />}
                                 {result?.type === 'visualize' && <VisualizeNode data={result.data as VisualizeData} />}
                                 {(result?.type === 'generate' || result?.type === 'humanize') && (
                                     <div className="modern-card p-16 bg-white/[0.02] border-white/10 relative group overflow-hidden shadow-2xl">
                                         <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                               <Cpu size={200} />
                                         </div>
                                         <div className="prose prose-invert max-w-none relative z-10">
                                             <p className="text-3xl font-serif font-light text-slate-100 leading-relaxed italic selection:bg-indigo-500/40">
                                                 "{result.data?.answer || result.data?.humanized_text || result.data?.text}"
                                             </p>
                                         </div>
                                         <div className="mt-16 flex items-center gap-6 border-t border-white/5 pt-10 opacity-40">
                                              <Zap size={20} className="text-indigo-400" />
                                              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic text-slate-500">Node manifested through VeriMind-9 Synthesis Protocol</span>
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

function IntelligenceNode({ img, title, label, desc, icon: Icon, color, onClick }: any) {
    return (
        <motion.div 
           whileHover={{ y: -10 }} 
           onClick={onClick}
           className="modern-card p-0 overflow-hidden bg-black/40 border-white/5 group border hover:border-white/20 transition-all cursor-pointer shadow-2xl"
        >
            <div className="h-44 overflow-hidden relative">
                <img 
                    src={img} 
                    alt={title} 
                    className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent " />
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl border border-white/10">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] font-sans ${color}`}>{label} NODE</span>
                </div>
            </div>
            <div className="p-10 relative">
                <div className="flex items-center gap-5 mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/30 transition-all ${color} group-hover:bg-white/10`}>
                         <Icon size={24} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                         <h4 className="text-[13px] font-black text-white uppercase tracking-[0.1em] italic font-sans">{title}</h4>
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-sans opacity-60">High-Res Sync active</span>
                    </div>
                </div>
                <p className="text-[11px] text-slate-400 font-bold tracking-widest leading-relaxed uppercase selection:bg-indigo-500/30 line-clamp-2">{desc}</p>
                <div className="mt-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 group-hover:gap-6 transition-all">
                    <span>Initialize Scan</span>
                    <ArrowRight size={14} />
                </div>
            </div>
        </motion.div>
    );
}

function PlagiarismNode({ data }: { data: PlagiarismData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="modern-card p-14 flex flex-col items-center text-center bg-rose-500/5 border-rose-500/20 shadow-2xl">
                 <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 font-sans">AUDIT BREACH RATIO</span>
                 <div className="text-[100px] font-black text-rose-500 mb-8 italic tracking-tighter leading-none shadow-[0_0_80px_rgba(244,63,94,0.2)]">{data.score}%</div>
                 <div className="px-12 py-3 bg-rose-500/10 rounded-full border border-rose-500/30">
                     <p className="text-[11px] text-rose-400 font-black uppercase tracking-[0.5em] font-sans">{data.verdict} DETECTED</p>
                 </div>
            </div>
            <div className="modern-card md:col-span-2 p-16 bg-white/[0.01] border-white/10 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-5">
                      <ShieldAlert size={140} className="text-rose-500" />
                 </div>
                 <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-14 border-l-4 border-rose-500 pl-10 font-sans">SPECTRUM AUDIT SUMMARY</h4>
                 <p className="text-3xl text-slate-100 font-serif italic font-light leading-relaxed">"{data.explanation}"</p>
                 <div className="mt-14 flex flex-wrap gap-4 pt-14 border-t border-white/5">
                      {["Cite Sources", "Rewrite Segments", "Trace Origin"].map(t => (
                          <span key={t} className="px-5 py-2 bg-white/5 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/5">{t}</span>
                      ))}
                 </div>
            </div>
        </div>
    );
}

function TruthNode({ data }: { data: TruthData }) {
    return (
        <div className="space-y-14">
             <div className="modern-card bg-indigo-500/5 border-indigo-500/20 text-center py-28 px-10 relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                 <span className="text-[12px] font-black text-indigo-400 uppercase tracking-[1em] mb-10 block relative z-10 font-sans">TRUTH CREDIBILITY SPECTRUM</span>
                 <div className="text-[120px] font-black text-white italic tracking-tighter relative z-10">{data.credibility_score}%</div>
                 <div className="mt-14 relative z-10 opacity-30">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] font-sans">Active Sync: Global Facts DB Node 44.1</span>
                 </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 {data.claims.map((c, i) => (
                      <div key={i} className="modern-card p-12 border-white/10 hover:bg-white/[0.03] transition-all shadow-2xl group">
                          <div className="flex justify-between items-center mb-14">
                               <div className="flex items-center gap-6">
                                   <div className={`w-4 h-4 rounded-full animate-pulse shadow-glow ${c.verdict === 'True' || c.verdict === 'Verified' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-rose-400 shadow-rose-400/50'}`} />
                                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] font-sans italic">{c.verdict} NODE</span>
                               </div>
                              <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-2xl border border-white/5 transition-colors group-hover:border-white/20">
                                  <Cpu size={16} className="text-indigo-400" />
                                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic font-sans">{c.confidence}% SYNC</span>
                              </div>
                          </div>
                          <p className="text-3xl text-white font-serif italic mb-14 leading-tight font-light transition-colors group-hover:text-indigo-100">"{c.claim}"</p>
                          <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-white/5 pl-12">{c.reasoning}</p>
                      </div>
                 ))}
             </div>
        </div>
    );
}

function VisualizeNode({ data }: { data: VisualizeData }) {
    return (
        <div className="space-y-20">
             <div className="modern-card p-20 bg-white/[0.01] border-white/10 shadow-2xl relative">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                       <Network size={160} />
                 </div>
                 <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em] mb-12 italic font-sans">KNOWLEDGE SYNTHESIS ABSTRACT</h4>
                 <p className="text-3xl text-slate-200 font-serif font-light italic leading-relaxed">"{data.summary}"</p>
             </div>
             {data.mermaid_diagrams?.map((d, i) => (
                 <div key={i} className="modern-card bg-[#030508] p-24 overflow-x-auto custom-scrollbar shadow-2xl border-white/15">
                     <div className="flex items-center justify-between mb-20 opacity-30">
                        <span className="text-[11px] font-black uppercase tracking-[0.6em] font-sans italic">HOLOGRAPHIC LOGIC MANIFEST: {d.type.toUpperCase()}</span>
                        <div className="flex gap-4"><Scan size={20} /><Binary size={20} /></div>
                     </div>
                     <div className="scale-110 origin-top">
                        <Mermaid code={d.code} />
                     </div>
                 </div>
             ))}
        </div>
    );
}

function Scan(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" x2="17" y1="12" y2="12"/></svg>
}
