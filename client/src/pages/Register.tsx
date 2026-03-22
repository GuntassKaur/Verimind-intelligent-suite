import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
    User, 
    Mail, 
    Lock, 
    ArrowRight, 
    Loader2, 
    Zap,
    Activity,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import api from '../services/api';
import { Logo } from '../components/Logo';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (pass: string) => {
        return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
    };

    const handleRegister = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePassword(password)) {
            setError('Neural key must be 8+ chars with uppercase and numeric nodes.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/api/auth/register', { name, email, password });
            if (data.success) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.error || 'Identity synthesis denied.');
            }
        } catch (err: unknown) {
             const axiosError = err as { response?: { data?: { error?: string } } };
             setError(axiosError.response?.data?.error || 'System interrupt in Auth module.');
        } finally {
            setLoading(false);
        }
    }, [name, email, password, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center py-20 px-6 bg-mesh relative">
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-200/20 blur-[150px] rounded-full animate-pulse" />
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full mx-auto relative z-10">
                <div className="modern-card p-14 bg-white border-none shadow-lux flex flex-col items-center">
                    <div className="text-center mb-14">
                        <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-100">
                            <Logo variant="icon" className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-4 leading-none">Identity Synthesis</h2>
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Establish Neural Credentials</p>
                    </div>

                    <form onSubmit={handleRegister} className="w-full space-y-8">
                         <div className="space-y-4">
                             <div className="relative group">
                                 <User className="absolute left-5 top-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                 <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder="Entity Real-Name" 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-400/50 transition-all placeholder:text-slate-300 shadow-sm"
                                    required
                                 />
                             </div>

                             <div className="relative group">
                                 <Mail className="absolute left-5 top-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                 <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="Neural Comm-Link (Email)" 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-400/50 transition-all placeholder:text-slate-300 shadow-sm"
                                    required
                                 />
                             </div>

                             <div className="relative group">
                                 <Lock className="absolute left-5 top-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                 <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Cryptographic Key (Password)" 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-400/50 transition-all placeholder:text-slate-300 shadow-sm"
                                    required
                                 />
                             </div>
                             
                             <div className="flex gap-2 mt-4 px-2">
                                 <div className={`h-1.5 flex-1 rounded-full ${password.length >= 8 ? 'bg-indigo-500' : 'bg-slate-100'}`} />
                                 <div className={`h-1.5 flex-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-indigo-500' : 'bg-slate-100'}`} />
                                 <div className={`h-1.5 flex-1 rounded-full ${/[0-9]/.test(password) ? 'bg-indigo-500' : 'bg-slate-100'}`} />
                             </div>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center italic mt-2">Requirement: 8+ chars, Uppercase, Numeric Nodes</p>
                         </div>

                         <AnimatePresence>
                             {error && (
                                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 shadow-lg shadow-rose-100/50">
                                     <XCircle size={20} className="text-rose-500 shrink-0" />
                                     <span className="text-[11px] font-black text-rose-500 uppercase tracking-widest italic">{error}</span>
                                 </motion.div>
                             )}
                             {success && (
                                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4 shadow-lg shadow-emerald-100/50">
                                     <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                                     <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest italic">Identity Synthesized. Redirecting...</span>
                                 </motion.div>
                             )}
                         </AnimatePresence>

                         <button 
                            type="submit" 
                            disabled={loading || success} 
                            className="w-full premium-btn-primary flex items-center justify-center gap-5 group py-6"
                         >
                             {loading ? <Loader2 className="animate-spin" size={20} /> : success ? <CheckCircle2 size={20} /> : <Zap size={20} className="group-hover:rotate-45" />}
                             <span className="uppercase tracking-[0.2em]">{loading ? 'Synthesizing...' : 'Establish Identity'}</span>
                             <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                         </button>

                         <div className="text-center mt-12">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                 Already in neural stream? <Link to="/login" className="text-indigo-600 hover:text-indigo-500 transition-colors ml-2 underline decoration-indigo-200">Recall Session</Link>
                             </p>
                         </div>
                    </form>

                    <div className="mt-16 pt-10 border-t border-slate-50 flex items-center justify-center gap-6 opacity-40">
                         <Activity size={16} className="text-indigo-400" />
                         <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Neural Protocol Established</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
