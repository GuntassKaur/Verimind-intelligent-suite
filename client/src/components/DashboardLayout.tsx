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
        { path: '/', label: 'AI Workspace', icon: Wand2 },
        { path: '/audit', label: 'Fact Checker', icon: ShieldCheck },
        { path: '/visualize', label: 'Visualizer', icon: Network },
        { path: '/typing', label: 'Typing Lab', icon: FileText },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 100 : 280 }}
                className="bg-white border-r border-slate-200 relative flex flex-col z-30 shadow-sm"
            >
                <div className="p-8 pb-10 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                             <Logo variant="icon" className="w-7 h-7 text-white" />
                        </div>
                        {!collapsed && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                                <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">VeriMind</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Workspace</span>
                             </motion.div>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-3">
                    {navItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group
                                    ${active 
                                        ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon size={22} className={active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
                                {!collapsed && (
                                    <motion.span 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }}
                                        className={`text-sm tracking-tight ${active ? 'font-black' : 'font-bold'}`}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                                {active && !collapsed && <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 space-y-4">
                     {!collapsed && (
                         <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-6 rounded-2xl border border-indigo-200 flex flex-col items-center text-center">
                              <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center mb-3 text-amber-500">
                                   <Zap size={20} className="fill-amber-500/20" />
                              </div>
                              <span className="text-xs font-black text-indigo-900 mb-1 tracking-tight">PRO UPGRADE</span>
                              <p className="text-[11px] text-indigo-700 leading-relaxed font-semibold">Get unlimited words, advanced reports, and fast analysis.</p>
                              <button 
                                onClick={() => alert('Premium features are currently free during the early-access beta! Enjoy unlimited usage.')}
                                className="mt-4 px-6 py-2.5 bg-indigo-600 text-white text-[11px] font-black rounded-xl uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
                              >
                                  Upgrade for Free
                              </button>
                         </div>
                     )}

                    <div className="border-t border-slate-200 pt-4">
                        <button 
                            onClick={async () => { 
                                try {
                                    await fetch('/api/auth/logout', { method: 'POST' });
                                } catch (e) { console.error('Logout error', e); }
                                localStorage.clear(); 
                                window.location.href = '/login'; 
                            }}
                            className="w-full flex items-center gap-4 px-5 py-4 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group font-bold"
                        >
                            <LogOut size={22} className="group-hover:text-rose-500" />
                            {!collapsed && <span className="text-sm">Log Out</span>}
                        </button>
                    </div>
                </div>

                <button 
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all z-40"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </motion.aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Modern Floating Header */}
                <header className="h-24 px-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-6 w-1/3">
                         <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                const val = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value.toLowerCase();
                                if (val.includes('type') || val.includes('game')) window.location.href = '/typing';
                                else if (val.includes('visual') || val.includes('map')) window.location.href = '/visualize';
                                else if (val.includes('fact') || val.includes('check')) window.location.href = '/audit';
                                else if (val.includes('write') || val.includes('ai')) window.location.href = '/';
                                else alert('No matching tools found for: ' + val);
                            }}
                            className="relative group w-full max-w-[400px]"
                         >
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                name="search"
                                placeholder="Search apps (e.g., 'typing game', 'visualizer')..."
                                className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                            />
                         </form>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <div className="flex gap-4">
                            <button 
                                onClick={() => alert("Notifications:\nWelcome to VeriMind Beta! You have successfully signed in. New intelligence models will be dropping soon.")}
                                className="p-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative"
                            >
                                <Bell size={20} />
                                <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                            </button>
                            <button 
                                onClick={() => alert("Favorites is a Pro feature! Star your favorite generations to save them forever. Coming soon.")}
                                className="p-3 text-slate-500 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                            >
                                <Star size={20} />
                            </button>
                        </div>
                        
                        <div className="h-10 w-[1px] bg-slate-200" />
                        
                        <div className="flex items-center gap-4 cursor-pointer group">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-extrabold text-slate-900 leading-tight">{userData?.name || 'Guest User'}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Member</p>
                            </div>
                            <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-0.5">
                                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                                    <User size={20} className="text-indigo-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
