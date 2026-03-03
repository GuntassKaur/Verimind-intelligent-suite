import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Keyboard, Timer, Target, Zap, Play, X, RefreshCw, Loader2 } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = ['General Knowledge', 'Science', 'Tech', 'Cooking', 'Music & Art', 'Kids'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function TypingLab() {
    const [difficulty, setDifficulty] = useState('Medium');
    const [category, setCategory] = useState('General Knowledge');
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'PLAYING' | 'FINISHED'>('IDLE');
    const [text, setText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [errors, setErrors] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<any>(null);
    const startTimeRef = useRef<number>(0);

    const startTest = async () => {
        setStatus('LOADING');
        try {
            const { data } = await api.post('/api/typing/get-text', { difficulty, category });
            setText(data.text);
            setUserInput('');
            setErrors(0);
            setWpm(0);
            setAccuracy(100);
            setTimeLeft(60);
            setStatus('PLAYING');
            startTimeRef.current = Date.now();

            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            console.error(err);
            setStatus('IDLE');
        }
    };

    const endTest = () => {
        clearInterval(timerRef.current);
        setStatus('FINISHED');
    };

    const cancelTest = () => {
        clearInterval(timerRef.current);
        setStatus('IDLE');
        setUserInput('');
    };

    useEffect(() => {
        if (status === 'PLAYING' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [status]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUserInput(value);

        // Calculate accuracy and errors
        let currentErrors = 0;
        for (let i = 0; i < value.length; i++) {
            if (value[i] !== text[i]) currentErrors++;
        }
        setErrors(currentErrors);

        const currentAccuracy = value.length === 0 ? 100 : Math.round(((value.length - currentErrors) / value.length) * 100);
        setAccuracy(currentAccuracy);

        // Calculate WPM
        const timeElapsed = (Date.now() - startTimeRef.current) / 1000 / 60; // in minutes
        const currentWpm = Math.round((value.length / 5) / (timeElapsed || 0.01));
        setWpm(currentWpm);

        if (value.length >= text.length) {
            endTest();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
            <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                    <Keyboard size={12} className="text-indigo-500" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Typing Practice</span>
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Typing Practice</h1>
                <p className="text-slate-500 font-medium">Test and improve your typing speed and accuracy.</p>
            </header>

            <div className="laptop-mock">
                <div className="laptop-screen">
                    <div className="split-view">
                        {/* LEFT: CONTROLS / INPUT */}
                        <div className="pane-input">
                            {status !== 'PLAYING' ? (
                                <div className="space-y-8">
                                    <div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Category</span>
                                        <div className="grid grid-cols-2 gap-3">
                                            {CATEGORIES.map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => setCategory(c)}
                                                    className={`px-4 py-3 rounded-xl text-[11px] font-bold transition-all border ${category === c ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                                                >
                                                    {c.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Difficulty</span>
                                        <div className="grid grid-cols-3 gap-3">
                                            {DIFFICULTIES.map(d => (
                                                <button
                                                    key={d}
                                                    onClick={() => setDifficulty(d)}
                                                    className={`px-4 py-3 rounded-xl text-[11px] font-bold transition-all border ${difficulty === d ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                                                >
                                                    {d.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={startTest}
                                        disabled={status === 'LOADING'}
                                        className="premium-btn-primary w-full flex items-center justify-center gap-3 py-4 mt-4"
                                    >
                                        {status === 'LOADING' ? <Loader2 className="animate-spin" /> : <Play size={20} />}
                                        {status === 'FINISHED' ? 'Restart Practice' : 'Start Practice'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Transcription</span>
                                        </div>
                                        <button onClick={cancelTest} className="text-rose-500 hover:text-rose-400 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors">
                                            <X size={14} />
                                            Cancel
                                        </button>
                                    </div>

                                    {/* Text Display Area */}
                                    <div className="custom-editor h-[300px] overflow-y-auto bg-black/40 border-white/10 leading-relaxed text-lg relative group">
                                        {/* Reference Text (Dimmed) */}
                                        <div className="absolute inset-8 pointer-events-none text-slate-700 select-none">
                                            {text}
                                        </div>
                                        {/* Overlay for Visual Feedback */}
                                        <div className="relative z-10 p-2 break-words whitespace-pre-wrap">
                                            {text.split('').map((char, i) => {
                                                let color = 'text-slate-500';
                                                if (i < userInput.length) {
                                                    color = userInput[i] === char ? 'text-emerald-400' : 'text-rose-500 bg-rose-500/10 rounded';
                                                } else if (i === userInput.length) {
                                                    color = 'text-white border-b-2 border-indigo-500 bg-indigo-500/10';
                                                }
                                                return <span key={i} className={`${color} transition-colors duration-150`}>{char}</span>;
                                            })}
                                        </div>
                                    </div>

                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={userInput}
                                        onChange={handleInput}
                                        className="opacity-0 absolute pointer-events-none"
                                        autoFocus
                                    />

                                    <p className="text-center text-[11px] text-slate-500 font-medium italic">Type the content above exactly as shown.</p>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: METRICS */}
                        <div className="pane-output">
                            <div className="h-full flex flex-col gap-6">
                                <div className="glass-card p-8 flex flex-col items-center justify-center space-y-2 border-indigo-500/10">
                                    <Timer size={24} className="text-secondary mb-2" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Remaining</span>
                                    <div className={`text-5xl font-black ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                                        {timeLeft}s
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="glass-card p-6 border-white/5 flex flex-col items-center">
                                        <Zap size={20} className="text-amber-400 mb-2" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Speed</span>
                                        <div className="text-2xl font-black text-white">{wpm} WPM</div>
                                    </div>
                                    <div className="glass-card p-6 border-white/5 flex flex-col items-center">
                                        <Target size={20} className="text-indigo-400 mb-2" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Accuracy</span>
                                        <div className={`text-2xl font-black ${accuracy < 90 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            {accuracy}%
                                        </div>
                                    </div>
                                </div>

                                {status === 'FINISHED' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="glass-card p-8 bg-indigo-500/5 border-indigo-500/20 text-center flex-grow flex flex-col justify-center"
                                    >
                                        <h2 className="text-2xl font-black text-white mb-2 uppercase">Practice Complete</h2>
                                        <p className="text-slate-400 text-sm mb-6">Your results have been saved to your history.</p>
                                        <div className="space-y-2 text-left mb-6">
                                            <div className="flex justify-between text-xs font-bold border-b border-white/5 pb-2">
                                                <span className="text-slate-500 uppercase">Mistakes</span>
                                                <span className="text-rose-500">{errors} characters</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-bold border-b border-white/5 pb-2 py-2">
                                                <span className="text-slate-500 uppercase">Difficulty</span>
                                                <span className="text-indigo-400">{difficulty}</span>
                                            </div>
                                        </div>
                                        <button onClick={startTest} className="premium-btn-primary w-full flex items-center justify-center gap-2">
                                            <RefreshCw size={18} />
                                            Try Again
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
