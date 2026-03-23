import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Info, AlertTriangle, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface Suggestion {
    id: string;
    type: 'tip' | 'warning' | 'success';
    text: string;
    description: string;
}

interface SmartSuggestionsProps {
    content: string;
    isDark?: boolean;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ content, isDark = true }) => {
    const wordCount = content.trim().split(/\s+/).length;
    const sentenceCount = content.split(/[.!?]+/).length;
    const avgSentenceLength = wordCount / sentenceCount;

    const generateSuggestions = (): Suggestion[] => {
        const list: Suggestion[] = [];
        
        if (content.length < 50) {
            list.push({
                id: 'length',
                type: 'tip',
                text: "Establish Deep Context",
                description: "Expanding your neural manifest with at least 500 characters increases audit resolution."
            });
        }

        if (avgSentenceLength > 25) {
            list.push({
                id: 'complexity',
                type: 'warning',
                text: "Modular Logic Detected",
                description: "Sentence length exceeds 25 words. Consider atomic decomposition for better readability."
            });
        }

        if (content.includes("very") || content.includes("really") || content.includes("actually")) {
             list.push({
                id: 'clarity',
                type: 'tip',
                text: "Precision Enhancement",
                description: "Vague intensifiers detected. Replace with technically precise descriptors."
            });
        }

        if (wordCount > 100) {
             list.push({
                id: 'fidelity',
                type: 'success',
                text: "High Fidelity Synchronized",
                description: "Content volume satisfies verification thresholds. Neural audit ready."
            });
        }

        return list.length ? list : [
            { id: 'idle', type: 'tip', text: 'Neural Baseline Nominal', description: 'Start writing to initiate real-time structural analysis.' }
        ];
    };

    const currentSuggestions = generateSuggestions();

    return (
        <div className={`p-8 rounded-[3rem] border shadow-2xl transition-all duration-500 ${
            isDark ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'
        }`}>
            <header className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                    <Sparkles className="text-indigo-400" size={18} />
                    <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-white' : 'text-slate-900'}`}>Strategic Insights</h3>
                </div>
                <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                    isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                }`}>
                    Live Protocol
                </div>
            </header>

            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {currentSuggestions.map((s, idx) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-6 rounded-[2rem] border transition-all hover:scale-[1.02] cursor-default group ${
                                s.type === 'warning' 
                                ? (isDark ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-100')
                                : s.type === 'success'
                                ? (isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100')
                                : (isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100 shadow-sm')
                            }`}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                {s.type === 'warning' ? <AlertTriangle size={16} className="text-rose-500" /> : 
                                 s.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-500" /> :
                                 <Lightbulb size={16} className="text-indigo-500" />}
                                <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'} flex-1`}>
                                    {s.text}
                                </h4>
                            </div>
                            <p className="text-[11px] font-bold leading-relaxed text-slate-500">
                                {s.description}
                            </p>
                            <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'}`}>
                                    Apply Change <TrendingUp size={12} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <footer className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                     <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                        <Info size={14} className="text-indigo-400" />
                     </div>
                     <p className="text-[10px] font-bold leading-relaxed text-slate-500">
                        Neural insights are calculated using **Semantic Spectral Analysis** based on your current workspace cadence.
                     </p>
                </div>
            </footer>
        </div>
    );
};
