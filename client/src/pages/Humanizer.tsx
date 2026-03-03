import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Copy, Check, Loader2, Sparkles, Info } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';
import { VoiceInput } from '../components/VoiceInput';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';

const TONES = ['Professional', 'Casual', 'Academic', 'Creative', 'Technical'];

export default function Humanizer() {
    const [text, setText] = useState('');
    const [tone, setTone] = useState('Professional');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const handleHumanize = async () => {
        if (!text.trim()) return;
        if (loading) return;
        setLoading(true);
        setResult(null);
        try {
            const { data } = await api.post('/api/humanize', { text, tone });
            setResult(data);
            setLoading(false);
        } catch (err: any) {
            console.error("Humanizer failure:", err);
            if (err.message === "Duplicate request detected" || err.message === "canceled" || err.name === "CanceledError") {
                return;
            }
            setLoading(false);
            // Result is null, so error UI will show if managed, or just stop loading
        }
    };

    const handleTranscription = (t: string) => {
        setText(prev => prev ? `${prev} ${t}` : t);
    };

    const copyToClipboard = () => {
        if (!result?.humanized_text) return;
        navigator.clipboard.writeText(result.humanized_text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
            <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                    <Logo variant="icon" className="w-3 h-3 text-indigo-500" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Humanizer</span>
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Humanizer</h1>
                <p className="text-slate-500 font-medium">Improve the flow and readability of your content.</p>
            </header>

            <div className="laptop-mock">
                <div className="laptop-screen">
                    <div className="split-view">
                        {/* INPUT PANE */}
                        <div className="pane-input">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Tone</span>
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {TONES.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t)}
                                        className={`px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${tone === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                                    >
                                        {t.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Content</span>
                                <div className="flex items-center gap-2">
                                    <VoiceInput onTranscription={handleTranscription} />
                                    <SmartProcessingToolbar onTextExtracted={setText} />
                                </div>
                            </div>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Paste AI-generated text here..."
                                className="custom-editor h-[320px] resize-none"
                            />

                            <button
                                onClick={handleHumanize}
                                disabled={loading || !text}
                                className="premium-btn-primary w-full mt-8 flex items-center justify-center gap-3 py-4"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Humanize
                                    </>
                                )}
                            </button>
                        </div>

                        {/* OUTPUT PANE */}
                        <div className="pane-output">
                            {!result && !loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                    <User size={64} className="text-slate-700 mb-6" />
                                    <p className="text-slate-500 font-medium italic">Select a tone and enter content to begin.</p>
                                </div>
                            ) : loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-center relative overflow-hidden rounded-2xl">
                                    <div className="absolute inset-0 shimmer opacity-50" />
                                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6 relative z-10" />
                                    <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] relative z-10 animate-pulse">Processing...</p>
                                </div>

                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Result // {tone}</span>
                                        </div>
                                        <button onClick={copyToClipboard} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
                                            {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                                        </button>
                                    </div>

                                    <div className="bg-[#0f1423] rounded-2xl p-8 border border-indigo-500/10 shadow-inner">
                                        <p className="text-slate-200 leading-[1.8] text-base whitespace-pre-wrap">{result.humanized_text}</p>
                                    </div>

                                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex items-start gap-3">
                                        <Info size={16} className="text-indigo-400 mt-1 shrink-0" />
                                        <p className="text-[12px] text-slate-400 leading-relaxed italic">
                                            The humanizer has adjusted the content to better replicate natural human writing patterns using the {tone} style.
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
