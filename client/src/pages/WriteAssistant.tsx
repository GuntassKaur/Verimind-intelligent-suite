import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, 
    Zap, 
    FileText, 
    Check, 
    Loader2, 
    Copy,
    GraduationCap,
    BarChart
} from 'lucide-react';
import api from '../services/api';

interface WriteResult {
    text: string;
    clarity_score: number;
    suggestions: string[];
}

export default function WriteAssistant() {
    const [text, setText] = useState('');
    const [result, setResult] = useState<WriteResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [studentMode, setStudentMode] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleAction = async (action: string) => {
        if (!text.trim()) {
            setError('Please type or paste some text first.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/api/study/write', { 
                text, 
                action,
                student_mode: studentMode 
            });
            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || 'Something went wrong.');
            }
        } catch {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!result?.text) return;
        navigator.clipboard.writeText(result.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-6 animate-fade-in">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold mb-2 text-white">Smart Writing Assistant</h1>
                <p className="text-slate-400">Improve your writing, fix mistakes, and clarify your ideas instantly.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Block */}
                <div className="space-y-6">
                    <div className="glass-card overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Input Text</span>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div 
                                        onClick={() => setStudentMode(!studentMode)}
                                        className={`w-8 h-4 rounded-full relative transition-colors ${studentMode ? 'bg-purple-600' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${studentMode ? 'translate-x-4' : ''}`} />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-tighter ${studentMode ? 'text-purple-400' : 'text-slate-500'}`}>
                                        Student Mode
                                    </span>
                                </label>
                            </div>
                        </div>
                        <textarea 
                            className="w-full h-[300px] p-6 bg-transparent text-white placeholder-slate-600 focus:outline-none resize-none text-lg leading-relaxed"
                            placeholder="Paste or type your content here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <ActionButton icon={Zap} label="1-Click Improve" onClick={() => handleAction('improve')} color="bg-purple-600" />
                        <ActionButton icon={Check} label="Grammar Fix" onClick={() => handleAction('grammar')} color="bg-indigo-600" />
                        <ActionButton icon={FileText} label="Summarize" onClick={() => handleAction('summarize')} color="bg-slate-800" />
                    </div>
                </div>

                {/* Output Block */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center py-20 glass-card"
                            >
                                <Loader2 size={40} className="text-purple-500 animate-spin mb-4" />
                                <p className="text-slate-500 font-medium">Synthesizing quality output...</p>
                            </motion.div>
                        ) : result ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="glass-card overflow-hidden">
                                    <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={14} className="text-purple-400" />
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Improved Result</span>
                                        </div>
                                        <button onClick={handleCopy} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-slate-400" />}
                                        </button>
                                    </div>
                                    <div className="p-6 text-white text-lg leading-relaxed max-h-[400px] overflow-y-auto">
                                        {result.text}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="glass-card p-6 flex flex-col items-center justify-center gap-2">
                                        <div className="flex items-center gap-2 text-purple-400 font-bold">
                                            <BarChart size={16} />
                                            <span className="text-xs uppercase tracking-widest">Clarity Score</span>
                                        </div>
                                        <span className="text-4xl font-black text-white">{result.clarity_score}</span>
                                    </div>
                                    <div className="glass-card p-4">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Next Steps</span>
                                        <ul className="space-y-2">
                                            {result.suggestions.map((s: string, i: number) => (
                                                <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                                                    <div className="w-1 h-1 rounded-full bg-purple-500" />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-20 glass-card text-center px-10">
                                <GraduationCap size={48} className="text-slate-800 mb-6" />
                                <h3 className="text-xl font-bold text-slate-500 mb-2">Ready to assist</h3>
                                <p className="text-slate-600 text-sm">Results will appear here once you hit an action button.</p>
                            </div>
                        )}
                    </AnimatePresence>
                    
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold animate-fade-in text-center">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface ActionButtonProps {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    color: string;
}

function ActionButton({ icon: Icon, label, onClick, color }: ActionButtonProps) {
    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl transition-all hover:scale-105 active:scale-95 border border-white/5 ${color} shadow-lg`}
        >
            <Icon size={20} className="text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">{label}</span>
        </button>
    );
}
