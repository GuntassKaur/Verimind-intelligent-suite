import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    Activity, 
    TrendingUp, 
    FileText, 
    Clock, 
    Award, 
    Zap,
    Target,
    ArrowUpRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function UserDashboard() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const statCards = [
        { label: 'Total Analyses', value: '128', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '+12% this week' },
        { label: 'AI Detection Avg', value: '94%', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: 'Highly accurate' },
        { label: 'Humanized Words', value: '14.2k', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '+2.4k today' },
        { label: 'Time Saved', value: '32h', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: 'vs manual editing' },
    ];

    const chartData = useMemo(() => ({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Analyses performed',
                data: [12, 19, 15, 25, 22, 10, 14],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    }), []);

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? '#0C0F17' : '#FFFFFF',
                titleColor: isDark ? '#FFFFFF' : '#0F172A',
                bodyColor: isDark ? '#94A3B8' : '#475569',
                borderColor: isDark ? '#1E293B' : '#E2E8F0',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 12,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: isDark ? '#475569' : '#94A3B8', font: { size: 10, weight: 600 } }
            },
            y: {
                grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
                ticks: { color: isDark ? '#475569' : '#94A3B8', font: { size: 10, weight: 600 } }
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-6 lg:px-10 space-y-10 pb-32 transition-colors duration-500">
            {/* Greeting */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className={`text-3xl md:text-4xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Welcome back, <span className="text-gradient">Agent</span>.
                    </h1>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Your content intelligence overview for this week.</p>
                </div>
                <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-6 py-3 rounded-2xl shadow-lg shadow-indigo-500/5">
                    <Zap className="text-indigo-400" size={18} />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Global XP</span>
                        <span className="text-sm font-black text-indigo-300 tracking-tighter">14,250 <span className="text-[10px] text-indigo-400/50">pts</span></span>
                    </div>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-6 rounded-3xl border shadow-sm group hover:shadow-xl transition-all duration-300 ${isDark ? 'bg-[#0C0F17] border-white/5 hover:border-indigo-500/30' : 'bg-white border-slate-100 hover:border-indigo-200'}`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">Active</span>
                        </div>
                        <h3 className={`text-4xl font-black mb-1 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
                        <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 italic">
                            <TrendingUp size={12} />
                            {stat.trend}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Chart */}
                <div className={`lg:col-span-2 p-8 rounded-[2.5rem] border shadow-soft ${isDark ? 'bg-[#0C0F17] border-white/5' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Intelligence Activity</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Verification frequency · Last 7 days</p>
                        </div>
                        <select className={`bg-transparent text-xs font-bold outline-none border rounded-xl px-4 py-2 ${isDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-slate-200'}`}>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Achievement / Streaks Sidebar */}
                <div className="space-y-8">
                    <div className={`p-8 rounded-[2.5rem] border shadow-soft relative overflow-hidden group ${isDark ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                            <h3 className={`text-lg font-black mb-6 uppercase tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-indigo-900'}`}>
                                <Award className="text-amber-500" size={20} /> Accomplishments
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { title: 'The Auditor', xp: 'Level 5', progress: 80 },
                                    { title: 'Fact Checker Pro', xp: 'Level 3', progress: 45 },
                                    { title: 'Humanizer Elite', xp: 'Level 12', progress: 95 },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                                            <span className={isDark ? 'text-slate-400' : 'text-indigo-900'}>{item.title}</span>
                                            <span className="text-indigo-400">{item.xp}</span>
                                        </div>
                                        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-indigo-900/10'}`}>
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.progress}%` }}
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={`p-8 rounded-[2.5rem] border shadow-soft flex flex-col items-center text-center ${isDark ? 'bg-[#0C0F17] border-white/5' : 'bg-white border-slate-100'}`}>
                        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4">
                            <span className="text-3xl font-black text-amber-500 leading-none">🔥</span>
                        </div>
                        <h4 className={`text-3xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>12 Days</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Current Learning Streak</p>
                        <button className="mt-8 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                            Keep it going
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent History Preview */}
            <div className={`p-8 rounded-[2.5rem] border shadow-soft ${isDark ? 'bg-[#0C0F17] border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between mb-8">
                     <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Operations</h3>
                     <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group transition-colors">
                        View Full History <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                     </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: 'Global Finance Audit', type: 'Truth Audit', time: '2 hours ago', score: '98%' },
                        { title: 'SaaS Pitch Deck', type: 'Rewrite', time: '5 hours ago', score: 'Elite' },
                        { title: 'Research Paper #4', type: 'Detection', time: 'Yesterday', score: '97% Human' },
                    ].map((history, i) => (
                        <div key={i} className={`p-6 rounded-2xl border flex items-center gap-4 group cursor-pointer transition-all ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/[0.08]' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-500 text-white'}`}>
                                {history.score}
                             </div>
                             <div>
                                 <h4 className={`text-sm font-black mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{history.title}</h4>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{history.type} · {history.time}</p>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
