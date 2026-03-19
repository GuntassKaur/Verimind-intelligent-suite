import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, ShieldAlert, Loader2, Key, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';
import axios from 'axios';

type LoginFlow = 'password' | 'forgot_request' | 'forgot_verify';

export default function Login() {
    const navigate = useNavigate();
    const [flow, setFlow] = useState<LoginFlow>('password');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otp, setOtp] = useState('');

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data } = await api.get('/api/auth/me');
                if (data.id) {
                    localStorage.setItem('user_name', data.name);
                    navigate('/history');
                }
            } catch { /* ignored */ }
        };
        checkSession();
    }, [navigate]);

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess('');
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            if (data.success) {
                if (data.user?.name) localStorage.setItem('user_name', data.user.name);
                setSuccess('Login successful!');
                setTimeout(() => navigate('/'), 1500);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) setError(err.response?.data?.error || 'Invalid credentials.');
            else setError('Login failed.');
        } finally { setLoading(false); }
    };

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess('');
        try {
            const { data } = await api.post('/api/auth/otp/request', { email });
            if (data.success) {
                setSuccess('Security code sent to your email.');
                setFlow('forgot_verify');
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) setError(err.response?.data?.error || 'Failed to send OTP.');
            else setError('Communication error.');
        } finally { setLoading(false); }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess('');

        // Password Complexity Validation
        const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!pwdRegex.test(newPassword)) {
            setError('Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.');
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/api/auth/otp/verify', { email, otp, password: newPassword });
            if (data.success) {
                setSuccess('Password updated successfully!');
                setTimeout(() => setFlow('password'), 2000);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) setError(err.response?.data?.error || 'Invalid OTP.');
            else setError('Verification failed.');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#05070a]">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full glass-card p-6 md:p-10 bg-[#0d1117]/40 relative z-10 border-white/5">
                <div className="text-center mb-8 md:mb-10">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-glow">
                        <Logo variant="icon" className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2 uppercase">Welcome Back</h1>
                    <p className="text-slate-500 font-medium text-xs md:text-sm">Secure access to VeriMind ecosystem.</p>
                </div>

                <AnimatePresence mode="wait">
                    {flow === 'password' && (
                        <motion.form key="password" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handlePasswordLogin} className="space-y-6">
                            <InputField label="Work Email" icon={Mail} type="email" value={email} onChange={setEmail} disabled={loading} placeholder="user@verimind.ai" />
                            <InputField label="Password" icon={Key} type="password" value={password} onChange={setPassword} disabled={loading} placeholder="••••••••" />
                            
                            <button disabled={loading} className="premium-btn-primary w-full py-5 flex items-center justify-center gap-3">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><span>Login</span><ArrowRight size={18} /></>}
                            </button>
                            
                            <div className="flex justify-center mt-4 mb-2">
                                <button type="button" onClick={() => setFlow('forgot_request')} className="text-[10px] text-slate-500 font-black uppercase tracking-widest hover:text-indigo-400">Forgot Password?</button>
                            </div>
                            <div className="text-center mt-6">
                                <button type="button" onClick={() => navigate('/register')} className="text-[10px] text-slate-500 font-black uppercase tracking-widest hover:text-indigo-400 transition-colors">Don't have an account? Register</button>
                            </div>
                        </motion.form>
                    )}

                    {flow === 'forgot_request' && (
                        <motion.form key="otp_request" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleRequestOTP} className="space-y-6">
                            <InputField label="Work Email" icon={Mail} type="email" value={email} onChange={setEmail} disabled={loading} placeholder="user@verimind.ai" />
                            <button disabled={loading} className="premium-btn-primary w-full py-5 flex items-center justify-center gap-3">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><span>Send Security Code</span><ArrowRight size={18} /></>}
                            </button>
                            <button type="button" onClick={() => setFlow('password')} className="w-full text-[10px] text-slate-500 font-black uppercase tracking-widest hover:text-indigo-400">Back to Login</button>
                        </motion.form>
                    )}

                    {flow === 'forgot_verify' && (
                        <motion.form key="otp_verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Verification Code</label>
                                <div className="relative flex items-center">
                                    <Key className="absolute left-4 text-slate-500" size={18} />
                                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="premium-input !pl-12 tracking-[1em] text-center font-black text-lg" placeholder="000000" maxLength={6} required disabled={loading} />
                                </div>
                            </div>
                            <InputField 
                                label="New Password" 
                                icon={Key} 
                                type="password" 
                                value={newPassword} 
                                onChange={setNewPassword} 
                                disabled={loading} 
                                placeholder="••••••••" 
                                hint="Min. 8 chars, 1 Uppercase, 1 Number, 1 Special Char (@$!%*?&)"
                            />
                            <button disabled={loading} className="premium-btn-primary w-full py-5 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-600/20">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><span>Verify</span><ArrowRight size={18} /></>}
                            </button>
                            <button type="button" onClick={() => setFlow('password')} className="w-full text-[10px] text-slate-500 font-black uppercase tracking-widest hover:text-indigo-400">Cancel</button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {error && <div className="mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-[11px] font-black uppercase tracking-tight"><ShieldAlert size={18} />{error}</div>}
                {success && <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-[11px] font-black uppercase tracking-tight"><ShieldCheck size={18} />{success}</div>}
            </motion.div>
        </div>
    );
}

interface InputProps {
    label: string;
    icon: React.ElementType;
    type: string;
    value: string;
    onChange: (val: string) => void;
    disabled: boolean;
    placeholder?: string;
    hint?: string;
}

const InputField = ({ label, icon: Icon, type, value, onChange, disabled, placeholder, hint }: InputProps) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative flex items-center">
            <Icon className="absolute left-4 text-slate-500" size={18} />
            <input type={type} value={value} onChange={e => onChange(e.target.value)} className="premium-input !pl-12" placeholder={placeholder} required disabled={disabled} />
        </div>
        {hint && (
            <p className="text-[9px] text-slate-600 font-medium ml-1 mt-1 uppercase tracking-wider">
                {hint}
            </p>
        )}
    </div>
);
