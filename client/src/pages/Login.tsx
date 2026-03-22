import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Mail, 
    Lock, 
    ArrowRight, 
    Loader2, 
    Zap,
    Activity,
    XCircle
} from 'lucide-react';
import api from '../services/api';
import { Logo } from '../components/Logo';

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
                localStorage.setItem('user', JSON.stringify(data.data?.user || data.user));
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
        <div className="min-h-screen flex items-center justify-center py-20 px-6 relative" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.05) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(168,85,247,0.05) 0%, transparent 60%), #F8FAFC' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/20 blur-[120px] rounded-full animate-pulse" />
                 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', damping: 25 }} className="max-w-md w-full mx-auto relative z-10">
                <div className="bg-white border border-slate-100/80 rounded-[2.5rem] p-8 md:p-14 shadow-[0_40px_80px_-20px_rgba(99,102,241,0.12)] flex flex-col items-center">
                    <div className="text-center mb-10 md:mb-14">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 border border-indigo-100 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-xl shadow-indigo-100">
                            <Logo variant="icon" className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4 leading-none">Welcome Back</h2>
                        <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.4em]">Sign in to your workspace</p>
                    </div>

                    <form onSubmit={handleLogin} className="w-full space-y-6">
                         <div className="relative group">
                             <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                             <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Email address" 
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-indigo-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.08)] transition-all placeholder:text-slate-300"
                                required
                             />
                         </div>

                         <div className="space-y-2">
                             <div className="relative group">
                                 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                 <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Password" 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-indigo-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.08)] transition-all placeholder:text-slate-300"
                                    required
                                 />
                             </div>
                             <div className="flex justify-end px-1">
                                  <Link to="/forgot-password" className="text-[11px] font-semibold text-slate-400 hover:text-indigo-600 transition-colors">Forgot password?</Link>
                             </div>
                         </div>

                         <AnimatePresence>
                             {error && (
                                 <motion.div initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                                     <XCircle size={18} className="text-rose-500 shrink-0" />
                                     <span className="text-[12px] font-semibold text-rose-600">{error}</span>
                                 </motion.div>
                             )}
                         </AnimatePresence>

                         <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
                         >
                             {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:scale-110 transition-transform" />}
                             <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                             {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                         </button>

                         <div className="text-center pt-2">
                             <p className="text-sm text-slate-400 font-medium">
                                 Don't have an account?{' '}
                                 <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-500 transition-colors">Create one →</Link>
                             </p>
                         </div>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-50 w-full flex items-center justify-center gap-3 opacity-50">
                         <Activity size={14} className="text-indigo-400" />
                         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Secured by VeriMind Protocol</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
