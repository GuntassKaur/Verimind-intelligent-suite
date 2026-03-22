import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const GlobalTypingTracker: React.FC = () => {
    const [wpm, setWpm] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const { pathname } = useLocation();

    const charCountRef = useRef(0);
    const startTimeRef = useRef<number | null>(null);
    const lastActivityRef = useRef<number>(0);
    
    const isExcludedPage = ['/login', '/register', '/verimind'].some(path => pathname.startsWith(path));

    useEffect(() => {
        if (isExcludedPage) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setWpm(0);
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (!target || !(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true')) return;

            if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== 'Delete') return;

            if (!startTimeRef.current) startTimeRef.current = Date.now();
            
            if (e.key === 'Backspace' || e.key === 'Delete') {
                charCountRef.current = Math.max(0, charCountRef.current - 1);
            } else {
                charCountRef.current += 1;
            }

            setIsTyping(true);
            lastActivityRef.current = Date.now();
        };

        const timer = setInterval(() => {
            if (startTimeRef.current && charCountRef.current > 0) {
                const now = Date.now();
                const elapsedMinutes = (now - startTimeRef.current) / 60000;
                if (now - lastActivityRef.current > 2000) setIsTyping(false);
                if (elapsedMinutes > 0.01) {
                    setWpm(Math.round((charCountRef.current / 5) / elapsedMinutes));
                }
            }
        }, 1000);

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(timer);
        };
    }, [isExcludedPage]);

    if (isExcludedPage || wpm === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="fixed bottom-8 left-8 z-[200] flex items-center gap-3 px-4 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl pointer-events-none"
            >
                <div className={`p-1.5 rounded-full ${isTyping ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`}>
                    <Keyboard size={12} className="text-white" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    SPEED: <span className="text-indigo-400">{wpm} WPM</span>
                </span>
            </motion.div>
        </AnimatePresence>
    );
};
