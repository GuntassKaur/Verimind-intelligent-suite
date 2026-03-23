import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    ShieldCheck,
    Zap,
    Clock,
    Bell,
    Settings,
    LogOut,
    Search,
    Brain,
    Info,
    CheckCircle2
} from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../contexts/ThemeContext';
import { TrustScoreGauge } from '../components/RiskMeter';

export default function DashboardLayout() {
    const { theme } = useTheme();
    const [userData, setUserData] = useState<{name?: string} | null>(null);
    const location = useLocation();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUserData(JSON.parse(stored));
    }, []);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/audit', label: 'Analyze', icon: ShieldCheck },
        { path: '/generator', label: 'Generate', icon: Zap },
        { path: '/history', label: 'History', icon: Clock },
    ];

    const isDark = theme === 'dark';

    return (
        <div className={`flex h-screen transition-colors duration-500 overflow-hidden ${isDark ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
            {/* 1. CLEAN LEFT SIDEBAR */}
            <aside className={`flex flex-col w-[260px] relative z-30 border-r transition-colors duration-500 ${isDark ? 'bg-[#1E293B]/30 border-white/5' : 'bg-white border-slate-200'}`}>
                <div className="p-8 mb-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                         <Logo variant="icon" className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>VeriMind</span>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    {navItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative
                                    ${active 
                                        ? (isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600')
                                        : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100')
                                    }`}
                            >
                                <item.icon size={20} className={active ? '' : 'opacity-70 group-hover:opacity-100'} />
                                <span className={`text-sm font-bold tracking-tight`}>
                                    {item.label}
                                </span>
                                {active && <motion.div layoutId="nav-glow" className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-full" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-2">
                    <Link to="/settings" className={`flex items-center gap-4 px-4 py-3 rounded-xl ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                        <Settings size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
                    </Link>
                    <button 
                        onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'}`}
                    >
                        <LogOut size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* 2. MAIN CONTENT AREA (THREE-PANEL) */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Minimal Header */}
                <header className={`h-16 px-8 flex items-center justify-between border-b ${isDark ? 'bg-[#0F172A]/80 border-white/5 backdrop-blur-md' : 'bg-white/80 border-slate-200'} sticky top-0 z-20`}>
                    <div className="flex items-center gap-4 text-slate-400">
                         <Search size={16} />
                         <span className="text-xs font-bold uppercase tracking-widest opacity-50">Global Search Neural manifests...</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                            <Bell size={18} />
                        </button>
                        <div className="h-6 w-[1px] bg-white/10" />
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right">
                                 <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{userData?.name || 'Guest User'}</p>
                                 <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Pro Analyst</p>
                            </div>
                            <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'} flex items-center justify-center font-black text-xs`}>
                                {userData?.name?.[0] || 'G'}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Main Feed */}
                    <main className="flex-1 overflow-y-auto custom-scrollbar p-0">
                        <Outlet />
                    </main>

                    {/* 3. RIGHT PANEL (SCORES & INTELLIGENCE) */}
                    <aside className={`hidden xl:flex flex-col w-[340px] border-l p-8 space-y-8 overflow-y-auto custom-scrollbar transition-colors ${isDark ? 'bg-[#0F172A] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                         <div className="flex items-center justify-between pb-4 border-b border-white/5">
                              <div className="flex items-center gap-2">
                                   <Brain size={16} className="text-indigo-500" />
                                   <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-slate-900'}`}>Synaptic Scores</h3>
                              </div>
                              <Info size={14} className="text-slate-500 cursor-help" />
                         </div>

                         {/* Trust Score Gauge */}
                         <div className={`p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5 shadow-2xl shadow-black/20' : 'bg-white border-slate-200 shadow-sm'} flex flex-col items-center`}>
                              <TrustScoreGauge 
                                score={84} // Mock score
                                isDark={isDark} 
                                metrics={{
                                    hallucination: 16,
                                    plagiarism: 10,
                                    bias: 12
                                }}
                              />
                              <p className="mt-8 text-[11px] font-medium text-slate-500 text-center uppercase tracking-widest leading-relaxed">Overall Trust Factor</p>
                         </div>

                         {/* Sub-Metrics Stack */}
                         <div className="space-y-4">
                              {[
                                { label: 'AI Authenticity', val: '92%', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                { label: 'Bias Quotient', val: 'Low', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                { label: 'Factual Density', val: 'High', icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                              ].map((m, i) => (
                                <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                                     <div className="flex items-center gap-3">
                                          <div className={`p-2 rounded-lg ${m.bg} ${m.color}`}>
                                               <m.icon size={14} />
                                          </div>
                                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{m.label}</span>
                                     </div>
                                     <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{m.val}</span>
                                </div>
                              ))}
                         </div>

                         {/* Suggestions */}
                         <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-indigo-600/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                              <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">AI Optimization Tips</h4>
                              <p className={`text-[11px] font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                "Consider adding more academic citations to improve the **Factual Density** score by ~12%."
                              </p>
                         </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
