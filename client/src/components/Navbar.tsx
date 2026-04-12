import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Sparkles, ShieldCheck, Keyboard, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
    onLoginClick: (e: React.MouseEvent) => void;
}

export const Navbar = ({ onLoginClick }: NavbarProps) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const [user, setUser] = useState<{ name?: string } | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        const updateAuth = () => {
            const name = localStorage.getItem('user_name');
            setUser(name ? { name } : null);
        };
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('storage', updateAuth);
        updateAuth();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', updateAuth);
        };
    }, []);

    const navItems = [
        { path: '/', label: 'Home', icon: LayoutDashboard },
        { path: '/dashboard', label: 'Hub', icon: LayoutDashboard },
        { path: '/write', label: 'Write', icon: Sparkles },
        { path: '/humanize', label: 'Humanize', icon: Brain },
    ];

    const handleLogout = useCallback(() => {
        localStorage.clear();
        window.dispatchEvent(new Event('storage'));
        window.location.href = '/';
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
            scrolled ? 'bg-black/40 border-b border-white/5 backdrop-blur-3xl py-4 shadow-[0_10px_40px_rgba(0,0,0,0.3)]' : 'bg-transparent py-8'
        }`}>
            <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <span className="font-black text-2xl">V</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tighter text-white leading-none group-hover:text-purple-400 transition-colors">VeriMind</span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Neural Suite</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                location.pathname === item.path 
                                ? 'bg-white text-black shadow-lg scale-105' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-xs font-black text-white">{user.name}</span>
                                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Premium Node</span>
                            </div>
                            <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all border border-transparent hover:border-white/5">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={onLoginClick}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]"
                        >
                            Establish Link
                        </button>
                    )}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-10 h-10 flex items-center justify-center text-white bg-white/5 rounded-lg">
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -20 }} 
                        className="fixed inset-0 top-[80px] bg-black/95 backdrop-blur-3xl z-50 md:hidden p-8"
                    >
                        <div className="flex flex-col gap-6">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.path} 
                                    to={item.path} 
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-between p-6 rounded-3xl bg-white/5 group"
                                >
                                    <div className="flex items-center gap-5">
                                        <item.icon size={24} className="text-purple-400 group-hover:scale-110 transition-transform" />
                                        <span className="text-xl font-black text-white uppercase tracking-tighter">{item.label}</span>
                                    </div>
                                    <ArrowRight size={20} className="text-slate-600 group-hover:text-white group-hover:translate-x-2 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

