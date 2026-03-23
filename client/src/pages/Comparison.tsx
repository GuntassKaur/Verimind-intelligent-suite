import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, Sparkles, AlertTriangle, ShieldCheck, 
    Cpu, Loader2, Info, ChevronRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { UniversalEditor } from '../components/UniversalEditor';

interface AIModel {
    id: string;
    name: string;
    provider: string;
    color: string;
    icon: any;
}

const MODELS: AIModel[] = [
    { id: 'gpt4', name: 'Neural-4 (Omni)', provider: 'OpenAI', color: 'text-emerald-400', icon: Sparkles },
    { id: 'claude3', name: 'Sonnet 3.5', provider: 'Anthropic', color: 'text-amber-400', icon: Zap },
    { id: 'gemini15', name: 'Flash 1.5', provider: 'Google', color: 'text-blue-400', icon: Cpu },
];

export default function Comparison() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [prompt, setPrompt] = useState('');
    const [responses, setResponses] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showDifferences, setShowDifferences] = useState(false);

    const handleCompare = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setResponses({});
        
        // Mocking parallel API calls
        setTimeout(() => {
            setResponses({
                gpt4: "The Great Wall of China is approximately 21,196 kilometers long. It was built across various historical northern borders of ancient Chinese states.",
                claude3: "Spanning over 21,000 kilometers, the Great Wall served as protection against nomadic groups. Recent surveys suggest its total length is roughly 13,171 miles.",
                gemini15: "The Great Wall's length is officially 21,196.18 km. It consists of stone, brick, tamped earth, and other materials, primarily built during the Ming Dynasty."
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 pb-40 relative">
            <header className="mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-8 ${
                        isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-100 text-amber-600'
                    }`}
                >
                    <Zap size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Multi-Neural Interrogation</span>
                </motion.div>
                <h1 className={`text-4xl md:text-7xl font-black tracking-tight mb-6 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Cross <span className="text-gradient-amber">Check</span>.
                </h1>
                <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto italic">
                    "Sync multiple LLM outputs to detect contradictions, verify factual density, and select the optimal response variant."
                </p>
            </header>

            <div className="grid grid-cols-1 gap-12">
                {/* Input Area */}
                <div className={`p-1 w-full rounded-[3.5rem] border bg-gradient-to-b ${isDark ? 'from-white/10 to-transparent border-white/5' : 'from-slate-200 to-transparent border-slate-100'}`}>
                    <div className={`p-8 rounded-[3.4rem] ${isDark ? 'bg-[#0F172A]' : 'bg-white'}`}>
                        <UniversalEditor 
                            value={prompt}
                            onChange={setPrompt}
                            placeholder="Enter a prompt to compare multiple AI models..."
                            minHeight="120px"
                            isDark={isDark}
                            label="Neural Inquiry"
                        />
                        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                             <div className="flex flex-wrap gap-4">
                                {MODELS.map(m => (
                                    <div key={m.id} className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                        <m.icon size={12} className={m.color} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{m.name}</span>
                                    </div>
                                ))}
                             </div>
                             <button
                                onClick={handleCompare}
                                disabled={loading || !prompt.trim()}
                                className={`px-12 py-6 rounded-3xl text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center gap-4 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 premium-btn-amber shadow-2xl'
                                }`}
                             >
                                 {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                 Interrogate Models
                             </button>
                        </div>
                    </div>
                </div>

                {/* Response Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {MODELS.map((model) => (
                        <div 
                            key={model.id}
                            className={`flex flex-col rounded-[3rem] border transition-all duration-500 relative overflow-hidden h-[600px] ${
                                isDark ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl'
                            } ${loading ? 'animate-pulse' : ''}`}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <model.icon size={120} />
                            </div>
                            
                            <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <model.icon size={20} className={model.color} />
                                    </div>
                                    <div>
                                        <h3 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>{model.name}</h3>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter opacity-70">{model.provider}</p>
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                            </div>

                            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative z-10">
                                {loading ? (
                                    <div className="space-y-4">
                                        <div className="h-4 shimmer w-full rounded-full" />
                                        <div className="h-4 shimmer w-[90%] rounded-full" />
                                        <div className="h-4 shimmer w-[95%] rounded-full" />
                                        <div className="h-4 shimmer w-[40%] rounded-full" />
                                    </div>
                                ) : responses[model.id] ? (
                                    <motion.p 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`text-sm md:text-base leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                                    >
                                        {responses[model.id]}
                                    </motion.p>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 italic">
                                        <Cpu size={40} className="mb-4" />
                                        <p className="text-xs">Awaiting neural pulse...</p>
                                    </div>
                                )}
                            </div>

                            <div className={`p-6 border-t ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50/50 border-slate-50'}`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Atomic Analysis</span>
                                    <div className="flex gap-2">
                                        <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-white border-slate-100'} transition-all`}>
                                            <Info size={14} className="text-slate-400" />
                                        </button>
                                        <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-white border-slate-100'} transition-all`}>
                                            <ShieldCheck size={14} className="text-emerald-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Analysis Dashboard (Conditional) */}
                <AnimatePresence>
                    {Object.keys(responses).length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-10"
                        >
                            <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                                <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Synaptic Contrast Analysis</h2>
                                <button
                                    onClick={() => setShowDifferences(!showDifferences)}
                                    className={`ml-auto flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        showDifferences 
                                        ? 'bg-amber-500 text-white' 
                                        : (isDark ? 'bg-white/5 border border-white/10 text-slate-400' : 'bg-slate-100 border border-slate-200 text-slate-600')
                                    }`}
                                >
                                    {showDifferences ? 'Hide Divergence' : 'Highlight Differences'}
                                    <AlertTriangle size={14} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Content Divergence', val: 'Low', color: 'text-emerald-500', icon: ShieldCheck },
                                    { label: 'Factual Conflict', val: 'None detected', color: 'text-emerald-500', icon: ShieldCheck },
                                    { label: 'Hallucination Risk', val: '2%', color: 'text-emerald-500', icon: ShieldCheck },
                                    { label: 'Consensus Level', val: '98%', color: 'text-indigo-500', icon: Sparkles },
                                ].map((stat, i) => (
                                    <div key={i} className={`p-6 rounded-[2rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</span>
                                            <stat.icon size={16} className={stat.color} />
                                        </div>
                                        <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.val}</div>
                                    </div>
                                ))}
                            </div>

                            <div className={`p-10 rounded-[3rem] border relative overflow-hidden ${isDark ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100'}`}>
                                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-6">Cross-Model Verdict</h4>
                                <p className={`text-xl font-bold leading-relaxed italic ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                                    "All interrogated models demonstrate high consensus on the subject. **Neural-4** provides the most detailed historical breakdown, while **Sonnet 3.5** offers superior metric conversion precision."
                                </p>
                                <ChevronRight size={40} className="absolute bottom-[-10px] right-[-10px] opacity-10 text-indigo-500" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
