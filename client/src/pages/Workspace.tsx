import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wand2, ShieldCheck,
    Sparkles,
    RotateCcw, Copy,
    ShieldAlert, Network,
    Upload, Cpu,
    Zap, Shield, Search,
    ArrowRight,
    Loader2,
    CheckCircle2,
    FileSearch,
    Fingerprint,
    Info,
    Layout,
    Brain,
    Bot,
    PenTool
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
    data: PlagiarismData | TruthData | VisualizeData | GeneralData;
}

const PIPELINE_STEPS = [
    { label: "Initializing Neural Flux", icon: Sparkles, color: "text-indigo-400" },
    { label: "Scanning Knowledge Base", icon: Search, color: "text-blue-400" },
    { label: "Auditing Logical Nodes", icon: Brain, color: "text-purple-400" },
    { label: "Synthesizing Manifest", icon: Network, color: "text-rose-400" }
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
        let interval: ReturnType<typeof setInterval> | undefined;
        if (loading) {
            setLoadStep(0);
            interval = setInterval(() => {
                setLoadStep(prev => (prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev));
            }, 2500);
        } else {
            setLoadStep(0);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const runAction = useCallback(async (type: string) => {
        if (!content.trim() && type !== 'generate') {
            setError(`Synthesis Error: Please provide source text for the ${type.toUpperCase()} module.`);
            return;
        }
        setLoading(type);
        setError('');

        try {
            let endpoint = '';
            let payload: Record<string, unknown> = {};

            switch (type) {
                case 'generate': endpoint = '/api/ai/generate'; payload = { prompt: content || 'Generate a high-fidelity research paper outline.' }; break;
                case 'analyze': endpoint = '/api/ai/analyze'; payload = { text: content }; break;
                case 'plagiarism': endpoint = '/api/ai/plagiarism/check'; payload = { text: content }; break;
                case 'humanize': endpoint = '/api/ai/humanize'; payload = { text: content }; break;
                case 'visualize': endpoint = '/api/ai/visualize'; payload = { text: content, type: 'flowchart' }; break;
            }

            const { data } = await api.post(endpoint, payload);
            
            if (data.success) {
                setResult({ type, data: (data.data || data) });
            } else {
                setError(data.error || "Neural Protocol Sync Loss. Please calibrate input.");
            }

        } catch (err: unknown) {
             const axiosError = err as { response?: { data?: { error?: string } } };
             setError(axiosError.response?.data?.error || `Sync Lost: ${type.toUpperCase()} node offline. (Ensure backend is linked)`);
        } finally {
            setLoading(null);
        }
    }, [content]);

    return (
        <div className="workspace-main relative bg-mesh min-h-full">
            <main className="workspace-center-content relative z-10 w-full max-w-5xl mx-auto py-16 px-6 lg:px-12">
                
                {/* ═══════════════════════════════════════════════
                   CANVA-STYLE TOOL SELECTOR
                   ═══════════════════════════════════════════════ */}
                <header className="mb-14 text-center">
                    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: -20 }} className="inline-flex items-center gap-4 bg-white/60 backdrop-blur-xl border border-white px-8 py-3 rounded-full mb-8 shadow-sm">
                         <Sparkles size={18} className="text-indigo-500" />
                         <span className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-700 italic">Prism Neural Workspace</span>
                    </motion.div>
                    <h1 className="text-6xl font-black text-slate-800 tracking-tighter mb-6 leading-tight">
                        Transform Your <span className="text-gradient">Intelligence</span>.
                    </h1>
                    <p className="max-w-xl mx-auto text-lg text-slate-500 font-medium leading-relaxed mb-12">
                        VeriMind Prism combines high-fidelity AI generation with forensic truth audits to build premium, trusted content structures.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-5">
                       {[
                           { key: 'generate', label: 'Produce', icon: Wand2, color: 'indigo' },
                           { key: 'analyze', label: 'Audit', icon: ShieldCheck, color: 'blue' },
                           { key: 'plagiarism', label: 'Verify', icon: ShieldAlert, color: 'rose' },
                           { key: 'humanize', label: 'Writing DNA', icon: Fingerprint, color: 'purple' },
                           { key: 'visualize', label: 'Brain Map', icon: Network, color: 'cyan' },
                       ].map((tool) => (
                           <button 
                                key={tool.key}
                                onClick={() => runAction(tool.key)}
                                className={`modern-tool-btn px-10 py-5 rounded-[2rem] gap-4 ${loading === tool.key ? 'active scale-95' : ''}`}
                           >
                               <tool.icon size={22} className={`text-${tool.color}-500`} />
                               <span className="text-sm font-black uppercase tracking-widest">{tool.label}</span>
                           </button>
                       ))}
                    </div>
                </header>

                {/* ═══════════════════════════════════════════════
                   GAMMA-INSPIRED SMART CANVAS
                   ═══════════════════════════════════════════════ */}
                <section className="input-top-area w-full no-print">
                    <motion.div 
                        animate={{ minHeight: result ? 400 : 350 }}
                        className="smart-gpt-editor group transition-all duration-700"
                    >
                        <div className="flex items-center justify-between mb-10 px-4 border-b border-indigo-50/50 pb-8">
                             <div className="flex items-center gap-8">
                                  <div onClick={() => fileInputRef.current?.click()} className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-3 rounded-2xl transition-all">
                                       <Upload size={20} className="text-slate-400" />
                                       <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Manifest Base</span>
                                  </div>
                                  <input type="file" ref={fileInputRef} className="hidden" onChange={(e)=>{
                                       const f=e.target.files?.[0]; if(!f)return;
                                       const r=new FileReader(); r.onload=(ev)=>setContent((ev.target?.result as string)||''); r.readAsText(f);
                                  }} />
                                  <div className="h-6 w-[1px] bg-slate-100" />
                                  <SmartProcessingToolbar onTextExtracted={setContent} />
                             </div>
                             <div className="flex items-center gap-6">
                                  <VoiceInput onTranscription={(t)=>setContent(p=>p+' '+t)} />
                                  <div className="px-5 py-2.5 bg-indigo-50/50 border border-indigo-100 rounded-full">
                                       <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{wordCount} Nuclei Detected</span>
                                  </div>
                             </div>
                        </div>

                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Begin your neural synthesis or paste a manifest for truth audit..."
                            className="custom-scrollbar h-full w-full placeholder:text-slate-300"
                        />

                        <div className="flex items-center justify-between mt-10 px-4 border-t border-indigo-50/50 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="flex gap-10">
                                  <div className="hover:text-indigo-600 transition-colors flex items-center gap-3 cursor-pointer" onClick={()=>{navigator.clipboard.writeText(content); setCopied(true); setTimeout(()=>setCopied(false), 2000);}}>
                                        {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Manifest Copied' : 'Copy'}</span>
                                  </div>
                                  <div className="hover:text-rose-500 transition-colors flex items-center gap-3 cursor-pointer" onClick={()=>{setContent(''); setResult(null);}}>
                                        <RotateCcw size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Reset Studio</span>
                                  </div>
                             </div>
                             <button 
                                onClick={() => runAction('generate')}
                                disabled={loading !== null}
                                className="premium-btn-primary flex items-center gap-5 px-10"
                             >
                                 <Zap size={18} />
                                 <span className="uppercase tracking-[0.2em] text-[11px]">Initiate Synthesis</span>
                                 <ArrowRight size={16} />
                             </button>
                        </div>
                    </motion.div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-500 text-[11px] font-black uppercase tracking-widest flex items-center gap-4 justify-center shadow-lg shadow-rose-100/50">
                             <ShieldAlert size={18} /> Interrupt: {error}
                        </motion.div>
                    )}
                </section>

                {/* ═══════════════════════════════════════════════
                   OUTPUT MANIFEST AREA
                   ═══════════════════════════════════════════════ */}
                <section className="output-bottom-area pb-40" id="ws-results">
                    <AnimatePresence mode="wait">
                        {!result && !loading ? (
                             <div className="pt-24 space-y-32">
                                  <div className="flex flex-col items-center">
                                       <div className="relative mb-12">
                                            <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-10 animate-pulse" />
                                            <div className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center border border-indigo-50 shadow-2xl relative z-10">
                                                 <Logo variant="icon" className="w-16 h-16 text-slate-100 grayscale opacity-20" />
                                            </div>
                                       </div>
                                       <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.8em] italic">Neural Nexus Standby</p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                       <FeatureInsightCard 
                                            title="Smart Produce"
                                            desc="High-fidelity AI synthesis based on deep research nodes."
                                            icon={PenTool}
                                            color="indigo"
                                       />
                                       <FeatureInsightCard 
                                            title="Spectra Audit"
                                            desc="Forensic claim verification & logical sync scan."
                                            icon={ShieldCheck}
                                            color="blue"
                                       />
                                       <FeatureInsightCard 
                                            title="Writing DNA"
                                            desc="Linguistic fingerprinting & probabilistic AI detection."
                                            icon={Fingerprint}
                                            color="purple"
                                       />
                                  </div>
                             </div>
                        ) : loading ? (
                             <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 modern-card border-none bg-white">
                                  <div className="relative mb-24 scale-150">
                                       <div className="w-48 h-48 border-[6px] border-indigo-50 border-t-indigo-500 rounded-full animate-spin" />
                                       <div className="absolute inset-0 flex items-center justify-center">
                                            <Logo variant="icon" className="w-16 h-16 text-indigo-500 animate-pulse" />
                                       </div>
                                  </div>
                                  <div className="space-y-6 w-full max-w-sm">
                                       {PIPELINE_STEPS.map((step, i) => (
                                           <div key={i} className={`pipeline-step px-10 py-5 rounded-[2rem] border transition-all duration-700 ${i <= loadStep ? 'active bg-white shadow-xl border-indigo-100 scale-105' : 'border-transparent'}`}>
                                                <step.icon size={22} className={i <= loadStep ? step.color : 'text-slate-200'} />
                                                <span className="text-sm font-black uppercase tracking-widest">{step.label}</span>
                                                {i < loadStep && <CheckCircle2 size={18} className="ml-auto text-emerald-500" />}
                                                {i === loadStep && <Loader2 size={18} className="ml-auto animate-spin text-indigo-400" />}
                                           </div>
                                       ))}
                                  </div>
                             </motion.div>
                        ) : (
                             <motion.div key="res" initial={{ opacity: 0, scale: 0.98, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', damping: 25 }} className="space-y-16">
                                  {/* Result Node Header */}
                                  <div className="flex items-center justify-between px-10 py-12 modern-card border-none bg-indigo-600 shadow-indigo-200">
                                       <div className="flex items-center gap-8">
                                            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/20">
                                                  <Bot size={40} className="text-white" />
                                            </div>
                                            <div>
                                                 <h3 className="text-[14px] font-black text-white uppercase tracking-[0.5em] italic">{result?.type?.toUpperCase()} MANIFEST READY</h3>
                                                 <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Neural Stability: 100 percent Accurate</span>
                                            </div>
                                       </div>
                                       <div className="flex gap-5">
                                            <button onClick={() => { setContent((result?.data as any)?.answer || (result?.data as any)?.humanized_text || (result?.data as any)?.text || ''); setResult(null); }} className="px-10 py-4 bg-black/10 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-black/20 transition-all border border-white/10">Import Manifest</button>
                                            <button onClick={() => generatePDF()} className="px-10 py-4 bg-white text-indigo-600 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl font-sans">Extract PDF Record</button>
                                       </div>
                                  </div>

                                  {/* ─── Dynamically Render Manifest Type ─── */}
                                  {result?.type === 'plagiarism' && <PlagiarismNode data={result.data as PlagiarismData} />}
                                  {result?.type === 'analyze' && <TruthNode data={result.data as TruthData} />}
                                  {result?.type === 'visualize' && <VisualizeNode data={result.data as VisualizeData} />}
                                  {(result?.type === 'generate' || result?.type === 'humanize') && (
                                      <div className="modern-card p-24 bg-white border-none shadow-lux relative group">
                                           <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                                 <Layout size={350} />
                                           </div>
                                           <div className="prose prose-indigo max-w-none relative z-10 px-8 py-10">
                                                <p className="text-4xl font-serif font-light text-slate-700 leading-relaxed italic selection:bg-indigo-100">
                                                    "{(result.data as any)?.answer || (result.data as any)?.humanized_text || (result.data as any)?.text}"
                                                </p>
                                           </div>
                                           <div className="mt-16 flex items-center gap-6 border-t border-slate-50 pt-12 text-slate-400">
                                                 <PenTool size={22} className="text-indigo-400" />
                                                 <span className="text-[11px] font-black uppercase tracking-[0.5em] italic">VeriMind Synthesis Output-Node Alpha-12</span>
                                           </div>
                                      </div>
                                  )}
                             </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </main>

            <IntelligenceReport data={result?.data as any} type={result?.type as any} content={content} />
        </div>
    );
}

function FeatureInsightCard({ title, desc, icon: Icon, color }: { title: string, desc: string, icon: React.ElementType, color: 'indigo' | 'blue' | 'purple' | 'rose' }) {
    const colors: Record<string, string> = {
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-500',
        blue: 'bg-blue-50 border-blue-100 text-blue-500',
        purple: 'bg-purple-50 border-purple-100 text-purple-500',
        rose: 'bg-rose-50 border-rose-100 text-rose-500',
    };
    return (
        <div className="modern-card p-12 bg-white border-none shadow-lux flex flex-col items-center text-center group cursor-default">
             <div className={`w-24 h-24 rounded-[2.5rem] border ${colors[color]} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                   <Icon size={40} />
             </div>
             <h4 className="text-2xl font-black text-slate-800 tracking-tight italic mb-5">{title}</h4>
             <p className="text-sm text-slate-500 leading-relaxed font-medium px-4">{desc}</p>
        </div>
    );
}

function PlagiarismNode({ data }: { data: PlagiarismData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="modern-card p-20 flex flex-col items-center text-center bg-white border-none shadow-lux">
                 <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.6em] mb-12">Originality Index</span>
                 <div className="text-[140px] font-black text-rose-500 leading-none mb-10 tracking-tighter italic">{data.score}%</div>
                 <div className="px-10 py-3 bg-rose-50 rounded-full border border-rose-100">
                     <p className="text-[11px] text-rose-600 font-black uppercase tracking-widest">{data.verdict} BREACH LEVEL</p>
                 </div>
            </div>
            <div className="modern-card md:col-span-2 p-24 bg-white border-none shadow-lux">
                 <h4 className="text-[12px] font-black text-slate-300 uppercase tracking-[0.8em] mb-16 italic border-b border-slate-50 pb-8 flex items-center gap-4">
                      <FileSearch size={18} className="text-rose-400" />
                      Neural Audit Summative Manifest
                 </h4>
                 <p className="text-4xl text-slate-600 font-serif italic font-light leading-relaxed px-4">"{data.explanation}"</p>
                 <div className="mt-16 flex flex-wrap gap-4 px-4">
                      {(data.suspicious_segments || []).slice(0, 3).map((seg, i) => (
                          <div key={i} className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] font-bold text-slate-500 flex items-center gap-3">
                               <Info size={14} className="text-rose-400" />
                               {seg.sentence.substring(0, 40)}...
                          </div>
                      ))}
                 </div>
            </div>
        </div>
    );
}

function TruthNode({ data }: { data: TruthData }) {
    return (
        <div className="space-y-16">
             <div className="modern-card bg-indigo-600 border-none text-center py-24 px-10 relative overflow-hidden group shadow-3xl">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 via-transparent to-transparent opacity-50" />
                 <span className="text-[14px] font-black text-indigo-200 uppercase tracking-[1em] mb-12 block relative z-10 italic">Credibility Scalar Baseline</span>
                 <div className="text-[180px] font-black text-white italic tracking-tighter relative z-10 leading-none">{data.credibility_score}%</div>
                 <div className="mt-16 relative z-10 text-white/40 flex items-center justify-center gap-8 uppercase tracking-[0.4em] font-black text-[10px]">
                      <div className="flex items-center gap-3"><Shield size={16} /> Data Indexed: 100%</div>
                      <div className="flex items-center gap-3"><Cpu size={16} /> Sync Rate: Optimal</div>
                 </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {data.claims?.map((c, i) => (
                      <div key={i} className="modern-card p-16 bg-white border-none shadow-lux group hover:bg-slate-50 transition-all">
                          <div className="flex justify-between items-center mb-10">
                               <div className="flex items-center gap-5">
                                   <div className={`w-4 h-4 rounded-full ${c.verdict === 'True' || c.verdict === 'Verified' ? 'bg-emerald-400' : 'bg-rose-400'} shadow-lg`} />
                                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] italic">{c.verdict} NODE</span>
                               </div>
                               <div className="px-6 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                    <span className="text-[11px] font-black text-indigo-500 uppercase italic">{c.confidence}% Confidence</span>
                               </div>
                          </div>
                          <p className="text-3xl text-slate-800 font-serif font-light leading-tight mb-8 group-hover:text-indigo-900 transition-colors">"{c.claim}"</p>
                          <p className="text-sm text-slate-500 font-medium italic border-l-4 border-slate-100 pl-8 leading-relaxed">{c.reasoning}</p>
                      </div>
                 ))}
             </div>
        </div>
    );
}

function VisualizeNode({ data }: { data: VisualizeData }) {
    return (
        <div className="space-y-16">
             <div className="modern-card p-24 bg-white border-none shadow-lux">
                 <h4 className="text-[12px] font-black text-slate-300 uppercase tracking-[0.8em] mb-12 italic text-center">Spectral Knowledge Analysis</h4>
                 <p className="text-4xl text-slate-600 font-serif font-light italic leading-relaxed text-center px-10">"{data.summary}"</p>
             </div>
             {data.mermaid_diagrams?.map((d, i) => (
                 <div key={i} className="modern-card bg-white p-24 shadow-lux border-none overflow-x-auto custom-scrollbar">
                     <div className="flex items-center justify-between mb-20 px-4">
                        <span className="text-[12px] font-black uppercase tracking-[0.8em] text-slate-300 italic">LOGIC FLOW: {d.type.toUpperCase()}</span>
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                            <Network size={22} className="text-indigo-500" />
                        </div>
                     </div>
                     <div className="min-h-[500px] flex items-center justify-center scale-110">
                        <Mermaid code={d.code} />
                     </div>
                 </div>
             ))}
        </div>
    );
}
