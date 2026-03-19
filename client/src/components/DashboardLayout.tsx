import { useState, memo, Suspense } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, LogOut,
    Fingerprint, Activity,
    Network, Cpu, Zap, ShieldCheck, CheckCircle2, Eye,
    LayoutTemplate, Keyboard, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Logo } from './Logo';
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
    const user = localStorage.getItem('user_name');

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
        const isActive =
            location.pathname === item.path ||
            (item.label === 'Flowchart' && location.pathname === '/flowchart') ||
            (item.label === 'Visualizer' && location.pathname === '/visualizer');

        const handleClick = (e: React.MouseEvent) => {
            if (item.protected && !user) { e.preventDefault(); window.location.href = '/login'; }
            setIsMobileMenuOpen(false);
        };
        const Icon = item.icon;

        return (
            <Link to={item.path} onClick={handleClick}>
                <div
                    title={collapsed && !mobile ? item.label : undefined}
                    className={`nav-item ${isActive ? 'active' : ''} ${collapsed && !mobile ? 'justify-center px-0' : ''}`}
                >
                    <Icon size={18} className={isActive ? 'text-indigo-400 shrink-0 shadow-neon' : 'text-slate-400 shrink-0 transition-colors'} />
                    {(!collapsed || mobile) && <span className="truncate tracking-wide">{item.label}</span>}
                </div>
            </Link>
        );
    });

    return (
        <div className="flex h-screen bg-[#0B0F1A] overflow-hidden font-sans relative">

            {/* ── ANIMATED FUTURISTIC BACKGROUND ── */}
            <div className="bg-animate fixed inset-0 pointer-events-none z-0">
                <div className="bg-blob bg-blob-1" />
                <div className="bg-blob bg-blob-2" />
                <div className="bg-blob bg-blob-3" />
                <div className="bg-blob bg-blob-4" />
            </div>

            {/* ══════════════════════════════════════
                LEFT SIDEBAR (Glass Dark Panel)
            ══════════════════════════════════════ */}
            <aside
                className={`hidden lg:flex flex-col shrink-0 z-30 transition-all duration-300 ease-in-out
                    ${collapsed ? 'w-[80px]' : 'w-[280px]'}
                    bg-[#0F172A]/70 backdrop-blur-xl border-r border-[#1F2937] shadow-[0_0_30px_rgba(0,0,0,0.5)] relative`}
            >
                {/* Logo + collapse toggle */}
                <div className={`flex items-center border-b border-[#1F2937] px-5 py-5 gap-3
                    ${collapsed ? 'justify-center' : 'justify-between'} bg-black/20`}
                >
                    {!collapsed && (
                        <Link to="/" className="flex items-center gap-3 min-w-0">
                            <Logo variant="icon" className="h-8 w-8 text-indigo-400 shrink-0 filter drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                            <span className="text-[17px] font-black tracking-tight text-white truncate text-gradient">
                                VeriMind
                            </span>
                        </Link>
                    )}
                    {collapsed && (
                        <Link to="/">
                            <Logo variant="icon" className="h-8 w-8 text-indigo-400 filter drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                        </Link>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all shrink-0"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* Nav list */}
                <nav className="flex-1 overflow-y-auto custom-scrollbar px-4 py-8 space-y-2">
                    {!collapsed && (
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-6">
                            Intelligence Modules
                        </div>
                    )}
                    {SIDEBAR_NAV.map((item, i) => (
                        <NavItem key={i} item={item} />
                    ))}
                </nav>

                {/* Footer */}
                <div className={`px-5 py-5 border-t border-[#1F2937] flex items-center gap-3 bg-black/30
                    ${collapsed ? 'justify-center' : ''}`}
                >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <Logo variant="icon" className="h-5 w-5 text-indigo-400" />
                    </div>
                    {!collapsed && (
                        <div>
                            <div className="text-xs font-bold text-slate-200 uppercase tracking-wide">VeriMind Core</div>
                            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">v5.5 Enterprise</div>
                        </div>
                    )}
                </div>
            </aside>

            {/* ══════════════════════════════════════
                MAIN CONTENT
            ══════════════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0 z-10 relative">

                {/* ── TOP NAVBAR (Sticky + Glowing Gradient Logo) ── */}
                <header className="sticky top-0 sticky-navbar flex items-center justify-between h-20 px-8 shrink-0
                    bg-[#0B0F1A]/80 backdrop-blur-lg border-b border-[#1F2937] z-20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]">

                    {/* Left: mobile menu + breadcrumb/logo */}
                    <div className="flex items-center gap-5">
                        <button
                            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        {/* Mobile logo */}
                        <Link to="/" className="lg:hidden flex items-center gap-3">
                            <Logo variant="icon" className="h-8 w-8 text-indigo-400 filter drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                            <span className="text-[17px] font-black tracking-tight text-white text-gradient">VeriMind</span>
                        </Link>

                        {/* Page breadcrumb label (desktop) */}
                        <div className="hidden lg:flex items-center gap-3">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest letter-spacing-[0.2em] border-l-2 border-indigo-500/50 pl-4 h-5 flex items-center">
                                {SIDEBAR_NAV.find(n => n.path === location.pathname)?.label ?? 'Workspace'}
                            </span>
                        </div>
                    </div>

                    {/* Right: user / auth */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full
                                    bg-[#111827] border border-[#1F2937] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white
                                        flex items-center justify-center text-xs font-bold uppercase shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                                        {user.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold text-slate-300 pr-1">{user}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                                        text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20
                                        border border-transparent
                                        transition-all text-sm font-bold tracking-wide"
                                >
                                    <LogOut size={16} />
                                    <span className="hidden sm:block">Disconnect</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <button className="px-5 py-2.5 text-slate-300 hover:text-white hover:bg-white/5
                                        text-sm font-bold transition-all rounded-xl border border-transparent hover:border-white/10 tracking-wide">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <button className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-xl
                                        bg-gradient-to-r from-indigo-600 to-purple-600
                                        text-white text-sm font-bold uppercase tracking-wide
                                        shadow-[0_4px_15px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_25px_rgba(168,85,247,0.6)]
                                        hover:-translate-y-0.5 transition-all">
                                        Get Started
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* ── SCROLLABLE PAGE CONTENT ── */}
                <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full pt-6 md:pt-10">
                    <Suspense fallback={
                        <div className="flex-1 flex items-center justify-center h-full">
                            <Activity className="animate-pulse text-indigo-400 filter drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]" size={40} />
                        </div>
                    }>
                        <Outlet />
                    </Suspense>

                    {/* Footer */}
                    <footer className="mt-12 py-10 text-center text-slate-600 pb-16">
                        <div className="flex justify-center mb-4 opacity-30">
                           <Logo variant="icon" className="w-8 h-8 text-indigo-400" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                            VeriMind Enterprise AI Framework © 2026<br/>
                            <span className="text-slate-700 font-medium">Secured & Verified Intelligence</span>
                        </p>
                    </footer>
                </main>
            </div>

            {/* ══════════════════════════════════════
                MOBILE SIDEBAR DRAWER (Dark Glass)
            ══════════════════════════════════════ */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 lg:hidden flex"
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-[#0B0F1A]/80 backdrop-blur-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                            className="relative w-[300px] h-full bg-[#0F172A] border-r border-[#1F2937]
                                flex flex-col z-10 shadow-[20px_0_50px_rgba(0,0,0,0.8)]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-6 border-b border-[#1F2937] bg-black/30">
                                <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Logo variant="icon" className="h-8 w-8 text-indigo-400 filter drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                    <span className="text-[18px] font-black tracking-tight text-white text-gradient">VeriMind</span>
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl border border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Nav */}
                            <nav className="flex-1 overflow-y-auto custom-scrollbar px-5 py-8 space-y-2">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 px-4">
                                    Navigation
                                </div>
                                {SIDEBAR_NAV.map((item, i) => (
                                    <NavItem key={i} item={item} mobile />
                                ))}
                            </nav>

                            {/* Mobile footer */}
                            <div className="px-6 py-6 border-t border-[#1F2937] bg-black/40 flex items-center justify-center">
                                <p className="text-[10px] text-indigo-400/70 font-bold uppercase tracking-widest">
                                    System Core v5.5
                                </p>
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
