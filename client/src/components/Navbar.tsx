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
        { path: '/write', label: 'Write', icon: Sparkles },
        { path: '/check', label: 'Check', icon: ShieldCheck },
        { path: '/typing', label: 'Typing Lab', icon: Keyboard },
    ];

    const handleLogout = useCallback(() => {
        localStorage.clear();
        window.dispatchEvent(new Event('storage'));
        window.location.href = '/';
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
            scrolled ? 'bg-black/60 border-b border-white/10 backdrop-blur-xl py-4' : 'bg-transparent py-6'
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">V</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-white leading-none">VeriMind</span>
                        <span className="text-[10px] font-medium text-purple-400 uppercase tracking-widest mt-1">Study Assistant</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/5">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                                location.pathname === item.path 
                                ? 'bg-purple-600 text-white shadow-lg' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="hidden sm:block text-sm font-medium text-slate-300">{user.name}</span>
                            <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={onLoginClick}
                            className="btn-primary py-2 text-sm"
                        >
                            Get Started
                        </button>
                    )}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-white">
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
                        className="fixed inset-0 top-[80px] bg-black/95 backdrop-blur-2xl z-50 md:hidden p-6"
                    >
                        <div className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.path} 
                                    to={item.path} 
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-lg font-semibold text-white"
                                >
                                    <item.icon size={20} className="text-purple-400" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

