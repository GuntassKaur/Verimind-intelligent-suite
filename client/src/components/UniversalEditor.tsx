import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Maximize2, 
    Minimize2, 
    Wand2, 
    Zap, 
    Eye, 
    Sparkles,
    CheckCircle2,
    Bold,
    Trash2,
    Copy,
    Check,
    Dna
} from 'lucide-react';

interface UniversalEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
    maxHeight? : string;
    label?: string;
    isDark?: boolean;
    onAIAction?: (action: string) => void;
}

export const UniversalEditor: React.FC<UniversalEditorProps> = ({
    value,
    onChange,
    placeholder = "Start typing or paste your content...",
    minHeight = "300px",
    maxHeight = "none",
    label = "Neural Manuscript",
    isDark = true,
    onAIAction
}) => {
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [showAIBar, setShowAIBar] = useState(false);
    const [copied, setCopied] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const toggleFocus = () => {
        setIsFocusMode(!isFocusMode);
        document.body.style.overflow = !isFocusMode ? 'hidden' : 'auto';
    };

    const handleClear = () => onChange('');
    
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleBold = () => {
        if (!textAreaRef.current) return;
        const start = textAreaRef.current.selectionStart;
        const end = textAreaRef.current.selectionEnd;
        const selected = value.substring(start, end);
        if (selected) {
            const newValue = value.substring(0, start) + `**${selected}**` + value.substring(end);
            onChange(newValue);
        }
    };

    const aiActions = [
        { id: 'improve', label: 'Optimize Syntax', icon: Zap, color: 'text-purple-400' },
        { id: 'simple', label: 'Simplify Logic', icon: Eye, color: 'text-blue-400' },
        { id: 'professional', label: 'Elevate Tone', icon: Sparkles, color: 'text-indigo-400' },
        { id: 'audit', label: 'Fact Audit', icon: CheckCircle2, color: 'text-emerald-400' },
        { id: 'dna', label: 'Extract DNA', icon: Dna, color: 'text-rose-400' }
    ];

    return (
        <div className={`w-full transition-all duration-700 ${isFocusMode ? 'fixed inset-0 z-50 bg-[#0b0f1a] p-12 overflow-y-auto' : ''}`}>
            
            <div className={`editor-container relative group transition-all duration-500 rounded-3xl ${isFocusMode ? 'max-w-4xl' : 'max-w-[700px]'} mx-auto overflow-hidden border ${isDark ? 'border-white/10 shadow-2xl' : 'border-slate-200 shadow-xl'} bg-[#0b0f1a]/40`}>
                
                {/* TOOLBAR */}
                <div className="editor-toolbar flex items-center justify-between px-6 py-3 bg-white/5 backdrop-blur-xl border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBold} className="p-2 mr-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all" title="Bold">
                            <Bold size={16} />
                        </button>
                        <div className="h-4 w-px bg-white/10 mx-1" />
                        <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-2" title="Copy">
                            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                        </button>
                        <button onClick={handleClear} className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition-all" title="Clear">
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
                         <button 
                            onClick={toggleFocus}
                            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
                        >
                            {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>
                </div>

                {/* AI FLOATING COMPONENT */}
                <div className="absolute right-6 top-20 z-10">
                    <button 
                        onMouseEnter={() => setShowAIBar(true)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white shadow-lg shadow-purple-500/10`}
                    >
                        <Wand2 size={18} />
                    </button>
                    
                    <AnimatePresence>
                        {showAIBar && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onMouseLeave={() => setShowAIBar(false)}
                                className="absolute right-12 top-0 flex flex-col gap-2 p-2 rounded-2xl border border-white/10 bg-[#0b0f1a]/90 backdrop-blur-2xl shadow-2xl z-20"
                            >
                                {aiActions.map((action) => (
                                    <button 
                                        key={action.id}
                                        onClick={() => { onAIAction?.(action.id); setShowAIBar(false); }}
                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left group"
                                    >
                                        <action.icon size={14} className={`${action.color}`} />
                                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-white uppercase tracking-widest whitespace-nowrap">
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
                    className={`editor-content w-full bg-transparent text-slate-200 placeholder:text-slate-600 outline-none resize-none p-10 text-lg md:text-xl font-medium leading-relaxed custom-scrollbar`}
                />
                
                <div className="absolute bottom-6 left-10 flex items-center gap-4 pointer-events-none opacity-40">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{value.length} CHR</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Neural Link: ACTIVE</span>
                </div>
            </div>
        </div>
    );
};
