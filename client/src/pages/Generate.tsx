import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Check, Info, Loader2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';
import { VoiceInput } from '../components/VoiceInput';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';

export default function Generate() {
    const [prompt, setPrompt] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mode, setMode] = useState('Brief');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        if (loading) return;

        setLoading(true);
        setAnswer('');
        try {
            const { data } = await api.post('/api/generate', {
                query: prompt,
                response_type: mode
            });
            if (data.answer) {
                setAnswer(data.answer);
            } else {
                setAnswer(data.error || "Generation failed. Please try a different topic.");
            }
            setLoading(false);
        } catch (err: any) {
            console.error("Generation failure:", err);
            if (err.message === "Duplicate request detected" || err.message === "canceled") {
                return; // Let the original request finish, keep loading true
            }
            setAnswer("Connection failed. Please check your network.");
            setLoading(false);
        }
    };

    const handleTranscription = (text: string) => {
        setPrompt(prev => prev ? `${prev} ${text}` : text);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(answer);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
            <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                    <Logo variant="icon" className="w-3 h-3 text-indigo-500" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Content Generator</span>
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Generator</h1>
                <p className="text-slate-500 font-medium">Generate professional summaries and research content.</p>
            </header>

            <div className="laptop-mock">
                <div className="laptop-screen">
                    <div className="split-view">
                        {/* INPUT PANE */}
                        <div className="pane-input">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Topic Description</span>
                                <div className="flex items-center gap-2">
                                    <VoiceInput onTranscription={handleTranscription} />
                                    <SmartProcessingToolbar onTextExtracted={setPrompt} />
                                </div>
                            </div>

                            {/* MODE SELECTOR */}
                            <div className="flex gap-1 mb-6 p-1 bg-white/5 rounded-xl border border-white/5">
                                {['Brief', 'Research'].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMode(m)}
                                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === m
                                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Define the research topic or question (e.g., 'Historical significance of the Renaissance')..."
                                className="custom-editor h-[340px] resize-none"
                            />

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !prompt}
                                className="premium-btn-primary w-full mt-8 flex items-center justify-center gap-3 py-4"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Start
                                    </>
                                )}
                            </button>
                        </div>

                        {/* OUTPUT PANE */}
                        <div className="pane-output">
                            {!answer && !loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                    <Sparkles size={64} className="text-slate-700 mb-6" />
                                    <p className="text-slate-500 font-medium italic">Enter a topic to begin generating content.</p>
                                </div>
                            ) : loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-center relative overflow-hidden rounded-2xl">
                                    <div className="absolute inset-0 shimmer opacity-50" />
                                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6 relative z-10" />
                                    <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] relative z-10 animate-pulse">Generating...</p>
                                    <p className="text-[10px] text-slate-600 mt-2 font-bold uppercase tracking-widest relative z-10">Processing</p>
                                </div>

                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Generated Content</span>
                                        </div>
                                        <button onClick={copyToClipboard} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
                                            {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                                        </button>
                                    </div>

                                    <div className="bg-[#0f1423] rounded-2xl p-8 border border-white/5 shadow-inner">
                                        <p className="text-slate-200 leading-[1.8] text-base whitespace-pre-wrap font-sans">{answer}</p>
                                    </div>

                                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex items-start gap-3">
                                        <Info size={16} className="text-indigo-400 mt-1 shrink-0" />
                                        <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                            This content has been generated using VeriMind's advanced verification logic to minimize inaccuracy.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
