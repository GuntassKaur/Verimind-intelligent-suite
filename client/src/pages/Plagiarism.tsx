import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Loader2, AlertTriangle, CheckCircle2, Search, Printer } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';
import { VoiceInput } from '../components/VoiceInput';
import { SmartProcessingToolbar } from '../components/SmartProcessingToolbar';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';

interface SuspiciousSegment {
    sentence: string;
    reason: string;
    risk: string;
}

interface PlagiarismResult {
    score: number;
    verdict: string;
    suspicious_segments: SuspiciousSegment[];
    explanation: string;
}

const SegmentCard = ({ segment, index }: { segment: SuspiciousSegment; index: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl relative group overflow-hidden"
    >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/40" />
        <p className="text-sm text-slate-100 font-medium mb-2 pr-6 leading-relaxed">"{segment.sentence}"</p>
        <div className="flex items-center gap-2 text-[10px] text-rose-400 font-black uppercase tracking-wider">
            <AlertTriangle size={12} />
            {segment.reason}
        </div>
    </motion.div>
);

export default function Plagiarism() {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PlagiarismResult | null>(null);
    const [error, setError] = useState('');

    const handleScan = useCallback(async () => {
        const trimmedText = text.trim();
        if (!trimmedText) {
            setError("Please provide content to scan for plagiarism.");
            return;
        }

        if (loading) return;

        setError('');
        setLoading(true);
        setResult(null);

        try {
            const { data } = await api.post('/api/plagiarism', { text: trimmedText });
            setResult(data);
        } catch (err: unknown) {
            console.error("Plagiarism scan failure:", err);
            if (err instanceof Error && err.name === "CanceledError") return;
            setError("Connection failed. Please check your network.");
        } finally {
            setLoading(false);
        }
    }, [text, loading]);

    const handleHumanize = useCallback(async () => {
        if (!text.trim() || loading) return;

        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/api/humanize', { text: text.trim(), tone: "Professional" });
            const newText = data.humanized_text || data.text || data;
            setText(newText);
            
            // Re-run scan with humanized text
            const scanResult = await api.post('/api/plagiarism', { text: newText });
            setResult(scanResult.data);
            
        } catch (err: unknown) {
            console.error("Humanization failure:", err);
            setError("Humanization or re-scan failed.");
        } finally {
            setLoading(false);
        }
    }, [text, loading]);

    const handleTranscription = useCallback((t: string) => {
        setText(prev => prev ? `${prev} ${t}` : t);
    }, []);

    const segmentsList = useMemo(() => {
        if (!result?.suspicious_segments) return null;
        return result.suspicious_segments.map((seg, i) => (
            <SegmentCard key={i} segment={seg} index={i} />
        ));
    }, [result?.suspicious_segments]);

    return (
        <div className="tool-container">
            <header className="mb-8 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 md:mb-6"
                >
                    <Logo variant="icon" className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Plagiarism Audit</span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Plagiarism Checker</h1>
                <p className="text-slate-400 font-medium text-base md:text-lg max-w-2xl">Detect semantic overlaps, AI patterns, and non-original content structures.</p>
            </header>

            <div className="laptop-mock">
                <div className="laptop-screen overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px] md:h-[800px] divide-y md:divide-y-0 md:divide-x divide-white/5">
                        {/* INPUT PANE */}
                        <div className="p-6 md:p-10 flex flex-col bg-[#0d1117]/30 overflow-y-auto custom-scrollbar">
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Original Material</label>
                                    <div className="flex items-center gap-2">
                                        <VoiceInput onTranscription={handleTranscription} />
                                        <SmartProcessingToolbar onTextExtracted={setText} />
                                    </div>
                                </div>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste content to be verified for originality..."
                                    className="custom-editor flex-1 min-h-[300px] mb-8"
                                />

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-xs font-bold"
                                    >
                                        <AlertTriangle size={18} />
                                        {error}
                                    </motion.div>
                                )}
                            </div>

                            <button
                                onClick={handleScan}
                                disabled={loading || !text.trim()}
                                className="premium-btn-primary w-full flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-indigo-600 to-purple-600"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Shield size={20} /> INITIATE SCAN</>}
                            </button>
                        </div>

                        {/* OUTPUT PANE */}
                        <div className="p-6 md:p-10 bg-black/40 flex flex-col overflow-y-auto custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {!result && !loading ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center text-center py-20"
                                    >
                                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5">
                                            <Search size={48} className="text-slate-700" />
                                        </div>
                                        <p className="text-slate-500 font-medium italic text-sm">Run a scan to analyze content architecture.</p>
                                    </motion.div>
                                ) : loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col space-y-8"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="shimmer h-32 w-full rounded-[2rem]" />
                                            <div className="shimmer h-32 w-full rounded-[2rem]" />
                                        </div>
                                        <div className="shimmer h-40 w-full rounded-[2rem] opacity-50" />
                                        <div className="space-y-4">
                                            <div className="shimmer h-24 w-full rounded-2xl opacity-30" />
                                            <div className="shimmer h-24 w-full rounded-2xl opacity-20" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-6 mb-6 no-print gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                                                    Status: Scanned
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                                                {result && result.score > 0 && (
                                                    <button
                                                        onClick={handleHumanize}
                                                        disabled={loading}
                                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                                                    >
                                                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />} 
                                                        <span className="whitespace-nowrap">Auto-Humanize & Scan</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={generatePDF}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                                                >
                                                    <Printer size={14} /> <span className="whitespace-nowrap">Download PDF</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="glass-panel p-6 md:p-8 min-h-[120px] md:min-h-[140px] border-indigo-500/20 bg-indigo-500/[0.03] flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Similarity Score</span>
                                                <div className={`text-4xl md:text-5xl font-black ${result && result.score > 20 ? 'text-rose-500' : 'text-emerald-400'}`}>
                                                    {result?.score}%
                                                </div>
                                            </div>
                                            <div className="glass-panel p-6 md:p-8 min-h-[120px] md:min-h-[140px] border-indigo-500/20 bg-indigo-500/[0.03] flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Neural Verdict</span>
                                                <div className={`text-xl md:text-2xl font-black ${result?.verdict === 'Low' ? 'text-emerald-400' : result?.verdict === 'Medium' ? 'text-amber-400' : 'text-rose-500'}`}>
                                                    {result?.verdict?.toUpperCase()} RISK
                                                </div>
                                            </div>
                                        </div>

                                        <div className="glass-panel p-8 bg-white/[0.02] border-white/5">
                                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Semantic Summary</h4>
                                            <p className="text-sm text-slate-300 leading-relaxed font-sans font-medium">{result?.explanation}</p>
                                        </div>

                                        {result && result.suspicious_segments && result.suspicious_segments.length > 0 && (
                                            <div className="space-y-4 pb-12">
                                                <div className="flex items-center justify-between px-1">
                                                    <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Risk Segments</h4>
                                                    <span className="text-[9px] text-slate-600 font-bold uppercase">Overlap detected</span>
                                                </div>
                                                {segmentsList}
                                            </div>
                                        )}

                                        {result?.score === 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex flex-col items-center justify-center py-16 text-emerald-400 glass-panel bg-emerald-500/[0.03] border-emerald-500/20 shadow-lg shadow-emerald-500/5 transition-all"
                                            >
                                                <CheckCircle2 size={56} className="mb-6 animate-pulse" />
                                                <span className="font-black text-sm uppercase tracking-[0.3em]">Originality Verified</span>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Hidden Print Report */}
            {result && <IntelligenceReport data={result} type="plagiarism" content={text} />}
        </div>
    );
}
