import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, ShieldAlert, Loader2, Key, ArrowRight, Zap, Info } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';

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
                    navigate('/');
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
                setSuccess('Access Granted. Redirecting...');
                setTimeout(() => navigate('/'), 1200);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Authentication Failed.');
        } finally { setLoading(false); }
    };

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess('');
        try {
            const { data } = await api.post('/api/auth/otp/request', { email });
            if (data.success) {
                setSuccess('Security code transmitted.');
                setFlow('forgot_verify');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Transmission failure.');
        } finally { setLoading(false); }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess('');
        const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!pwdRegex.test(newPassword)) {
            setError('Entropy insufficient: Use uppercase, number, and special character.');
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post('/api/auth/otp/verify', { email, otp, password: newPassword });
            if (data.success) {
                setSuccess('Security protocol updated.');
                setTimeout(() => setFlow('password'), 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Node verification failed.');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0B0F1A] relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                 <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[180px] animate-pulse" />
                 <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
                 <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full relative z-10">
                <div className="text-center mb-12">
                     <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                          <Logo variant="icon" className="w-8 h-8 text-indigo-500" />
                     </div>
                     <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">Session Initialize</h1>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">VeriMind Intelligence Protocol</p>
                </div>

                <div className="modern-card p-10 bg-white/[0.02] border-white/5 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                    <AnimatePresence mode="wait">
                        {flow === 'password' && (
                            <motion.form key="password" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handlePasswordLogin} className="space-y-8">
                                <InputField label="Authentication Node" icon={Mail} type="email" value={email} onChange={setEmail} disabled={loading} placeholder="neural@verimind.ai" />
                                <InputField label="Security Key" icon={Key} type="password" value={password} onChange={setPassword} disabled={loading} placeholder="••••••••" />
                                
                                <button disabled={loading} className="premium-btn-primary w-full py-5 flex items-center justify-center gap-4 text-xs tracking-widest hover:scale-[1.02] transition-all">
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><span>Authorize</span><ArrowRight size={18} /></>}
                                </button>
                                
                                <div className="flex flex-col gap-4 text-center mt-6">
                                    <button type="button" onClick={() => setFlow('forgot_request')} className="text-[9px] text-slate-500 font-black uppercase tracking-widest hover:text-indigo-400">Forgot Security Key?</button>
                                    <div className="h-px bg-white/5 w-full" />
                                    <Link to="/register" className="text-[9px] text-slate-500 font-black uppercase tracking-widest hover:text-indigo-400">Request Node Access / Register</Link>
                                </div>
                            </motion.form>
                        )}

                        {flow === 'forgot_request' && (
                            <motion.form key="otp_request" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleRequestOTP} className="space-y-8">
                                <InputField label="Registered Node" icon={Mail} type="email" value={email} onChange={setEmail} disabled={loading} placeholder="neural@verimind.ai" />
                                <button disabled={loading} className="premium-btn-primary w-full py-5 flex items-center justify-center gap-4 text-xs tracking-widest">
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><span>Transmit Security Code</span><Zap size={18} /></>}
                                </button>
                                <button type="button" onClick={() => setFlow('password')} className="w-full text-[9px] text-slate-500 font-black uppercase tracking-widest hover:text-indigo-400">Back to Standard Login</button>
                            </motion.form>
                        )}

                        {flow === 'forgot_verify' && (
                            <motion.form key="otp_verify" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onSubmit={handleVerifyOTP} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Pin Verification</label>
                                    <div className="relative flex items-center">
                                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 text-center font-black text-2xl tracking-[0.8em] text-white focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-slate-800" placeholder="000000" maxLength={6} required disabled={loading} />
                                    </div>
                                </div>
                                <InputField 
                                    label="Reset Security Key" 
                                    icon={Key} 
                                    type="password" 
                                    value={newPassword} 
                                    onChange={setNewPassword} 
                                    disabled={loading} 
                                    placeholder="••••••••" 
                                    hint="Min. 8 chars | Upper | Symbol"
                                />
                                <button disabled={loading} className="premium-btn-primary w-full py-5 flex items-center justify-center gap-4 text-xs tracking-widest bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20">
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><span>Apply Security Update</span><ShieldCheck size={18} /></>}
                                </button>
                                <button type="button" onClick={() => setFlow('password')} className="w-full text-[9px] text-slate-500 font-black uppercase tracking-widest hover:text-indigo-400 text-center">Abort Recovery</button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {error && <div className="mt-10 p-5 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-400 text-[10px] font-black uppercase tracking-widest"><ShieldAlert size={18} />{error}</div>}
                    {success && <div className="mt-10 p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400 text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={18} />{success}</div>}
                </div>
                
                <div className="mt-12 text-center opacity-20 hover:opacity-100 transition-opacity">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em]">VeriMind Quantum Cryptography Lab</p>
                </div>
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
    <div className="space-y-3">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative flex items-center group">
            <div className="absolute left-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                <Icon size={18} />
            </div>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-[13px] font-medium text-white focus:outline-none focus:border-indigo-500/30 focus:bg-white/[0.05] transition-all placeholder:text-slate-700" placeholder={placeholder} required disabled={disabled} />
        </div>
        {hint && (
            <p className="text-[9px] text-slate-600 font-black ml-1 mt-2 uppercase tracking-widest">
                <Info size={10} className="inline mr-2 opacity-50" /> {hint}
            </p>
        )}
    </div>
);
