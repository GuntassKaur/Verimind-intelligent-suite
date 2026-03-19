import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [isActive, setIsActive] = useState(false); // New: Tracks if user IS typing
    const [activeSeconds, setActiveSeconds] = useState(0); // New: Real seconds spent typing

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startTest = async () => {
        setStatus('LOADING');
        setIsActive(false);
        setActiveSeconds(0);
        try {
            const { data } = await api.post('/api/typing/get-text', { difficulty, category });
            setText(data.text);
            setUserInput('');
            setErrors(0);
            setWpm(0);
            setAccuracy(100);
            setTimeLeft(60);
            setStatus('PLAYING');
        } catch (err) {
            console.error(err);
            setStatus('IDLE');
        }
    };

    // New: Active Timer Logic
    useEffect(() => {
        if (status === 'PLAYING' && isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
                setActiveSeconds(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        if (timeLeft <= 0 && status === 'PLAYING') {
            endTest();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [status, isActive, timeLeft]);

    const endTest = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
        setIsActive(false);
        setStatus('FINISHED');
    };

    const cancelTest = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
        setIsActive(false);
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
        if (status !== 'PLAYING') return;

        // Start activity if not already started
        if (!isActive) setIsActive(true);

        // Reset the "stop typing" timeout (Debounce)
        if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = setTimeout(() => {
            setIsActive(false); // Stop timer after 1 second of inactivity
        }, 1000);

        setUserInput(value);

        // Calculate accuracy and errors
        let currentErrors = 0;
        for (let i = 0; i < value.length; i++) {
            if (value[i] !== text[i]) currentErrors++;
        }
        setErrors(currentErrors);

        const currentAccuracy = value.length === 0 ? 100 : Math.round(((value.length - currentErrors) / value.length) * 100);
        setAccuracy(currentAccuracy);

        // Calculate WPM based on ACTIVE seconds
        // WPM = (Total Characters / 5) / (Time in Minutes)
        if (activeSeconds > 0) {
            const currentWpm = Math.round((value.length / 5) / (activeSeconds / 60));
            setWpm(currentWpm);
        }

        if (value.length >= text.length) {
            endTest();
        }
    };


    return (
        <div className="max-w-7xl mx-auto px-6 py-12 pt-16 md:pt-24 min-h-screen">
            <header className="mb-8 md:mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                    <Keyboard size={12} className="text-indigo-500" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Typing Practice</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">Typing Practice</h1>
                <p className="text-slate-500 font-medium text-sm md:text-base">Test and improve your typing speed and accuracy.</p>
            </header>

            <div className="laptop-mock">
                <div className="laptop-screen overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px] md:h-[800px] divide-y md:divide-y-0 md:divide-x divide-white/5">
                        {/* LEFT: CONTROLS / INPUT */}
                        <div className="p-6 md:p-10 flex flex-col bg-[#0d1117]/30 overflow-y-auto custom-scrollbar">
                            {status !== 'PLAYING' ? (
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Select Category</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {CATEGORIES.map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => setCategory(c)}
                                                    className={`px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${category === c ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'}`}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Intensity Level</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {DIFFICULTIES.map(d => (
                                                <button
                                                    key={d}
                                                    onClick={() => setDifficulty(d)}
                                                    className={`px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${difficulty === d ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'}`}
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={startTest}
                                        disabled={status === 'LOADING'}
                                        className="premium-btn-primary w-full flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 mt-4"
                                    >
                                        {status === 'LOADING' ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                                        <span className="text-sm font-black tracking-widest uppercase">{status === 'FINISHED' ? 'Restart Practice' : 'Initialize Session'}</span>
                                    </button>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-1 flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Neural Tracking</span>
                                        </div>
                                        <button onClick={cancelTest} className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all">
                                            <X size={12} />
                                            Terminate
                                        </button>
                                    </div>

                                    {/* Text Display Area */}
                                    <div className="glass-panel flex-1 min-h-[300px] md:min-h-[350px] bg-black/40 border-white/5 p-4 md:p-8 leading-relaxed text-lg md:text-2xl relative overflow-y-auto selection:bg-indigo-500/30">
                                        {/* Reference Text (Dimmed) */}
                                        <div className="absolute inset-4 md:inset-8 pointer-events-none text-slate-800 select-none font-mono tracking-tight leading-relaxed">
                                            {text}
                                        </div>
                                        {/* Overlay for Visual Feedback */}
                                        <div className="relative z-10 break-words whitespace-pre-wrap font-mono tracking-tight leading-relaxed">
                                            {text.split('').map((char, i) => {
                                                let color = 'text-transparent';
                                                if (i < userInput.length) {
                                                    color = userInput[i] === char ? 'text-indigo-400' : 'text-rose-500 bg-rose-500/20 rounded-md ring-2 ring-rose-500/30';
                                                } else if (i === userInput.length) {
                                                    color = 'text-white border-b-2 border-indigo-400 bg-indigo-400/20 animate-pulse';
                                                }
                                                return <span key={i} className={`${color} transition-all duration-75`}>{char}</span>;
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

                                    <div className="mt-6 flex items-center justify-center gap-4">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Synchronize Input</p>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* RIGHT: METRICS */}
                        {/* RIGHT: METRICS & FEEDBACK */}
                        <div className="p-6 md:p-10 bg-black/40 flex flex-col overflow-y-auto custom-scrollbar">
                            <div className="h-full flex flex-col gap-6">
                                {/* Timer Card */}
                                <div className="glass-panel p-6 md:p-10 flex flex-col items-center justify-center space-y-4 border-white/5 bg-white/[0.02] relative overflow-hidden">
                                    {/* Activity Indicator Overlay */}
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div 
                                                initial={{ opacity: 0 }} 
                                                animate={{ opacity: 1 }} 
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-emerald-500/5 flex items-center justify-center"
                                            >
                                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20">
                                                    <motion.div 
                                                        animate={{ x: ['-100%', '100%'] }} 
                                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                        className="w-1/2 h-full bg-emerald-500"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 relative z-10">
                                        <Timer size={28} className={isActive ? "text-emerald-400 animate-pulse" : "text-slate-500"} />
                                    </div>
                                    <div className="text-center relative z-10">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-2">
                                            {isActive ? 'Tracking Active' : 'Timer Paused'}
                                        </span>
                                        <div className={`text-4xl md:text-6xl font-black ${timeLeft < 10 ? 'text-rose-500 animate-bounce' : 'text-white'} tracking-tighter`}>
                                            {timeLeft}<span className="text-xl md:text-2xl text-slate-600">s</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Velocity & Precision Grid */}
                                <div className="grid grid-cols-2 gap-4 md:gap-6">
                                    {/* WPM Card */}
                                    <div className="glass-panel p-6 md:p-8 border-white/5 bg-white/[0.02] flex flex-col items-center group relative overflow-hidden">
                                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center border mb-3 md:mb-4 transition-all ${
                                            wpm > 60 ? 'bg-emerald-500/10 border-emerald-500/20' : 
                                            wpm > 30 ? 'bg-amber-500/10 border-amber-500/20' : 
                                            'bg-rose-500/10 border-rose-500/20'
                                        }`}>
                                            <Zap size={18} className={wpm > 60 ? 'text-emerald-400' : wpm > 30 ? 'text-amber-400' : 'text-rose-400'} />
                                        </div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Velocity</span>
                                        <div className="text-2xl md:text-3xl font-black text-white">{wpm} <span className="text-[10px] md:text-xs text-slate-500">WPM</span></div>
                                        
                                        {/* WPM Progress Bar */}
                                        <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                                            <motion.div 
                                                className={`h-full ${wpm > 60 ? 'bg-emerald-500' : wpm > 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min((wpm / 100) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Accuracy Card */}
                                    <div className="glass-panel p-6 md:p-8 border-white/5 bg-white/[0.02] flex flex-col items-center group">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                                            <Target size={18} className="text-indigo-400" />
                                        </div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Precision</span>
                                        <div className={`text-2xl md:text-3xl font-black ${accuracy < 90 ? 'text-rose-400' : 'text-indigo-400'}`}>{accuracy}<span className="text-[10px] md:text-xs text-slate-500">%</span></div>
                                        
                                        {/* Accuracy Bar */}
                                        <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                                            <motion.div 
                                                className={`h-full ${accuracy < 90 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${accuracy}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {status === 'FINISHED' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="glass-panel p-8 bg-indigo-500/[0.03] border-indigo-500/20 text-center flex-grow flex flex-col justify-center"
                                    >
                                        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Performance Summary</h2>
                                        
                                        {/* SMART SUGGESTION BOX */}
                                        <div className={`mb-8 p-6 rounded-2xl border ${wpm < 30 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                                            <p className="text-sm font-black uppercase tracking-widest mb-2 font-mono">
                                                {wpm < 30 ? 'Skill Enhancement Required' : 'Elite Status Detected'}
                                            </p>
                                            <p className="text-xs font-medium leading-relaxed italic">
                                                {wpm < 30 
                                                    ? "You can improve your typing speed with regular practice. Focus on accuracy first, speed will follow." 
                                                    : "Great typing speed! Keep practicing to improve further and reach record-breaking velocities."}
                                            </p>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between items-center p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inaccuracies</span>
                                                <span className="text-xs font-black text-rose-500">{errors} chars</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Active Time</span>
                                                <span className="text-xs font-black text-indigo-400">{activeSeconds}s Engaged</span>
                                            </div>
                                        </div>

                                        <button onClick={startTest} className="premium-btn-primary w-full flex items-center justify-center gap-3 py-5 bg-indigo-500 group">
                                            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                            <span className="text-xs font-black tracking-widest uppercase">Restart Neural Cycle</span>
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
