import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Type, 
    Maximize2, 
    Minimize2, 
    Wand2, 
    Zap, 
    Eye, 
    Sparkles,
    CheckCircle2,
    Play
} from 'lucide-react';

interface UniversalEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
    maxHeight?: string;
    label?: string;
    isDark?: boolean;
    onAIAction?: (action: string) => void;
}

export const UniversalEditor: React.FC<UniversalEditorProps> = ({
    value,
    onChange,
    placeholder = "Start writing or paste your content here...",
    minHeight = "200px",
    maxHeight = "none",
    label = "Content Manuscript",
    isDark = false,
    onAIAction
}) => {
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [showAIBar, setShowAIBar] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const wordCount = value.trim() === '' ? 0 : value.trim().split(/\s+/).length;
    const charCount = value.length;
    const readabilityGrade = Math.min(12, Math.floor(wordCount / 10) + 1); // Mock complexity

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const toggleFocus = () => {
        setIsFocusMode(!isFocusMode);
        if (!isFocusMode) {
             document.body.classList.add('focus-mode-active');
        } else {
             document.body.classList.remove('focus-mode-active');
        }
    };

    const aiActions = [
        { id: 'improve', label: 'Optimize Syntax', icon: Zap, color: 'text-amber-400' },
        { id: 'simple', label: 'Simplify Logic', icon: Eye, color: 'text-emerald-400' },
        { id: 'professional', label: 'Elevate Tone', icon: Sparkles, color: 'text-indigo-400' },
        { id: 'audit', label: 'Fact Audit', icon: CheckCircle2, color: 'text-rose-400' }
    ];

    return (
        <div className={`w-full space-y-4 transition-all duration-700 ${isFocusMode ? 'fixed inset-0 z-50 bg-[#05070a] p-12 overflow-y-auto' : ''}`}>
            {!isFocusMode && (
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-6 rounded-full ${isDark ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-indigo-600'}`} />
                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {label}
                        </label>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${isDark ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                            <Type size={12} />
                            <span className="text-[10px] font-black uppercase tracking-wider">{wordCount} Words</span>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${isDark ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                            <Wand2 size={12} className="text-purple-500" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Grade {readabilityGrade}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className={`relative group transition-all duration-500 rounded-[3rem] p-1.5 border ${
                isDark 
                ? 'bg-[#0f172a] border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus-within:border-indigo-500/50' 
                : 'bg-white border-slate-200 shadow-2xl focus-within:border-indigo-500/30'
            } ${isFocusMode ? 'max-w-4xl mx-auto border-indigo-500/20 shadow-indigo-500/10 shadow-[0_0_100px_rgba(99,102,241,0.1)]' : ''}`}>
                
                {/* Floating AI Action Trigger */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
                    <button 
                        onMouseEnter={() => setShowAIBar(true)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border shadow-xl ${
                            isDark ? 'bg-slate-900 border-white/10 text-indigo-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50'
                        }`}
                    >
                        <Wand2 size={20} className={showAIBar ? 'rotate-12 scale-110' : ''} />
                    </button>
                    
                    <AnimatePresence>
                        {showAIBar && (
                            <motion.div 
                                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                onMouseLeave={() => setShowAIBar(false)}
                                className={`absolute left-16 top-0 flex flex-col gap-2 p-3 rounded-2xl border shadow-2xl backdrop-blur-xl ${
                                    isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-slate-200'
                                }`}
                            >
                                {aiActions.map((action) => (
                                    <button 
                                        key={action.id}
                                        onClick={() => { onAIAction?.(action.id); setShowAIBar(false); }}
                                        className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all whitespace-nowrap group ${
                                            isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                                        }`}
                                    >
                                        <action.icon size={16} className={`${action.color} group-hover:scale-110 transition-transform`} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-indigo-600'}`}>
                                            {action.label}
                                        </span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <textarea
                    ref={textAreaRef}
                    value={value}
                    onChange={handleInput}
                    placeholder={placeholder}
                    style={{ 
                        minHeight: isFocusMode ? '70vh' : minHeight,
                        maxHeight: isFocusMode ? 'none' : maxHeight 
                    }}
                    className={`w-full p-10 md:p-14 rounded-[2.8rem] outline-none resize-none text-lg md:text-xl font-medium leading-relaxed transition-all custom-scrollbar ${
                        isDark 
                        ? 'bg-[#0f172a] text-slate-200 placeholder:text-slate-700' 
                        : 'bg-white text-slate-800 placeholder:text-slate-400'
                    }`}
                />
                
                {/* Right Actions */}
                <div className="absolute bottom-8 right-10 flex items-center gap-4 opacity-0 group-focus-within:opacity-100 transition-all transform translate-y-2 group-focus-within:translate-y-0">
                     <div className={`p-4 rounded-2xl flex items-center gap-3 transition-all cursor-default ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`}>
                          <div className="flex flex-col items-end">
                               <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Live Fidelity</span>
                               <span className="text-[10px] font-bold text-slate-500">{charCount.toLocaleString()} Characters</span>
                          </div>
                          <ActivityBar intensity={Math.min(100, (wordCount / 500) * 100)} isDark={isDark} />
                     </div>

                     <button 
                        onClick={toggleFocus}
                        title={isFocusMode ? "Exit Focus" : "Enter Focus"}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border shadow-lg ${
                            isDark ? 'bg-slate-900 border-white/10 text-slate-500 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600'
                        }`}
                     >
                        {isFocusMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                     </button>
                </div>

            </div>
            {isFocusMode && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-10 px-10 py-5 rounded-[2rem] bg-[#1e293b]/50 border border-white/5 backdrop-blur-2xl shadow-2xl z-50">
                    <div className="flex items-center gap-3">
                        <Type size={16} className="text-indigo-400" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">{wordCount} WORDS</span>
                    </div>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div className="flex items-center gap-3">
                        <Play size={16} className="text-emerald-400" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">FOCUS ACTIVE</span>
                    </div>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <button onClick={toggleFocus} className="text-xs font-black text-rose-400 uppercase tracking-[0.2em] hover:text-rose-300 transition-colors">EXIT PROTOCOL</button>
                </div>
            )}
        </div>
    );
};

const ActivityBar = ({ intensity, isDark }: { intensity: number, isDark: boolean }) => (
    <div className={`w-12 h-10 flex items-end gap-[2px] ${isDark ? 'opacity-40' : 'opacity-60'}`}>
        {[...Array(6)].map((_, i) => (
             <motion.div 
                key={i}
                initial={{ height: 2 }}
                animate={{ height: `${2 + Math.random() * (intensity / 10 + 20)}%` }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
                className={`w-1 rounded-full ${isDark ? 'bg-indigo-500' : 'bg-indigo-600'}`}
             />
        ))}
    </div>
);
