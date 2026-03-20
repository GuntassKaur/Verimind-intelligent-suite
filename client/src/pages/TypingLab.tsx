import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Target, Zap, X, Loader2, Activity, Trophy } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = ['General Knowledge', 'Science', 'Tech', 'Cooking', 'Music & Art', 'Kids'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

interface TypingUpdateDetail {
    wpm: number;
    accuracy: number;
    suggestions?: string[];
    tips?: string[];
}

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
    const [isActive, setIsActive] = useState(false);
    const [activeSeconds, setActiveSeconds] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync with Assistant Panel
    useEffect(() => {
        const detail: TypingUpdateDetail = { wpm, accuracy };
        if (status === 'FINISHED' || wpm > 0) {
            detail.suggestions = wpm < 30 ? ["Focus on accuracy", "Establish rhythm"] : wpm < 60 ? ["Minimize hand movement", "Touch typing drills"] : ["Advanced speed bursts", "Zero-error challenge"];
            detail.tips = [`Current Precision: ${accuracy}%`, `Total Errors: ${errors}`];
        }
        window.dispatchEvent(new CustomEvent('typing_update', { detail }));
    }, [wpm, accuracy, status, errors]);

    const endTest = () => {
        setIsActive(false);
        setStatus('FINISHED');
        if (timerRef.current) clearInterval(timerRef.current);
        if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    };

    const startTest = async () => {
        setStatus('LOADING');
        setIsActive(false);
        setActiveSeconds(0);
        try {
            const { data } = await api.post('/api/typing/get-text', { difficulty, category });
            setText(data.success ? data.data?.text || data.text : data.text);
            setUserInput('');
            setErrors(0);
            setWpm(0);
            setAccuracy(100);
            setTimeLeft(60);
            setStatus('PLAYING');
        } catch (err) {
            setStatus('IDLE');
        }
    };

    useEffect(() => {
        if (status === 'PLAYING' && isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
                setActiveSeconds(prev => prev + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        if (timeLeft <= 0 && status === 'PLAYING') {
            endTest();
        }

        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [status, isActive, timeLeft]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (status !== 'PLAYING') return;

        if (!isActive) setIsActive(true);
        if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = setTimeout(() => setIsActive(false), 1200);

        setUserInput(val);

        let errs = 0;
        for (let i = 0; i < val.length; i++) {
            if (val[i] !== text[i]) errs++;
        }
        setErrors(errs);
        setAccuracy(val.length === 0 ? 100 : Math.round(((val.length - errs) / val.length) * 100));

        if (activeSeconds > 0) {
            const currentWpm = Math.round((val.length / 5) / (activeSeconds / 60));
            setWpm(currentWpm);
        }

        if (val.length >= text.length) endTest();
    };

    return (
        <div className="workspace-center-content">
            <section className="input-top-area no-print">
                <AnimatePresence mode="wait">
                    {status !== 'PLAYING' ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto space-y-10">
                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="flex-1 space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Neural Data Nodes</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {CATEGORIES.slice(0, 6).map(c => (
                                            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${category === c ? 'bg-indigo-500 border-indigo-500 text-white shadow-xl' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'}`}>{c}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Synaptic Intensity</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {DIFFICULTIES.map(d => (
                                            <button key={d} onClick={() => setDifficulty(d)} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${difficulty === d ? 'bg-indigo-500 border-indigo-500 text-white shadow-xl' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'}`}>{d}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button onClick={startTest} disabled={status === 'LOADING'} className="premium-btn-primary flex items-center justify-center gap-4 py-5 px-12 rounded-2xl group transition-all">
                                    {status === 'LOADING' ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:rotate-45" />}
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">{status === 'FINISHED' ? 'Restart Cycle' : 'Initialize Session'}</span>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
                            <div className="flex items-center justify-between mb-8 opacity-60">
                                <div className="flex items-center gap-3">
                                    <Activity size={16} className="text-emerald-500" />
                                    <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Neural Link: {isActive ? 'Established' : 'Paused'}</h2>
                                </div>
                                <button onClick={() => setStatus('IDLE')} className="text-slate-500 hover:text-rose-400 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                                    <X size={14} /> Terminate
                                </button>
                            </div>

                            <div className="smart-gpt-editor bg-black/40 min-h-[300px] border-white/5 p-8 relative">
                                <div className="absolute inset-0 pointer-events-none p-10 font-mono text-xl text-slate-800 leading-[1.8] tracking-tight whitespace-pre-wrap selection:bg-indigo-500/10">
                                    {text}
                                </div>
                                <div className="relative z-10 font-mono text-xl leading-[1.8] tracking-tight whitespace-pre-wrap">
                                    {text.split('').map((char, i) => {
                                        let clr = 'text-transparent';
                                        if (i < userInput.length) clr = userInput[i] === char ? 'text-indigo-400' : 'text-rose-500 bg-rose-500/20 rounded';
                                        else if (i === userInput.length) clr = 'text-white border-b-2 border-indigo-400 bg-indigo-500/10 animate-pulse';
                                        return <span key={i} className={clr}>{char}</span>;
                                    })}
                                </div>
                                <input ref={inputRef} type="text" value={userInput} onChange={handleInput} className="opacity-0 absolute inset-0 cursor-default" autoFocus />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <section className="output-bottom-area">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="modern-card flex flex-col items-center justify-center p-10 border-indigo-500/10 bg-indigo-500/5 group">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 transition-all ${isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                              <Timer size={24} className={isActive ? 'animate-pulse' : ''} />
                         </div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Engagement</span>
                         <div className={`text-4xl font-black ${timeLeft < 10 ? 'text-rose-500' : 'text-white'}`}>{timeLeft}<span className="text-lg opacity-30">s</span></div>
                     </div>

                     <div className="modern-card flex flex-col items-center justify-center p-10 border-cyan-500/10 bg-cyan-500/5 group">
                         <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                              <Zap size={24} />
                         </div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Velocity</span>
                         <div className="text-4xl font-black text-white">{wpm}<span className="text-lg opacity-30"> WPM</span></div>
                     </div>

                     <div className="modern-card flex flex-col items-center justify-center p-10 border-purple-500/10 bg-purple-500/5 group">
                         <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-purple-500/20 bg-purple-500/10 text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                              <Target size={24} />
                         </div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Precision</span>
                         <div className="text-4xl font-black text-white">{accuracy}<span className="text-lg opacity-30">%</span></div>
                     </div>
                </div>

                {status === 'FINISHED' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto mt-12 space-y-6">
                         <div className="modern-card grid grid-cols-1 md:grid-cols-2 gap-10 p-12 bg-white/[0.02]">
                             <div className="flex flex-col justify-center">
                                 <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                                     <Trophy className="text-amber-400" size={28} /> Neural Summary
                                 </h3>
                                 <div className={`p-6 rounded-2xl border ${wpm < 30 ? 'bg-amber-500/5 border-amber-500/20 text-amber-500' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'}`}>
                                      <h4 className="text-[11px] font-black uppercase tracking-widest mb-2">Analyst Feedback</h4>
                                      <p className="text-xs font-medium leading-relaxed italic opacity-80">
                                          {wpm < 30 ? "Sync errors detected. Focus on precise finger placement before aiming for high-velocity throughput." : "Impeccable coordination. Your synaptic response time is within the elite percentile for this category."}
                                      </p>
                                 </div>
                             </div>
                             <div className="space-y-4">
                                  <div className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-white/5">
                                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logic Interruptions</span>
                                      <span className="text-xs font-black text-rose-500">{errors} Errors</span>
                                  </div>
                                  <div className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-white/5">
                                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Session Time</span>
                                      <span className="text-xs font-black text-indigo-400">{activeSeconds}s Active</span>
                                  </div>
                                  <button onClick={startTest} className="w-full py-5 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/30">Initiate Next Cycle</button>
                             </div>
                         </div>
                    </motion.div>
                )}
            </section>
        </div>
    );
}
