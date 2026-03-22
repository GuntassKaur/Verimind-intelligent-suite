import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    Zap,
    Moon,
    Sun,
    LayoutDashboard,
    RefreshCcw
} from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../contexts/ThemeContext';

export default function DashboardLayout() {
    const { theme, toggleTheme } = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const [userData, setUserData] = useState<{name?: string} | null>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUserData(JSON.parse(stored));
    }, []);

    const navItems = [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/workspace', label: 'AI Workspace', icon: Wand2 },
        { path: '/audit', label: 'Truth Audit', icon: ShieldCheck },
        { path: '/rewrite', label: 'Smart Rewrite', icon: RefreshCcw },
        { path: '/visualize', label: 'Visualizer', icon: Network },
        { path: '/typing', label: 'Typing Lab', icon: FileText },
    ];

    return (
        <div className={`flex h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#05070a]' : 'bg-[#FDFBF7]'}`}>
            {/* Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 100 : 280 }}
                className={`hidden md:flex flex-col relative z-30 shadow-sm border-r transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0C0F17] border-slate-800/50' : 'bg-white border-slate-200'}`}
            >
                <div className="p-8 pb-10 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                             <Logo variant="icon" className="w-7 h-7 text-white" />
                        </div>
                        {!collapsed && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                                <span className={`text-xl font-extrabold tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>VeriMind</span>
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
                                        ? (theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30' : 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200')
                                        : (theme === 'dark' ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')
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
                         <div className={`p-6 rounded-[2rem] border flex flex-col items-center text-center transition-all ${theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/5 shadow-2xl' : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200'}`}>
                              <div className={`w-12 h-12 shadow-xl rounded-2xl flex items-center justify-center mb-4 text-amber-500 ${theme === 'dark' ? 'bg-slate-900 border border-white/5' : 'bg-white'}`}>
                                   <Zap size={24} className="fill-amber-500/20" />
                              </div>
                              <span className={`text-[11px] font-black mb-1.5 tracking-tight uppercase ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-900'}`}>Intelligence Pro</span>
                              <p className={`text-[10px] leading-relaxed font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-indigo-700'}`}>
                                Unlock **Neural Network** expansion, the **Writing DNA** biometric engine, and unlimited fact-check cycles in easy, human language.
                              </p>
                              <button 
                                onClick={() => alert('Premium features are currently free during the early-access beta! Enjoy unlimited usage.')}
                                className="mt-5 w-full py-4 bg-indigo-600 text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 hover:-translate-y-1 active:scale-95"
                              >
                                  Deploy Pro Engine
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
            <div className="flex-1 flex flex-col overflow-hidden relative pb-20 md:pb-0">
                {/* Modern Floating Header */}
                <header className={`h-20 md:h-24 px-4 md:px-10 border-b flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl transition-colors duration-500 ${theme === 'dark' ? 'bg-[#05070A]/80 border-slate-800/50' : 'bg-white/80 border-slate-200'}`}>
                    <div className="flex items-center gap-6 w-1/2 md:w-1/3">
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
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 md:text-slate-400 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} size={16} />
                            <input 
                                type="text"
                                name="search"
                                placeholder="Search apps..."
                                className={`w-full border rounded-xl pl-10 md:pl-12 pr-4 md:pr-6 py-2.5 md:py-3.5 text-xs font-bold outline-none transition-all md:placeholder:text-slate-400 placeholder:text-transparent ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800 text-white focus:bg-slate-900 focus:border-indigo-500' : 'bg-slate-100 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-400'}`}
                            />
                         </form>
                    </div>
                    
                    <div className="flex items-center gap-4 md:gap-8">
                         <div className="flex gap-2 md:gap-4 relative">
                            <button 
                                onClick={toggleTheme}
                                className={`p-2 md:p-3 rounded-xl transition-all ${theme === 'dark' ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-400/10' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
                            >
                                {theme === 'dark' ? <Sun size={18} className="md:w-5 md:h-5" /> : <Moon size={18} className="md:w-5 md:h-5" />}
                            </button>
                            
                            <div className="relative">
                                <button 
                                    onClick={() => { setShowNotifications(!showNotifications); setShowFavorites(false); }}
                                    className={`p-2 md:p-3 rounded-xl transition-all relative ${theme === 'dark' ? 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                >
                                    <Bell size={18} className="md:w-5 md:h-5" />
                                    <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-2 h-2 md:w-2.5 md:h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                                </button>
                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className={`absolute right-0 mt-4 w-72 md:w-80 rounded-3xl border shadow-2xl p-6 ${theme === 'dark' ? 'bg-[#0C0F17] border-white/5' : 'bg-white border-slate-100'}`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Neural Logs</h4>
                                                <span className="text-[10px] font-bold text-indigo-500">1 NEW</span>
                                            </div>
                                            <div className="space-y-4">
                                                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                                                    <p className={`text-[11px] font-bold leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>"Welcome to VeriMind Beta! You have successfully signed in. New intelligence models will be dropping soon."</p>
                                                    <span className="text-[9px] text-slate-500 mt-2 block">2m ago</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="relative">
                                <button 
                                    onClick={() => { setShowFavorites(!showFavorites); setShowNotifications(false); }}
                                    className={`p-2 md:p-3 rounded-xl transition-all hidden sm:block ${theme === 'dark' ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-400/10' : 'text-slate-500 hover:text-amber-500 hover:bg-amber-50'}`}
                                >
                                    <Star size={18} className="md:w-5 md:h-5" />
                                </button>
                                <AnimatePresence>
                                    {showFavorites && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className={`absolute right-0 mt-4 w-72 md:w-80 rounded-3xl border shadow-2xl p-8 text-center ${theme === 'dark' ? 'bg-[#0C0F17] border-white/5' : 'bg-white border-slate-100'}`}
                                        >
                                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <Star size={24} className="text-amber-500 fill-amber-500/20" />
                                            </div>
                                            <h4 className={`text-xs font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Favorites Hub</h4>
                                            <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">"Star your favorite generations to save them forever. Coming soon to Pro users."</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        
                        <div className="h-8 md:h-10 w-[1px] bg-slate-200" />
                        
                        <div className="flex items-center gap-4 cursor-pointer group">
                            <div className="text-right hidden md:block">
                                <p className={`text-sm font-extrabold leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{userData?.name || 'Guest User'}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Member</p>
                            </div>
                            <div className={`w-10 h-10 md:w-12 md:h-12 border rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-0.5 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                <div className={`w-full h-full rounded-[10px] flex items-center justify-center overflow-hidden ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                                    <User size={18} className="text-indigo-600 md:w-5 md:h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar p-0">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-50 px-4 py-2 pb-safe flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                {navItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all ${active ? 'text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-indigo-50 mb-1' : ''}`}>
                                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
                            </div>
                            {active && <span className="text-[9px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>}
                        </Link>
                    );
                })}
                <button 
                    onClick={async () => { 
                        try {
                            await fetch('/api/auth/logout', { method: 'POST' });
                        } catch (e) { console.error('Logout error', e); }
                        localStorage.clear(); 
                        window.location.href = '/login'; 
                    }}
                    className="flex flex-col items-center justify-center w-16 h-14 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                >
                    <div className="p-1.5 rounded-xl">
                        <LogOut size={20} />
                    </div>
                </button>
            </div>
        </div>
    );
}
