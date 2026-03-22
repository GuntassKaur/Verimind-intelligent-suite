import { useState, useCallback, useRef } from 'react';
import {
    Wand2, ShieldCheck,
    Search, Brain, Network,
    Loader2, Inbox, Upload, Trash2, Check,
} from 'lucide-react';
import api from '../services/api';
import { Mermaid } from '../components/Mermaid';

const TOOLS = [
    { key: 'generate', label: 'Write Context', desc: 'AI content generator', icon: Wand2 },
    { key: 'analyze', label: 'Truth Audit', desc: 'Verify fact & claims', icon: ShieldCheck },
    { key: 'plagiarism', label: 'Plagiarism', desc: 'Check original text', icon: Search },
    { key: 'humanize', label: 'Writing DNA', desc: 'Detect AI origins', icon: Brain },
    { key: 'visualize', label: 'Knowledge Map', desc: 'Generate visual charts', icon: Network },
];

export default function Workspace() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            let payload: any = {};

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
                setError(data.error || "Action failed.");
            }

        } catch (err: any) {
             setError(err.response?.data?.error || `Server disconnected. Ensure backend is running.`);
        } finally {
            setLoading(null);
        }
    }, [content]);

    return (
        <div className="w-full max-w-6xl mx-auto py-12 px-4 md:px-8">
            {/* Header */}
            <header className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3">All-in-one AI Writing & Analysis Tool</h1>
                <p className="text-slate-400 text-sm max-w-2xl mx-auto">Generate content, verify facts, detect plagiarism, and visualize knowledge cleanly.</p>
            </header>

            {/* Error Area */}
            {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-3">
                    <ShieldCheck size={18} /> {error}
                </div>
            )}

            {/* Tools Grid - One clean row/grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {TOOLS.map(tool => (
                    <button 
                        key={tool.key}
                        onClick={() => runAction(tool.key)}
                        disabled={loading !== null}
                        className={`clean-card p-4 text-left flex flex-col items-start gap-4 transition-colors disabled:opacity-50 ${loading === tool.key ? 'border-primary bg-primary/10' : 'hover:border-slate-500'}`}
                    >
                        <div className={`p-2 rounded-lg ${loading === tool.key ? 'bg-primary text-white' : 'bg-slate-800 text-slate-300'}`}>
                            {loading === tool.key ? <Loader2 className="animate-spin" size={20} /> : <tool.icon size={20} />}
                        </div>
                        <div>
                            <span className={`block text-sm font-semibold ${loading === tool.key ? 'text-primary' : 'text-slate-200'}`}>{tool.label}</span>
                            <span className="block text-[11px] text-slate-500 mt-1">{tool.desc}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Editor Area */}
            <div className="clean-card mb-10 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Text Editor</span>
                    <div className="flex items-center gap-3">
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-700 rounded-md text-slate-400 transition-colors" title="Upload File">
                            <Upload size={16} />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".txt" onChange={(e)=>{
                            const f=e.target.files?.[0]; if(!f)return;
                            const r=new FileReader(); r.onload=(ev)=>setContent((ev.target?.result as string)||''); r.readAsText(f);
                        }} />
                        <button onClick={() => setContent('')} className="p-2 hover:bg-slate-700 rounded-md text-slate-400 transition-colors" title="Clear">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
                <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Provide text here..."
                    className="w-full bg-transparent text-slate-200 placeholder:text-slate-600 outline-none resize-none px-6 py-6 font-medium leading-relaxed min-h-[250px] max-h-[300px] overflow-y-auto"
                />
            </div>

            {/* Results Header */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Results</h3>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="clean-card p-16 text-center bg-primary/5 border-primary/20">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-primary font-medium">Processing request...</p>
                </div>
            )}

            {/* Empty State */}
            {!result && !loading && (
                <div className="clean-card border-dashed border-slate-700 p-16 text-center">
                    <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Your result will appear here</p>
                </div>
            )}

            {/* Populated Result */}
            {result && !loading && (
                <ResultBoxes result={result} />
            )}
        </div>
    );
}

// Sub-component rendering the separate boxes cleanly
function ResultBoxes({ result }: { result: any }) {
    const { type, data } = result;

    if (type === 'analyze') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="clean-card p-6 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Score</span>
                    <span className="text-6xl font-bold text-primary">{data.credibility_score}%</span>
                    <span className="text-xs text-slate-500 mt-2">Credibility</span>
                </div>
                <div className="clean-card p-6">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 block">Analysis</span>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.simple_explanation || "Detailed analysis completed."}</p>
                </div>
                <div className="clean-card p-6">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 block">Suggestions & Claims</span>
                    <ul className="text-sm text-slate-300 space-y-4">
                        {data.suggestions?.length > 0 ? data.suggestions.slice(0,3).map((s: string, i: number) => (
                            <li key={i} className="flex gap-3"><Check size={16} className="text-emerald-400 shrink-0"/> {s}</li>
                        )) : (
                            data.claims?.slice(0, 3).map((c: any, i: number) => (
                                <li key={i} className="border-b border-white/5 pb-3">
                                    <span className={`font-semibold block mb-1 ${c.verdict === 'True' || c.verdict === 'Verified' ? 'text-emerald-400' : 'text-rose-400'}`}>{c.verdict}</span> 
                                    <span className="text-slate-400 text-xs">{c.claim}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        );
    }

    if (type === 'plagiarism') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="clean-card p-6 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Score</span>
                    <span className="text-6xl font-bold text-emerald-400">{data.score}%</span>
                    <span className="text-xs text-slate-500 mt-2">{data.verdict}</span>
                </div>
                <div className="clean-card p-6">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 block">Analysis</span>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.explanation}</p>
                </div>
                <div className="clean-card p-6">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 block">Suggestions & Alerts</span>
                    <div className="space-y-3">
                        {(data.suspicious_segments || []).length > 0 ? data.suspicious_segments.slice(0, 3).map((seg: any, i: number) => (
                            <div key={i} className="p-3 bg-slate-800/50 rounded border border-slate-700/50 text-xs text-slate-300">
                                "{seg.sentence}"
                            </div>
                        )) : (
                            <div className="text-slate-400 text-sm">No suspicious sentences found. Great job!</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'visualize') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="clean-card p-6 flex flex-col justify-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 block">Analysis Summary</span>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.summary}</p>
                </div>
                <div className="clean-card p-6 md:col-span-2 overflow-x-auto">
                    {data.mermaid_diagrams?.map((d: any, i: number) => (
                        <div key={i}>
                             <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 block">{d.type} Chart</span>
                             <div className="min-h-[250px] flex items-center justify-center bg-white p-4 rounded-xl text-black overflow-x-auto">
                                  <Mermaid code={d.code} />
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Default for Generate / Humanize
    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="clean-card p-6 col-span-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 block">Analysis / Output</span>
                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {data.answer || data.humanized_text || data.text}
                </div>
            </div>
        </div>
    );
}
