import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, ArrowRight, Key } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';

type AuthMode = 'login' | 'register' | 'forgot' | 'verify';

export default function Login() {
    const [, setLocation] = useLocation();
    const [mode, setMode] = useState<AuthMode>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [resendDisabled, setResendDisabled] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (mode === 'login') {
                const { data } = await api.post('/api/auth/login', { email, password });
                if (data.token) {
                    if (data.user && data.user.name) {
                        localStorage.setItem('user_name', data.user.name);
                    }
                    setSuccess('Login successful. Redirecting...');
                    setTimeout(() => setLocation('/'), 1000);
                } else {
                    setError(data.error || 'Invalid email or password.');
                }
            } else if (mode === 'register') {
                const { data } = await api.post('/api/auth/register', { name, email, password });
                if (data.success) {
                    setSuccess('Account created. Please sign in.');
                    setMode('login');
                } else {
                    setError(data.error || 'Registration failed.');
                }
            } else if (mode === 'forgot') {
                const { data } = await api.post('/api/auth/forgot-password', { email });
                if (data.success) {
                    setSuccess('OTP sent to your email.');
                    setMode('verify');
                    handleResendTimer();
                } else {
                    setError(data.error || 'Failed to send OTP.');
                }
            } else if (mode === 'verify') {
                const { data } = await api.post('/api/auth/verify-reset', { email, otp, newPassword: password });
                if (data.success) {
                    setSuccess('Password updated successfully. Please login.');
                    setMode('login');
                    setPassword('');
                    setOtp('');
                } else {
                    setError(data.error || 'Failed to verify OTP.');
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Request failed. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendTimer = () => {
        setResendDisabled(true);
        setTimeout(() => setResendDisabled(false), 60000);
    };

    const handleResend = async () => {
        if (resendDisabled) return;
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const { data } = await api.post('/api/auth/forgot-password', { email });
            if (data.success) {
                setSuccess('OTP resent to your email.');
                handleResendTimer();
            } else {
                setError(data.error || 'Failed to resend OTP.');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        switch (mode) {
            case 'login': return 'Login';
            case 'register': return 'Create Account';
            case 'forgot': return 'Reset Password';
            case 'verify': return 'Verify OTP';
        }
    };

    const getDescription = () => {
        switch (mode) {
            case 'login': return 'Login to your account to continue.';
            case 'register': return 'Create an account to save your reports.';
            case 'forgot': return 'Enter your email to receive a secure OTP.';
            case 'verify': return 'Enter the OTP and your new password.';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass-card p-10 bg-[#0d1117]/60"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(79,158,255,0.3)]">
                        <Logo variant="icon" className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                        {getTitle()}
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {getDescription()}
                    </p>
                </div>

                {(mode === 'login' || mode === 'register') && (
                    <div className="flex bg-black/20 p-1 rounded-xl mb-8">
                        <button
                            type="button"
                            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'register' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Register
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {mode === 'register' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                            <div className="relative flex items-center">
                                <User className="absolute left-4 text-slate-500 pointer-events-none" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="premium-input !pl-12"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 text-slate-500 pointer-events-none" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="premium-input !pl-12"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {mode === 'verify' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">6-Digit OTP</label>
                            <div className="relative flex items-center">
                                <Key className="absolute left-4 text-slate-500 pointer-events-none" size={18} />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="premium-input !pl-12 tracking-[0.5em] font-mono text-center"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {(mode === 'login' || mode === 'register' || mode === 'verify') && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    {mode === 'verify' ? 'New Password' : 'Password'}
                                </label>
                                {mode === 'login' && (
                                    <button
                                        type="button"
                                        onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 text-slate-500 pointer-events-none" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="premium-input !pl-12"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="premium-btn-primary w-full py-4 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span className="uppercase tracking-[0.2em] font-black">
                                    {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Sign Up' : mode === 'forgot' ? 'Send OTP' : 'Update Password'}
                                </span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    {mode === 'verify' && (
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendDisabled || loading}
                                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {resendDisabled ? 'Wait 60s to Resend' : 'Resend OTP'}
                            </button>
                        </div>
                    )}
                </form>

                <div className="mt-8 text-center pt-8 border-t border-white/5 space-y-4">
                    {(mode === 'forgot' || mode === 'verify') && (
                        <button
                            type="button"
                            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                            className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors block w-full"
                        >
                            Back to Login
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            localStorage.removeItem('user_name');
                            setLocation('/');
                        }}
                        className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors block w-full"
                    >
                        Continue as Guest
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
