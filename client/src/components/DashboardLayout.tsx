import React, { useState, memo, Suspense, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, LogOut,
    Fingerprint, Activity,
    Network, Cpu, Zap, ShieldCheck, CheckCircle2, Eye,
    LayoutTemplate, Keyboard, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { Logo } from './Logo';
import { AppAssistantPanel } from './AppAssistantPanel';
import api from '../services/api';

const SIDEBAR_NAV = [
    { label: 'Workspace',     path: '/',          icon: Cpu },
    { label: 'Generator',     path: '/generator', icon: Zap },
    { label: 'Analyzer',      path: '/analyzer',  icon: CheckCircle2 },
    { label: 'Plagiarism',    path: '/plagiarism', icon: ShieldCheck },
    { label: 'Humanizer',     path: '/humanizer', icon: Activity },
    { label: 'Visualizer',    path: '/visualizer', icon: Network },
    { label: 'Flowchart',     path: '/flowchart',  icon: LayoutTemplate },
    { label: 'Research',      path: '/research',  icon: Eye },
    { label: 'Typing Lab',    path: '/typing',    icon: Keyboard },
    { label: 'History',       path: '/history',   icon: Fingerprint, protected: true },
];

export const DashboardLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [wpm, setWpm] = useState(0);
    const user = localStorage.getItem('user_name');

    useEffect(() => {
        const handleTypingUpdate = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setWpm(detail?.wpm || 0);
        };
        window.addEventListener('typing_update', handleTypingUpdate);
        return () => window.removeEventListener('typing_update', handleTypingUpdate);
    }, []);

    const handleLogout = async () => {
        try {
            await api.post('/api/auth/logout').catch(() => {});
            localStorage.removeItem('user_name');
            localStorage.removeItem('guest_actions');
            window.location.href = '/';
        } catch (e) {
            console.error('Logout failed:', e);
        }
    };

    const NavItem = memo(({ item, mobile = false }: { item: typeof SIDEBAR_NAV[0]; mobile?: boolean }) => {
        const isActive = location.pathname === item.path;
        const handleClick = (e: React.MouseEvent) => {
            if (item.protected && !user) { e.preventDefault(); window.location.href = '/login'; }
            setIsMobileMenuOpen(false);
        };
        const Icon = item.icon;

        return (
            <Link to={item.path} onClick={handleClick}>
                <div
                    title={collapsed && !mobile ? item.label : undefined}
                    className={`nav-item transition-all duration-300 rounded-xl flex items-center gap-4 px-4 py-3 group mb-1
                        ${isActive ? 'active bg-white/5 border-white/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'}
                        ${collapsed && !mobile ? 'justify-center px-0' : ''}`}
                >
                    <Icon size={18} className={`${isActive ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'group-hover:text-indigo-400'}`} />
                    {(!collapsed || mobile) && <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>}
                </div>
            </Link>
        );
    });

    return (
        <div className="workspace-layout">
            {/* AMBIENT BACKGROUND */}
            <div className="bg-animate fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[180px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* SIDEBAR */}
            <aside className={`hidden lg:flex flex-col z-30 transition-all duration-500 ease-in-out border-r border-white/5 bg-[#0D1117]/60 backdrop-blur-3xl shrink-0 ${collapsed ? 'w-20' : 'w-72'}`}>
                <div className={`p-8 flex items-center border-b border-white/5 mb-6 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                   {!collapsed && (
                        <div className="flex items-center gap-3">
                            <Logo variant="icon" className="w-8 h-8 text-indigo-500" />
                            <h2 className="text-xs font-black text-white uppercase tracking-[0.4em]">VeriMind</h2>
                        </div>
                   )}
                   {collapsed && <Logo variant="icon" className="w-8 h-8 text-indigo-500" />}
                   <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500">
                     {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                   </button>
                </div>

                <nav className="flex-1 overflow-y-auto custom-scrollbar px-5 space-y-1">
                    {!collapsed && <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 mb-4">Core Systems</div>}
                    {SIDEBAR_NAV.map((item, i) => <NavItem key={i} item={item} />)}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-rose-500/10 text-rose-400/60 hover:text-rose-400 transition-all group">
                        <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                        {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="workspace-main z-10 custom-scrollbar relative">
                <header className="sticky top-0 h-20 flex items-center justify-between px-10 bg-[#0B0F1A]/40 backdrop-blur-xl border-b border-white/5 z-50">
                    <div className="flex items-center gap-8">
                         <button className="lg:hidden p-2 text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} />
                         </button>
                         <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                {SIDEBAR_NAV.find(n => n.path === location.pathname)?.label || "Workspace Node"}
                            </span>
                         </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-3 px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full group cursor-pointer hover:bg-indigo-500/20 transition-all">
                            <Sparkles size={14} className="text-indigo-400 group-hover:rotate-12 transition-transform" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Initialize Node</span>
                        </div>
                        {user && (
                            <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[11px] font-black uppercase text-white shadow-xl">
                                    {user.charAt(0)}
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden md:block">{user}</span>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1">
                    <Suspense fallback={
                        <div className="flex-1 flex items-center justify-center h-[60vh]">
                            <Logo variant="icon" className="w-16 h-16 text-indigo-500 animate-pulse" />
                        </div>
                    }>
                        <Outlet />
                    </Suspense>
                </main>
            </div>

            {/* RIGHT PANEL */}
            <AppAssistantPanel wpm={wpm} />

            {/* MOBILE NAVIGATION OVERLAY */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] lg:hidden">
                        <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
                        <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="relative w-80 h-full bg-[#0D1117] border-r border-white/5 p-8 flex flex-col">
                             <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-3">
                                    <Logo variant="icon" className="w-8 h-8 text-indigo-500" />
                                    <h2 className="text-sm font-black text-white uppercase tracking-widest">VeriMind</h2>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-2xl border border-white/10 text-slate-400"><X size={20} /></button>
                             </div>
                             <nav className="space-y-4 flex-1">
                                {SIDEBAR_NAV.map((item, i) => <NavItem key={i} item={item} mobile />)}
                             </nav>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
