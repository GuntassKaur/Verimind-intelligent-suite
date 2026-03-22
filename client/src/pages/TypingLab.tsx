import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Target, Zap, X, Activity, Trophy, Play, RotateCcw } from 'lucide-react';
import api from '../services/api';

interface TypingUpdateDetail {
    wpm: number;
    accuracy: number;
    suggestions?: string[];
    tips?: string[];
}

export default function TypingLab() {
    const [status, setStatus] = useState<'IDLE' | 'TYPING' | 'FINISHED'>('IDLE');
    const [text, setText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [errors, setErrors] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [activeSeconds, setActiveSeconds] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Sync with Assistant Panel (if any)
    useEffect(() => {
        const detail: TypingUpdateDetail = { wpm, accuracy };
        if (status === 'FINISHED' || wpm > 0) {
            detail.suggestions = wpm < 30 ? ["Focus on accuracy first!", "Don't look at the keyboard."] : wpm < 60 ? ["You're doing great, keep a steady rhythm.", "Try to read ahead as you type."] : ["Amazing speed!", "You are a typing master."];
            detail.tips = [`High Score precision: ${accuracy}%`, `Errors made: ${errors}`];
        }
        window.dispatchEvent(new CustomEvent('typing_update', { detail }));
    }, [wpm, accuracy, status, errors]);

    const fetchQuote = useCallback(async () => {
        try {
            const { data } = await api.get('/api/typing/quote');
            if (data.success) setText(data.quote);
        } catch {
            setText("The quick brown fox jumps over the lazy dog. Typing fast requires practice, focus, and good posture. Keep your fingers on the home row!");
        }
    }, []);

    useEffect(() => {
        fetchQuote();
    }, [fetchQuote]);

    const startTest = () => {
        setStatus('TYPING');
        setIsActive(true);
        setUserInput('');
        setTimeLeft(60);
        setWpm(0);
        setAccuracy(100);
        setErrors(0);
        setActiveSeconds(0);
        if (inputRef.current) inputRef.current.focus();
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (status !== 'TYPING' || timeLeft === 0) return;

        setUserInput(val);
        
        let errs = 0;
        const targetArr = text.split('');
        val.split('').forEach((char, i) => {
            if (char !== targetArr[i]) errs++;
        });
        setErrors(errs);

        const acc = Math.max(0, Math.round(((val.length - errs) / Math.max(1, val.length)) * 100));
        setAccuracy(acc);

        if (val.length >= text.length) {
            finishTest();
        }
    };

    const finishTest = useCallback(() => {
        setStatus('FINISHED');
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        finishTest();
                        return 0;
                    }
                    return prev - 1;
                });
                setActiveSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, finishTest, timeLeft]);

    useEffect(() => {
        if (isActive && activeSeconds > 0) {
            const words = userInput.length / 5;
            const currentWpm = Math.round((words / activeSeconds) * 60);
            setWpm(currentWpm);
        }
    }, [activeSeconds, userInput, isActive]);

    return (
        <div className="w-full max-w-5xl mx-auto py-12 px-4 md:px-8">
            <header className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-2xl mb-4 shadow-sm">
                    <Trophy className="text-amber-500 w-8 h-8" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Speed Typing Game</h1>
                <p className="text-slate-500 text-sm max-w-lg mx-auto font-medium">Test your typing speed and accuracy. Beat the clock and set a new high score!</p>
            </header>

            <section className="mb-10">
                <div className="clean-card bg-white p-8 overflow-hidden relative">
                    {/* Game Stats Bar */}
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                 <Timer size={20} />
                             </div>
                             <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Left</span>
                                 <span className={`text-2xl font-black ${timeLeft < 10 && status === 'TYPING' ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>{timeLeft}s</span>
                             </div>
                         </div>
                         <div className="flex gap-8">
                              <div className="flex flex-col items-end">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Speed</span>
                                  <span className="text-2xl font-black text-indigo-600">{wpm} <span className="text-sm font-bold text-indigo-300">WPM</span></span>
                              </div>
                              <div className="h-10 w-px bg-slate-100" />
                              <div className="flex flex-col items-end">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accuracy</span>
                                  <span className="text-2xl font-black text-emerald-500">{accuracy}%</span>
                              </div>
                         </div>
                    </div>

                    {/* Text Display Area */}
                    <div className="relative p-8 bg-slate-50 rounded-2xl border border-slate-200 mb-8 shadow-inner">
                         <p className="text-2xl md:text-3xl font-medium leading-relaxed text-slate-400 tracking-wide break-words select-none">
                            {text.split('').map((char, i) => {
                                let color = 'text-slate-400';
                                let bg = '';
                                if (i < userInput.length) {
                                    if (userInput[i] === char) {
                                        color = 'text-slate-900';
                                    } else {
                                        color = 'text-rose-600';
                                        bg = 'bg-rose-100 rounded-sm';
                                    }
                                } else if (i === userInput.length && status === 'TYPING') {
                                    bg = 'bg-indigo-100 border-b-2 border-indigo-500 rounded-sm animate-pulse';
                                }
                                return <span key={i} className={`${color} ${bg} transition-colors duration-75`}>{char}</span>;
                            })}
                         </p>
                    </div>

                    {/* Interactive Input */}
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={userInput}
                            onChange={handleInput}
                            disabled={status === 'IDLE' || status === 'FINISHED'}
                            placeholder={status === 'IDLE' ? "Click 'Start Game' to begin typing..." : "Type here as fast as you can..."}
                            className="w-full bg-white border-2 border-slate-200 rounded-2xl px-8 py-5 text-xl font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-300 shadow-sm"
                        />
                    </div>

                    {/* Game Controls */}
                    <div className="flex justify-center mt-10">
                        {status !== 'TYPING' ? (
                            <button
                                onClick={startTest}
                                className="flex items-center gap-3 py-4 px-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-200 hover:-translate-y-1 hover:shadow-xl transition-all"
                            >
                                {status === 'IDLE' ? <Play className="fill-white" size={20} /> : <RotateCcw size={20} />}
                                <span className="text-sm uppercase tracking-widest">{status === 'IDLE' ? 'Start Game' : 'Play Again'}</span>
                            </button>
                        ) : (
                            <button
                                onClick={finishTest}
                                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                            >
                                <X size={16} /> End Game Early
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Game Over Screen */}
            <AnimatePresence>
                {status === 'FINISHED' && (
                    <motion.section 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mb-12"
                    >
                         <div className="clean-card bg-white p-10 text-center border-2 border-indigo-100 flex flex-col items-center">
                             <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-white">
                                 <Trophy size={40} className="text-amber-500" />
                             </div>
                             <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Time's Up!</h3>
                             <p className="text-slate-500 font-medium mb-10">Here is your final performance report.</p>
                             
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                                  <div className="p-8 rounded-2xl bg-indigo-50 border border-indigo-100">
                                       <Activity size={24} className="text-indigo-500 mx-auto mb-4" />
                                       <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 block">Typing Speed</span>
                                       <div className="text-5xl font-black text-indigo-600">{wpm}</div>
                                       <span className="text-xs font-bold text-indigo-400 mt-1 block">WPM</span>
                                  </div>
                                  <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-100">
                                       <Target size={24} className="text-emerald-500 mx-auto mb-4" />
                                       <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 block">Accuracy</span>
                                       <div className="text-5xl font-black text-emerald-600">{accuracy}%</div>
                                       <span className="text-xs font-bold text-emerald-400 mt-1 block">Correct</span>
                                  </div>
                                  <div className="p-8 rounded-2xl bg-rose-50 border border-rose-100">
                                       <Zap size={24} className="text-rose-500 mx-auto mb-4" />
                                       <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2 block">Mistakes</span>
                                       <div className="text-5xl font-black text-rose-600">{errors}</div>
                                       <span className="text-xs font-bold text-rose-400 mt-1 block">Typos</span>
                                  </div>
                             </div>

                             <button 
                                onClick={startTest} 
                                className="mt-12 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-2"
                             >
                                <RotateCcw size={18} /> Play Again
                             </button>
                         </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
}
