import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TrustScoreGaugeProps {
    score: number;
    metrics?: {
        hallucination: number;
        plagiarism: number;
        bias: number;
    };
    isDark?: boolean;
}

export const TrustScoreGauge = ({ score, metrics, isDark = true }: TrustScoreGaugeProps) => {
    // Range Logic: Red (0-40), Yellow (40-70), Green (70-100)
    const getColor = (val: number) => {
        if (val >= 70) return '#10b981'; // emerald-500
        if (val >= 40) return '#f59e0b'; // amber-500
        return '#ef4444'; // rose-500
    };

    const riskLabel = score >= 70 ? 'NOMINAL' : score >= 40 ? 'CAUTION' : 'CRITICAL';
    const mainColor = getColor(score);

    const data = {
        datasets: [
            {
                data: [score, 100 - score],
                backgroundColor: [
                    mainColor,
                    isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0,0,0,0.05)',
                ],
                borderWidth: 0,
                circumference: 240,
                rotation: -120,
                cutout: '88%',
                borderRadius: 30,
            },
        ],
    };

    const options = {
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        },
        animation: {
            animateScale: true,
            animateRotate: true,
            duration: 2500
        },
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-72 h-72 flex items-center justify-center">
                {/* Glow Effect */}
                <div 
                    className="absolute w-48 h-48 rounded-full blur-[80px] opacity-20 transition-all duration-1000"
                    style={{ backgroundColor: mainColor }}
                />
                
                <div className="absolute inset-0">
                    <Doughnut data={data} options={options} />
                </div>

                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center z-10 relative"
                >
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-2">Neural Trust</span>
                    <div 
                        className="text-6xl font-black tracking-tighter transition-all duration-500"
                        style={{ color: isDark ? 'white' : '#0f172a' }}
                    >
                        {score}<span className="text-3xl opacity-30">%</span>
                    </div>
                    <div 
                        className="mt-4 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-500"
                        style={{ color: mainColor, borderColor: `${mainColor}33`, backgroundColor: `${mainColor}11` }}
                    >
                        {riskLabel} PROTOCOL
                    </div>
                </motion.div>
            </div>

            {/* Sub-Metrics Visualization */}
            {metrics && (
                <div className="grid grid-cols-3 gap-6 mt-8 w-full max-w-md">
                    {[
                        { label: 'Fact Fidelity', val: 100 - metrics.hallucination, color: 'text-indigo-400' },
                        { label: 'Originality', val: 100 - metrics.plagiarism, color: 'text-emerald-400' },
                        { label: 'Neutrality', val: 100 - metrics.bias, color: 'text-amber-400' }
                    ].map((m, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="w-1.5 h-12 bg-white/5 rounded-full relative overflow-hidden">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${m.val}%` }}
                                    transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
                                    className={`absolute bottom-0 w-full transition-all ${m.color.replace('text-', 'bg-')}`}
                                />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{m.label}</span>
                            <span className={`text-[10px] font-bold ${m.color}`}>{m.val}%</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
