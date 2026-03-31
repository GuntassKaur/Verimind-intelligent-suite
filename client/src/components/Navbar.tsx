import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';
import { Logo } from './Logo';

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
        { path: '/', label: 'Home' },
        { path: '/live-ai', label: 'Live AI' },
        { path: '/dashboard', label: 'Dashboard' }
    ];

    const handleLogout = useCallback(() => {
        localStorage.clear();
        window.dispatchEvent(new Event('storage'));
        window.location.href = '/';
    }, []);

    // Fixed click handlers to prevent bubbling
    const onActionClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onLoginClick(e);
    };

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
            scrolled ? 'bg-[#0B0F19]/80 border-b border-white/5 backdrop-blur-xl py-3 shadow-lg' : 'bg-transparent py-5'
        }`}>
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Logo variant="icon" className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">VeriMind</span>
                </Link>

                <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/5">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                                location.pathname === item.path ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-300">Hi, {user.name}</span>
                            <button onClick={handleLogout} className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-rose-500 transition-colors">
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <button onClick={onActionClick} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white">Login</button>
                            <button onClick={onActionClick} className="px-6 py-2.5 bg-white text-black font-bold text-sm rounded-xl">Get Started</button>
                        </div>
                    )}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2.5 rounded-xl bg-white/5 text-white">
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 top-[74px] bg-[#0B0F19] z-[99] p-6 lg:hidden">
                        <div className="flex flex-col gap-3">
                            {navItems.map((item) => (
                                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className="p-4 rounded-xl bg-white/5 text-lg font-medium text-slate-300">
                                    {item.label}
                                </Link>
                            ))}
                            {!user && <button onClick={(e) => { setMobileOpen(false); onActionClick(e); }} className="p-4 rounded-xl bg-indigo-600 text-white font-bold text-lg mt-4">Get Started</button>}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
