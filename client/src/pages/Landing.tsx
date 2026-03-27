import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    MessageSquare,
    Zap,
    Cpu,
    ArrowRight
} from 'lucide-react';
import { Logo } from '../components/Logo';
import FloatingParticles from '../components/FloatingParticles';

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-300 overflow-x-hidden selection:bg-indigo-500/30 font-sans relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-50">
                <FloatingParticles count={50} />
            </div>

            {/* PREMIUM NAVIGATION */}
            <nav className="fixed top-0 w-full z-50 px-4 md:px-10 py-6 md:py-10 flex items-center justify-between pointer-events-none">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-4 pointer-events-auto cursor-pointer group">
                    <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] group-hover:scale-110 transition-transform">
                        <Logo variant="icon" className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white leading-none">VeriMind</span>
                </motion.div>
                
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-6 pointer-events-auto">
                    <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors px-4">Login</Link>
                    <Link to="/register" className="premium-btn-primary px-8 py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-2xl shadow-indigo-500/10">Join Verimind</Link>
                </motion.div>
            </nav>

            {/* HERO SECTION - CENTER FOCUS */}
            <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600/5 blur-[180px] -z-10 rounded-full" />
                 
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-12">
                        Simple. Powerful.<br />
                        <span className="text-gradient">Intelligent AI.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-400 font-medium leading-relaxed mb-20">
                        Experience a purpose-driven AI platform designed for clarity. 
                        No clutter, just results.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                         <Link to="/live-ai" className="premium-btn-primary w-full md:w-auto px-20 py-8 rounded-[3rem] flex items-center justify-center gap-6 text-[14px] uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30 group transition-all hover:scale-105 active:scale-95">
                             <div className="relative">
                                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30" />
                                  <div className="relative w-3 h-3 bg-white rounded-full" />
                             </div>
                             <span>Start Live AI</span>
                         </Link>
                         <Link to="/chat" className="bg-white/5 border border-white/10 w-full md:w-auto px-20 py-8 rounded-[3rem] flex items-center justify-center gap-6 text-[14px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all shadow-2xl group active:scale-95">
                              <MessageSquare size={22} className="text-indigo-400" />
                              <span>View Chat History</span>
                         </Link>
                    </div>

                    <div className="mt-24 pt-12 border-t border-white/5 grid grid-cols-3 gap-10 opacity-40">
                         <div className="text-center">
                              <h3 className="text-2xl font-black text-white">99.9%</h3>
                              <p className="text-[9px] font-black uppercase tracking-widest">Accuracy</p>
                         </div>
                         <div className="text-center">
                              <h3 className="text-2xl font-black text-white">14ms</h3>
                              <p className="text-[9px] font-black uppercase tracking-widest">Latency</p>
                         </div>
                         <div className="text-center">
                              <h3 className="text-2xl font-black text-white">10M+</h3>
                              <p className="text-[9px] font-black uppercase tracking-widest">Queries</p>
                         </div>
                    </div>
                 </motion.div>
            </header>

            {/* FEATURES SECTION */}
            <section className="py-40 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Live Intelligence", desc: "Real-time JARVIS-style voice and text interaction.", icon: Zap },
                            { title: "Smart Chat", desc: "Structured conversation history with deep memory.", icon: MessageSquare },
                            { title: "Analytics", desc: "Monitor your AI usage and performance metrics.", icon: Cpu }
                        ].map((f, i) => (
                            <div key={i} className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-white/[0.04] transition-all group">
                                <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-indigo-600 transition-colors">
                                    <f.icon size={24} className="text-indigo-400 group-hover:text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4">{f.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium mb-8">{f.desc}</p>
                                <ArrowRight size={20} className="text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-2 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-20 border-t border-white/5 text-center">
                <div className="max-w-4xl mx-auto px-10">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-10">
                        <Logo variant="icon" className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.5em]">© 2026 VERIMIND INTELLIGENT SUITE. ALL NEURAL RIGHTS RESERVED.</p>
                </div>
            </footer>
        </div>
    );
}
