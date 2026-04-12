import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    Search, 
    Loader2, 
    Info,
    ArrowRight
} from 'lucide-react';
import api from '../services/api';

interface TruthResult {
    plagiarism_score: number;
    reliability_score: number;
    explanation: string;
    suggestions: string[];
}

export default function TruthChecker() {
    const [text, setText] = useState('');
    const [result, setResult] = useState<TruthResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheck = async () => {
        if (!text.trim()) {
            setError('Please provide text to verify.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/api/study/check', { text });
            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || 'Check failed.');
            }
        } catch {
            setError('Connection error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-6 animate-fade-in">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold mb-2 text-white">Truth & Plagiarism</h1>
                <p className="text-slate-400">Scan for plagiarism and verify the reliability of information in one step.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Area */}
                <div className="space-y-6">
                    <div className="glass-card overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verify Content</span>
                            <Search size={14} className="text-slate-600" />
                        </div>
                        <textarea 
                            className="w-full h-[300px] p-6 bg-transparent text-white placeholder-slate-600 focus:outline-none resize-none"
                            placeholder="Paste content here to check facts and plagiarism..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleCheck}
                        disabled={loading}
                        className="btn-primary w-full py-5 justify-center text-lg"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><ShieldCheck size={20} /> START VERIFICATION</>}
                    </button>
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Results Area */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center py-20 glass-card">
                                <Search size={40} className="text-emerald-500 animate-pulse mb-8" />
                                <div className="space-y-4 w-2/3">
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-emerald-500" />
                                    </div>
                                    <p className="text-center text-xs text-slate-600 font-bold uppercase tracking-widest">Scanning global records...</p>
                                </div>
                            </div>
                        ) : result ? (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                {/* Big Scores */}
                                <div className="grid grid-cols-2 gap-6">
                                    <ScoreCard 
                                        label="Plagiarism" 
                                        value={`${result.plagiarism_score}%`} 
                                        status={result.plagiarism_score > 20 ? 'bad' : 'good'} 
                                    />
                                    <ScoreCard 
                                        label="Reliability" 
                                        value={`${result.reliability_score}%`} 
                                        status={result.reliability_score > 70 ? 'good' : 'warning'} 
                                    />
                                </div>

                                {/* Detailed Explanation */}
                                <div className="glass-card p-8 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${result.reliability_score > 70 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                            <Info size={18} />
                                        </div>
                                        <h4 className="text-lg font-bold">Analysis Summary</h4>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed font-medium capitalize">
                                        {result.explanation}
                                    </p>
                                </div>

                                {/* Tips */}
                                <div className="glass-card p-6">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Improvement Tips</span>
                                    <div className="space-y-3">
                                        {result.suggestions.map((tip: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                                {tip}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-20 glass-card text-center px-10">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                    <Search size={40} className="text-slate-800" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-500">No results yet</h3>
                                <p className="text-slate-600 text-sm mt-2">Paste text and click verify to start the audit.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-12 glass-card p-8 bg-black/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-purple-600/10 rounded-2xl">
                        <ShieldCheck className="text-purple-500" size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold">Safe & Private</h4>
                        <p className="text-slate-500 text-sm">We don't store your academic content. All scans are transient.</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                    Learn about verification <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

function ScoreCard({ label, value, status }: { label: string, value: string, status: 'good' | 'warning' | 'bad' }) {
    const colors = {
        good: 'text-emerald-400 shadow-emerald-500/20',
        warning: 'text-amber-400 shadow-amber-500/20',
        bad: 'text-rose-400 shadow-rose-500/20'
    };

    return (
        <div className="glass-card p-8 flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">{label}</span>
            <span className={`text-5xl font-black transition-all group-hover:scale-110 ${colors[status]}`}>
                {value}
            </span>
            <div className={`mt-4 w-2 h-2 rounded-full ${status === 'good' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'} shadow-[0_0_10px_currentColor]`} />
        </div>
    );
}
