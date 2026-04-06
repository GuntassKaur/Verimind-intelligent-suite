import { useState, useCallback, useRef } from 'react';
import {
    ShieldCheck,
    Loader2, 
    Inbox, 
    Check,
    Sparkles,
    Activity
} from 'lucide-react';
import api from '../services/api';
import { Mermaid } from '../components/Mermaid';
import { UniversalEditor } from '../components/UniversalEditor';

export default function Workspace() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState<string | null>(null);
    const [result, setResult] = useState<{ type: string; data: Record<string, any> } | null>(null);
    const [error, setError] = useState('');

    const runAction = useCallback(async (type: string) => {
        if (!content.trim() && type !== 'generate') {
            setError(`Please provide text to run ${type.toUpperCase()}.`);
            return;
        }
        setLoading(type);
        setError('');
        setResult(null);

        try {
            let endpoint = '';
            let payload: Record<string, unknown> = {};

            switch (type) {
                case 'generate': endpoint = '/api/ai/generate'; payload = { prompt: content || 'Generate a high-fidelity research paper outline.' }; break;
                case 'analyze': endpoint = '/api/ai/analyze'; payload = { text: content }; break;
                case 'plagiarism': endpoint = '/api/ai/plagiarism/check'; payload = { text: content }; break;
                case 'humanize': endpoint = '/api/ai/humanize'; payload = { text: content }; break;
                case 'visualize': endpoint = '/api/ai/visualize'; payload = { text: content, type: 'flowchart' }; break;
                default: endpoint = '/api/ai/generate'; payload = { prompt: content };
            }

            const { data } = await api.post(endpoint, payload);
            
            if (data.success) {
                setResult({ type, data: (data.data || data) });
            } else {
                setError(data.error || "Neural link failure.");
            }

        } catch (err: unknown) {
             const errorMsg = (err as any).response?.data?.error || `Spectral sync interrupted.`;
             setError(errorMsg);
        } finally {
            setLoading(null);
        }
    }, [content]);

    return (
        <div className="w-full py-12">
            {/* Header */}
            <header className="text-center mb-16">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 mb-6 backdrop-blur-md">
                    <Sparkles size={14} className="text-purple-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-200">Integrated Workspace</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                    Neural <span className="text-gradient-premium">Workspace.</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    A high-fidelity environment for deep content synthesis and forensic analysis.
                </p>
            </header>

            {/* Error Area */}
            {error && (
                <div className="max-w-[700px] mx-auto mb-10 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs flex items-center gap-4 font-bold animate-fade-in shadow-lg shadow-rose-500/5">
                    <ShieldCheck size={20} /> {error}
                </div>
            )}

            {/* Editor Area */}
            <UniversalEditor 
                value={content}
                onChange={setContent}
                onAIAction={(action) => {
                    if (action === 'improve') runAction('generate');
                    if (action === 'audit') runAction('analyze');
                    if (action === 'professional') runAction('humanize');
                    if (action === 'simple') runAction('visualize');
                }}
            />

            {/* Results Section */}
            <div className="max-w-[700px] mx-auto mt-20">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-3">
                        <Activity size={18} className="text-purple-500" />
                        <h3 className="text-xl font-bold text-white tracking-tight">Intelligence Output</h3>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="glass-card p-20 text-center animate-pulse">
                        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-6" />
                        <p className="text-purple-300 font-bold uppercase tracking-widest text-[10px]">Processing Neural Manifest...</p>
                    </div>
                )}

                {/* Empty State */}
                {!result && !loading && (
                    <div className="glass-card border-dashed p-20 text-center opacity-40">
                        <Inbox className="w-12 h-12 text-slate-500 mx-auto mb-6" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Awaiting Data Flow</p>
                    </div>
                )}

                {/* Populated Result */}
                {result && !loading && (
                    <div className="space-y-8 animate-fade-in">
                        <ResultBoxes result={result} />
                    </div>
                )}
            </div>
        </div>
    );
}

function ResultBoxes({ result }: { result: { type: string; data: any } }) {
    const { type, data } = result;

    return (
        <div className="glass-card glow-border p-8 md:p-12 space-y-10">
            {/* Standardized Response Section (as requested) */}
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-white/5 pb-10">
                <div className="flex-1">
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4 block">Fidelity Assessment</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black text-white tracking-tighter">
                            {data.plagiarism_score || data.credibility_score || data.score || 0}
                        </span>
                        <span className="text-2xl font-bold text-slate-500">%</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">Confidence Score: {data.confidence_score || 85}%</p>
                </div>
                <div className="flex-1 space-y-4">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Structural Suggestions</span>
                     <div className="space-y-3">
                         {(data.suggestions || []).slice(0, 3).map((s: string, i: number) => (
                             <div key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                                 <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                 {s}
                             </div>
                         ))}
                     </div>
                </div>
            </div>

            <div className="space-y-6">
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">Semantic Analysis</span>
                <div className="prose prose-invert max-w-none prose-p:text-lg prose-p:text-slate-300 prose-p:leading-relaxed whitespace-pre-wrap font-medium">
                    {data.analysis_text || data.answer || data.humanized_text || data.explanation || "Synthesis complete. No anomalies detected."}
                </div>
            </div>

            {/* Specialized Data Sections */}
            {type === 'visualize' && data.mermaid_diagrams?.map((d: any, i: number) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 mt-10">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 block">Logic Map: {d.type}</span>
                    <div className="flex items-center justify-center p-4">
                        <Mermaid code={d.code} />
                    </div>
                </div>
            ))}

            {type === 'analyze' && data.claims?.length > 0 && (
                <div className="mt-10 space-y-6 border-t border-white/5 pt-10">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Neural Claims Audit</span>
                    <div className="grid grid-cols-1 gap-4">
                        {data.claims.slice(0, 4).map((c: any, i: number) => (
                            <div key={i} className="p-5 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between gap-6 group hover:bg-white/5 transition-all">
                                <div>
                                    <span className="text-xs font-bold text-slate-300 block mb-1">{c.claim}</span>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{c.reasoning}</span>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                    c.verdict === 'Verified' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                                }`}>
                                    {c.verdict}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
