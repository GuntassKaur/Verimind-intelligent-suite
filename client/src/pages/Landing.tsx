import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    ArrowRight,
    ShieldCheck,
    Sparkles,
    CheckCircle,
    Zap,
    Brain,
    Lock,
    Globe,
    Cpu
} from 'lucide-react';

export default function Landing() {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1, 
            y: 0, 
            transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
        })
    };

    return (
        <div className="relative min-h-screen bg-transparent overflow-x-hidden selection:bg-purple-500/30">
            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 px-6">
                 {/* Hero Mesh Gradient Overlay */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-purple-600/10 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
                 
                 <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div 
                        custom={0} initial="hidden" animate="visible" variants={fadeUp}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 mb-10 backdrop-blur-md"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                        <span className="text-[10px] font-black text-purple-300 uppercase tracking-[0.4em]">Integrated Intelligence Suite v2.0</span>
                    </motion.div>

                    <motion.h1 
                        custom={1} initial="hidden" animate="visible" variants={fadeUp}
                        className="text-7xl md:text-[120px] font-black tracking-tighter mb-10 leading-[0.85] text-white"
                    >
                        Elevate <br />
                        Your <span className="text-gradient">Academics.</span>
                    </motion.h1>

                    <motion.p 
                        custom={2} initial="hidden" animate="visible" variants={fadeUp}
                        className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-400 font-medium mb-16 leading-relaxed"
                    >
                        Verimind is the neural operating system for modern students. 
                        Humanize AI responses, verify records, and master productivity in a high-fidelity workspace.
                    </motion.p>

                    <motion.div 
                        custom={3} initial="hidden" animate="visible" variants={fadeUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-8"
                    >
                         <Link to="/write" className="w-full sm:w-auto">
                             <button className="btn-primary w-full sm:w-auto px-16 py-6 text-sm uppercase tracking-widest hover:shadow-[0_0_40px_rgba(147,51,234,0.4)]">
                                 Sync Workspace <ArrowRight size={18} />
                             </button>
                         </Link>
                         <div className="flex items-center gap-8 text-slate-500 text-[11px] font-black uppercase tracking-[0.3em]">
                             <span className="flex items-center gap-2.5 transition-colors hover:text-purple-400"><Lock size={16} className="text-purple-500" /> AES-256</span>
                             <span className="flex items-center gap-2.5 transition-colors hover:text-indigo-400"><Globe size={16} className="text-indigo-500" /> Zero Logs</span>
                         </div>
                    </motion.div>
                 </div>
            </section>

            {/* Neural Matrix Preview */}
            <section className="py-32 px-6 relative">
                 <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                    {[
                        { 
                            title: "Smart Writing", 
                            label: "Neural Forge",
                            desc: "Refine tone, fix complex syntax, and summarize research papers with enterprise-grade models optimized for student needs.", 
                            icon: Zap, 
                            color: "text-amber-400", 
                            path: "/write" 
                        },
                        { 
                            title: "AI Humanizer", 
                            label: "Natural Synthesis",
                            desc: "Convert robotic AI footprints into authentic human prose. Advanced neural reweaving allows you to bypass detection with 99% accuracy.", 
                            icon: Brain, 
                            color: "text-purple-400", 
                            path: "/humanize" 
                        },
                        { 
                            title: "Truth Checker", 
                            label: "Audit Engine",
                            desc: "Scan across 40T+ academic records for plagiarism. Verify facts and assess information reliability with real-time neural auditing.", 
                            icon: ShieldCheck, 
                            color: "text-emerald-400", 
                            path: "/check" 
                        }
                    ].map((feature, i) => (
                        <Link key={i} to={feature.path}>
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="glass-card p-12 group h-full hover:border-purple-500/40 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -z-10 group-hover:bg-purple-500/10 transition-colors" />
                                
                                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 border border-white/5 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 ${feature.color}`}>
                                    <feature.icon size={32} className="transition-transform group-hover:scale-110" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 block">{feature.label}</span>
                                <h3 className="text-3xl font-black mb-6 tracking-tight group-hover:text-purple-400 transition-colors">{feature.title}</h3>
                                <p className="text-slate-400 text-base leading-relaxed font-medium mb-8">{feature.desc}</p>
                                
                                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-purple-400/0 group-hover:text-purple-400 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                    Initialize Module <ArrowRight size={14} />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                 </div>
            </section>

            {/* Trust / Network Stats */}
            <section className="py-24 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
                     {[
                         { val: "1.2M+", label: "Tasks Cleared", icon: CheckCircle },
                         { val: "240k+", label: "Neural Tokens/sec", icon: Cpu },
                         { val: "99.9%", label: "Accuracy Index", icon: Zap },
                         { val: "100%", label: "Zero Knowledge", icon: Lock }
                     ].map((s, i) => (
                         <div key={i} className="text-center group">
                             <div className="flex justify-center mb-6"><s.icon size={24} className="text-purple-500/30 group-hover:text-purple-500 transition-colors" /></div>
                             <div className="text-4xl font-black text-white mb-2">{s.val}</div>
                             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">{s.label}</div>
                         </div>
                     ))}
                </div>
            </section>

            {/* Large Feature / Showcase */}
            <section className="py-40 px-6">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2 space-y-8">
                        <span className="text-purple-500 font-black uppercase text-xs tracking-[0.5em]">The Philosophy</span>
                        <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">Academic Integrity meets <span className="text-gradient">Neural Power.</span></h2>
                        <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                            We don't just generate text; we help you refine your logic. Verimind is built on the principle that AI should be a tool for enhancement, not just replacement. Our goal is to empower students through technology while maintaining the highest standards of academic honesty.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link to="/register" className="btn-primary">Get Access</Link>
                            <Link to="/about" className="px-8 py-4 border border-white/10 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-colors">Learn More</Link>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full">
                        <div className="glass-card p-4 bg-gradient-to-br from-purple-600/10 to-transparent border-purple-500/20 group">
                            <div className="rounded-xl overflow-hidden bg-black/40 border border-white/5 h-80 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
                                <div className="p-10 text-center relative z-10">
                                    <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-purple-500/30">
                                        <Sparkles size={40} className="text-purple-400" />
                                    </div>
                                    <h4 className="text-2xl font-black text-white">Neural Interface v4</h4>
                                    <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest">Live Preview Enabled</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Layer */}
            <footer className="py-24 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-black text-lg">V</div>
                            <span className="text-lg font-black tracking-widest uppercase">Verimind</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] max-w-xs leading-loose">
                            The definitive neural productivity suite for the next generation of academic pioneers.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-12">
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Modules</h5>
                            <div className="flex flex-col gap-3">
                                <Link to="/write" className="text-slate-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">Writing Forge</Link>
                                <Link to="/humanize" className="text-slate-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">Humanizer</Link>
                                <Link to="/check" className="text-slate-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">Truth Audit</Link>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Protocol</h5>
                            <div className="flex flex-col gap-3">
                                <span className="text-slate-500 cursor-default text-xs font-bold uppercase tracking-widest">Privacy Policy</span>
                                <span className="text-slate-500 cursor-default text-xs font-bold uppercase tracking-widest">Terms of Sync</span>
                                <span className="text-slate-500 cursor-default text-xs font-bold uppercase tracking-widest">API Status</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 text-center">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.6em]">© 2026 Verimind Neural Suite • Secure Node Cluster 42</p>
                </div>
            </footer>
        </div>
    );
}
