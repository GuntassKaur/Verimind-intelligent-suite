import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
    User, 
    Mail, 
    Lock, 
    ShieldCheck, 
    ArrowRight, 
    Loader2, 
    Zap,
    Activity,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import api from '../services/api';

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
        <div className="min-h-[80vh] flex items-center justify-center py-20">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full mx-auto">
                <div className="modern-card p-12 bg-black/40 border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                    
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck size={32} className="text-indigo-400" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-3">Identity Synthesis</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Establish Neural Credentials</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                         <div className="space-y-2">
                             <div className="relative group">
                                 <User className="absolute left-4 top-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                 <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder="Entity Real-Name" 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 text-xs font-black text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700" 
                                    required
                                 />
                             </div>
                         </div>

                         <div className="space-y-2">
                             <div className="relative group">
                                 <Mail className="absolute left-4 top-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                 <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="Neural Comm-Link (Email)" 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 text-xs font-black text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700" 
                                    required
                                 />
                             </div>
                         </div>

                         <div className="space-y-2">
                             <div className="relative group">
                                 <Lock className="absolute left-4 top-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                 <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Cryptographic Key (Password)" 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 text-xs font-black text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700" 
                                    required
                                 />
                             </div>
                             <div className="flex gap-2 mt-3 px-2">
                                 <div className={`h-1 flex-1 rounded-full ${password.length >= 8 ? 'bg-indigo-500' : 'bg-white/5'}`} />
                                 <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-indigo-500' : 'bg-white/5'}`} />
                                 <div className={`h-1 flex-1 rounded-full ${/[0-9]/.test(password) ? 'bg-indigo-500' : 'bg-white/5'}`} />
                             </div>
                             <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-center mt-2">Entropy Requirement: 8+ chars, Uppercase, Numeric Nodes</p>
                         </div>

                         <AnimatePresence>
                             {error && (
                                 <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3">
                                     <XCircle size={16} className="text-rose-400 shrink-0" />
                                     <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{error}</span>
                                 </motion.div>
                             )}
                             {success && (
                                 <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                                     <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Identity Synthesized. Redirecting...</span>
                                 </motion.div>
                             )}
                         </AnimatePresence>

                         <button 
                            type="submit" 
                            disabled={loading || success} 
                            className="w-full premium-btn-primary py-5 rounded-xl flex items-center justify-center gap-4 group transition-all"
                         >
                             {loading ? <Loader2 className="animate-spin" size={18} /> : success ? <CheckCircle2 size={18} /> : <Zap size={18} className="group-hover:rotate-45" />}
                             <span className="text-xs font-black uppercase tracking-[0.2em]">{loading ? 'Synthesizing...' : 'Establish Identity'}</span>
                             <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                         </button>

                         <div className="text-center mt-8">
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                 Already in neural stream? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors ml-2 underline decoration-indigo-500/30">Recall Session</Link>
                             </p>
                         </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-6 opacity-30">
                         <Activity size={14} className="text-indigo-500" />
                         <span className="text-[9px] font-black uppercase tracking-[0.3em]">Neural Protocol Established</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
