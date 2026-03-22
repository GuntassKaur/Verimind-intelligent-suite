import { useState, useCallback, useRef } from 'react';
import {
    Wand2, ShieldCheck,
    Search, Brain, Network,
    Loader2, Inbox, Upload, Trash2, Check,
} from 'lucide-react';
import api from '../services/api';
import { Mermaid } from '../components/Mermaid';

const TOOLS = [
    { key: 'generate', label: 'AI Writer', desc: 'Create content easily', icon: Wand2, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { key: 'analyze', label: 'Fact Checker', desc: 'Verify facts & claims', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { key: 'plagiarism', label: 'Plagiarism', desc: 'Find copied text', icon: Search, color: 'text-amber-600', bg: 'bg-amber-100' },
    { key: 'humanize', label: 'AI Detector', desc: 'Check if AI wrote it', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-100' },
    { key: 'visualize', label: 'Flowchart Maker', desc: 'Generate visual maps', icon: Network, color: 'text-rose-600', bg: 'bg-rose-100' },
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
            <header className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">All-in-one AI Writing & Analysis Tool</h1>
                <p className="text-slate-500 text-sm max-w-2xl mx-auto font-medium">Generate content, verify facts, detect plagiarism, and visualize knowledge cleanly.</p>
            </header>

            {/* Error Area */}
            {error && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex items-center gap-3 font-semibold shadow-sm">
                    <ShieldCheck size={18} /> {error}
                </div>
            )}

            {/* Tools Grid - Colorful but clean */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">
                {TOOLS.map(tool => (
                    <button 
                        key={tool.key}
                        onClick={() => runAction(tool.key)}
                        disabled={loading !== null}
                        className={`clean-card p-5 text-left flex flex-col items-start gap-4 transition-all disabled:opacity-50 hover:-translate-y-1 ${loading === tool.key ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'hover:border-slate-300'}`}
                    >
                        <div className={`p-2.5 rounded-xl ${loading === tool.key ? 'bg-indigo-600 text-white shadow-md' : `${tool.bg} ${tool.color}`}`}>
                            {loading === tool.key ? <Loader2 className="animate-spin" size={22} /> : <tool.icon size={22} />}
                        </div>
                        <div>
                            <span className={`block text-sm font-bold ${loading === tool.key ? 'text-indigo-600' : 'text-slate-800'}`}>{tool.label}</span>
                            <span className="block text-[11.5px] font-medium text-slate-500 mt-1">{tool.desc}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Editor Area */}
            <div className="clean-card mb-12 flex flex-col overflow-hidden bg-white">
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Text Editor</span>
                    <div className="flex items-center gap-3">
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-200 rounded-md text-slate-500 transition-colors" title="Upload File">
                            <Upload size={16} />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".txt" onChange={(e)=>{
                            const f=e.target.files?.[0]; if(!f)return;
                            const r=new FileReader(); r.onload=(ev)=>setContent((ev.target?.result as string)||''); r.readAsText(f);
                        }} />
                        <button onClick={() => setContent('')} className="p-2 hover:bg-rose-100 hover:text-rose-600 rounded-md text-slate-500 transition-colors" title="Clear">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
                <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Provide your text here..."
                    className="w-full bg-white text-slate-800 placeholder:text-slate-400 outline-none resize-y px-6 py-6 font-medium leading-relaxed min-h-[200px] max-h-[300px]"
                />
            </div>

            {/* Results Header */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Results</h3>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="clean-card p-16 text-center bg-indigo-50 border-indigo-100 shadow-inner">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-indigo-700 font-bold">Processing request...</p>
                </div>
            )}

            {/* Empty State */}
            {!result && !loading && (
                <div className="clean-card border-dashed border-2 border-slate-200 p-16 text-center bg-slate-50/50">
                    <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">Your result will appear here</p>
                </div>
            )}

            {/* Populated Result */}
            {result && !loading && (
                <ResultBoxes result={result} />
            )}
        </div>
    );
}

function ResultBoxes({ result }: { result: any }) {
    const { type, data } = result;

    if (type === 'analyze') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="clean-card p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-indigo-50 to-white">
                    <span className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-4">Credibility Score</span>
                    <span className="text-6xl font-extrabold text-indigo-600">{data.credibility_score}%</span>
                    <span className="text-xs font-semibold text-slate-500 mt-2">Overall Accuracy</span>
                </div>
                <div className="clean-card p-8">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Analysis Breakdown</span>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">{data.simple_explanation || "Detailed analysis completed."}</p>
                </div>
                <div className="clean-card p-8">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Actionable Insights</span>
                    <ul className="text-sm text-slate-700 space-y-4 font-medium">
                        {data.suggestions?.length > 0 ? data.suggestions.slice(0,3).map((s: string, i: number) => (
                            <li key={i} className="flex gap-3 items-start"><Check size={18} className="text-emerald-500 shrink-0 mt-0.5"/> {s}</li>
                        )) : (
                            data.claims?.slice(0, 3).map((c: any, i: number) => (
                                <li key={i} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                                    <span className={`font-bold block mb-1.5 ${c.verdict === 'True' || c.verdict === 'Verified' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {c.verdict}
                                    </span> 
                                    <span className="text-slate-600 text-xs leading-relaxed block">{c.claim}</span>
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
                <div className="clean-card p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-amber-50 to-white">
                    <span className="text-xs font-black text-amber-500 uppercase tracking-widest mb-4">Originality Score</span>
                    <span className="text-6xl font-extrabold text-amber-500">{data.score}%</span>
                    <span className="text-xs font-bold text-slate-500 mt-2">{data.verdict}</span>
                </div>
                <div className="clean-card p-8">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Forensic Analysis</span>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">{data.explanation}</p>
                </div>
                <div className="clean-card p-8">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Suspicious Segments</span>
                    <div className="space-y-4">
                        {(data.suspicious_segments || []).length > 0 ? data.suspicious_segments.slice(0, 3).map((seg: any, i: number) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium italic">
                                "{seg.sentence}"
                            </div>
                        )) : (
                            <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
                                <Check size={18} className="text-emerald-500" />
                                No suspicious sentences found. Great job!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'visualize') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="clean-card p-8 flex flex-col justify-center bg-white">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Process Summary</span>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">{data.summary}</p>
                </div>
                <div className="clean-card p-8 md:col-span-2 overflow-x-auto bg-slate-50">
                    {data.mermaid_diagrams?.map((d: any, i: number) => (
                        <div key={i}>
                             <span className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 block">{d.type} Visual Map</span>
                             <div className="min-h-[250px] flex items-center justify-center text-black">
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
            <div className="clean-card p-8 bg-white shadow-sm border-indigo-100">
                <span className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-5 block">AI Output Stream</span>
                <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {data.answer || data.humanized_text || data.text}
                </div>
            </div>
        </div>
    );
}
