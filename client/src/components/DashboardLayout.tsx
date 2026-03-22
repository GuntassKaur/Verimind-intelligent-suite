import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Wand2,
    ShieldCheck,
    Network,
    FileText,
    Bell,
    LogOut,
    Search,
    ChevronLeft,
    ChevronRight,
    Star,
    User,
    Zap
} from 'lucide-react';
import { Logo } from './Logo';

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [userData, setUserData] = useState<{name?: string} | null>(null);
    const location = useLocation();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (stored) setUserData(JSON.parse(stored));
    }, []);

    const navItems = [
        { path: '/', label: 'Neural Studio', icon: Wand2 },
        { path: '/audit', label: 'Truth Engine', icon: ShieldCheck },
        { path: '/visualize', label: 'Brain Map', icon: Network },
        { path: '/typing', label: 'Linguistic Lab', icon: FileText },
    ];

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* ═══════════════════════════════════════════════
               CANVA-INSPIRED SIDEBAR
               ═══════════════════════════════════════════════ */}
            <motion.aside
                animate={{ width: collapsed ? 100 : 280 }}
                className="workspace-sidebar relative flex flex-col z-30"
            >
                <div className="p-8 pb-10 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                             <Logo variant="icon" className="w-7 h-7 text-white" />
                        </div>
                        {!collapsed && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                                <span className="text-xl font-black text-slate-800 tracking-tight leading-none">VeriMind</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Prism Node v5.9</span>
                             </motion.div>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                                    ${active 
                                        ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                            >
                                <item.icon size={22} className={active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
                                {!collapsed && (
                                    <motion.span 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }}
                                        className="text-sm font-bold tracking-tight"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                                {active && !collapsed && <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 space-y-4">
                     {!collapsed && (
                         <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 flex flex-col items-center text-center">
                              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-3 text-indigo-600">
                                   <Zap size={20} />
                              </div>
                              <span className="text-xs font-black text-indigo-900 mb-1">PRO UPGRADE</span>
                              <p className="text-[10px] text-indigo-500/70 leading-relaxed font-bold">Access 100k Neural Nodes and Deep Analytics.</p>
                              <button className="mt-4 px-6 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Unlock Prism</button>
                         </div>
                     )}

                    <div className="border-t border-slate-100 pt-4">
                        <button 
                            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                            className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all group"
                        >
                            <LogOut size={22} />
                            {!collapsed && <span className="text-sm font-bold">Archive Session</span>}
                        </button>
                    </div>
                </div>

                <button 
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-lg text-slate-400 hover:text-indigo-600 transition-all z-40"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </motion.aside>

            {/* ═══════════════════════════════════════════════
               GAMMA-STYLE MAIN AREA
               ═══════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Modern Floating Header */}
                <header className="h-24 px-10 border-b border-slate-100 bg-white/70 backdrop-blur-3xl flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-6 w-1/3">
                         <div className="relative group w-full max-w-[400px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                type="text"
                                placeholder="Search manifests, files or neural nodes..."
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl pl-12 pr-6 py-3 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-400/50 transition-all placeholder:text-slate-300"
                            />
                         </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <div className="flex gap-4">
                            <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all relative">
                                <Bell size={20} />
                                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
                            </button>
                            <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                                <Star size={20} />
                            </button>
                        </div>
                        
                        <div className="h-10 w-[1px] bg-slate-100" />
                        
                        <div className="flex items-center gap-4 cursor-pointer group">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-black text-slate-800 leading-none">{userData?.name || 'Neural Entity'}</p>
                                <p className="text-[10px] font-bold text-indigo-500/60 uppercase tracking-widest mt-1">Prime Operator</p>
                            </div>
                            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center p-[2px] shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
                                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                                    <User size={20} className="text-indigo-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto workspace-main custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
