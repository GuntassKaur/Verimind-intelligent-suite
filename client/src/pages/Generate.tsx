import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, 
    Loader2, 
    CheckCircle2,
    Copy,
    Terminal,
    Sparkles,
    Printer,
    Activity,
    Code,
    FileText,
    Eye,
    Globe
} from 'lucide-react';

import { generatePDF } from '../utils/pdfExport';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { UniversalEditor } from '../components/UniversalEditor';

export default function Generate() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'content' | 'website'>('content');
    const [copied, setCopied] = useState(false);
    const [previewMode, setPreviewMode] = useState<'code' | 'render'>('code');

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Neural prompt required for synthesis.');
            return;
        }
        setLoading(true);
        setError('');
        setResult('');

        try {
            const systemPrompt = mode === 'website' 
                ? "You are a professional web architect. Generate CLEAN, MODERN, and RESPONSIVE HTML5 and CSS3 code (single file) for the requested website. Use Tailwind CSS via CDN. Output ONLY the code, no markdown blocks."
                : "You are a senior content strategist. Generate high-fidelity research or content based on the prompt.";

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/generate-stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: mode === 'website' ? `Build this website: ${prompt}` : prompt, system_instruction: systemPrompt }),
            });

            if (!response.ok) throw new Error('Neural link failed.');
            
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error('Stream logic failed.');

            let currentText = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '');
                        if (dataStr === '[DONE]') break;
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.chunk) {
                                currentText += data.chunk;
                                setResult(currentText);
                            }
                        } catch (e) {}
                    }
                }
            }
        } catch {
             setError('System interrupt in Synthesis module. Neural link failed.');
        } finally {
            setLoading(false);
        }
    }, [prompt, mode]);

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <header className="mb-20 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 mb-8">
                    <Zap size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Forge v5.0</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-none text-white">
                    Creative <span className="text-gradient-premium italic">Foundry.</span>
                </h1>
                
                {/* Mode Selector */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-12">
                    <button 
                        onClick={() => setMode('content')}
                        className={`px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'content' ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-slate-500 hover:text-white border border-white/5'}`}
                    >
                        <FileText size={16} /> Content Mode
                    </button>
                    <button 
                        onClick={() => setMode('website')}
                        className={`px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'website' ? 'bg-blue-600 text-white shadow-[0_0_300px_rgba(37,99,235,0.3)] border border-blue-400/30' : 'bg-white/5 text-slate-500 hover:text-white border border-white/5'}`}
                    >
                        <Globe size={16} /> Website Architect
                    </button>
                </div>
            </header>

            {/* Input Area */}
            <div className="p-1 rounded-[3.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/5 shadow-2xl">
                <div className="bg-[#0b0f1a] rounded-[3.3rem] p-8 md:p-12">
                    <UniversalEditor 
                        value={prompt}
                        onChange={setPrompt}
                        placeholder={mode === 'website' ? "Describe the website structure, theme, and components..." : "Define the neural logic for synthesis..."}
                        minHeight="200px"
                    />
                    <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/5">
                        <div className="flex gap-6">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Logic Node</span>
                                <span className="text-xs font-bold text-white uppercase italic tracking-tighter">Gemini Flash 1.5</span>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Spectral Status</span>
                                <span className="text-xs font-bold text-emerald-400 uppercase italic tracking-tighter">Optimal</span>
                            </div>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className={`px-12 py-6 rounded-[2.2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-4 ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'premium-btn-primary hover:scale-[1.05] shadow-2xl shadow-amber-500/20'
                            }`}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            {loading ? 'Forging...' : 'Initiate Synthesis'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-4 max-w-2xl mx-auto">
                    <Terminal size={18} /> {error}
                </div>
            )}

            {/* Output Display */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center space-y-10 animate-pulse">
                         <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                         <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em]">Defragmenting Neural Manifest</span>
                    </div>
                ) : result ? (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                        <div className="glass-card glow-border p-8 md:p-12 overflow-hidden flex flex-col min-h-[600px]">
                            <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b border-white/5 pb-10">
                                <div className="flex items-center gap-6">
                                    <div className={`p-5 rounded-2xl ${mode === 'website' ? 'bg-blue-600/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'} border border-white/10`}>
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white tracking-tight">Synthesized Architecture</h3>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Fidelity: Neural Sovereign v2</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {mode === 'website' && (
                                        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 mr-4">
                                            <button 
                                                onClick={() => setPreviewMode('code')}
                                                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${previewMode === 'code' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                                            >
                                                Code
                                            </button>
                                            <button 
                                                onClick={() => setPreviewMode('render')}
                                                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${previewMode === 'render' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                                            >
                                                Preview
                                            </button>
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} 
                                        className="px-8 py-3.5 rounded-xl text-[10px] font-black border border-white/10 text-slate-400 hover:text-white transition-all"
                                    >
                                        {copied ? 'Captured' : 'Copy Manifest'}
                                    </button>
                                    <button onClick={() => generatePDF()} className="p-3.5 bg-white text-[#0b0f1a] rounded-xl hover:scale-110 transition-all shadow-2xl">
                                        <Printer size={18} />
                                    </button>
                                </div>
                            </header>

                            <div className="flex-1 bg-[#05070a]/50 rounded-[2.5rem] border border-white/5 p-8 overflow-auto custom-scrollbar">
                                {mode === 'website' && previewMode === 'render' ? (
                                    <iframe 
                                        srcDoc={result}
                                        title="Website Preview"
                                        className="w-full min-h-[500px] border-none bg-white rounded-2xl"
                                    />
                                ) : (
                                    <pre className={`text-slate-300 text-sm font-mono leading-relaxed whitespace-pre-wrap ${mode === 'website' ? 'text-blue-300/80' : ''}`}>
                                        {result}
                                    </pre>
                                )}
                            </div>

                            <footer className="mt-12 pt-8 flex items-center justify-between opacity-40">
                                <div className="flex items-center gap-3">
                                    <Activity size={12} className="text-amber-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Stability Verified</span>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Architect: NeuralForge Core</span>
                            </footer>
                        </div>
                    </motion.div>
                ) : (
                    <div className="py-40 flex flex-col items-center justify-center text-center opacity-20">
                         <div className="w-24 h-24 rounded-[3rem] border border-dashed border-slate-500 flex items-center justify-center mb-10">
                            <Code size={40} />
                         </div>
                         <h3 className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 text-white">Foundry Static</h3>
                         <p className="text-xs font-medium italic">Logic manifests appear here after neural initialization.</p>
                    </div>
                )}
            </AnimatePresence>
            
            {result && mode === 'content' && <IntelligenceReport data={{ answer: result }} type="general" content={prompt} />}
        </div>
    );
}
