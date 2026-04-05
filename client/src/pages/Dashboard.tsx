import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    AlertCircle, 
    Search, 
    ShieldCheck, 
    Activity,
    TrendingUp,
    Zap,
    Trophy,
    ArrowRight,
    Sparkles,
    Globe
} from 'lucide-react';

export default function UserDashboard() {
    const credibilityScore = 86;
    
    // Circular Progress Calculation
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (credibilityScore / 100) * circumference;

    const stats = [
        { label: 'Claims Analyzed', value: '4,129', icon: Search, color: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
        { label: 'Verified Claims %', value: '92.4%', icon: ShieldCheck, color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
        { label: 'Suspect Claims %', value: '4.2%', icon: AlertCircle, color: 'text-rose-400', glow: 'shadow-rose-500/20' },
        { label: 'Needs Review %', value: '3.4%', icon: Activity, color: 'text-amber-400', glow: 'shadow-amber-500/20' },
    ];

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 space-y-12 pb-32 relative z-10">
            {/* Top Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400"
                    >
                        <Zap size={12} className="animate-pulse" /> Detect. Verify. Trust.
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">
                            Verimind <span className="text-indigo-500 italic">Suite</span>.
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-sm">Ensuring AI Reliability • Production Mode</p>
                    </div>
                </div>

                <div className="flex gap-6">
                    <div className="flex flex-col items-end px-10 py-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-3xl shadow-2xl">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2">Neural XP Balance</span>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-white tracking-tighter">84,250</span>
                            <Trophy size={20} className="text-indigo-400" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* LARGE CIRCULAR GAUGE SECTION */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-5 aspect-square rounded-[4rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-12 flex flex-col items-center justify-center relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative">
                        {/* SVG Gauge */}
                        <svg className="w-64 h-64 transform -rotate-90">
                            <circle
                                cx="128"
                                cy="128"
                                r={radius}
                                fill="transparent"
                                stroke="rgba(255,255,255,0.03)"
                                strokeWidth="16"
                            />
                            <motion.circle
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                cx="128"
                                cy="128"
                                r={radius}
                                fill="transparent"
                                stroke="url(#active-gradient)"
                                strokeWidth="16"
                                strokeDasharray={circumference}
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="active-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#6366F1" />
                                    <stop offset="100%" stopColor="#2DD4BF" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Center Score */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-7xl font-black text-white tracking-tighter leading-none mb-1">{credibilityScore}</span>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Credibility Index</span>
                                <span className="text-[9px] font-bold text-emerald-400 mt-1 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full w-fit mx-auto">High Reliability</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 w-full grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col items-center group/card hover:bg-white/5 transition-all">
                            <span className="text-2xl font-black text-white">4.2s</span>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Avg Latency</span>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col items-center group/card hover:bg-white/5 transition-all">
                            <span className="text-2xl font-black text-white">99.8%</span>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">API Uptime</span>
                        </div>
                    </div>
                </motion.div>

                {/* STAT CARDS COLUMN */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-indigo-500/20 transition-all group relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity bg-indigo-500/20`} />
                            
                            <div className="flex items-center justify-between mb-8">
                                <div className={`p-5 rounded-2xl bg-white/5 ${stat.color} border border-current opacity-60 shadow-2xl`}>
                                    <stat.icon size={28} />
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Metric: Active</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none">{stat.value}</h3>
                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">{stat.label}</p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Growth +2.4%</span>
                                </div>
                                <TrendingUp size={14} className="text-indigo-500/50" />
                            </div>
                        </motion.div>
                    ))}

                    <Link 
                        to="/visualizer"
                        className="sm:col-span-2 p-10 rounded-[3rem] bg-gradient-to-r from-indigo-600 to-purple-600 shadow-2xl shadow-indigo-600/20 flex items-center justify-between relative overflow-hidden group cursor-pointer"
                    >
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
                         <div className="relative z-10 flex flex-col">
                             <h4 className="text-2xl font-black text-white tracking-tight">Initiate Neural Logic Flow</h4>
                             <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.3em]">Visualizing premium agent-based automation systems</p>
                         </div>
                         <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                             <ArrowRight className="text-white" />
                         </div>
                    </Link>
                </div>

            </div>

            {/* SPARK HERO BOARD */}
            <Link 
                to="/spark"
                className="block p-12 md:p-20 rounded-[5rem] bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 relative overflow-hidden group shadow-2xl"
            >
                <div className="absolute inset-0 bg-purple-600/10 blur-[150px] animate-pulse" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/10 to-transparent" />
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                     <div className="space-y-10">
                          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 text-[10px] font-black uppercase tracking-[0.4em] text-purple-400">
                               <Sparkles size={12} /> Flagship: Neural Spark Engine
                          </div>
                          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                               Synthesis beyond <br/>
                               <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 italic">Ordinary Research.</span>
                          </h2>
                          <p className="text-slate-500 text-lg md:text-xl font-bold leading-relaxed italic max-w-xl">
                               The first AI engine that doesn't just search—it executes research, builds dynamic spark-pages, and cross-references entire corpora in real-time.
                          </p>
                          <div className="flex items-center gap-6">
                               <div className="px-10 py-5 rounded-[2rem] bg-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-purple-600/40 group-hover:scale-105 transition-all">Launch Spark Protocol</div>
                               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">v4.0 Core Active</span>
                          </div>
                     </div>
                     <div className="hidden lg:flex flex-col gap-6">
                          <div className="p-8 rounded-[3rem] bg-white/5 border border-white/5 transform -rotate-2 group-hover:rotate-0 transition-transform">
                               <div className="flex items-center gap-4 mb-4">
                                    <Globe className="text-purple-400" size={20} />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Scan Active</span>
                               </div>
                               <div className="space-y-2">
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                         <div className="h-full w-4/5 bg-purple-500" />
                                    </div>
                                    <div className="h-2 w-2/3 bg-white/5 rounded-full overflow-hidden">
                                         <div className="h-full w-1/2 bg-indigo-500" />
                                    </div>
                               </div>
                          </div>
                     </div>
                </div>
            </Link>

            {/* LOWER TOOLING DASHBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <ToolCard title="Neural Forge" desc="High-precision text & code generation with 99% human-readability score." icon={Zap} path="/forge" color="from-emerald-500/20" />
                <ToolCard title="Truth Auditor" desc="Cross-referencing claims against 450M verifiable neural records." icon={Search} path="/audit" color="from-indigo-500/20" />
                <ToolCard title="Neural Workspace" desc="Integrated collaboration environment for deep-ai research nodes." icon={ShieldCheck} path="/workspace" color="from-purple-500/20" />
            </div>
        </div>
    );
}

function ToolCard({ title, desc, icon: Icon, path, color }: { title: string, desc: string, icon: any, path: string, color: string }) {
    return (
        <Link to={path} className="p-10 rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group relative overflow-hidden flex flex-col h-full">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} to-transparent blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-500">
                <Icon size={28} className="text-white group-hover:text-white" />
            </div>
            <h5 className="text-xl font-black tracking-tight text-white mb-2">{title}</h5>
            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8 flex-grow">{desc}</p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:translate-x-2 transition-transform">
                Launch Protocol <ArrowRight size={14} />
            </div>
        </Link>
    );
}
