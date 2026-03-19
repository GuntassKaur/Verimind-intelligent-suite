import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, ShieldAlert, Loader2, Key, ArrowRight, X, RefreshCw } from 'lucide-react';
import { Logo } from './Logo';
import api from '../services/api';
import axios from 'axios';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

type LoginStep = 'email' | 'otp';

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
    const [step, setStep] = useState<LoginStep>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await api.post('/api/auth/send-otp', { email });
            if (data.success) {
                setSuccess('Security code sent to your email.');
                setStep('otp');
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Failed to send security code.');
            } else {
                setError('An unexpected communication error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/api/auth/verify-otp', { email, otp });
            if (data.success) {
                if (data.user?.name) localStorage.setItem('user_name', data.user.name);
                setSuccess('Identity verified!');
                setTimeout(() => {
                    onSuccess?.();
                    onClose();
                    window.location.reload(); // Simple refresh to update global state
                }, 1000);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Invalid or expired security code.');
            } else {
                setError('Verification failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="max-w-md w-full glass-card p-10 bg-[#0d1117] border-white/10 relative shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                                <Logo variant="icon" className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight mb-2 uppercase">
                                {step === 'email' ? 'Identification' : 'Verify Code'}
                            </h2>
                            <p className="text-slate-500 font-medium text-xs">
                                {step === 'email'
                                    ? 'Access the full VeriMind suite with a one-time code.'
                                    : `Enter the code sent to ${email}`}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 'email' ? (
                                <motion.form
                                    key="email"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    onSubmit={handleRequestOTP}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
                                        <div className="relative flex items-center">
                                            <Mail className="absolute left-4 text-slate-500" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="premium-input !pl-12 !py-4"
                                                placeholder="user@example.com"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        disabled={loading}
                                        className="premium-btn-primary w-full py-5 flex items-center justify-center gap-3"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><RefreshCw size={20} /><span className="uppercase tracking-widest font-black text-xs">Send OTP CODE</span><ArrowRight size={18} /></>}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="otp"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    onSubmit={handleVerifyOTP}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Enter Code</label>
                                        <div className="relative flex items-center">
                                            <Key className="absolute left-4 text-slate-500" size={18} />
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                className="premium-input !pl-12 tracking-[1em] text-center font-black text-lg"
                                                placeholder="000000"
                                                maxLength={6}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        disabled={loading}
                                        className="premium-btn-primary w-full py-5 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-600/20"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><ShieldCheck size={20} /><span className="uppercase tracking-widest font-black text-xs">Verify & Continue</span></>}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep('email')}
                                        className="w-full text-[10px] text-slate-500 font-black uppercase tracking-widest hover:text-indigo-400 transition-colors"
                                    >
                                        Change Email
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {(error || success) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-8 p-4 border rounded-2xl flex items-center gap-3 text-[11px] font-black uppercase ${error ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}
                            >
                                {error ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                                {error || success}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
