import React, { useState, memo, Suspense, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, LogOut,
    Fingerprint, Activity,
    Network, Cpu, Zap, ShieldCheck, CheckCircle2, Eye,
    LayoutTemplate, Keyboard, ChevronLeft, ChevronRight, Sparkles,
    Signal, Radio
} from 'lucide-react';
import { Logo } from './Logo';
import { AppAssistantPanel } from './AppAssistantPanel';
import api from '../services/api';

const SIDEBAR_NAV = [
    { label: 'Workspace',     path: '/',          icon: Cpu, color: 'text-indigo-400' },
    { label: 'Generator',     path: '/generator', icon: Zap, color: 'text-amber-400' },
    { label: 'Analyzer',      path: '/analyzer',  icon: CheckCircle2, color: 'text-blue-400' },
    { label: 'Plagiarism',    path: '/plagiarism', icon: ShieldCheck, color: 'text-rose-400' },
    { label: 'Humanizer',     path: '/humanizer', icon: Activity, color: 'text-purple-400' },
    { label: 'Visualizer',    path: '/visualizer', icon: Network, color: 'text-cyan-400' },
    { label: 'Flowchart',     path: '/flowchart',  icon: LayoutTemplate, color: 'text-emerald-400' },
    { label: 'Research',      path: '/research',  icon: Eye, color: 'text-indigo-300' },
    { label: 'Typing Lab',    path: '/typing',    icon: Keyboard, color: 'text-slate-400' },
    { label: 'History',       path: '/history',   icon: Fingerprint, protected: true, color: 'text-slate-500' },
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
                    className={`nav-item transition-all duration-500 rounded-2xl flex items-center gap-4 px-5 py-3.5 group mb-2
                        ${isActive ? 'active bg-white/5 border border-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] shadow-indigo-500/10' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'}
                        ${collapsed && !mobile ? 'justify-center px-0' : ''}`}
                >
                    <Icon size={18} className={`${isActive ? item.color : 'group-hover:' + item.color} transition-colors duration-500`} />
                    {(!collapsed || mobile) && (
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] relative overflow-hidden">
                            {item.label}
                            {isActive && <motion.div layoutId="activeNav" className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />}
                        </span>
                    )}
                </div>
            </Link>
        );
    });

    return (
        <div className="workspace-layout">
            {/* SIDEBAR */}
            <aside className={`hidden lg:flex flex-col z-30 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] border-r border-white/5 bg-[#05070A]/80 backdrop-blur-3xl shrink-0 ${collapsed ? 'w-24' : 'w-80'}`}>
                <div className={`p-10 flex items-center border-b border-white/5 mb-8 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                   {!collapsed && (
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                <Logo variant="icon" className="w-8 h-8 text-indigo-500" />
                            </div>
                            <h2 className="text-[11px] font-black text-white uppercase tracking-[0.6em] italic">VeriMind</h2>
                        </div>
                   )}
                   {collapsed && <Logo variant="icon" className="w-8 h-8 text-indigo-500" />}
                   <button onClick={() => setCollapsed(!collapsed)} className="p-3 hover:bg-white/5 rounded-2xl text-slate-600 transition-colors">
                     {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                   </button>
                </div>

                <nav className="flex-1 overflow-y-auto custom-scrollbar px-6 space-y-1">
                    {!collapsed && <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] px-5 mb-6">Neural Pathways</div>}
                    {SIDEBAR_NAV.map((item, i) => <NavItem key={i} item={item} />)}
                </nav>

                <div className="p-8 space-y-4">
                    {/* System Telemetry */}
                    {!collapsed && (
                        <div className="px-6 py-5 bg-white/[0.02] border border-white/5 rounded-3xl mb-4">
                             <div className="flex items-center justify-between mb-3">
                                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Latency</span>
                                  <Signal size={12} className="text-emerald-500 animate-pulse" />
                             </div>
                             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: '20%' }} animate={{ width: '85%' }} transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }} className="h-full bg-indigo-500" />
                             </div>
                        </div>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-5 px-6 py-5 rounded-2xl hover:bg-rose-500/10 text-rose-400/50 hover:text-rose-400 transition-all group border border-transparent hover:border-rose-500/10">
                        <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                        {!collapsed && <span className="text-[10px] font-black uppercase tracking-[0.3em]">Disconnect</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="workspace-main z-10 custom-scrollbar relative">
                <header className="sticky top-0 h-24 flex items-center justify-between px-10 bg-[#05070A]/60 backdrop-blur-2xl border-b border-white/5 z-50 transition-all">
                    <div className="flex items-center gap-10">
                         <button className="lg:hidden p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white border border-white/5 transition-all" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={20} />
                         </button>
                         <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <Radio size={14} className="text-emerald-500 animate-ping" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic selection:bg-indigo-500/20">
                                    {SIDEBAR_NAV.find(n => n.path === location.pathname)?.label || "Node Intelligence"}
                                </span>
                            </div>
                            <div className="hidden lg:block h-4 w-[1px] bg-white/10" />
                            <span className="hidden lg:block text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Sync v5.8.1</span>
                         </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden sm:flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-white/5 rounded-2xl group cursor-pointer hover:border-white/20 transition-all shadow-xl">
                            <Sparkles size={16} className="text-indigo-400 group-hover:scale-125 transition-transform" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] font-sans">Initialize Nexus</span>
                        </div>
                        {user && (
                            <div className="flex items-center gap-5 pl-8 border-l border-white/5">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] font-sans hidden md:block">{user}</span>
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-rose-500 p-[1px]">
                                     <div className="w-full h-full bg-[#05070A] rounded-2xl flex items-center justify-center text-[12px] font-black text-white uppercase">
                                         {user.charAt(0)}
                                     </div>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 relative">
                    <Suspense fallback={
                        <div className="flex-1 flex items-center justify-center h-[60vh]">
                            <div className="relative">
                                <div className="absolute inset-0 blur-3xl bg-indigo-500/20 animate-pulse rounded-full" />
                                <Logo variant="icon" className="w-20 h-20 text-indigo-500 animate-bounce relative" />
                            </div>
                        </div>
                    }>
                        <Outlet />
                    </Suspense>
                </main>

                {/* Footer Engagement Bar */}
                <footer className="h-14 border-t border-white/5 px-10 flex items-center justify-between opacity-30 hover:opacity-100 transition-opacity">
                     <div className="flex items-center gap-8">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Global Truth Matrix Active</span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Neural Nodes: 1,440/1,440</span>
                     </div>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] italic">VeriMind &copy; 2026</span>
                </footer>
            </div>

            {/* RIGHT PANEL - Hidden on smaller screens for irresponsiveness fix */}
            <div className="hidden xl:block">
                 <AppAssistantPanel wpm={wpm} />
            </div>

            {/* MOBILE NAVIGATION OVERLAY */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] lg:hidden">
                        <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsMobileMenuOpen(false)} />
                        <motion.aside initial={{ x: -400 }} animate={{ x: 0 }} exit={{ x: -400 }} transition={{ type: 'spring', damping: 25 }} className="relative w-80 h-full bg-[#05070A] border-r border-white/10 p-10 flex flex-col">
                             <div className="flex items-center justify-between mb-16">
                                <div className="flex items-center gap-4">
                                    <Logo variant="icon" className="w-10 h-10 text-indigo-500" />
                                    <h2 className="text-sm font-black text-white uppercase tracking-[0.4em] italic">VeriMind</h2>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/5 rounded-2xl border border-white/10 text-slate-400"><X size={20} /></button>
                             </div>
                             <nav className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                                {SIDEBAR_NAV.map((item, i) => <NavItem key={i} item={item} mobile />)}
                             </nav>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
