import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Mail, 
    Lock, 
    ShieldCheck, 
    ArrowRight, 
    Loader2, 
    Zap,
    Activity,
    XCircle
} from 'lucide-react';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.dispatchEvent(new Event('storage'));
                navigate('/');
            } else {
                setError(data.error || 'Identity recall failed.');
            }
        } catch (err: unknown) {
             const axiosError = err as { response?: { data?: { error?: string } } };
             setError(axiosError.response?.data?.error || 'System interrupt in Auth module.');
        } finally {
            setLoading(false);
        }
    }, [email, password, navigate]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full mx-auto">
                <div className="modern-card p-12 bg-black/40 border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                    
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck size={32} className="text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-3">Recall Session</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Establish Secure Link</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                         <div className="space-y-2">
                             <div className="relative group">
                                 <Mail className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                 <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="Neural Comm-Link (Email)" 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 text-xs font-black text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700" 
                                    required
                                 />
                             </div>
                         </div>

                         <div className="space-y-2">
                             <div className="relative group">
                                 <Lock className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                 <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Cryptographic Key (Password)" 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 text-xs font-black text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700" 
                                    required
                                 />
                             </div>
                             <div className="flex justify-end px-2">
                                  <Link to="/forgot-password" className="text-[9px] font-black text-slate-600 hover:text-blue-400 uppercase tracking-widest transition-colors">Key Recovery?</Link>
                             </div>
                         </div>

                         <AnimatePresence>
                             {error && (
                                 <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3">
                                     <XCircle size={16} className="text-rose-400" />
                                     <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{error}</span>
                                 </motion.div>
                             )}
                         </AnimatePresence>

                         <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full premium-btn-primary bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 py-5 rounded-xl flex items-center justify-center gap-4 group transition-all"
                         >
                             {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:rotate-45" />}
                             <span className="text-xs font-black uppercase tracking-[0.2em]">{loading ? 'Recalling...' : 'Initiate Session'}</span>
                             <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                         </button>

                         <div className="text-center mt-8">
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                 New entity in stream? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors ml-2 underline decoration-indigo-500/30">Synthesize Identity</Link>
                             </p>
                         </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-6 opacity-30">
                         <Activity size={14} className="text-blue-500" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Protocol Established</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
