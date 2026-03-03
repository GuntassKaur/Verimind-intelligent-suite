import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RiskMeterProps {
    score: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const RiskMeter = ({ score, riskLevel }: RiskMeterProps) => {
    // Score is 0-100 (100 = Perfect, 0 = Terrible)
    // Risk Level: LOW, MEDIUM, HIGH

    // Invert score for visual if needed, but let's assume High Score = Good Accuracy
    // So Risk Meter: 
    // If Score is 90 -> Risk is Low. Meter should be mostly Green.

    const data = {
        labels: ['Accuracy', 'Risk'],
        datasets: [
            {
                data: [score, 100 - score],
                backgroundColor: [
                    score > 80 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444', // Green, Orange, Red
                    'rgba(255, 255, 255, 0.05)',
                ],
                borderWidth: 0,
                circumference: 270,
                rotation: -135,
                cutout: '85%',
                borderRadius: 20,
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
            duration: 2000
        }
    };

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0">
                <Doughnut data={data} options={options} />
            </div>

            <div className="text-center z-10 relative mt-[-10px]">
                <div className="text-sm text-gray-400 tracking-wider font-medium mb-1">TRUST SCORE</div>
                <div className="text-5xl font-bold text-white tracking-tighter shadow-glow">
                    {score}%
                </div>
                <div className={`text-sm font-bold mt-2 px-3 py-1 rounded-full border ${riskLevel === 'LOW' ? 'text-green-400 border-green-500/30' :
                    riskLevel === 'MEDIUM' ? 'text-yellow-400 border-yellow-500/30' :
                        'text-red-400 border-red-500/30'
                    }`}>
                    {riskLevel} RISK
                </div>
            </div>
        </div>
    );
};
