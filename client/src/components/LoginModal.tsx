import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, ShieldAlert, Loader2, Key, ArrowRight, X, User } from 'lucide-react';
import { Logo } from './Logo';
import api from '../services/api';
import axios from 'axios';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
    const [mode, setMode] = useState<AuthMode>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const resetMessages = () => {
        setError('');
        setSuccess('');
    };

    const handleSwitchMode = (newMode: AuthMode) => {
        setMode(newMode);
        resetMessages();
    };

    const validateEmail = (val: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        resetMessages();

        if (!validateEmail(email)) {
            return setError('Please enter a valid email address.');
        }
        if (mode !== 'forgot' && password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }
        if (mode === 'register' && name.trim().length < 2) {
            return setError('Please enter a valid name.');
        }

        setLoading(true);

        try {
            if (mode === 'login') {
                const { data } = await api.post('/api/auth/login', { email, password });
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.data?.user || data.user));
                    localStorage.setItem('user_name', data.data?.user?.name || data.user?.name || '');
                    window.dispatchEvent(new Event('storage'));
                    setSuccess('Authentication successful!');
                    setTimeout(() => {
                        onSuccess?.();
                        onClose();
                        window.location.reload();
                    }, 1000);
                } else {
                    setError(data.error || 'Login failed.');
                }
            } else if (mode === 'register') {
                const { data } = await api.post('/api/auth/register', { name, email, password });
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.data?.user || data.user));
                    localStorage.setItem('user_name', data.data?.user?.name || data.user?.name || name);
                    window.dispatchEvent(new Event('storage'));
                    setSuccess('Account created successfully!');
                    setTimeout(() => {
                        onSuccess?.();
                        onClose();
                        window.location.reload();
                    }, 1000);
                } else {
                    setError(data.error || 'Registration failed.');
                }
            } else if (mode === 'forgot') {
                // Simulate forgot password API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                setSuccess('Password reset link sent to your email.');
                setTimeout(() => setMode('login'), 3000);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Authentication failed. Please check credentials.');
            } else {
                setError('A system error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-[#000000]/80 backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="w-full max-w-md bg-[#0B0F1A] border border-white/10 rounded-3xl p-8 sm:p-10 relative shadow-[0_30px_100px_rgba(124,92,255,0.2)] overflow-hidden"
                    >
                        {/* Shimmer background effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#7C5CFF]/10 to-transparent pointer-events-none" />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8 relative z-10">
                            <div className="w-16 h-16 bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Logo variant="icon" className="w-8 h-8 text-[#7C5CFF]" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                                {mode === 'login' && 'Welcome Back'}
                                {mode === 'register' && 'Create Workspace'}
                                {mode === 'forgot' && 'Reset Protocol'}
                            </h2>
                            <p className="text-[#E6EAF2]/60 font-medium text-sm">
                                {mode === 'login' && 'Authenticate to access VeriMind Intelligence.'}
                                {mode === 'register' && 'Join the future of enterprise AI.'}
                                {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            {mode === 'register' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#E6EAF2]/50 uppercase tracking-widest pl-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#00D4FF] transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#7C5CFF] focus:bg-white/10 transition-all"
                                            placeholder="John Doe"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#E6EAF2]/50 uppercase tracking-widest pl-1">Work Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#00D4FF] transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#7C5CFF] focus:bg-white/10 transition-all"
                                        placeholder="user@company.com"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {mode !== 'forgot' && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end pl-1">
                                        <label className="text-[10px] font-black text-[#E6EAF2]/50 uppercase tracking-widest">Password</label>
                                        {mode === 'login' && (
                                            <button
                                                type="button"
                                                onClick={() => handleSwitchMode('forgot')}
                                                className="text-[10px] font-bold text-[#00D4FF] hover:text-[#7C5CFF] transition-colors uppercase tracking-widest"
                                            >
                                                Forgot?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#00D4FF] transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#7C5CFF] focus:bg-white/10 transition-all"
                                            placeholder="••••••••"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            )}

                            {(error || success) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-wide border ${
                                        error 
                                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                    }`}
                                >
                                    {error ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                                    <span className="flex-1 leading-tight">{error || success}</span>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 flex items-center justify-center gap-3 bg-[#7C5CFF] hover:bg-[#6A4BE5] text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(124,92,255,0.4)] hover:shadow-[0_0_30px_rgba(124,92,255,0.6)]"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                    <>
                                        {mode === 'login' && 'Sign In'}
                                        {mode === 'register' && 'Create Account'}
                                        {mode === 'forgot' && 'Send Link'}
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>

                            <div className="pt-6 text-center">
                                {mode === 'login' ? (
                                    <p className="text-xs text-[#E6EAF2]/60 font-medium">
                                        Don't have an account? <button type="button" onClick={() => handleSwitchMode('register')} className="text-[#00D4FF] font-bold hover:text-[#7C5CFF] transition-colors">Register Now</button>
                                    </p>
                                ) : mode === 'register' ? (
                                    <p className="text-xs text-[#E6EAF2]/60 font-medium">
                                        Already have an account? <button type="button" onClick={() => handleSwitchMode('login')} className="text-[#00D4FF] font-bold hover:text-[#7C5CFF] transition-colors">Sign In</button>
                                    </p>
                                ) : (
                                    <p className="text-xs text-[#E6EAF2]/60 font-medium">
                                        Remembered your password? <button type="button" onClick={() => handleSwitchMode('login')} className="text-[#00D4FF] font-bold hover:text-[#7C5CFF] transition-colors">Sign In</button>
                                    </p>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
