import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard } from 'lucide-react';
import { useLocation } from 'wouter';

export const GlobalTypingTracker: React.FC = () => {
    const [wpm, setWpm] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [location] = useLocation();

    const charCountRef = useRef(0);
    const startTimeRef = useRef<number | null>(null);
    const lastActivityRef = useRef<number>(Date.now());
    const displayTimerRef = useRef<any>(null);

    // Exclusion List: Do not track typing on these pages
    const isExcludedPage = ['/login', '/reset-password', '/otp-verify'].some(path => location.startsWith(path));

    useEffect(() => {
        if (isExcludedPage) {
            setWpm(0);
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isInput = target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.contentEditable === 'true';

            if (!isInput) return;

            // Ignore system keys
            if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== 'Delete') return;

            // Start timer on first key press
            if (!startTimeRef.current) {
                startTimeRef.current = Date.now();
            }

            // Update character count
            if (e.key === 'Backspace' || e.key === 'Delete') {
                charCountRef.current = Math.max(0, charCountRef.current - 1);
            } else {
                charCountRef.current += 1;
            }

            setIsTyping(true);
            lastActivityRef.current = Date.now();
        };

        // Calculation Timer: Update WPM every 1 second
        displayTimerRef.current = setInterval(() => {
            if (startTimeRef.current && charCountRef.current > 0) {
                const now = Date.now();
                const elapsedMinutes = (now - startTimeRef.current) / 60000;

                // Stop tracking if idle for 2 seconds
                if (now - lastActivityRef.current > 2000) {
                    setIsTyping(false);
                }

                if (elapsedMinutes > 0.01) {
                    const currentWpm = Math.round((charCountRef.current / 5) / elapsedMinutes);
                    setWpm(currentWpm);
                }
            }
        }, 1000);

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (displayTimerRef.current) clearInterval(displayTimerRef.current);
        };
    }, [isExcludedPage]);

    // Cleanup: Reset if inactive for too long
    useEffect(() => {
        if (!isTyping && wpm > 0) {
            const resetTimeout = setTimeout(() => {
                setWpm(0);
                charCountRef.current = 0;
                startTimeRef.current = null;
            }, 5000);
            return () => clearTimeout(resetTimeout);
        }
    }, [isTyping, wpm]);

    if (isExcludedPage) return null;

    return (
        <AnimatePresence>
            {wpm > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed bottom-8 left-8 z-[200] flex items-center gap-3 px-4 py-2 bg-[#0d1117]/80 backdrop-blur-xl border border-indigo-500/30 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.2)] pointer-events-none"
                >
                    <div className={`p-1.5 rounded-full ${isTyping ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`}>
                        <Keyboard size={12} className="text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                            Typing Speed: <span className="text-indigo-400">{wpm} WPM</span>
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
