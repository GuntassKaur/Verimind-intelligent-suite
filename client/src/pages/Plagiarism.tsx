import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';
import { VoiceInput } from '../components/VoiceInput';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';

export default function Plagiarism() {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleScan = async () => {
        if (!text.trim()) {
            setError("Please provide content to scan for plagiarism.");
            return;
        }
        setError('');
        if (loading) return;
        setLoading(true);
        setResult(null);
        try {
            const { data } = await api.post('/api/plagiarism', { text });
            setResult(data);
            setLoading(false);
        } catch (err: any) {
            console.error("Plagiarism scan failure:", err);
            if (err.message === "Duplicate request detected" || err.message === "canceled" || err.name === "CanceledError") {
                return;
            }
            setError("Connection failed. Please check your network.");
            setLoading(false);
        }
    };

    const handleTranscription = (t: string) => {
        setText(prev => prev ? `${prev} ${t}` : t);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
            <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                    <Logo variant="icon" className="w-3 h-3 text-indigo-500" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Plagiarism Checker</span>
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Plagiarism Checker</h1>
                <p className="text-slate-500 font-medium">Check content originality and detect similarities.</p>
            </header>

            <div className="laptop-mock">
                <div className="laptop-screen">
                    <div className="split-view">
                        {/* INPUT PANE */}
                        <div className="pane-input">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Content</h3>
                                <div className="flex items-center gap-2">
                                    <VoiceInput onTranscription={handleTranscription} />
                                    <SmartProcessingToolbar onTextExtracted={setText} />
                                </div>
                            </div>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Paste the content to be checked for originality..."
                                className="custom-editor h-[440px] resize-none"
                            />

                            {error && (
                                <div className="mt-4 p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm font-medium">
                                    <AlertTriangle size={18} />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleScan}
                                disabled={loading}
                                className="premium-btn-primary w-full mt-8 flex items-center justify-center gap-3 py-4"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Scanning...
                                    </>
                                ) : (
                                    <>
                                        <Shield size={20} />
                                        Start
                                    </>
                                )}
                            </button>
                        </div>

                        {/* OUTPUT PANE */}
                        <div className="pane-output">
                            {!result && !loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                    <ShieldCheck size={64} className="text-slate-700 mb-6" />
                                    <p className="text-slate-500 font-medium italic">Run a scan to view results.</p>
                                </div>
                            ) : loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-center relative overflow-hidden rounded-2xl">
                                    <div className="absolute inset-0 shimmer opacity-50" />
                                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6 relative z-10" />
                                    <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] relative z-10 animate-pulse">Scanning...</p>
                                </div>

                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="glass-card p-6 border-indigo-500/10">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Similarity Score</span>
                                            <div className={`text-4xl font-black ${result.score > 20 ? 'text-rose-500' : 'text-emerald-400'}`}>
                                                {result.score}%
                                            </div>
                                        </div>
                                        <div className="glass-card p-6 border-indigo-500/10">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Verdict</span>
                                            <div className={`text-xl font-bold ${result.verdict === 'Low' ? 'text-emerald-400' : result.verdict === 'Medium' ? 'text-amber-400' : 'text-rose-500'}`}>
                                                {result.verdict.toUpperCase()} RISK
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-card p-8 bg-black/20">
                                        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Summary</h4>
                                        <p className="text-slate-300 leading-relaxed text-sm">{result.explanation}</p>
                                    </div>

                                    {result.suspicious_segments?.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-4">Similar Content</h4>
                                            {result.suspicious_segments.map((seg: any, i: number) => (
                                                <div key={i} className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl relative group">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/40 rounded-l-xl"></div>
                                                    <p className="text-sm text-white font-medium mb-2 pr-6">"{seg.sentence}"</p>
                                                    <div className="flex items-center gap-2 text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                                                        <AlertTriangle size={12} />
                                                        {seg.reason}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {result.score === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 text-emerald-400">
                                            <CheckCircle2 size={48} className="mb-4" />
                                            <span className="font-bold">Originality Verified</span>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
