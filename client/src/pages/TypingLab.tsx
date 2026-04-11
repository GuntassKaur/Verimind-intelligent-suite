import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Keyboard, 
    RotateCcw, 
    Zap, 
    Timer,
    Brain,
    CheckCircle
} from 'lucide-react';

const SAMPLE_TEXT = "Intelligence is the ability to adapt to change. Learning is a lifelong process that shapes our understanding of the world. By improving your typing speed, you can communicate your ideas more effectively and keep up with the fast-paced digital environment. Practice consistently and you will see progress.";

export default function TypingLab() {
    const [text, setText] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isFinished, setIsFinished] = useState(false);
    const [charStates, setCharStates] = useState<number[]>([]); // 0: untyped, 1: correct, 2: wrong
    const [suggestions, setSuggestions] = useState<string[]>(["Keep your wrists level.", "Use all ten fingers.", "Don't look at the keys."]);
    const inputRef = useRef<HTMLInputElement>(null);

    const reset = useCallback(() => {
        setText('');
        setStartTime(null);
        setTimeLeft(60);
        setWpm(0);
        setAccuracy(100);
        setIsFinished(false);
        setCharStates(new Array(SAMPLE_TEXT.length).fill(0));
        setSuggestions(["Keep your wrists level.", "Use all ten fingers.", "Don't look at the keys."]);
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
        
        // Dynamic suggestions based on WPM
        if (wpm < 30) {
            setSuggestions(["Focus on accuracy first.", "Try typing games.", "Practice every day."]);
        } else if (wpm < 60) {
            setSuggestions(["Try to look at the screen.", "Relax your hands.", "Focus on rhythm."]);
        } else {
            setSuggestions(["Great speed!", "Try harder texts.", "Focus on flow."]);
        }
    }, [startTime, text, wpm]);

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
        <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400">
                        <Keyboard size={14} /> Productivity Hub
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                        Focus <span className="text-purple-500">Typing Lab</span>.
                    </h1>
                </div>
                <div className="flex gap-10 mb-2">
                    <div className="text-right">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Time Left</span>
                        <span className="text-4xl font-black text-white">{timeLeft}s</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Accuracy</span>
                        <span className="text-4xl font-black text-purple-400">{accuracy}%</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <StatBox label="Words Per Minute" value={wpm} icon={Zap} unit="WPM" color="text-purple-400" />
                    <div className="glass-card p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <Brain size={16} className="text-purple-400" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tips for you</span>
                        </div>
                        <div className="space-y-4">
                            {suggestions.map((s, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i} 
                                    className="flex items-center gap-3 text-sm text-slate-300 font-medium"
                                >
                                    <CheckCircle size={12} className="text-purple-500" />
                                    {s}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Typing Area */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="glass-card p-10 md:p-14 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 opacity-30" />
                        
                        <div className="mb-10 relative">
                            <div className="text-2xl md:text-3xl font-medium leading-relaxed tracking-tight select-none">
                                {SAMPLE_TEXT.split('').map((char, i) => (
                                    <span 
                                        key={i} 
                                        className={`${
                                            charStates[i] === 1 ? 'text-white' : 
                                            charStates[i] === 2 ? 'text-red-500 bg-red-500/10' : 
                                            'text-slate-600'
                                        } transition-all duration-75`}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>
                            
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
                            <div className="text-purple-400 font-bold uppercase text-xs tracking-widest animate-pulse pt-8 border-t border-white/5">
                                Start typing to begin your session...
                            </div>
                        )}

                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                Mode: 60s Practice
                            </div>
                            <button 
                                onClick={reset}
                                className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                            >
                                <RotateCcw size={16} /> Reset Lab
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {(isFinished || timeLeft <= 0) && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card p-10 bg-purple-600 border-none shadow-[0_0_50px_rgba(147,51,234,0.3)] flex flex-col md:flex-row items-center justify-between gap-8"
                            >
                                <div>
                                    <h4 className="text-3xl font-black text-white mb-1">Session Complete</h4>
                                    <p className="text-purple-100 text-sm font-medium">Your accuracy was {accuracy}%</p>
                                </div>
                                <div className="flex items-center gap-8 bg-black/20 p-6 rounded-3xl">
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-white">{wpm}</div>
                                        <div className="text-xs font-bold text-purple-200 uppercase tracking-widest">WPM</div>
                                    </div>
                                    <button onClick={reset} className="px-8 py-3 bg-white text-purple-600 rounded-xl font-bold hover:scale-105 transition-transform">
                                        Try Again
                                    </button>
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
        <div className="glass-card p-8 relative group">
             <div className="flex flex-col gap-2">
                <span className="text-5xl font-black text-white tracking-tight">{value}</span>
                <span className={`text-xs font-bold uppercase tracking-widest ${color}`}>{unit}</span>
             </div>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4">{label}</p>
        </div>
    );
}

