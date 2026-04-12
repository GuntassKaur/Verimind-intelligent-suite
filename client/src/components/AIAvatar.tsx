import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIAvatarProps {
    status: 'idle' | 'listening' | 'thinking' | 'speaking';
    audioLevel?: number; // 0 to 1
}

export const AIAvatar: React.FC<AIAvatarProps> = ({ status, audioLevel = 0 }) => {
    const [simulatedLevel, setSimulatedLevel] = React.useState(0);

    React.useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (status === 'speaking') {
            interval = setInterval(() => {
                setSimulatedLevel(0.3 + Math.random() * 0.7);
            }, 100);
        } else {
            setSimulatedLevel(0);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [status]);

    const activeLevel = audioLevel > 0 ? audioLevel : simulatedLevel;

    return (
        <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Background Glows */}
            <AnimatePresence>
                {(status === 'speaking' || status === 'listening' || status === 'thinking') && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                            opacity: [0.3, 0.6, 0.3],
                            scale: status === 'speaking' ? [1, 1.2 + activeLevel, 1] : status === 'listening' ? [1, 1.1, 1] : 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`absolute inset-0 rounded-full blur-[80px] ${
                            status === 'speaking' ? 'bg-indigo-500/40' : 
                            status === 'listening' ? 'bg-emerald-500/20' : 'bg-purple-500/20'
                        }`}
                    />
                )}
            </AnimatePresence>

            {/* Pulsing Rings for Listening */}
            <AnimatePresence>
                {status === 'listening' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ 
                                    opacity: [0, 0.5, 0],
                                    scale: [1, 1.8],
                                }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    delay: i * 0.6,
                                    ease: "easeOut"
                                }}
                                className="absolute w-48 h-48 border-2 border-emerald-500/30 rounded-full"
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Glowing Waveform for Speaking */}
            <AnimatePresence>
                {status === 'speaking' && (
                    <div className="absolute inset-0 flex items-center justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ 
                                    height: [20, 40 + (activeLevel * 60), 20],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{ 
                                    duration: 0.3, 
                                    repeat: Infinity, 
                                    delay: i * 0.05 
                                }}
                                className="w-2 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Thinking / Processing Circle */}
            <AnimatePresence>
                {status === 'thinking' && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute w-60 h-60 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                    />
                )}
            </AnimatePresence>

            {/* Main Robot Image */}
            <motion.div
                animate={{
                    y: status === 'idle' ? [0, -10, 0] : 0,
                    scale: status === 'listening' ? [1, 1.05, 1] : 1,
                    filter: status === 'speaking' ? `drop-shadow(0 0 20px rgba(99, 102, 241, ${0.4 + activeLevel}))` : 'none'
                }}
                transition={{ 
                    duration: status === 'idle' ? 3 : 0.5, 
                    repeat: status === 'idle' ? Infinity : 0,
                    ease: "easeInOut"
                }}
                className="relative z-10"
            >
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" 
                    alt="AI Assistant"
                    loading="eager"
                    className="w-48 h-48 object-contain"
                    onError={(e) => {
                         // Fallback in case of flaticon outage
                         (e.target as HTMLImageElement).src = "https://www.flaticon.com/free-icon/robot_4712109";
                         // If that fails, just hide the broken image and use the glows/rings
                    }}
                />
                
                {/* Eyes/Face Glow Overlay */}
                <motion.div 
                    animate={{ 
                        opacity: status === 'speaking' ? [0.4, 0.8, 0.4] : 0 
                    }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full pointer-events-none"
                />
            </motion.div>
        </div>
    );
};
