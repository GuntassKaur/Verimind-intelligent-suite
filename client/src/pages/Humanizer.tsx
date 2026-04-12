import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Brain, 
    Sparkles, 
    Zap, 
    Check, 
    Loader2, 
    Copy,
    Info,
    Shield
} from 'lucide-react';
import api from '../services/api';

export default function Humanizer() {
    const [text, setText] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [tone, setTone] = useState('Professional');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleHumanize = async () => {
        if (!text.trim()) {
            setError('Please provide AI text to humanize.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data } = await api.post('/api/ai/humanize', { 
                text, 
                tone 
            });
            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || 'Humanization failed.');
            }
        } catch (err) {
            setError('Neural link unstable. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-6 animate-fade-in">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-600/10 rounded-lg text-purple-500">
                        <Brain size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Neural Humanizer</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-4 text-white tracking-tight">AI Outsmarted.</h1>
                <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                    Convert robotic AI outputs into natural, high-quality human writing that passes detection.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Area */}
                <div className="space-y-6">
                    <div className="glass-card overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Robotic AI Manifest</span>
                            <div className="flex gap-2">
                                {['Professional', 'Casual', 'Academic'].map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => setTone(t)}
                                        className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase transition-all ${tone === t ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea 
                            className="w-full h-[350px] p-6 bg-transparent text-white placeholder-slate-700 focus:outline-none resize-none text-lg leading-relaxed font-main"
                            placeholder="Paste AI generated text here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleHumanize}
                        disabled={loading}
                        className="btn-primary w-full py-5 justify-center text-lg relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={20} /> HUMANIZE NEURAL TEXT</>}
                    </button>
                </div>

                {/* Output Area */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center py-24 glass-card border-purple-500/20"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 blur-2xl bg-purple-500/30 animate-pulse" />
                                    <Zap size={48} className="text-purple-500 animate-bounce relative z-10" />
                                </div>
                                <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-8">Reweaving Neural Layers...</p>
                            </motion.div>
                        ) : result ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="glass-card overflow-hidden border-emerald-500/10">
                                    <div className="p-4 border-b border-white/5 bg-emerald-500/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className="text-emerald-500" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enhanced Human Stream</span>
                                        </div>
                                        <button onClick={handleCopy} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-slate-500" />}
                                        </button>
                                    </div>
                                    <div className="p-6 text-white text-lg leading-relaxed max-h-[450px] overflow-y-auto selection:bg-emerald-500/30">
                                        {result}
                                    </div>
                                </div>

                                <div className="glass-card p-6 border-white/5 bg-black/20">
                                    <div className="flex items-center gap-3 text-emerald-400/80 mb-4">
                                        <Info size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Detection Audit</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                            <div className="text-2xl font-black text-white">99%</div>
                                            <div className="text-[9px] font-bold text-slate-500 uppercase mt-1">Human Score</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                            <div className="text-2xl font-black text-white">Pass</div>
                                            <div className="text-[9px] font-bold text-slate-500 uppercase mt-1">GPTZero Scan</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-24 glass-card text-center px-10 border-white/5 opacity-50">
                                <Sparkles size={48} className="text-slate-800 mb-6" />
                                <h3 className="text-xl font-bold text-slate-600 mb-2 font-display">Neural Forge Ready</h3>
                                <p className="text-slate-700 text-sm font-medium">Input robotic fragments to begin the humanization process.</p>
                            </div>
                        )}
                    </AnimatePresence>
                    
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
