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
    Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

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
    const [error, setError] = useState('');
    const [copying, setCopying] = useState<string | null>(null);

    const runRewrite = useCallback(async () => {
        if (!content.trim()) {
            setError('Please enter text to rewrite.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/api/ai/rewrite-modes', { text: content });
            if (data.success) {
                setResults(data.data);
            } else {
                setError(data.error || 'Rewrite cycle failed.');
            }
        } catch (err: any) {
             setError(err.response?.data?.error || 'Rewrite module unavailable.');
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
    ];

    return (
        <div className="max-w-7xl mx-auto py-10 px-6 lg:px-10 space-y-12 pb-32 transition-colors duration-500">
            {/* Header */}
            <header className="text-center space-y-4">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full border ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}
                >
                    <RefreshCcw size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Multi-Mode Polarity Engine</span>
                </motion.div>
                <h1 className={`text-4xl md:text-6xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Smart <span className="text-gradient">Rewriter</span>.
                </h1>
                <p className={`text-sm md:text-lg font-medium max-w-2xl mx-auto italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    "Transform your thoughts into 4 distinct linguistic dimensions instantly."
                </p>
            </header>

            {/* Input Section */}
            <div className={`rounded-[2.5rem] border p-8 md:p-12 transition-all ${isDark ? 'bg-[#0C0F17] border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}>
                <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="text-amber-400" size={18} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Draft Input</span>
                </div>
                <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your content here to manifest 4 distinct tonalities..."
                    className={`w-full h-48 md:h-64 rounded-[2rem] p-8 text-base md:text-lg font-medium outline-none transition-all placeholder:text-slate-600 resize-none leading-relaxed ${isDark ? 'bg-black/40 border border-white/5 text-slate-200 focus:border-indigo-500/30' : 'bg-slate-50 border border-slate-200 text-slate-800 shadow-inner focus:bg-white focus:border-indigo-300'}`}
                />
                
                <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
                    <div className="flex items-center gap-4">
                         <div className="flex -space-x-3">
                              {modes.map((m, i) => (
                                  <div key={i} className={`w-10 h-10 rounded-full border-4 ${isDark ? 'border-[#0C0F17]' : 'border-white'} ${m.bg} flex items-center justify-center ${m.color}`}>
                                       <m.icon size={16} />
                                  </div>
                              ))}
                         </div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">4 Modes Unified</span>
                    </div>
                    <button 
                        onClick={runRewrite}
                        disabled={loading || !content.trim()}
                        className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 active:translate-y-0.5 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                        {loading ? 'Processing...' : 'Initialize Rewrite'}
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            <AnimatePresence mode="wait">
                {results && !loading && (
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {modes.map((mode, idx) => (
                            <motion.div 
                                key={mode.key}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`group p-10 rounded-[2.5rem] border transition-all relative overflow-hidden flex flex-col min-h-[400px] ${isDark ? 'bg-[#0C0F17] border-white/5 hover:border-indigo-500/30' : 'bg-white border-slate-100 shadow-lg hover:shadow-2xl'}`}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl opacity-20 transition-all group-hover:opacity-40 ${mode.bg}`} />
                                
                                <header className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl ${mode.bg} ${mode.color}`}>
                                             <mode.icon size={24} />
                                        </div>
                                        <div>
                                             <h3 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{mode.label}</h3>
                                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5 italic">Manifestation {idx + 1}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleCopy((results as any)[mode.key], mode.key)}
                                        className={`p-3 rounded-xl transition-all ${isDark ? 'bg-white/5 text-slate-500 hover:text-white' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}
                                    >
                                        {copying === mode.key ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                                    </button>
                                </header>

                                <div className="flex-1 relative z-10">
                                    <p className={`text-base md:text-lg font-medium italic leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        "{(results as any)[mode.key]}"
                                    </p>
                                </div>

                                <footer className="mt-8 pt-8 border-t border-slate-500/10 flex items-center justify-between relative z-10">
                                     <div className="flex items-center gap-2">
                                          <div className={`w-2 h-2 rounded-full ${mode.bg} ${mode.color} bg-current animate-pulse`} />
                                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Optimized for Clarity</span>
                                     </div>
                                     <button className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 group/btn ${mode.color}`}>
                                          Apply Variation <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                     </button>
                                </footer>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            
            {error && (
                <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center text-xs font-black uppercase tracking-[0.2em] shadow-xl">
                    {error}
                </div>
            )}
        </div>
    );
}
