import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Keyboard, 
    RotateCcw, 
    Zap, 
    Flame, 
    Target, 
    Timer
} from 'lucide-react';

const SAMPLE_TEXT = "Intelligence is the ability to adapt to change. In the realm of neural architectures, the speed of thought is only limited by the frequency of your synaptic cycles. Verimind empowers human cognition by bridging the gap between raw data and actionable insight.";

export default function TypingLab() {
    const [text, setText] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isFinished, setIsFinished] = useState(false);
    const [charStates, setCharStates] = useState<number[]>([]); // 0: untyped, 1: correct, 2: wrong
    const inputRef = useRef<HTMLInputElement>(null);

    const reset = useCallback(() => {
        setText('');
        setStartTime(null);
        setWpm(0);
        setAccuracy(100);
        setIsFinished(false);
        setCharStates(new Array(SAMPLE_TEXT.length).fill(0));
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    useEffect(() => {
        reset();
    }, [reset]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (isFinished) return;

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
        setAccuracy(Math.round((correctCount / Math.max(1, val.length)) * 100));

        if (val.length === SAMPLE_TEXT.length) {
            setIsFinished(true);
            const timeElapsed = (Date.now() - (startTime || Date.now())) / 60000;
            setWpm(Math.round((val.length / 5) / timeElapsed));
        }
    };

    // Calculate live WPM
    useEffect(() => {
        if (startTime && !isFinished) {
            const interval = setInterval(() => {
                const timeElapsed = (Date.now() - startTime) / 60000;
                if (timeElapsed > 0) {
                    setWpm(Math.round((text.length / 5) / timeElapsed));
                }
            }, 500);
            return () => clearInterval(interval);
        }
    }, [startTime, isFinished, text]);

    return (
        <div className="max-w-6xl mx-auto py-12 px-6 lg:px-10 space-y-12 pb-32">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                        <Keyboard size={11} /> Cognitive Speed Lab
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
                        Typing <span className="text-indigo-500">Accelerator</span>.
                    </h1>
                    <p className="text-slate-500 font-medium italic text-lg">"Measuring the delta between thought and digital input."</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Stats Sidebar */}
                <div className="space-y-8">
                    <StatBox label="Words Per Minute" value={wpm} icon={Zap} unit="WPM" color="text-indigo-400" />
                    <StatBox label="Accuracy" value={accuracy} icon={Target} unit="%" color="text-emerald-400" />
                    <div className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 flex flex-col items-center text-center group">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 shadow-2xl group-hover:scale-110 transition-transform">
                            <Flame size={28} className="text-amber-500" />
                        </div>
                        <span className="text-3xl font-black text-white italic tracking-tighter">ELITE</span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-1">Status Class</span>
                    </div>
                </div>

                {/* Main Interaction Lab */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="p-12 md:p-16 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20" />
                        
                        {/* Sample Text Display */}
                        <div className="text-2xl md:text-3xl font-bold leading-relaxed tracking-tight break-words font-mono opacity-80 mb-12">
                            {SAMPLE_TEXT.split('').map((char, i) => (
                                <span 
                                    key={i} 
                                    className={`${
                                        charStates[i] === 1 ? 'text-white' : 
                                        charStates[i] === 2 ? 'text-rose-500 bg-rose-500/10 underline decoration-2' : 
                                        'text-slate-700'
                                    } transition-colors duration-100`}
                                >
                                    {char}
                                </span>
                            ))}
                        </div>

                        {/* Hidden Input Layer */}
                        <div className="relative">
                            <input 
                                ref={inputRef}
                                type="text"
                                value={text}
                                onChange={handleInput}
                                disabled={isFinished}
                                className="absolute inset-0 opacity-0 cursor-default"
                                autoFocus
                            />
                            {!startTime && !isFinished && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    className="flex items-center gap-3 text-indigo-400/60 font-black uppercase text-xs tracking-widest animate-pulse"
                                >
                                    <Zap size={14} /> Start typing to trigger neural link
                                </motion.div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="mt-12 pt-12 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Timer size={14} className="text-slate-600" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        {startTime ? Math.round((Date.now() - startTime) / 1000) : 0}s Elapsed
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={reset}
                                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all active:scale-95 shadow-2xl"
                            >
                                <RotateCcw size={14} /> Re-Sync
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isFinished && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="p-12 rounded-[4rem] bg-gradient-to-br from-indigo-600 to-purple-600 shadow-[0_0_80px_rgba(79,70,229,0.3)] flex flex-col md:flex-row items-center justify-between gap-10 border border-white/20 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                                <div className="relative z-10">
                                    <h4 className="text-4xl font-black text-white tracking-tighter mb-2">Neural Synergy Complete.</h4>
                                    <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.4em]">Evaluation: Cognitive Overclock Active</p>
                                </div>
                                <div className="flex items-center gap-8 relative z-10 bg-white/10 p-8 rounded-[3rem] backdrop-blur-xl border border-white/10">
                                    <div className="text-center">
                                        <div className="text-5xl font-black text-white tracking-tighter">{wpm}</div>
                                        <div className="text-[9px] font-black text-indigo-200 uppercase tracking-[0.3em]">Final WPM</div>
                                    </div>
                                    <div className="w-px h-12 bg-white/10" />
                                    <div className="text-center">
                                        <div className="text-5xl font-black text-white tracking-tighter">{accuracy}%</div>
                                        <div className="text-[9px] font-black text-indigo-200 uppercase tracking-[0.3em]">Accuracy</div>
                                    </div>
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
        <div className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 relative overflow-hidden group hover:bg-white/[0.05] transition-all">
             <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-xl bg-white/5 border border-current opacity-40 ${color}`}>
                    <Icon size={24} />
                </div>
             </div>
             <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-black text-white tracking-tighter leading-none">{value}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${color}`}>{unit}</span>
             </div>
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">{label}</p>
        </div>
    );
}
