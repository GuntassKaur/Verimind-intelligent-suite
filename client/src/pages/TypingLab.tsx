import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Target, Zap, X, Activity, Trophy, Play, RotateCcw, BrainCircuit, Keyboard } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = ["Kids", "General Knowledge", "Science", "Tech", "Cooking", "Music & Art"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function GamesHub() {
    const [activeTab, setActiveTab] = useState<'TYPING' | 'MEMORY'>('TYPING');

    return (
        <div className="w-full max-w-5xl mx-auto py-12 px-4 md:px-8">
            <header className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-2xl mb-4 shadow-sm">
                    <Trophy className="text-amber-500 w-8 h-8" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Focus & Play</h1>
                <p className="text-slate-500 text-sm max-w-lg mx-auto font-medium">Sharpen your mind with interactive focused games.</p>
            </header>

            <div className="flex justify-center mb-8">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
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
                </div>
            </div>

            {activeTab === 'TYPING' ? <TypingGame /> : <MemoryGame />}

        </div>
    );
}

function TypingGame() {
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
        <section className="mb-10 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
                <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    disabled={status === 'TYPING'}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 disabled:opacity-50"
                >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select 
                    value={difficulty} 
                    onChange={e => setDifficulty(e.target.value)}
                    disabled={status === 'TYPING'}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 disabled:opacity-50"
                >
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            <div className="clean-card bg-white p-5 md:p-8 overflow-hidden relative shadow-sm rounded-2xl md:rounded-3xl border border-slate-100">
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

                <div className="relative p-6 md:p-8 bg-slate-50 rounded-2xl border border-slate-200 mb-8 shadow-inner">
                     <p className="text-xl md:text-3xl font-medium leading-relaxed text-slate-400 tracking-wide break-words select-none">
                        {text.split('').map((char, i) => {
                            let color = 'text-slate-400';
                            let bg = '';
                            if (i < userInput.length) {
                                if (userInput[i] === char) {
                                    color = 'text-slate-900 font-bold';
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

                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={handleInput}
                        disabled={status === 'FINISHED'}
                        placeholder={status === 'IDLE' ? "Click 'Start Game' to begin..." : "Type here..."}
                        className="w-full bg-white border-2 border-slate-200 rounded-2xl px-8 py-5 text-xl font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-300 shadow-sm"
                    />
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
        </section>
    );
}

// Memory Match Game
const EMOJIS = ['🚀', '🧠', '💡', '🔥', '🌟', '💻', '🔮', '🎯'];

function MemoryGame() {
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
                <h2 className="text-2xl font-black text-slate-800 mb-2">Memory Match</h2>
                <p className="text-sm font-medium text-slate-500">
                    Flip the cards to reveal the AI symbols. Your goal is to find all the matching pairs with the fewest number of moves. Click on any two cards to see if they match!
                </p>
            </div>

            <div className="flex justify-between w-full max-w-lg mb-8 px-4">
                <div className="text-center bg-indigo-50 px-6 py-3 rounded-xl">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Moves</span>
                    <span className="text-2xl font-black text-indigo-600">{moves}</span>
                </div>
                <div className="text-center bg-emerald-50 px-6 py-3 rounded-xl">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Pairs</span>
                    <span className="text-2xl font-black text-emerald-600">{matches} / 8</span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-lg w-full px-2 md:px-0">
                {cards.map((card, idx) => (
                    <button
                        key={card.id}
                        onClick={() => handleCardClick(idx)}
                        className={`aspect-square flex items-center justify-center text-2xl md:text-4xl rounded-xl md:rounded-2xl transition-all duration-300 transform shadow-sm ${card.isFlipped || card.isMatched ? 'bg-white border-2 border-indigo-100 rotate-y-180' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1'}`}
                    >
                        {(card.isFlipped || card.isMatched) ? card.emoji : <BrainCircuit className="text-indigo-400/50" size={28} />}
                    </button>
                ))}
            </div>

            {matches === 8 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 text-center">
                    <h2 className="text-3xl font-black text-slate-800 mb-4">You Won in {moves} moves!</h2>
                    <button onClick={initializeGame} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                        Play Again
                    </button>
                </motion.div>
            )}
        </section>
    );
}
