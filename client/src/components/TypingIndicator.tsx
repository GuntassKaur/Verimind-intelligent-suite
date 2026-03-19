import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const TypingIndicator = () => {
    const [isTyping, setIsTyping] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        let hideTimeout: ReturnType<typeof setTimeout>;

        const handleInput = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                if (!isTyping) {
                    setIsTyping(true);
                    setStartTime(Date.now());
                    setCharCount(1);
                } else {
                    setCharCount(prev => prev + 1);
                }

                // Calculate WPM
                if (startTime) {
                    const elapsedMinutes = (Date.now() - startTime) / 60000;
                    if (elapsedMinutes > 0) {
                        const calculatedWpm = Math.round((charCount / 5) / elapsedMinutes);
                        setWpm(calculatedWpm);
                    }
                }

                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(() => {
                    setIsTyping(false);
                    setStartTime(null);
                    setCharCount(0);
                    setWpm(0);
                }, 3000);
            }
        };

        document.addEventListener('input', handleInput);
        return () => {
            document.removeEventListener('input', handleInput);
            clearTimeout(hideTimeout);
        };
    }, [isTyping, startTime, charCount]);

    return (
        <AnimatePresence>
            {isTyping && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-8 right-8 z-[9999] flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-indigo-500/50 px-5 py-3 rounded-full shadow-2xl"
                >
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest italic">Typing</span>
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-1 h-1 bg-indigo-400 rounded-full"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div className="font-mono text-sm font-bold text-white">
                        {wpm} <span className="text-[10px] text-slate-500 font-sans">WPM</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
