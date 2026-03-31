import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    MessageSquare,
    BarChart3,
    Info,
    Settings,
    LogOut,
    Menu,
    X,
    Mic,
    ChevronRight
} from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../contexts/ThemeContext';
import FloatingParticles from './FloatingParticles';
import { LoginModal } from './LoginModal';

export default function DashboardLayout() {
    useTheme();
    const [userData, setUserData] = useState<{name?: string} | null>(() => {
        try {
            const stored = localStorage.getItem('user');
            if (stored) return JSON.parse(stored);
            const name = localStorage.getItem('user_name');
            if (name) return { name };
            return null;
        } catch (e) {
            return null;
        }
    });

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
        const handleStorageChange = () => {
             const name = localStorage.getItem('user_name');
             if (name) setUserData({ name });
             else setUserData(null);
        };
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
             window.removeEventListener('scroll', handleScroll);
             window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const centerNavItems = [
        { path: '/', label: 'Home' },
        { path: '/#features', label: 'Features' },
        { path: '/live-ai', label: 'Live AI' },
        { path: '/dashboard', label: 'Dashboard' }
    ];

    const mobileNavItems = [
        { path: '/', label: 'Home', icon: LayoutDashboard },
        { path: '/live-ai', label: 'Live AI', icon: Mic },
        { path: '/chat', label: 'Chat', icon: MessageSquare },
        { path: '/dashboard', label: 'Console', icon: BarChart3 },
        { path: '/about', label: 'About', icon: Info },
    ];

    const handleLoginClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setMobileMenuOpen(false);
        setIsLoginOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        window.dispatchEvent(new Event('storage'));
        window.location.href='/';
    };

    return (
        <div className="min-h-screen transition-colors duration-500 flex flex-col relative bg-[#0B0F19] text-[#E2E8F0]">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <FloatingParticles count={20} />
            </div>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
                scrolled 
                ? 'bg-[#0B0F19]/80 border-b border-white/5 backdrop-blur-xl py-3 shadow-lg shadow-black/20' 
                : 'bg-transparent border-transparent py-5'
            }`}>
                <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all">
                             <Logo variant="icon" className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white leading-none">VeriMind</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-2 bg-white/[0.03] p-1.5 rounded-full border border-white/5 backdrop-blur-md">
                        {centerNavItems.map((item) => {
                            const isAnchor = item.path.includes('#');
                            const active = location.pathname === item.path && !isAnchor;
                            
                            const linkContent = <span className="relative z-10">{item.label}</span>;
                            const cls = `px-5 py-2 rounded-full text-sm font-medium transition-all relative group ${active ? 'text-white' : 'text-slate-400 hover:text-white'}`;

                            return isAnchor ? (
                                <a href={item.path} key={item.label} className={cls}>{linkContent}</a>
                            ) : (
                                <Link key={item.path} to={item.path} className={cls}>
                                    {linkContent}
                                    {active && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white/10 rounded-full border border-white/10 backdrop-blur-xl" />}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 relative z-10">
                        {userData ? (
                            <div className="hidden md:flex items-center gap-5 mr-1">
                                <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                                     Dashboard <ChevronRight size={14} className="opacity-50" />
                                </Link>
                                <div className="h-5 w-px bg-white/10" />
                                <div className="flex items-center gap-3 group cursor-pointer relative" onClick={handleLogout}>
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 text-white border border-white/10 flex items-center justify-center font-medium transition-transform group-hover:scale-105 relative z-10">
                                        {userData.name?.[0]?.toUpperCase() || 'U'}
                                        <div className="absolute inset-0 bg-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <LogOut size={14} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <button 
                                    onClick={handleLoginClick}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={handleLoginClick}
                                    className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
                                >
                                    Get Started
                                </button>
                            </div>
                        )}

                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl bg-white/5 text-white"
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
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="fixed inset-0 z-[90] lg:hidden p-6 pt-24 bg-[#0B0F19]/95 backdrop-blur-3xl"
                    >
                         <div className="space-y-2">
                             {mobileNavItems.map((item) => (
                                 <Link 
                                    key={item.path} 
                                    to={item.path} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 p-4 rounded-xl text-lg font-medium tracking-tight ${
                                        location.pathname === item.path 
                                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                                        : 'bg-transparent text-slate-300 hover:bg-white/5'
                                    }`}
                                 >
                                     <item.icon size={20} className={location.pathname === item.path ? "text-indigo-400" : "text-slate-500"} />
                                     {item.label}
                                 </Link>
                             ))}
                         </div>

                         {!userData ? (
                             <div className="mt-8 pt-8 border-t border-white/5 space-y-3 flex flex-col">
                                 <button onClick={handleLoginClick} className="px-6 py-4 rounded-xl bg-white text-black font-bold text-sm w-full">
                                     Get Started
                                 </button>
                                 <button onClick={handleLoginClick} className="px-6 py-4 rounded-xl bg-white/5 text-white font-medium text-sm border border-white/10 w-full">
                                     Login
                                 </button>
                             </div>
                         ) : (
                             <div className="mt-8 pt-8 border-t border-white/5 space-y-2">
                                  <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 text-slate-400 font-medium hover:bg-white/5 rounded-xl"><Settings size={20} /> Settings</Link>
                                  <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 text-rose-400 font-medium hover:bg-rose-500/10 rounded-xl mt-2"><LogOut size={20} /> Log Out</button>
                             </div>
                         )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT */}
            <main className="flex-1 pt-24 pb-12 font-sans z-10 relative">
                <div className="w-full h-full min-h-[70vh]">
                    <Outlet context={{ openLoginModal: () => setIsLoginOpen(true) }} />
                </div>
            </main>

            <footer className="py-8 border-t border-white/5 text-center relative z-10 bg-[#0B0F19]">
                <p className="text-xs text-slate-500">© 2026 VeriMind. Advanced Intelligence Systems.</p>
                <div className="flex justify-center gap-6 mt-4 opacity-60">
                     <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy</a>
                     <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Terms</a>
                </div>
            </footer>
        </div>
    );
}
