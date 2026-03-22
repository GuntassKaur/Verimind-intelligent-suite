import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Target, Zap, X, Activity, Trophy } from 'lucide-react';
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

    // Sync with Assistant Panel
    useEffect(() => {
        const detail: TypingUpdateDetail = { wpm, accuracy };
        if (status === 'FINISHED' || wpm > 0) {
            detail.suggestions = wpm < 30 ? ["Focus on accuracy", "Establish rhythm"] : wpm < 60 ? ["Minimize hand movement", "Touch typing drills"] : ["Advanced speed bursts", "Zero-error challenge"];
            detail.tips = [`Current Precision: ${accuracy}%`, `Total Errors: ${errors}`];
        }
        window.dispatchEvent(new CustomEvent('typing_update', { detail }));
    }, [wpm, accuracy, status, errors]);

    const fetchQuote = useCallback(async () => {
        try {
            const { data } = await api.get('/api/typing/quote');
            if (data.success) setText(data.quote);
        } catch {
            setText("The neural network is initializing. Prepare for high-fidelity linguistic synchronization.");
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
        
        // Calculate Errors
        let errs = 0;
        const targetArr = text.split('');
        val.split('').forEach((char, i) => {
            if (char !== targetArr[i]) errs++;
        });
        setErrors(errs);

        // Accuracy
        const acc = Math.max(0, Math.round(((val.length - errs) / Math.max(1, val.length)) * 100));
        setAccuracy(acc);

        // Finish condition
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

    // Live WPM calculation
    useEffect(() => {
        if (isActive && activeSeconds > 0) {
            const words = userInput.length / 5;
            const currentWpm = Math.round((words / activeSeconds) * 60);
            setWpm(currentWpm);
        }
    }, [activeSeconds, userInput, isActive]);

    return (
        <div className="workspace-center-content">
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper mb-10">
                      <button className="modern-tool-btn active">
                         <Timer size={20} className="text-amber-400" />
                         <span>Neural Cadence</span>
                      </button>
                </div>

                <div className="smart-gpt-editor bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6 px-4 opacity-40">
                         <div className="flex items-center gap-3">
                             <Activity size={16} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Frequency Synchronization</span>
                         </div>
                         <div className="flex items-center gap-6">
                              <div className="flex flex-col items-center">
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Remaining</span>
                                  <span className={`text-xl font-black italic ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
                              </div>
                              <div className="h-8 w-px bg-white/5" />
                              <div className="flex flex-col items-center">
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Live Cadence</span>
                                  <span className="text-xl font-black italic text-indigo-400">{wpm} WPM</span>
                              </div>
                         </div>
                    </div>

                    <div className="relative p-10 bg-black/20 rounded-2xl border border-white/5 mb-8">
                         <p className="text-2xl font-serif italic leading-relaxed text-slate-500 select-none">
                            {text.split('').map((char, i) => {
                                let color = 'text-slate-600';
                                if (i < userInput.length) {
                                    color = userInput[i] === char ? 'text-indigo-400' : 'text-rose-500 underline decoration-2';
                                }
                                return <span key={i} className={`${color} transition-colors`}>{char}</span>;
                            })}
                         </p>
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={handleInput}
                        disabled={status === 'IDLE' || status === 'FINISHED'}
                        placeholder={status === 'IDLE' ? "Initialize sequence to start..." : "Synchronize your input..."}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-xl font-serif italic text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800"
                    />

                    <div className="flex justify-center mt-12">
                        {status !== 'TYPING' ? (
                            <button
                                onClick={startTest}
                                className="premium-btn-primary flex items-center gap-4 py-6 px-16 rounded-3xl group shadow-2xl transition-all"
                            >
                                <Zap size={20} className="group-hover:rotate-45" />
                                <span className="text-xs font-black uppercase tracking-[0.3em]">{status === 'IDLE' ? 'Enter Stream' : 'Recall Sequence'}</span>
                            </button>
                        ) : (
                            <button
                                onClick={finishTest}
                                className="px-12 py-5 bg-white/5 border border-white/10 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-rose-400 hover:border-rose-500/20 transition-all flex items-center gap-3"
                            >
                                <X size={16} /> Terminate Session
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {status === 'FINISHED' && (
                    <motion.section initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="output-bottom-area">
                         <div className="flex flex-col items-center">
                             <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center justify-center mb-10 shadow-3xl shadow-amber-500/20">
                                 <Trophy size={40} className="text-amber-500" />
                             </div>
                             <h3 className="text-3xl font-black text-white italic tracking-tighter mb-12 uppercase">Synchronization Manifested</h3>
                             
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                                  <div className="modern-card p-12 text-center bg-indigo-500/5 border-indigo-500/10">
                                       <Activity size={24} className="text-indigo-400 mx-auto mb-6" />
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Final Cadence</span>
                                       <div className="text-6xl font-black text-white italic">{wpm}</div>
                                       <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-2 block">Words / Min</span>
                                  </div>
                                  <div className="modern-card p-12 text-center bg-emerald-500/5 border-emerald-500/10">
                                       <Target size={24} className="text-emerald-400 mx-auto mb-6" />
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Neural Precision</span>
                                       <div className="text-6xl font-black text-white italic">{accuracy}%</div>
                                       <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-2 block">Synchronized</span>
                                  </div>
                                  <div className="modern-card p-12 text-center bg-rose-500/5 border-rose-500/10">
                                       <X size={24} className="text-rose-400 mx-auto mb-6" />
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Entropy Nodes</span>
                                       <div className="text-6xl font-black text-white italic">{errors}</div>
                                       <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mt-2 block">Logic Faults</span>
                                  </div>
                             </div>

                             <button onClick={startTest} className="mt-16 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.5em] transition-all underline underline-offset-8 decoration-white/10">Initiate Fresh Cycle</button>
                         </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
}
