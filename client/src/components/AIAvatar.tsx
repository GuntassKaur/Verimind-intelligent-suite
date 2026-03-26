import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIAvatarProps {
    status: 'idle' | 'listening' | 'thinking' | 'speaking';
    audioLevel?: number; // 0 to 1
}

export const AIAvatar: React.FC<AIAvatarProps> = ({ status, audioLevel = 0 }) => {
    const [simulatedLevel, setSimulatedLevel] = useState(0);

    useEffect(() => {
        let interval: any;
        if (status === 'speaking' && audioLevel === 0) {
            interval = setInterval(() => {
                setSimulatedLevel(0.2 + Math.random() * 0.8);
            }, 100);
        } else {
            setSimulatedLevel(0);
        }
        return () => clearInterval(interval);
    }, [status, audioLevel]);

    const activeLevel = audioLevel > 0 ? audioLevel : simulatedLevel;

    // Animation variants
    const containerVariants: any = {
        idle: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' } },
        listening: { y: [0, -5, 0], scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } },
        thinking: { y: [0, -15, 0], rotate: [0, 2, -2, 0], transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } },
        speaking: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } },
    };

    const eyeVariants: any = {
        idle: { height: '12px', opacity: 0.8 },
        listening: { height: '16px', opacity: 1 },
        thinking: {
            height: ['12px', '4px', '12px'],
            x: [-5, 5, -5],
            transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
        },
        speaking: { 
            height: ['12px', '16px', '12px'], 
            transition: { repeat: Infinity, duration: 0.5 }
        }
    };

    const ringVariants: any = {
        idle: { rotate: 360, transition: { repeat: Infinity, duration: 20, ease: 'linear' } },
        listening: { rotate: 360, scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 10, ease: 'linear' } },
        thinking: { rotate: -360, transition: { repeat: Infinity, duration: 3, ease: 'linear' } },
        speaking: { rotate: 360, scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 8, ease: 'linear' } },
    };

    return (
        <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Ambient HUD Widgets (Floating around) */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Left Progress Bar Bar */}
                <motion.div 
                    animate={{ opacity: [0.2, 0.5, 0.2], y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className="absolute left-0 top-1/4 w-1 h-32 bg-indigo-500/20 rounded-full"
                >
                    <motion.div 
                        animate={{ height: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        className="w-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]"
                    />
                </motion.div>

                {/* Right Circular HUD */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                    className="absolute right-0 top-1/3 w-12 h-12 border border-dashed border-indigo-400/30 rounded-full flex items-center justify-center"
                >
                    <div className="w-6 h-6 border-t-2 border-indigo-400 rounded-full" />
                </motion.div>

                {/* Floating Data Hexes */}
                <div className="absolute left-4 top-10 flex flex-col space-y-1">
                   {[1, 2, 3].map(i => (
                       <motion.div 
                        key={i}
                        animate={{ x: [0, 5, 0], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ delay: i * 0.5, repeat: Infinity, duration: 3 }}
                        className="w-4 h-1 bg-indigo-400/40 rounded-full" 
                       />
                   ))}
                </div>
            </div>

            {/* Outer Sound Wave Rings */}
            <AnimatePresence>
                {(status === 'listening' || status === 'speaking') && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="absolute inset-[-40px] flex items-center justify-center pointer-events-none"
                    >
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className={`absolute border border-indigo-500 rounded-full`}
                                style={{ width: 140 + i * 40, height: 140 + i * 40, opacity: 0.1 }}
                                animate={{
                                    scale: [1, 1.1 + (activeLevel * 0.4), 1],
                                    opacity: [0.05, 0.2 * activeLevel + 0.05, 0.05],
                                    borderWidth: [1, 2 * activeLevel + 1, 1]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: status === 'listening' ? 1.5 : 0.4,
                                    delay: i * 0.1,
                                    ease: 'easeInOut'
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Glowing Aura */}
            <motion.div
                animate={{
                    scale: status === 'speaking' ? 1.3 + activeLevel * 0.3 : status === 'listening' ? [1, 1.2, 1] : 1,
                    opacity: status === 'speaking' ? 0.5 + activeLevel * 0.5 : status === 'thinking' ? 0.7 : 0.3
                }}
                transition={{ duration: 1, repeat: status === 'listening' ? Infinity : 0 }}
                className={`absolute inset-8 rounded-full blur-[60px] ${
                    status === 'listening' ? 'bg-indigo-500/40' : 
                    status === 'thinking' ? 'bg-purple-500/40' : 
                    status === 'speaking' ? 'bg-indigo-400/50' : 'bg-slate-700/20'
                }`}
            />

            {/* Main Robot Avatar Body */}
            <motion.div
                variants={containerVariants}
                animate={status}
                className="relative z-10 w-56 h-64 rounded-[60px] bg-[#05070A] border border-white/5 shadow-2xl flex flex-col items-center justify-start py-8 overflow-hidden backdrop-blur-md"
                style={{
                    boxShadow: status === 'speaking' 
                        ? `0 0 ${40 + activeLevel * 80}px rgba(99, 102, 241, ${0.2 + activeLevel * 0.5}), inset 0 0 40px rgba(99, 102, 241, 0.1)` 
                        : status === 'listening'
                        ? '0 0 50px rgba(99, 102, 241, 0.4), inset 0 0 30px rgba(99, 102, 241, 0.1)'
                        : status === 'thinking'
                        ? '0 0 60px rgba(168, 85, 247, 0.4), inset 0 0 40px rgba(168, 85, 247, 0.2)'
                        : '0 0 30px rgba(255, 255, 255, 0.03)'
                }}
            >
                {/* Internal Scanlines Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%]" />

                {/* Rotating Tech Ring behind the face */}
                <motion.div
                    variants={ringVariants}
                    animate={status}
                    className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 border-2 border-dashed rounded-full opacity-10 pointer-events-none"
                    style={{ borderColor: status === 'thinking' ? '#C084FC' : '#818CF8' }}
                />

                {/* Face Area */}
                <div className="relative z-20 flex flex-col items-center space-y-8 w-full">
                    {/* Vision Plate (Glowing backplate) */}
                    <div className="absolute top-2 w-40 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                    
                    {/* Eyes */}
                    <div className="relative flex items-center justify-center space-x-14">
                        {/* Eye reflections */}
                        <div className="absolute inset-0 flex justify-center space-x-14 opacity-30 pointer-events-none translate-y-[-4px]">
                            <div className="w-2 h-2 rounded-full bg-white blur-[2px]" />
                            <div className="w-2 h-2 rounded-full bg-white blur-[2px]" />
                        </div>

                        {[0, 1].map(i => (
                            <motion.div
                                key={i}
                                className={`w-12 rounded-full shadow-[0_0_20px_currentColor] ${
                                    status === 'thinking' ? 'text-purple-400 bg-purple-400' : 
                                    status === 'listening' ? 'text-indigo-300 bg-indigo-300' : 'text-indigo-500 bg-indigo-500'
                                }`}
                                variants={eyeVariants}
                                animate={status}
                                style={{
                                    boxShadow: `0 0 ${10 + activeLevel * 20}px currentColor`
                                }}
                            />
                        ))}
                    </div>

                    {/* Mouth / Audio Wave */}
                    <div className="h-10 flex items-center justify-center w-full px-12">
                        {status === 'speaking' ? (
                            <div className="flex items-center space-x-1.5 h-full">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((bar) => (
                                    <motion.div
                                        key={bar}
                                        className="w-1.5 bg-gradient-to-t from-indigo-600 to-indigo-300 rounded-full shadow-[0_0_15px_rgba(129,140,248,0.6)]"
                                        animate={{
                                            height: [
                                                '4px',
                                                `${10 + Math.random() * 25 + activeLevel * 30}px`,
                                                '4px'
                                            ]
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 0.15 + Math.random() * 0.15,
                                            ease: 'easeInOut'
                                        }}
                                    />
                                ))}
                            </div>
                        ) : status === 'listening' ? (
                            <motion.div
                                className="w-24 h-1 bg-indigo-400/60 rounded-full shadow-[0_0_15px_rgba(129,140,248,0.8)]"
                                animate={{ width: ['40px', '96px', '40px'], opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                            />
                        ) : status === 'thinking' ? (
                            <div className="flex space-x-3">
                                {[0, 1, 2].map((dot) => (
                                    <motion.div
                                        key={dot}
                                        className="w-2.5 h-2.5 bg-purple-400 rounded-full shadow-[0_0_12px_currentColor]"
                                        animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.5, delay: dot * 0.15 }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="w-12 h-1 bg-slate-800 rounded-full" />
                        )}
                    </div>
                </div>

                {/* Bottom Reactor / Core (Chest area) */}
                <div className="mt-auto mb-6 relative">
                    <motion.div 
                        animate={{ 
                            scale: 1 + activeLevel * 0.4,
                            opacity: 0.5 + activeLevel * 0.5 
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-indigo-500/30 bg-[#0A0C10] shadow-[0_0_20px_rgba(99,102,241,0.2)]`}
                    >
                        <motion.div 
                            animate={{ 
                                rotate: 360,
                                scale: status === 'speaking' ? [1, 1.3, 1] : 1
                            }}
                            transition={{ rotate: { repeat: Infinity, duration: 4, ease: 'linear' }, scale: { repeat: Infinity, duration: 0.5 } }}
                            className="w-6 h-6 border-t-2 border-indigo-400 rounded-full flex items-center justify-center"
                        >
                            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]" />
                        </motion.div>
                    </motion.div>
                    
                    {/* Reactor Labels */}
                    <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-[6px] font-mono text-indigo-500/40 space-y-0.5 whitespace-nowrap">
                        <div>PWR.SRG: {Math.round(activeLevel * 100)}%</div>
                        <div>LNK.STB: 99.9%</div>
                    </div>
                </div>

                {/* Side Brackets */}
                <div className="absolute left-4 bottom-1/2 translate-y-1/2 w-1 h-32 border-l border-white/5" />
                <div className="absolute right-4 bottom-1/2 translate-y-1/2 w-1 h-32 border-r border-white/5" />
            </motion.div>
        </div>
    );
};
