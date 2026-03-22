import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    RefreshCcw, 
    Copy, 
    Check, 
    GraduationCap, 
    Briefcase, 
    Smile, 
    BookOpen,
    Zap,
    Loader2,
    ChevronRight,
    Sparkles,
    Layout
} from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { UniversalEditor } from '../components/UniversalEditor';

interface RewriteResults {
  academic: string;
  professional: string;
  casual: string;
  storytelling: string;
}

export default function RewriteModes() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<RewriteResults | null>(null);
    const [activeMode, setActiveMode] = useState<'academic' | 'professional' | 'casual' | 'storytelling'>('professional');
    const [error, setError] = useState('');
    const [copying, setCopying] = useState<string | null>(null);

    const runRewrite = useCallback(async () => {
        if (!content.trim()) {
            setError('Please enter text to manifest new dimensions.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/api/ai/rewrite-modes', { text: content });
            if (data.success) {
                setResults(data.data);
            } else {
                setError(data.error || 'Cognitive shift failed.');
            }
        } catch (err: any) {
             setError(err.response?.data?.error || 'Rewrite frequency offline.');
        } finally {
            setLoading(false);
        }
    }, [content]);

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopying(key);
        setTimeout(() => setCopying(null), 2000);
    };

    const modes = [
        { key: 'academic', label: 'Academic', icon: GraduationCap, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { key: 'professional', label: 'Professional', icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { key: 'casual', label: 'Casual', icon: Smile, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { key: 'storytelling', label: 'Storytelling', icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    ] as const;

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 space-y-12 pb-32 transition-colors duration-500">
            {/* Header */}
            <header className="text-center space-y-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}
                >
                    <RefreshCcw size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Multi-Dimensional Linguistics</span>
                </motion.div>
                <h1 className={`text-4xl md:text-7xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Smart <span className="text-gradient">Rewriter</span>.
                </h1>
                <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto italic leading-relaxed">
                    "Instantly transform your manuscript into 4 distinct linguistic dimensions with neural precision."
                </p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Input Area (Left on Desktop) */}
                <div className="xl:col-span-12 space-y-10">
                    <UniversalEditor 
                        label="Original Manuscript"
                        value={content}
                        onChange={setContent}
                        minHeight="350px"
                        isDark={isDark}
                    />
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                             <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-100 border border-slate-200 shadow-inner'}`}>
                                  <Layout size={24} className="text-slate-500" />
                             </div>
                             <div>
                                  <h4 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Polarity Selection</h4>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">4 Dimensions Active</p>
                             </div>
                        </div>

                        <button 
                            onClick={runRewrite}
                            disabled={loading || !content.trim()}
                            className={`w-full md:w-auto px-16 py-8 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${
                                loading ? 'opacity-50' : 'premium-btn-primary shadow-2xl hover:scale-[1.02]'
                            }`}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                            {loading ? 'Cognitive Shift...' : 'Initialize Dimensions'}
                        </button>
                    </div>
                </div>

                {/* Results Section (Always Full Width but Grid Within) */}
                <div className="xl:col-span-12">
                    <AnimatePresence mode="wait">
                        {results && !loading ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-10"
                            >
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {modes.map((mode) => (
                                        <button
                                            key={mode.key}
                                            onClick={() => setActiveMode(mode.key)}
                                            className={`px-8 py-5 rounded-2xl border transition-all flex items-center gap-3 ${
                                                activeMode === mode.key 
                                                ? `${mode.bg} ${mode.color} border-current ring-4 ring-current/5` 
                                                : `${isDark ? 'bg-white/5 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'} hover:border-slate-400`
                                            }`}
                                        >
                                            <mode.icon size={18} />
                                            <span className="text-[11px] font-black uppercase tracking-widest">{mode.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <motion.div 
                                    key={activeMode}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`p-12 md:p-20 rounded-[4rem] border relative overflow-hidden group min-h-[500px] flex flex-col justify-center ${
                                        isDark ? 'bg-[#1E293B] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-clean'
                                    }`}
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] -ml-32 -mb-32" />
                                    
                                    <header className="flex items-center justify-between mb-16 relative z-10">
                                        <div className="flex items-center gap-5">
                                            <div className={`p-5 rounded-3xl ${modes.find(m => m.key === activeMode)?.bg} ${modes.find(m => m.key === activeMode)?.color}`}>
                                                {(() => {
                                                    const mode = modes.find(m => m.key === activeMode);
                                                    return mode && <mode.icon size={32} />;
                                                })()}
                                            </div>
                                            <div>
                                                <h3 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                    {modes.find(m => m.key === activeMode)?.label} Dimension
                                                </h3>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 italic">Neural manifestation optimized for context</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleCopy((results as any)[activeMode], activeMode)}
                                            className={`px-6 py-4 rounded-xl transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest ${
                                                isDark ? 'bg-white/5 text-slate-300 hover:text-white border border-white/5' : 'bg-slate-50 text-slate-600 border border-slate-200'
                                            }`}
                                        >
                                            {copying === activeMode ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                            {copying === activeMode ? 'Copied' : 'Clone Output'}
                                        </button>
                                    </header>

                                    <div className="flex-1 relative z-10 flex items-center">
                                        <p className={`text-xl md:text-3xl font-bold italic leading-[1.6] ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                                            "{results[activeMode]}"
                                        </p>
                                    </div>

                                    <footer className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                             {['Coherent', 'Audited', 'Premium'].map((tag) => (
                                                 <span key={tag} className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isDark ? 'border-white/5 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                                                      {tag}
                                                 </span>
                                             ))}
                                        </div>
                                        <button className="flex items-center gap-3 px-8 py-4 bg-indigo-500/10 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all group/apply">
                                            Deploy Transformation <ChevronRight size={14} className="group-hover/apply:translate-x-1 transition-transform" />
                                        </button>
                                    </footer>
                                </motion.div>
                            </motion.div>
                        ) : loading ? (
                            <div className="py-20 flex flex-col items-center justify-center space-y-8">
                                <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                <div className="text-center">
                                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Shift In Progress</h4>
                                    <p className="text-slate-500 italic text-sm">Restructuring manuscript through 4 linguistic filters...</p>
                                </div>
                            </div>
                        ) : (
                                <div className="py-32 flex flex-col items-center text-center">
                                    <div className="w-32 h-32 bg-indigo-500/5 rounded-full flex items-center justify-center mb-10 border border-indigo-500/10 relative">
                                        <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-2xl animate-pulse" />
                                        <RefreshCcw size={56} className="text-slate-800 relative z-10 opacity-20" />
                                    </div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Frequency Awaiting Input</h3>
                                    <p className="text-slate-500 italic text-sm max-w-xs leading-relaxed">Neural manifestations will materialize here upon manuscript initialization.</p>
                                </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            {error && (
                <div className="p-10 rounded-[2.5rem] bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center text-xs font-black uppercase tracking-[0.3em] shadow-xl">
                    <Sparkles className="inline-block mr-3" size={16} /> {error}
                </div>
            )}
        </div>
    );
}
