import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Type, Hash, Maximize2, Minimize2 } from 'lucide-react';

interface UniversalEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
    label?: string;
    isDark?: boolean;
}

export const UniversalEditor: React.FC<UniversalEditorProps> = ({
    value,
    onChange,
    placeholder = "Start writing or paste your content here...",
    minHeight = "400px",
    label = "Content Manuscript",
    isDark = false
}) => {
    const wordCount = value.trim() === '' ? 0 : value.trim().split(/\s+/).length;
    const charCount = value.length;
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="w-full space-y-4">
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
                        <Hash size={12} />
                        <span className="text-[10px] font-black uppercase tracking-wider">{charCount} Chars</span>
                    </div>
                </div>
            </div>

            <div className={`relative group transition-all duration-500 rounded-[2.5rem] p-1 border ${
                isDark 
                ? 'bg-[#0f172a] border-white/5 shadow-2xl focus-within:border-indigo-500/50' 
                : 'bg-white border-slate-200 shadow-xl focus-within:border-indigo-500/30'
            }`}>
                <textarea
                    ref={textAreaRef}
                    value={value}
                    onChange={handleInput}
                    placeholder={placeholder}
                    style={{ minHeight }}
                    className={`w-full p-8 md:p-10 rounded-[2.3rem] outline-none resize-none text-base md:text-lg font-medium leading-relaxed transition-all scrollbar-thin ${
                        isDark 
                        ? 'bg-[#0f172a] text-slate-200 placeholder:text-slate-700' 
                        : 'bg-white text-slate-900 placeholder:text-slate-400'
                    }`}
                />
                
                <div className="absolute bottom-6 right-8 flex gap-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                     <button className={`p-2 rounded-xl transition-all ${isDark ? 'bg-white/5 text-slate-500 hover:text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Maximize2 size={16} />
                     </button>
                </div>

                <div className={`absolute inset-x-0 bottom-0 h-24 pointer-events-none rounded-b-[2.5rem] bg-gradient-to-t ${isDark ? 'from-[#0f172a]' : 'from-white'} to-transparent opacity-40`} />
            </div>
        </div>
    );
};
