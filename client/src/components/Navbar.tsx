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
        { path: '/', label: 'Portal' },
        { path: '/dashboard', label: 'Command' },
        { path: '/spark', label: 'Neural Spark' },
        { 
            label: 'Analyze', 
            items: [
                { path: '/audit', label: 'Truth Audit' },
                { path: '/plagiarism', label: 'Origins Scan' },
                { path: '/comparison', label: 'Comparison' }
            ]
        },
        { 
            label: 'Generate', 
            items: [
                { path: '/forge', label: 'Neural Forge' },
                { path: '/humanizer', label: 'Humanizer' },
                { path: '/ppt', label: 'PPT Engine' }
            ]
        },
        { 
            label: 'Labs', 
            items: [
                { path: '/visualizer', label: 'Logic Flow' },
                { path: '/workspace', label: 'Neural Workspace' },
                { path: '/typing-lab', label: 'Typing Lab' }
            ]
        }
    ];

    const handleLogout = useCallback(() => {
        localStorage.clear();
        window.dispatchEvent(new Event('storage'));
        window.location.href = '/';
    }, []);

    const onActionClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onLoginClick(e);
    };

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
            scrolled ? 'bg-[#0B0F19]/60 border-b border-white/5 backdrop-blur-2xl py-3 shadow-2xl' : 'bg-transparent py-6'
        }`}>
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-transform">
                        <Logo variant="icon" className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter text-white leading-none">Verimind</span>
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em] mt-1">Intelligence Suite</span>
                    </div>
                </Link>

                {/* Main Navigation Desktop */}
                <div className="hidden lg:flex items-center gap-2 bg-white/[0.02] p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                    {navItems.map((item, idx) => (
                        <div key={idx} className="relative group/nav">
                            {item.path ? (
                                <Link 
                                    to={item.path} 
                                    className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                        location.pathname === item.path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <>
                                    <button className="px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-2">
                                        {item.label}
                                        <div className="w-1 h-1 rounded-full bg-slate-600 group-hover/nav:bg-indigo-400 transition-colors" />
                                    </button>
                                    {/* Dropdown glassmorphism */}
                                    <div className="absolute top-full left-0 mt-2 w-48 opacity-0 translate-y-2 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto transition-all duration-300">
                                        <div className="p-2 rounded-2xl bg-[#0F172A]/90 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-1">
                                            {item.items?.map((sub) => (
                                                <Link 
                                                    key={sub.path} 
                                                    to={sub.path}
                                                    className="block w-full px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="hidden md:flex items-center gap-6">
                             <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Pilot</span>
                                <span className="text-xs font-bold text-white leading-tight">{user.name}</span>
                             </div>
                            <button onClick={handleLogout} className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-95">
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                            <button onClick={onActionClick} className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">Protocol Login</button>
                            <button onClick={onActionClick} className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">Launch Neural Link</button>
                        </div>
                    )}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center">
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 top-[78px] bg-[#0B0F19]/95 backdrop-blur-3xl z-[99] lg:hidden p-8 overflow-y-auto">
                        <div className="flex flex-col gap-6">
                            {navItems.map((item, idx) => (
                                <div key={idx} className="space-y-4">
                                    {item.path ? (
                                        <Link to={item.path} onClick={() => setMobileOpen(false)} className="text-2xl font-black text-white hover:text-indigo-400 transition-colors uppercase tracking-tighter">
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">{item.label}</span>
                                            <div className="grid grid-cols-1 gap-3">
                                                {item.items?.map((sub) => (
                                                    <Link key={sub.path} to={sub.path} onClick={() => setMobileOpen(false)} className="p-5 rounded-2xl bg-white/5 border border-white/5 text-sm font-bold text-slate-300">
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {!user && <button onClick={(e) => { setMobileOpen(false); onActionClick(e); }} className="p-6 rounded-[2rem] bg-indigo-600 text-white font-black text-lg mt-8 shadow-2xl shadow-indigo-600/20 uppercase tracking-widest">Connect Matrix</button>}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
