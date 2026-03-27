import { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, 
    Zap,
    Activity,
    Flame,
    MessageSquare,
    Target,
    Trophy
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

    useEffect(() => {
        const savedPins = localStorage.getItem('verimind_pinned_ids');
        if (savedPins) {
            // In a real app we'd fetch these by ID. 
            // Here we'll just mock it or assume they are stored in history.
            // For now, let's just show a premium 'Pinned' section placeholder that looks functional.
        }
    }, []);

    const statCards = [
        { label: 'Queries Asked', value: '1,280', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '+12% this week' },
        { label: 'AI Usage', value: '94.2%', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: 'Optimized' },
        { label: 'Performance', value: '78 ms', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '-5ms improvement' },
        { label: 'Success Rate', value: '99.9%', icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: 'High Reliability' },
    ];

    const chartData = useMemo(() => ({
        labels: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6', 'Phase 7'],
        datasets: [
            {
                label: 'Neural Activity',
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
                backgroundColor: isDark ? '#0A0514' : '#FFFFFF',
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
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 space-y-12 pb-32 transition-colors duration-500 relative z-10">
            {/* Command Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}
                    >
                        <Trophy size={11} /> Verimind Analytics v1.0
                    </motion.div>
                    <h1 className={`text-5xl md:text-7xl font-black tracking-tighter leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Analytics <span className="text-gradient">Dashboard</span>.
                    </h1>
                    <p className="text-slate-500 font-medium italic text-lg">"Real-time insights into your AI interactions and performance."</p>
                </div>
                
                <div className="flex gap-4">
                    <div className={`flex flex-col items-end px-8 py-4 rounded-[2rem] border ${isDark ? 'bg-white/[0.03] border-white/5 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Neural Authority</span>
                        <div className="flex items-center gap-3">
                            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>14,250</span>
                            <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">XP</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Neural Matrix Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-10 rounded-[3rem] border group transition-all duration-500 ${
                            isDark 
                            ? 'bg-white/[0.02] border-white/5 hover:border-indigo-500/30 shadow-2xl hover:bg-white/[0.04]' 
                            : 'bg-white border-slate-200 hover:border-indigo-200 shadow-clean hover:shadow-hover'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div className={`p-5 rounded-[1.5rem] ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-500 border border-current opacity-70`}>
                                <stat.icon size={32} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">Synced</span>
                            </div>
                        </div>
                        <h3 className={`text-5xl font-black mb-1 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
                        <p className={`text-[11px] font-black uppercase tracking-[0.4em] mb-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{stat.label}</p>
                        <div className="flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/5 w-fit px-3 py-1.5 rounded-lg">
                            <TrendingUp size={14} />
                            {stat.trend}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tactical Intelligence Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Synaptic Activity Visualizer */}
                <div className={`lg:col-span-2 p-12 rounded-[3.5rem] border ${isDark ? 'bg-white/[0.02] border-white/5 backdrop-blur-3xl' : 'bg-white border-slate-200 shadow-clean'}`}>
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <h3 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Usage Analytics</h3>
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Historical AI Performance & API Usage</p>
                        </div>
                        <div className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Protocol: Active</span>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Cognitive Augmentation Sidebar */}
                <div className="space-y-10">
                    {/* Focus Streak Card */}
                    <div className={`p-12 rounded-[3.5rem] border relative overflow-hidden group ${
                        isDark 
                        ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20' 
                        : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'
                    }`}>
                         <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000" />
                         <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-amber-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                                <Flame size={40} className="text-amber-500 animate-pulse" />
                            </div>
                            <h4 className={`text-5xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>12 Days</h4>
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-12">Cognitive Streak</p>
                            <button className="w-full py-6 premium-btn-primary shadow-2xl text-[11px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all">
                                Amplify Growth
                            </button>
                         </div>
                    </div>

                    {/* Achievement Tracking */}
                    <div className={`p-10 rounded-[3.5rem] border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-clean'}`}>
                        <h4 className={`text-[11px] font-black uppercase tracking-[0.5em] mb-10 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Synaptic Achievements</h4>
                        <div className="space-y-8">
                            {[
                                { title: 'The Neural Auditor', level: 'Mastery Level 5', progress: 85 },
                                { title: 'Velocity Architect', level: 'Mastery Level 3', progress: 42 },
                            ].map((badge, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{badge.title}</span>
                                        <span className="text-[10px] font-black text-indigo-400">{badge.level}</span>
                                    </div>
                                    <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${badge.progress}%` }}
                                            viewport={{ once: true }}
                                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Neural Log Archive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className={`p-12 rounded-[4rem] border ${isDark ? 'bg-white/[0.02] border-white/5 backdrop-blur-xl' : 'bg-white border-slate-200 shadow-clean'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                         <div>
                            <h3 className={`text-3xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Cognitive Archive</h3>
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Forensic history retrieval system</p>
                         </div>
                    </div>
                    <div className="space-y-6">
                        {[
                            { title: 'Global Finance Audit', type: 'Neural Audit', time: '2h ago', score: '98%' },
                            { title: 'SaaS Pitch Manuscript', type: 'Forge S3', time: '5h ago', score: 'ELITE' },
                        ].map((op, i) => (
                            <div key={i} className={`p-8 rounded-[2.5rem] border flex items-center gap-6 group cursor-pointer transition-all duration-500 ${
                                isDark ? 'bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-indigo-500/20' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-soft hover:border-indigo-200'
                            }`}>
                                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs tracking-tighter ${isDark ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-indigo-500 text-white'}`}>
                                    {op.score}
                                 </div>
                                 <div>
                                     <h4 className={`text-sm font-black mb-1 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{op.title}</h4>
                                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">{op.type} · <span className="text-indigo-500/60">{op.time}</span></p>
                                 </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`p-12 rounded-[4rem] border ${isDark ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100'}`}>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                            <TrendingUp size={20} />
                        </div>
                        <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Pinned Insights</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 border-dashed flex flex-col items-center justify-center text-center opacity-40 py-16">
                            <MessageSquare className="mb-4 text-slate-500" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">No priority insights pinned</p>
                            <p className="text-[9px] font-bold text-slate-700 mt-2 uppercase">Your pinned neural links will appear here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
