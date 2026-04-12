import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Sparkles,
    ShieldCheck,
    Keyboard,
    ArrowRight,
    Zap,
    BookOpen,
    Layout,
    Brain
} from 'lucide-react';

export default function UserDashboard() {
    return (
        <div className="max-w-7xl mx-auto py-12 px-6 space-y-16 pb-32">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-12">
                <div className="space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Neural Systems Online
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                        Welcome back, <br /><span className="text-gradient">Explorer</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xl text-lg">
                        Select a neural module to begin your workspace session. Your data is encrypted and secure.
                    </p>
                </div>
                
                <div className="flex gap-12">
                    <div className="text-right">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Session Tokens</span>
                        <span className="text-3xl font-black text-white">4.2k</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Audit Score</span>
                        <span className="text-3xl font-black text-purple-400">98%</span>
                    </div>
                </div>
            </header>

            {/* Feature Modules */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em]">Active Neural Modules</h2>
                    <span className="h-px bg-white/5 flex-1 mx-8" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <DashboardCard 
                        title="Smart Writing" 
                        desc="Improve text, fix grammar, and summarize instantly with Forge." 
                        icon={Sparkles} 
                        path="/write" 
                        color="from-purple-500" 
                    />
                    <DashboardCard 
                        title="AI Humanizer" 
                        desc="Bypass AI detection by synthesizing robotic text into prose." 
                        icon={Brain} 
                        path="/humanize" 
                        color="from-indigo-500" 
                    />
                    <DashboardCard 
                        title="Truth Audit" 
                        desc="Combine fact-checking and plagiarism detection in one scan." 
                        icon={ShieldCheck} 
                        path="/check" 
                        color="from-emerald-500" 
                    />
                    <DashboardCard 
                        title="Typing Lab" 
                        desc="Master your output speed with real-time biometric feedback." 
                        icon={Keyboard} 
                        path="/typing" 
                        color="from-blue-500" 
                    />
                </div>
            </section>

            {/* Layout Split: Analytics & Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 h-full">
                {/* Insights Column */}
                <div className="lg:col-span-2 space-y-8">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em]">Workplace Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InsightCard 
                            title="Pro Tip: Tone Synthesis" 
                            desc="Use the 'Professional' tone in Humanizer for peer-reviewed style outputs."
                            icon={Zap}
                            color="text-amber-400"
                        />
                         <InsightCard 
                            title="Clarity Benchmarking" 
                            desc="Target a score of 85+ for maximum readability in academic submissions."
                            icon={Layout}
                            color="text-blue-400"
                        />
                    </div>

                    {/* Placeholder for Graph or Activity */}
                    <div className="glass-card p-10 bg-white/[0.01] border-white/5 relative overflow-hidden h-64 flex flex-col justify-end">
                         <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent" />
                         <div className="relative z-10 flex items-center justify-between">
                             <div className="space-y-1">
                                 <h4 className="text-xl font-bold">Productivity Curve</h4>
                                 <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Neural tokens processed over time</p>
                             </div>
                             <div className="flex gap-2">
                                 {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                     <div key={i} className="w-2 bg-purple-500/20 rounded-t-sm" style={{ height: `${h}px` }} />
                                 ))}
                             </div>
                         </div>
                    </div>
                </div>

                {/* Sidebar Column: Recent Activity */}
                <div className="space-y-8">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em]">System Logs</h3>
                    <div className="glass-card p-8 space-y-8 bg-black/20">
                         {[
                             { title: "Humanization Sync", time: "2 min ago", type: "success" },
                             { title: "Audit: Philosophy Essay", time: "1 hour ago", type: "info" },
                             { title: "Typing Lab Session", time: "3 hours ago", type: "success" },
                             { title: "New Document Drafted", time: "5 hours ago", type: "alert" }
                         ].map((log, i) => (
                             <div key={i} className="flex items-center gap-4 group">
                                 <div className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-emerald-500/40' : log.type === 'info' ? 'bg-blue-500/40' : 'bg-purple-500/40'}`} />
                                 <div className="flex-1">
                                     <div className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{log.title}</div>
                                     <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-0.5">{log.time}</div>
                                 </div>
                             </div>
                         ))}
                         <button className="w-full py-4 mt-4 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                             View Full Audit Log
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardCard({ title, desc, icon: Icon, path, color }: { title: string, desc: string, icon: any, path: string, color: string }) {
    return (
        <Link to={path} className="glass-card p-10 group relative overflow-hidden flex flex-col h-full hover:scale-[1.02] border border-white/5 hover:border-purple-500/30 transition-all duration-500">
            <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${color} to-transparent blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity`} />
            
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-purple-600 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(147,51,234,0.3)]">
                <Icon size={32} className="text-white transition-transform group-hover:scale-110" />
            </div>
            
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-purple-400 transition-colors">{title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium mb-12 flex-grow text-sm group-hover:text-slate-400 transition-colors">{desc}</p>
            
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 transform transition-transform group-hover:translate-x-2">
                Sync Module <ArrowRight size={14} />
            </div>
        </Link>
    );
}

function InsightCard({ title, desc, icon: Icon, color }: { title: string, desc: string, icon: any, color: string }) {
    return (
        <div className="glass-card p-8 flex items-start gap-6 bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-white/5">
            <div className={`p-4 rounded-2xl bg-white/5 ${color} border border-white/5`}>
                <Icon size={24} />
            </div>
            <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">{title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

