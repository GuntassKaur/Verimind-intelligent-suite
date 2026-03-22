import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, 
    Zap,
    Target,
    ArrowUpRight,
    Trophy,
    Flame,
    BarChart3
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
        { label: 'Intelligence Usage', value: '1,280', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '+12% this week' },
        { label: 'Avg Truth Score', value: '94.2%', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: 'Neural Precision' },
        { label: 'Typing Velocity', value: '78 WPM', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '+5 WPM today' },
        { label: 'Improvement Quotient', value: '+42%', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: 'vs last month' },
    ];

    const chartData = useMemo(() => ({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Intelligence Activity',
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
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                titleColor: isDark ? '#FFFFFF' : '#0F172A',
                bodyColor: isDark ? '#94A3B8' : '#475569',
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0',
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
                grid: { color: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' },
                ticks: { color: isDark ? '#475569' : '#94A3B8', font: { size: 10, weight: 600 } }
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 space-y-12 pb-32 transition-colors duration-500">
            {/* SaaS Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}
                    >
                        <Trophy size={10} /> Neural Level 12
                    </motion.div>
                    <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Core <span className="text-gradient">Intelligence</span>.
                    </h1>
                    <p className="text-slate-500 font-medium italic">"Welcome back, Agent. Your synaptic activity is peaking."</p>
                </div>
                
                <div className="flex gap-4">
                    <div className={`flex flex-col items-end px-6 py-3 rounded-[1.8rem] border ${isDark ? 'bg-[#1E293B] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Global Reputation</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>14,250</span>
                            <span className="text-[10px] font-bold text-indigo-400 uppercase">XP</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Premium Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-8 rounded-[2.5rem] border group transition-all duration-500 ${
                            isDark 
                            ? 'bg-[#1E293B] border-white/5 hover:border-indigo-500/30 shadow-2xl hover:shadow-indigo-500/5' 
                            : 'bg-white border-slate-200 hover:border-indigo-200 shadow-clean hover:shadow-hover'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                                <stat.icon size={28} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">Active</span>
                            </div>
                        </div>
                        <h3 className={`text-4xl font-black mb-1 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400">
                            <BarChart3 size={12} />
                            {stat.trend}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Visual Intelligence Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Visualization */}
                <div className={`lg:col-span-2 p-10 rounded-[3rem] border ${isDark ? 'bg-[#1E293B] border-white/5' : 'bg-white border-slate-200 shadow-clean'}`}>
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className={`text-xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Synaptic Activity</h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Neural Verification Cycle · Last 7 days</p>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                             <span className="text-[10px] font-black text-slate-500 uppercase">Filter: Weekly</span>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Gamification Sidebar */}
                <div className="space-y-8">
                    {/* Streaks Card */}
                    <div className={`p-10 rounded-[3rem] border relative overflow-hidden group ${
                        isDark 
                        ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20' 
                        : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'
                    }`}>
                         <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700" />
                         <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-amber-500/20">
                                <Flame size={32} className="text-amber-500 animate-pulse" />
                            </div>
                            <h4 className={`text-4xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>12 Days</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-10">Current Synaptic Streak</p>
                            <button className="w-full py-5 premium-btn-primary shadow-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                                Unleash Potential
                            </button>
                         </div>
                    </div>

                    {/* Achievements Summary */}
                    <div className={`p-10 rounded-[3rem] border ${isDark ? 'bg-[#1E293B] border-white/5' : 'bg-white border-slate-200 shadow-clean'}`}>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-8 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Recent Accolades</h4>
                        <div className="space-y-6">
                            {[
                                { title: 'The Neural Auditor', level: 'Lv.5', progress: 85 },
                                { title: 'Velocity Master', level: 'Lv.3', progress: 42 },
                            ].map((badge, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{badge.title}</span>
                                        <span className="text-[10px] font-black text-indigo-400">{badge.level}</span>
                                    </div>
                                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${badge.progress}%` }}
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Neural Log Preview */}
            <div className={`p-10 rounded-[3.5rem] border ${isDark ? 'bg-[#1E293B] border-white/5' : 'bg-white border-slate-200 shadow-clean'}`}>
                <div className="flex items-center justify-between mb-10">
                     <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Neural Operations History</h3>
                     <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 flex items-center gap-2 group">
                        Access Full Vault <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                     </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: 'Global Finance Audit', type: 'Truth Audit', time: '2h ago', score: '98%' },
                        { title: 'SaaS Pitch Manuscript', type: 'Rewrite', time: '5h ago', score: 'Elite' },
                        { title: 'Quantum Research Paper', type: 'Detection', time: 'Yesterday', score: '97%' },
                    ].map((op, i) => (
                        <div key={i} className={`p-6 rounded-3xl border flex items-center gap-5 group cursor-pointer transition-all duration-300 ${
                            isDark ? 'bg-white/5 border-white/5 hover:bg-white/[0.08]' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-soft'
                        }`}>
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs ${isDark ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-500 text-white'}`}>
                                {op.score}
                             </div>
                             <div>
                                 <h4 className={`text-sm font-black mb-1 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{op.title}</h4>
                                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{op.type} · {op.time}</p>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
