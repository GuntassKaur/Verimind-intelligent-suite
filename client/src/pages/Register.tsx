import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck, ShieldAlert, Loader2, Key, User, Zap } from 'lucide-react';
import { Logo } from '../components/Logo';
import api from '../services/api';

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
        setError(''); setSuccess('');

        if (password !== confirmPassword) {
            setError('Security keys do not match.');
            return;
        }

        const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!pwdRegex.test(password)) {
            setError('Entropy insufficient: Use uppercase, number, and special character.');
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/api/auth/register', { email, password, name });
            if (data.success) {
                if (data.user?.name) localStorage.setItem('user_name', data.user.name);
                setSuccess('Node Allocated. Redirecting to core...');
                setTimeout(() => navigate('/'), 1200);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failure.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0B0F1A] relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                 <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[180px] animate-pulse" />
                 <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
                 <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full relative z-10">
                <div className="text-center mb-10">
                     <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                          <Logo variant="icon" className="w-8 h-8 text-indigo-500" />
                     </div>
                     <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">Node Allocation</h1>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Register Universal Identity</p>
                </div>

                <div className="modern-card p-10 bg-white/[0.02] border-white/5 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                    <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleRegister} className="space-y-6">
                        <InputField label="Identity Name" icon={User} type="text" value={name} onChange={setName} disabled={loading} placeholder="John Doe" />
                        <InputField label="Communication Node" icon={Mail} type="email" value={email} onChange={setEmail} disabled={loading} placeholder="neural@verimind.ai" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField 
                                label="Security Key" 
                                icon={Key} 
                                type="password" 
                                value={password} 
                                onChange={setPassword} 
                                disabled={loading} 
                                placeholder="••••••••" 
                            />
                            <InputField 
                                label="Confirm Key" 
                                icon={Key} 
                                type="password" 
                                value={confirmPassword} 
                                onChange={setConfirmPassword} 
                                disabled={loading} 
                                placeholder="••••••••" 
                            />
                        </div>

                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest pl-1">
                             <Zap size={10} className="inline mr-2 text-indigo-500" /> Requirement: 8+ Chars | Upper | Number | Symbol
                        </p>

                        <button disabled={loading} className="premium-btn-primary w-full py-5 flex items-center justify-center gap-4 text-xs tracking-widest hover:scale-[1.02] transition-all bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-600/30">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><span>Initialize Node</span><ShieldCheck size={18} /></>}
                        </button>
                        
                        <div className="text-center mt-6">
                            <Link to="/login" className="text-[9px] text-slate-500 font-black uppercase tracking-widest hover:text-indigo-400 transition-colors">Existing Identity Detected? Login</Link>
                        </div>
                    </motion.form>

                    {error && <div className="mt-8 p-5 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-400 text-[10px] font-black uppercase tracking-widest"><ShieldAlert size={18} />{error}</div>}
                    {success && <div className="mt-8 p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400 text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={18} />{success}</div>}
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
}

const InputField = ({ label, icon: Icon, type, value, onChange, disabled, placeholder }: InputProps) => (
    <div className="space-y-3">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative flex items-center group">
            <div className="absolute left-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                <Icon size={18} />
            </div>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-[13px] font-medium text-white focus:outline-none focus:border-indigo-500/30 focus:bg-white/[0.05] transition-all placeholder:text-slate-700" placeholder={placeholder} required disabled={disabled} />
        </div>
    </div>
);
