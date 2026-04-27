import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Dna, 
    Scan, 
    Zap, 
    Activity, 
    Shield, 
    BarChart3, 
    Fingerprint,
    Loader2,
    CheckCircle2,
    Info,
    MoveRight
} from 'lucide-react';
import api from '../services/api';

interface DnaResult {
    overall_dna: string;
    metrics: {
        tone: string;
        complexity_score: number;
        readability_level: string;
        ai_probability: number;
        bias_index: string;
    };
    stylistic_traits: string[];
    visual_data: {
        lexical_richness: number;
        sentence_variation: number;
        robotic_markers: number;
    };
}

export default function WritingDna() {
    const [text, setText] = useState('');
    const [result, setResult] = useState<DnaResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!text.trim() || text.length < 50) {
            setError('Please provide at least 50 characters for a valid stylistic signature.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/api/ai/dna', { text });
            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || 'Failed to extract DNA sequence.');
            }
        } catch {
            setError('Neural link synchronization failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400">
                        <Fingerprint size={14} /> Stylistic Biometrics
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tight text-white">
                        Writing <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">DNA</span> Analyzer.
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl font-medium">
                        Deconstruct any text into its core linguistic components to detect authorship markers, AI probability, and psychological tone.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Input Section */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                    <div className="glass-card relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Dna size={120} className="text-indigo-500" />
                        </div>
                        
                        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Scan size={18} className="text-indigo-400" />
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Neural Input Stream</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500">{text.length} CHR</span>
                        </div>

                        <textarea 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-[400px] p-10 bg-transparent text-white placeholder-slate-700 outline-none resize-none text-xl leading-relaxed custom-scrollbar"
                            placeholder="Paste the text you want to analyze... (Min 50 chars)"
                        />

                        <div className="p-8 bg-black/20 flex items-center justify-between">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={12} /> Real-time tracking enabled
                            </div>
                            <button 
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="group flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(79,70,229,0.3)]"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        EXTRACT DNA <MoveRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                    <AnimatePresence mode="wait">
                        {!result && !loading ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center p-12 glass-card text-center border-dashed border-white/10 opacity-40 min-h-[500px]"
                            >
                                <Dna size={64} className="text-slate-700 mb-8" />
                                <h3 className="text-xl font-bold text-slate-500 mb-2">Awaiting Manifest</h3>
                                <p className="text-slate-600 text-sm max-w-xs">Enter text and initiate the neural extraction to see stylistic biometrics.</p>
                            </motion.div>
                        ) : loading ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center p-12 glass-card min-h-[500px]"
                            >
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl animate-pulse rounded-full" />
                                    <Dna size={64} className="text-indigo-500 animate-spin relative z-10" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">Sequencing...</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">Deconstructing linguistic structures</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Overall Summary */}
                                <div className="glass-card p-8 bg-indigo-600 border-none shadow-2xl">
                                    <h4 className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em] mb-4">Stylistic Signature</h4>
                                    <p className="text-2xl font-black text-white leading-tight">
                                        "{result.overall_dna}"
                                    </p>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <MetricCard label="Complexity" value={`${result.metrics.complexity_score}%`} icon={BarChart3} />
                                    <MetricCard label="AI Probability" value={`${result.metrics.ai_probability}%`} icon={Zap} color={result.metrics.ai_probability > 50 ? 'text-rose-400' : 'text-emerald-400'} />
                                    <MetricCard label="Tone" value={result.metrics.tone} icon={Activity} />
                                    <MetricCard label="Bias" value={result.metrics.bias_index} icon={Shield} />
                                </div>

                                {/* Stylistic Traits */}
                                <div className="glass-card p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={16} className="text-indigo-400" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linguistic Traits</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {result.stylistic_traits.map((trait, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-bold text-slate-300">
                                                {trait}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Technical Visuals */}
                                <div className="glass-card p-8 space-y-6">
                                    <div className="flex items-center gap-2">
                                        <Info size={16} className="text-slate-500" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Matrix</span>
                                    </div>
                                    <div className="space-y-5">
                                        <ProgressBar label="Lexical Richness" value={result.visual_data.lexical_richness} />
                                        <ProgressBar label="Sentence Variation" value={result.visual_data.sentence_variation} />
                                        <ProgressBar label="Robotic Markers" value={result.visual_data.robotic_markers} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold text-center animate-shake">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, color = 'text-white' }: { label: string, value: string | number, icon: any, color?: string }) {
    return (
        <div className="glass-card p-6 border-white/5 bg-white/5 relative group overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={64} />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</span>
                <span className={`text-2xl font-black ${color} tracking-tight`}>{value}</span>
            </div>
        </div>
    );
}

function ProgressBar({ label, value }: { label: string, value: number }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
                <span className="text-[10px] font-black text-white">{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className="h-full bg-indigo-500 rounded-full"
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}
