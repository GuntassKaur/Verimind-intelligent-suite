import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Sparkles, ShieldCheck, History, Search, User, Keyboard, LayoutDashboard, ShieldAlert, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

const NavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon?: LucideIcon }) => {
    const [location] = useLocation();
    const isActive = location === href;

    return (
        <Link href={href}>
            <div className={twMerge(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 cursor-pointer text-sm font-semibold whitespace-nowrap",
                isActive
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
            )}>
                {Icon && <Icon size={16} />}
                <span>{children}</span>
            </div>
        </Link>
    );
};

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-[#0a0e1a]/80 backdrop-blur-xl">
            <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/">
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="hidden lg:block">
                            <Logo variant="full" className="w-8 h-8 text-indigo-500 group-hover:drop-shadow-[0_0_15px_rgba(99,102,241,0.8)] transition-all duration-300" />
                        </div>
                        <div className="block lg:hidden">
                            <Logo variant="icon" className="w-8 h-8 text-indigo-500 group-hover:drop-shadow-[0_0_15px_rgba(99,102,241,0.8)] transition-all duration-300" />
                        </div>
                    </div>
                </Link>

                <div className="hidden lg:flex items-center gap-2">
                    <NavLink href="/generate" icon={Sparkles}>Generator</NavLink>
                    <NavLink href="/analyze" icon={ShieldCheck}>Analyzer</NavLink>
                    <NavLink href="/plagiarism" icon={Search}>Plagiarism</NavLink>
                    <NavLink href="/humanize" icon={User}>Humanizer</NavLink>
                    <NavLink href="/typing" icon={Keyboard}>Typing Practice</NavLink>
                    <NavLink href="/history" icon={History}>History</NavLink>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-xs font-bold text-white tracking-tight">
                            Welcome, {localStorage.getItem('user_name') || 'Guest'}
                        </span>
                    </div>

                    {localStorage.getItem('user_name') ? (
                        <button
                            onClick={() => {
                                localStorage.removeItem('user_name');
                                window.location.href = '/login';
                            }}
                            className="hidden sm:block px-4 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-xs font-bold text-rose-400 transition-all cursor-pointer"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link href="/login">
                            <button className="hidden sm:block px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-slate-300 transition-all cursor-pointer">
                                Login
                            </button>
                        </Link>
                    )}

                    {/* Mobile Menu Trigger */}
                    <div className="lg:hidden relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <LayoutDashboard size={20} />
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 mt-4 w-64 bg-[#0d1117]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[1000]"
                                >
                                    <div className="max-h-[70vh] overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                        {[
                                            { label: 'Analyzer', href: '/analyze', icon: ShieldAlert },
                                            { label: 'Generator', href: '/generate', icon: Sparkles },
                                            { label: 'Plagiarism', href: '/plagiarism', icon: Search },
                                            { label: 'Humanizer', href: '/humanize', icon: User },
                                            { label: 'Typing Practice', href: '/typing', icon: Keyboard },
                                            { label: 'Archive', href: '/history', icon: History },
                                            { label: 'Mission', href: '/about', icon: Info },
                                        ].map((item) => (
                                            <Link key={item.href} href={item.href}>
                                                <div
                                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <item.icon size={16} className="text-indigo-400" />
                                                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest group-hover:text-white">{item.label}</span>
                                                </div>
                                            </Link>
                                        ))}
                                        <div className="pt-4 border-t border-white/5">
                                            <div className="px-3 py-2 mb-2">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Account</p>
                                                <p className="text-xs font-bold text-white uppercase italic">{localStorage.getItem('user_name') || 'Guest'}</p>
                                            </div>
                                            <Link href="/login">
                                                <button className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                                                    Login
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </nav>
    );
};
