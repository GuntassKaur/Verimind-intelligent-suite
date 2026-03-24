import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShieldCheck,
    Zap,
    Settings,
    LogOut,
    MonitorPlay,
    Layers,
    Menu,
    X,
    FileType
} from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../contexts/ThemeContext';

export default function DashboardLayout() {
    const { theme } = useTheme();
    const [userData] = useState<{name?: string} | null>(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error('Error parsing user data from localStorage', e);
            return null;
        }
    });

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { path: '/', label: 'Home', icon: LayoutDashboard },
        { path: '/generator', label: 'Generate', icon: Zap },
        { path: '/audit', label: 'Analyze', icon: ShieldCheck },
        { path: '/plagiarism', label: 'Plagiarism', icon: Layers },
        { path: '/ppt', label: 'PPTs', icon: MonitorPlay },
        { path: '/visualizer', label: 'Visualizer', icon: FileType },
    ];

    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen transition-colors duration-500 flex flex-col ${isDark ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
            {/* ═══════════════════════════════════════════════
               PROFESSIONAL TOP NAVBAR
               ═══════════════════════════════════════════════ */}
            <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 border-b ${
                scrolled 
                ? (isDark ? 'bg-[#0F172A]/90 border-white/5 backdrop-blur-xl' : 'bg-white/90 border-slate-200 backdrop-blur-xl') 
                : 'bg-transparent border-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                             <Logo variant="icon" className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>VeriMind</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                        {navItems.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                                <Link 
                                    key={item.path} 
                                    to={item.path}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative group
                                        ${active 
                                            ? (isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-700')
                                            : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                                        }`}
                                >
                                    {item.label}
                                    {active && <motion.div layoutId="nav-pill" className="absolute inset-0 border border-indigo-500/20 rounded-xl" />}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-4">
                         <div className="hidden md:flex items-center gap-3 mr-4">
                             <div className="text-right">
                                  <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{userData?.name || 'Guest Analyst'}</p>
                                  <div className="flex items-center gap-1 justify-end opacity-50">
                                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                       <span className="text-[9px] font-bold uppercase tracking-tighter">Verified</span>
                                  </div>
                             </div>
                             <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-indigo-500/20 text-indigo-400 border border-white/5' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'} flex items-center justify-center font-black transition-transform hover:scale-105 cursor-pointer`}>
                                 {userData?.name?.[0] || 'G'}
                             </div>
                         </div>

                         {/* Mobile Trigger */}
                         <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`lg:hidden p-3 rounded-xl ${isDark ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`}
                         >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                         </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed inset-0 z-[90] lg:hidden p-6 pt-24 ${isDark ? 'bg-[#0F172A]' : 'bg-white'}`}
                    >
                         <div className="space-y-4">
                             {navItems.map((item) => (
                                 <Link 
                                    key={item.path} 
                                    to={item.path} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 p-5 rounded-2xl text-lg font-black tracking-tight ${
                                        location.pathname === item.path 
                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                                        : (isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-50 text-slate-600')
                                    }`}
                                 >
                                     <item.icon size={22} />
                                     {item.label}
                                 </Link>
                             ))}
                         </div>

                         <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                              <Link to="/settings" className="flex items-center gap-4 p-5 text-slate-500 font-bold"><Settings size={20} /> Settings</Link>
                              <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="w-full flex items-center gap-4 p-5 text-rose-500 font-bold"><LogOut size={20} /> Log Out</button>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════
               MAIN CONTENT (POPPINS/INTER FONT)
               ═══════════════════════════════════════════════ */}
            <main className="flex-1 pt-24 md:pt-32 pb-20 font-sans">
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <Outlet />
                </div>
            </main>

            {/* Global Minimal Footer */}
            <footer className={`py-12 border-t text-center ${isDark ? 'border-white/5 text-slate-600' : 'border-slate-200 text-slate-400'}`}>
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Verimind Intelligent – Forensic AI Sovereignty</p>
            </footer>
        </div>
    );
}
