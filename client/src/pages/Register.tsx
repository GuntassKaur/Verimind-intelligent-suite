import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck, ShieldAlert, Loader2, Key, User, ArrowRight, HelpCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';
import axios from 'axios';

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Password Complexity Validation
        const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!pwdRegex.test(password)) {
            setError('Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.');
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/api/auth/register', { email, password, name });
            if (data.success) {
                if (data.user?.name) localStorage.setItem('user_name', data.user.name);
                setSuccess('Registration successful! Redirecting...');
                setTimeout(() => navigate('/'), 1500);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Failed to register.');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#05070a]">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass-card p-6 md:p-10 bg-[#0d1117]/40 relative z-10 border-white/5"
            >
                <div className="text-center mb-8 md:mb-10">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-glow">
                        <Logo variant="icon" className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2 uppercase">Create Account</h1>
                    <p className="text-slate-500 font-medium text-xs md:text-sm">Join the VeriMind ecosystem.</p>
                </div>

                <motion.form
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleRegister}
                    className="space-y-6"
                >
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative flex items-center">
                            <User className="absolute left-4 text-slate-500" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="premium-input !pl-12"
                                placeholder="John Doe"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-4 text-slate-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="premium-input !pl-12"
                                placeholder="user@verimind.ai"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative flex items-center">
                            <Key className="absolute left-4 text-slate-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="premium-input !pl-12"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>
                        <p className="text-[9px] text-slate-600 font-medium ml-1 mt-1 uppercase tracking-wider">
                            Min. 8 chars, 1 Uppercase, 1 Number, 1 Special Char (@$!%*?&)
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                        <div className="relative flex items-center">
                            <Key className="absolute left-4 text-slate-500" size={18} />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="premium-input !pl-12"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="premium-btn-primary w-full py-5 flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-600/20"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><ShieldCheck size={20} /><span className="uppercase tracking-widest font-black text-xs">Register</span><ArrowRight size={18} /></>}
                    </button>
                    
                    <div className="text-center mt-4">
                        <button type="button" onClick={() => navigate('/login')} className="text-[10px] text-slate-500 font-black uppercase tracking-widest hover:text-indigo-400 transition-colors">
                            Already have an account? Login
                        </button>
                    </div>
                </motion.form>

                {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-[11px] font-black uppercase tracking-tight">
                        <ShieldAlert size={18} className="shrink-0" />{error}
                    </motion.div>
                )}
                {success && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-[11px] font-black uppercase tracking-tight">
                        <ShieldCheck size={18} className="shrink-0" />{success}
                    </motion.div>
                )}

                <div className="mt-8 flex justify-center gap-6 opacity-20 hover:opacity-100 transition-opacity">
                    <button onClick={() => navigate('/')} className="text-white hover:text-indigo-400 transition-colors"><HelpCircle size={14} /></button>
                </div>
            </motion.div>
        </div>
    );
}
