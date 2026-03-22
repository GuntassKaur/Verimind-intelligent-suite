import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Target, Zap, X, Activity, Trophy, Play, RotateCcw, BrainCircuit, Keyboard, Rocket, FlaskConical, Cpu, Music, ChefHat, Globe, Check } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const CATEGORIES = [
    { name: "Kids", icon: Rocket, color: "text-rose-500", bg: "bg-rose-500/10" },
    { name: "General Knowledge", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Science", icon: FlaskConical, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Tech", icon: Cpu, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { name: "Cooking", icon: ChefHat, color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "Music & Art", icon: Music, color: "text-purple-500", bg: "bg-purple-500/10" }
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

function TypingGame() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [status, setStatus] = useState<'IDLE' | 'TYPING' | 'FINISHED'>('IDLE');
    const [text, setText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [errors, setErrors] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [activeSeconds, setActiveSeconds] = useState(0);

    const [category, setCategory] = useState('General Knowledge');
    const [difficulty, setDifficulty] = useState('Medium');

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchQuote = useCallback(async () => {
        try {
            const { data } = await api.get(`/api/typing/quote?category=${encodeURIComponent(category)}&difficulty=${difficulty}`);
            if (data.data?.quote || data.quote) setText(data.data?.quote || data.quote);
        } catch {
            setText("The quick brown fox jumps over the lazy dog. Keep your fingers on the home row!");
        }
    }, [category, difficulty]);

    useEffect(() => {
        if (status === 'IDLE') {
            fetchQuote();
            setUserInput('');
        }
    }, [fetchQuote, status, difficulty, category]);

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
        <section className="space-y-10 animate-fade-in">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                     <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Select Knowledge Manifest</h3>
                     <div className="flex gap-2">
                          {DIFFICULTIES.map(d => (
                              <button 
                                key={d}
                                onClick={() => setDifficulty(d)}
                                disabled={status === 'TYPING'}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                    difficulty === d 
                                    ? 'bg-indigo-600 text-white shadow-lg' 
                                    : isDark ? 'bg-white/5 text-slate-500 border border-white/5' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'
                                }`}
                              >
                                {d}
                              </button>
                          ))}
                     </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {CATEGORIES.map(c => (
                        <button
                            key={c.name}
                            onClick={() => setCategory(c.name)}
                            disabled={status === 'TYPING'}
                            className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 group ${
                                category === c.name 
                                ? `border-indigo-500/50 shadow-lg ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}` 
                                : isDark ? 'bg-[#0C0F17] border-white/5 hover:border-white/10' : 'bg-white border-slate-100 hover:border-slate-300'
                            }`}
                        >
                            <div className={`p-3 rounded-xl ${c.bg} ${c.color} transition-transform group-hover:scale-110`}>
                                <c.icon size={20} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest text-center ${category === c.name ? 'text-indigo-400' : 'text-slate-500'}`}>{c.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={`rounded-[2.5rem] p-6 md:p-10 overflow-hidden relative border transition-all ${isDark ? 'bg-[#0C0F17] border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.05)]'}`}>
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 pb-5 md:pb-6 border-b border-slate-100 gap-6 md:gap-0">
                     <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
                         <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                             <Timer size={20} />
                         </div>
                         <div className="flex flex-col">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Left</span>
                             <span className={`text-xl md:text-2xl font-black ${timeLeft < 10 && status === 'TYPING' ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>{timeLeft}s</span>
                         </div>
                     </div>
                     <div className="flex gap-6 md:gap-8 w-full md:w-auto justify-center">
                          <div className="flex flex-col items-center md:items-end">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Speed</span>
                              <span className="text-xl md:text-2xl font-black text-indigo-600">{wpm} <span className="text-sm font-bold text-indigo-300">WPM</span></span>
                          </div>
                          <div className="h-10 w-px bg-slate-100 hidden md:block" />
                          <div className="flex flex-col items-center md:items-end">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accuracy</span>
                              <span className="text-xl md:text-2xl font-black text-emerald-500">{accuracy}%</span>
                          </div>
                     </div>
                </div>

                <div className={`relative p-6 md:p-10 rounded-[2rem] border mb-8 shadow-inner overflow-hidden min-h-[120px] md:min-h-[160px] ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                     <p className={`text-xl md:text-3xl font-medium leading-[1.8] tracking-wide break-words select-none transition-colors ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>
                        {text.split('').map((char, i) => {
                            let color = isDark ? 'text-slate-600' : 'text-slate-300';
                            let bg = '';
                            if (i < userInput.length) {
                                if (userInput[i] === char) {
                                    color = isDark ? 'text-white font-black' : 'text-slate-900 font-bold';
                                } else {
                                    color = 'text-rose-500';
                                    bg = 'bg-rose-500/10 rounded-sm ring-1 ring-rose-500/20';
                                }
                            } else if (i === userInput.length && status === 'TYPING') {
                                bg = 'bg-blue-500/20 border-b-4 border-blue-500 rounded-sm animate-pulse';
                            }
                            return <span key={i} className={`${color} ${bg} px-[1px]`}>{char}</span>;
                        })}
                     </p>
                </div>

                <div className="relative max-w-2xl mx-auto">
                    <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={handleInput}
                        disabled={status === 'FINISHED'}
                        placeholder={status === 'IDLE' ? "MANIFEST START TO BEGIN..." : "SYNC YOUR COGNITION..."}
                        className={`w-full rounded-2xl px-10 py-6 text-xl md:text-2xl font-black outline-none transition-all placeholder:text-slate-700 shadow-2xl relative z-10 ${
                            isDark 
                            ? 'bg-white/5 border-2 border-white/5 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' 
                            : 'bg-white border-2 border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                        }`}
                    />
                    <div className="absolute -inset-4 bg-indigo-500/5 blur-3xl rounded-full opacity-50 pointer-events-none" />
                </div>

                <div className="flex justify-center mt-10">
                    {status !== 'TYPING' ? (
                        <button
                            onClick={startTest}
                            className="flex items-center gap-3 py-4 px-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-200 hover:-translate-y-1 transition-all"
                        >
                            {status === 'IDLE' ? <Play className="fill-white" size={20} /> : <RotateCcw size={20} />}
                            <span className="text-sm uppercase tracking-widest">{status === 'IDLE' ? 'Start Game' : 'Play Again'}</span>
                        </button>
                    ) : (
                        <button
                            onClick={finishTest}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                        >
                            <X size={16} /> End Game
                        </button>
                    )}
                </div>
            </div>
            
            <AnimatePresence>
                 {status === 'FINISHED' && (
                    <motion.section 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mb-12"
                    >
                         <div className={`p-10 text-center border-2 rounded-[3.5rem] flex flex-col items-center shadow-3xl ${isDark ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-white border-indigo-100'}`}>
                             <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-8 shadow-inner ring-8 ring-white/5">
                                 <Trophy size={48} className="text-amber-500" />
                             </div>
                             <h3 className={`text-4xl font-black tracking-tighter mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Operation Complete.</h3>
                             <p className="text-slate-500 font-medium mb-12 italic">"Cognitive throughput successfully mapped across the manifest."</p>
                             
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                                  {[
                                      { label: 'Speed', val: wpm, unit: 'WPM', icon: Activity, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                                      { label: 'Accuracy', val: accuracy, unit: '%', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                                      { label: 'Mistakes', val: errors, unit: 'Typos', icon: Zap, color: 'text-rose-400', bg: 'bg-rose-400/10' },
                                  ].map((stat, i) => (
                                      <div key={i} className={`p-10 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100 shadow-soft'}`}>
                                           <stat.icon size={26} className={`${stat.color} mx-auto mb-6`} />
                                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">{stat.label}</span>
                                           <div className={`text-6xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.val}</div>
                                           <span className={`text-[11px] font-bold mt-2 block ${stat.color}`}>{stat.unit}</span>
                                      </div>
                                  ))}
                             </div>

                             <button 
                                onClick={startTest} 
                                className="mt-16 px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center gap-4 shadow-xl shadow-indigo-500/20 active:scale-95"
                             >
                                <RotateCcw size={20} /> Deploy New Session
                             </button>
                         </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </section>
    );
}

// Memory Match Game
const EMOJIS = ['🚀', '🧠', '💡', '🔥', '🌟', '💻', '🔮', '🎯'];

function MemoryGame() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [cards, setCards] = useState<{id: number, emoji: string, isFlipped: boolean, isMatched: boolean}[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);

    const initializeGame = useCallback(() => {
        const shuffled = [...EMOJIS, ...EMOJIS]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({ id: index, emoji, isFlipped: false, isMatched: false }));
        setCards(shuffled);
        setFlippedIndices([]);
        setMoves(0);
        setMatches(0);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const handleCardClick = (index: number) => {
        if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const match = cards[newFlipped[0]].emoji === cards[newFlipped[1]].emoji;
            
            if (match) {
                setTimeout(() => {
                    const matchedCards = [...cards];
                    matchedCards[newFlipped[0]].isMatched = true;
                    matchedCards[newFlipped[1]].isMatched = true;
                    setCards(matchedCards);
                    setFlippedIndices([]);
                    setMatches(m => m + 1);
                }, 500);
            } else {
                setTimeout(() => {
                    const unflipCards = [...cards];
                    unflipCards[newFlipped[0]].isFlipped = false;
                    unflipCards[newFlipped[1]].isFlipped = false;
                    setCards(unflipCards);
                    setFlippedIndices([]);
                }, 1000);
            }
        }
    };

    return (
        <section className="mb-10 animate-fade-in flex flex-col items-center">
            <div className="text-center mb-6 max-w-md">
                <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Memory Match</h2>
                <p className="text-sm font-medium text-slate-500">
                    Flip the cards to reveal the AI symbols. Your goal is to find all the matching pairs with the fewest number of moves. Click on any two cards to see if they match!
                </p>
            </div>

            <div className="flex justify-between w-full max-w-lg mb-8 px-4">
                <div className={`text-center px-6 py-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-indigo-50'}`}>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Moves</span>
                    <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-indigo-600'}`}>{moves}</span>
                </div>
                <div className={`text-center px-6 py-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-emerald-50'}`}>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Pairs</span>
                    <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-emerald-600'}`}>{matches} / 8</span>
                </div>
            </div>

             <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-xl w-full px-2 md:px-0">
                {cards.map((card, idx) => (
                    <button
                        key={card.id}
                        onClick={() => handleCardClick(idx)}
                        className={`aspect-square flex items-center justify-center text-3xl md:text-5xl rounded-2xl md:rounded-[2rem] transition-all duration-500 transform shadow-xl relative preserve-3d ${
                            card.isFlipped || card.isMatched 
                            ? `${isDark ? 'bg-white/10 border-white/10' : 'bg-white border-indigo-100'} rotate-y-180` 
                            : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-indigo-600/20'
                        }`}
                    >
                        {(card.isFlipped || card.isMatched) ? (
                            <span className="animate-in fade-in zoom-in duration-300">{card.emoji}</span>
                        ) : (
                            <BrainCircuit className="text-indigo-200/40" size={32} />
                        )}
                        {card.isMatched && (
                             <div className="absolute top-2 right-2">
                                 <Check className="text-emerald-500" size={16} />
                             </div>
                        )}
                    </button>
                ))}
            </div>

            {matches === 8 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 text-center">
                    <h2 className={`text-3xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>You Won in {moves} moves!</h2>
                    <button onClick={initializeGame} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                        Play Again
                    </button>
                </motion.div>
            )}
        </section>
    );
}

function ReactionGame() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [gameState, setGameState] = useState<'IDLE' | 'WAITING' | 'READY' | 'RESULTS' | 'TOO_EARLY'>('IDLE');
    const [startTime, setStartTime] = useState(0);
    const [result, setResult] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startTest = () => {
        setGameState('WAITING');
        const delay = Math.floor(Math.random() * 3000) + 2000;
        timeoutRef.current = setTimeout(() => {
            setGameState('READY');
            setStartTime(Date.now());
        }, delay);
    };

    const handleClick = () => {
        if (gameState === 'WAITING') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setGameState('TOO_EARLY');
        } else if (gameState === 'READY') {
            const reactionTime = Date.now() - startTime;
            setResult(reactionTime);
            setGameState('RESULTS');
        }
    };

    const reset = () => {
        setGameState('IDLE');
        setResult(0);
    };

    return (
        <section className="mb-10 animate-fade-in flex flex-col items-center">
            <div className="text-center mb-10 max-w-md">
                <h2 className={`text-3xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Neural Reaction</h2>
                <p className="text-sm font-medium text-slate-500 italic">
                    "Measure your synaptic response latency. Click anywhere as soon as the signal turns green."
                </p>
            </div>

            <div 
                onClick={gameState === 'IDLE' || gameState === 'RESULTS' || gameState === 'TOO_EARLY' ? undefined : handleClick}
                className={`w-full max-w-2xl aspect-[16/9] rounded-[3rem] shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden border-4 ${
                    gameState === 'IDLE' ? (isDark ? 'bg-indigo-600/20 border-indigo-600/30' : 'bg-slate-100 border-slate-200') :
                    gameState === 'WAITING' ? (isDark ? 'bg-rose-600/20 border-rose-600/30' : 'bg-rose-50 border-rose-100') :
                    gameState === 'READY' ? (isDark ? 'bg-emerald-600/40 border-emerald-600/50' : 'bg-emerald-500 border-emerald-400') :
                    gameState === 'TOO_EARLY' ? (isDark ? 'bg-amber-600/20 border-amber-600/30' : 'bg-amber-50 border-amber-100') :
                    (isDark ? 'bg-blue-600/20 border-blue-600/30' : 'bg-blue-50 border-blue-100')
                }`}
            >
                {gameState === 'IDLE' && (
                    <div className="text-center py-10" onClick={startTest}>
                        <Zap className="text-indigo-500 w-16 h-16 mx-auto mb-6 animate-pulse" />
                        <h3 className={`text-2xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Ready to test?</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Click to start the sequence</p>
                    </div>
                )}

                {gameState === 'WAITING' && (
                    <div className="text-center">
                        <h3 className={`text-4xl font-black ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>WAIT FOR GREEN...</h3>
                    </div>
                )}

                {gameState === 'READY' && (
                    <div className="text-center">
                        <h3 className="text-6xl font-black text-white drop-shadow-lg scale-110 transition-transform">CLICK NOW!</h3>
                    </div>
                )}

                {gameState === 'TOO_EARLY' && (
                    <div className="text-center animate-bounce">
                        <X className="text-amber-500 w-16 h-16 mx-auto mb-6" />
                        <h3 className={`text-3xl font-black mb-6 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>TOO EARLY!</h3>
                        <button onClick={startTest} className="px-10 py-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20">Try Again</button>
                    </div>
                )}

                {gameState === 'RESULTS' && (
                    <div className="text-center">
                        <Trophy className="text-blue-500 w-16 h-16 mx-auto mb-6" />
                        <h3 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Response Mapped</h3>
                        <div className="text-7xl font-black text-blue-500 mb-8">{result}<span className="text-2xl ml-2">ms</span></div>
                        <div className="flex gap-4 justify-center">
                            <button onClick={startTest} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20">Test Again</button>
                            <button onClick={reset} className="px-8 py-4 bg-white/5 border border-white/10 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest">Reset</button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default function GamesHub() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState<'TYPING' | 'MEMORY' | 'REACTION'>('TYPING');

    return (
        <div className="w-full max-w-6xl mx-auto py-12 px-4 md:px-8 space-y-12 pb-32 transition-colors duration-500">
            <header className="text-center">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`inline-flex items-center justify-center p-4 rounded-[2rem] mb-6 shadow-xl ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50'}`}
                >
                    <Trophy className="text-amber-500 w-10 h-10" />
                </motion.div>
                <h1 className={`text-4xl md:text-6xl font-black tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Focus & <span className="text-gradient">Play</span>.</h1>
                <p className={`text-sm md:text-base font-medium max-w-lg mx-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>"Sharpen your high-velocity intelligence through specialized cognitive drills."</p>
            </header>

            <div className="flex justify-center">
                <div className={`flex gap-2 p-1.5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200 shadow-inner'}`}>
                    <button 
                        onClick={() => setActiveTab('TYPING')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'TYPING' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Keyboard size={18} /> Speed Typing
                    </button>
                    <button 
                        onClick={() => setActiveTab('MEMORY')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'MEMORY' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <BrainCircuit size={18} /> Memory Cards
                    </button>
                    <button 
                        onClick={() => setActiveTab('REACTION')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'REACTION' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Zap size={18} /> Neural Reaction
                    </button>
                </div>
            </div>

            {activeTab === 'TYPING' ? <TypingGame /> : activeTab === 'MEMORY' ? <MemoryGame /> : <ReactionGame />}

        </div>
    );
}
