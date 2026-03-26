import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
    id: number;
    size: string;
    left: string;
    top: string;
    duration: number;
    delay: number;
    opacity: number;
    color: string;
    pathX: number[];
    pathY: number[];
}

const FloatingParticles = ({ count = 12 }: { count?: number }) => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: count }).map((_, i) => ({
            id: i,
            size: Math.random() * 150 + 50 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            duration: Math.random() * 40 + 40,
            delay: Math.random() * -60,
            opacity: Math.random() * 0.08 + 0.02,
            color: Math.random() > 0.5 ? '#6366f1' : Math.random() > 0.5 ? '#a855f7' : '#06b6d4',
            pathX: [0, (Math.random() - 0.5) * 400, 0],
            pathY: [0, (Math.random() - 0.5) * 400, 0]
        }));
        setParticles(newParticles);
    }, [count]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0 }}
                    animate={{ 
                        x: p.pathX,
                        y: p.pathY
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: p.delay
                    }}
                    className="absolute rounded-full blur-[80px]"
                    style={{
                        top: p.top,
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        opacity: p.opacity,
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingParticles;
