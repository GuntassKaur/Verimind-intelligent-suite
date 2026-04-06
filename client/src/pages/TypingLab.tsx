import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Keyboard, 
    RotateCcw, 
    Zap, 
    Target, 
    Timer,
    Brain
} from 'lucide-react';

const SAMPLE_TEXT = "Intelligence is the ability to adapt to change. In the realm of neural architectures, the speed of thought is only limited by the frequency of your synaptic cycles. Verimind empowers human cognition by bridging the gap between raw data and actionable insight.";

export default function TypingLab() {
    const [text, setText] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isFinished, setIsFinished] = useState(false);
    const [charStates, setCharStates] = useState<number[]>([]); // 0: untyped, 1: correct, 2: wrong
    const [suggestions, setSuggestions] = useState<string[]>(["Focus on flow.", "Minimize cognitive noise.", "Synchronize input buffers."]);
    const inputRef = useRef<HTMLInputElement>(null);

    const reset = useCallback(() => {
        setText('');
        setStartTime(null);
        setTimeLeft(60);
        setWpm(0);
        setAccuracy(100);
        setIsFinished(false);
        setCharStates(new Array(SAMPLE_TEXT.length).fill(0));
        setSuggestions(["Focus on flow.", "Minimize cognitive noise.", "Synchronize input buffers."]);
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    useEffect(() => {
        reset();
    }, [reset]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (isFinished || timeLeft <= 0) return;

        if (!startTime) setStartTime(Date.now());

        const newStates = [...charStates];
        let correctCount = 0;

        for (let i = 0; i < SAMPLE_TEXT.length; i++) {
            if (i >= val.length) {
                newStates[i] = 0;
            } else if (val[i] === SAMPLE_TEXT[i]) {
                newStates[i] = 1;
                correctCount++;
            } else {
                newStates[i] = 2;
            }
        }

        setCharStates(newStates);
        setText(val);
        setAccuracy(val.length > 0 ? Math.round((correctCount / val.length) * 100) : 100);

        if (val.length === SAMPLE_TEXT.length) {
            handleFinish();
        }
    };

    const handleFinish = useCallback(() => {
        setIsFinished(true);
        if (startTime) {
            const timeElapsed = (Date.now() - startTime) / 60000;
            setWpm(Math.round((text.length / 5) / timeElapsed));
        }
        setSuggestions(["High-fidelity output.", "Neural link optimal.", "Buffer cleared."]);
    }, [startTime, text]);

    // Timer Logic
    useEffect(() => {
        let interval: any;
        if (startTime && !isFinished && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleFinish();
                        return 0;
                    }
                    return prev - 1;
                });
                
                // Live WPM
                const timeElapsed = (Date.now() - startTime) / 60000;
                if (timeElapsed > 0) {
                    setWpm(Math.round((text.length / 5) / timeElapsed));
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [startTime, isFinished, timeLeft, text, handleFinish]);

    return (
        <div className="max-w-6xl mx-auto py-12 px-6 lg:px-10 space-y-12 pb-32">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                        <Keyboard size={11} /> Cognitive Speed Lab
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
                        Typing <span className="text-indigo-500">Accelerator</span>.
                    </h1>
                </div>
                <div className="flex gap-6 mb-2">
                    <div className="text-right">
                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Remaining</span>
                        <span className="text-4xl font-black text-white tracking-tighter">{timeLeft}s</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Live Precision</span>
                        <span className="text-4xl font-black text-indigo-400 tracking-tighter">{accuracy}%</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Stats Sidebar */}
                <div className="space-y-8">
                    <StatBox label="Words Per Minute" value={wpm} icon={Zap} unit="WPM" color="text-indigo-400" />
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                            <Brain size={16} className="text-purple-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Suggestions</span>
                        </div>
                        <div className="space-y-3">
                            {suggestions.map((s, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i} 
                                    className="flex items-center gap-3 text-xs font-bold text-slate-300"
                                >
                                    <div className="w-1 h-1 rounded-full bg-purple-500" />
                                    {s}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Interaction Lab */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="p-12 md:p-16 rounded-[4rem] bg-[#0b0f1a]/60 border border-white/5 backdrop-blur-3xl relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-20 animate-pulse" />
                        
                        <div className="mb-12 relative">
                             {/* Sample Text Display */}
                            <div className="text-2xl md:text-3xl font-bold leading-relaxed tracking-tight break-words font-main opacity-80 select-none">
                                {SAMPLE_TEXT.split('').map((char, i) => (
                                    <span 
                                        key={i} 
                                        className={`${
                                            charStates[i] === 1 ? 'text-white' : 
                                            charStates[i] === 2 ? 'text-rose-500 bg-rose-500/10' : 
                                            'text-slate-700'
                                        } transition-all duration-75`}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>
                            
                            {/* Hidden Input Layer */}
                            <input 
                                ref={inputRef}
                                type="text"
                                value={text}
                                onChange={handleInput}
                                disabled={isFinished || timeLeft <= 0}
                                className="absolute inset-0 opacity-0 cursor-default w-full h-full"
                                autoFocus
                            />
                        </div>

                        {!startTime && !isFinished && (
                            <div className="flex items-center gap-4 text-indigo-400 font-black uppercase text-[10px] tracking-widest animate-pulse border-t border-white/5 pt-10">
                                <Timer size={14} /> Neural Interface Standing By. Start typing to initialize...
                            </div>
                        )}

                        {/* Controls */}
                        <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol</span>
                                    <span className="text-xs font-bold text-white uppercase italic tracking-tighter">Standard 60s Burst</span>
                                </div>
                            </div>
                            <button 
                                onClick={reset}
                                className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[.3em] text-slate-300 hover:bg-white/10 hover:text-white transition-all active:scale-95 shadow-2xl"
                            >
                                <RotateCcw size={14} /> Re-Sync
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {(isFinished || timeLeft <= 0) && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-12 rounded-[3.5rem] bg-indigo-600 shadow-[0_0_80px_rgba(79,70,229,0.3)] flex flex-col md:flex-row items-center justify-between gap-10 border border-white/20 relative"
                            >
                                <div>
                                    <h4 className="text-4xl font-black text-white tracking-tighter mb-1">Session Terminated.</h4>
                                    <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">Sync Delta: {accuracy}% Accuracy Level</p>
                                </div>
                                <div className="flex items-center gap-10 bg-black/20 p-8 rounded-[2.5rem] border border-white/10">
                                    <div className="text-center">
                                        <div className="text-5xl font-black text-white tracking-tighter">{wpm}</div>
                                        <div className="text-[9px] font-black text-indigo-200 uppercase tracking-widest mt-1">Final WPM</div>
                                    </div>
                                    <div className="w-px h-12 bg-white/5" />
                                    <button onClick={reset} className="px-8 py-4 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Run New Sync</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value, icon: Icon, unit, color }: any) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 relative group hover:bg-white/[0.05] transition-all">
             <div className="flex items-end gap-2 mb-2">
                <span className="text-6xl font-black text-white tracking-tighter leading-none">{value}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${color}`}>{unit}</span>
             </div>
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">{label}</p>
        </div>
    );
}
