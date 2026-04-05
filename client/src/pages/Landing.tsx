import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Zap,
    Cpu,
    ArrowRight,
    Network,
    ShieldCheck,
    Bot,
    Globe,
    LayoutDashboard,
    Keyboard
} from 'lucide-react';

export default function Landing() {
    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const features = [
        { title: "Neural Forge", desc: "Advanced AI text generation with creative vs precise precision toggles.", icon: Zap, path: "/forge" },
        { title: "Truth Auditor", desc: "Cross-reference claims against 450M verifiable neural records instantly.", icon: ShieldCheck, path: "/audit" },
        { title: "Logic Stream", desc: "Real-time diagramming engine with live Markdown-to-Mermaid conversion.", icon: Network, path: "/visualizer" },
        { title: "Typing Accelerator", desc: "Measure the delta between thought and digital input in our speed lab.", icon: Keyboard, path: "/typing-lab" },
        { title: "Humanizer Prime", desc: "Sophisticated re-writing engine to ensure 99% human-readability scores.", icon: Bot, path: "/humanizer" },
        { title: "Global Intelligence", desc: "Multi-modal processing across 50+ languages with zero-latency edge.", icon: Globe, path: "/live-ai" }
    ];

    return (
        <div className="bg-[#0B0F19] text-[#F8FAFC] overflow-x-hidden -mt-24 pt-24 min-h-screen selection:bg-indigo-500/30">
            {/* Ambient Lighting */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-gradient-to-b from-indigo-600/15 via-purple-600/5 to-transparent blur-[150px] pointer-events-none -z-10 animate-pulse" />
            
            {/* HERO SECTION */}
            <header className="relative pt-28 pb-48 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                 <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
                    
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-10 hover:bg-indigo-500/20 transition-all cursor-pointer group">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300">Phase 4 Deployment Initialized</span>
                        <ArrowRight size={12} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter text-white leading-[0.9] mb-10 max-w-5xl mx-auto">
                        Intelligence.<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 drop-shadow-2xl">Re-Engineered.</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-16 italic">
                        "Bridging the cognitive gap between raw data and actionable human insight with an uncompromising neural suite."
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
                         <Link to="/dashboard" className="w-full sm:w-auto">
                             <button className="w-full sm:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center gap-4 text-base font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95">
                                 Enter Command Hub <LayoutDashboard size={20} />
                             </button>
                         </Link>
                         <Link to="/live-ai" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-4 text-base font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all active:scale-95 backdrop-blur-xl">
                                Protocol Demo
                            </button>
                         </Link>
                    </motion.div>
                 </motion.div>

                 {/* Interactive UI Element */}
                 <motion.div 
                    initial={{ opacity: 0, y: 100, rotateX: 20 }} 
                    animate={{ opacity: 1, y: 0, rotateX: 0 }} 
                    transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
                    className="w-full max-w-7xl mx-auto mt-32 relative px-6 [perspective:2000px]"
                 >
                     <div className="w-full aspect-[21/9] bg-[#0B0F19]/40 border border-white/10 rounded-[3rem] shadow-[0_0_100px_-20px_rgba(99,102,241,0.2)] backdrop-blur-3xl overflow-hidden relative group hover:border-indigo-500/20 transition-colors duration-1000">
                         <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
                         
                         {/* Window Chrome */}
                         <div className="h-16 border-b border-white/5 bg-white/5 flex items-center justify-between px-10">
                            <div className="flex gap-3">
                                <div className="w-3 h-3 rounded-full bg-rose-500/40" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                            </div>
                            <div className="px-6 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">
                                Verimind Dashboard // Node_Alpha_7
                            </div>
                            <div className="w-20" />
                         </div>

                         <div className="p-12 grid grid-cols-12 gap-10 h-full">
                            <div className="col-span-3 space-y-6 opacity-30 group-hover:opacity-60 transition-opacity duration-1000">
                                <div className="h-10 w-full bg-white/5 rounded-xl border border-white/10" />
                                <div className="h-10 w-4/5 bg-white/5 rounded-xl border border-white/10" />
                                <div className="h-10 w-full bg-indigo-500/20 rounded-xl border border-indigo-500/20" />
                                <div className="h-40 w-full bg-white/5 rounded-2xl border border-white/10" />
                            </div>
                            <div className="col-span-9 space-y-10">
                                <div className="h-48 w-full bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-white/10 p-10 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="h-6 w-32 bg-white/10 rounded-full" />
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/20 shadow-2xl" />
                                    </div>
                                    <div className="h-10 w-2/3 bg-white/5 rounded-xl" />
                                </div>
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="h-32 bg-white/5 rounded-3xl border border-white/10" />
                                    <div className="h-32 bg-white/5 rounded-3xl border border-white/10" />
                                    <div className="h-32 bg-white/5 rounded-3xl border border-white/10" />
                                </div>
                            </div>
                         </div>
                     </div>
                 </motion.div>
            </header>

            {/* INTEGRATED SUITE SECTION */}
            <section id="features" className="py-20 px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">Intelligence <br/><span className="text-indigo-500">Suite.</span></h2>
                            <p className="text-slate-500 text-lg max-w-xl font-medium">A modular ecosystem designed for the next generation of digital professionals.</p>
                        </div>
                        <div className="hidden lg:block w-px h-32 bg-white/10 mx-10" />
                        <div className="flex items-center gap-8 bg-white/[0.02] p-8 rounded-[3rem] border border-white/5">
                            <div className="text-center">
                                <div className="text-4xl font-black text-white tracking-tighter">99.9%</div>
                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Uptime SLA</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-black text-white tracking-tighter">50M+</div>
                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Tokens/Sec</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <Link key={i} to={f.path}>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all group flex flex-col h-full relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-700" />
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 border border-white/10 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                        <f.icon size={28} className="text-indigo-400 group-hover:text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{f.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium text-sm mb-12 flex-1">{f.desc}</p>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 group-hover:gap-4 transition-all">
                                        Launch Module <ArrowRight size={12} />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEURAL TRUST SECTION */}
            <section className="py-40 px-8 border-t border-white/5 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
                    <div className="flex-1 space-y-10 text-center lg:text-left">
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">Engineering Trust <br/><span className="text-cyan-400">by Design.</span></h2>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Truth Audit™ uses high-dimensional vector space analysis to verify claims against the world's most reliable knowledge graphs. No hallucinations, just forensic precision.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            {['Zero-Hallucination', 'HIPAA Compliant', 'Bank-SaaS Encryption'].map((tag, i) => (
                                <span key={i} className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 w-full lg:w-auto">
                        <div className="p-10 rounded-[4rem] bg-gradient-to-br from-indigo-600/20 to-transparent border border-indigo-500/20 relative shadow-2xl">
                             <div className="grid grid-cols-2 gap-6">
                                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5">
                                    <div className="text-3xl font-black text-white mb-2">99.2%</div>
                                    <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Truth Score</div>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5">
                                    <div className="text-3xl font-black text-white mb-2">0.03s</div>
                                    <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Verification</div>
                                </div>
                                <div className="col-span-2 p-8 rounded-[2.5rem] bg-white/5 border border-white/5 flex items-center justify-between">
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-white/20 rounded" />
                                        <div className="h-6 w-48 bg-white/10 rounded" />
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                                        <ShieldCheck size={24} className="text-emerald-400" />
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-40 px-8 border-t border-white/5">
                <div className="max-w-5xl mx-auto text-center relative z-10 bg-gradient-to-br from-indigo-600/10 via-white/5 to-transparent p-20 lg:p-32 rounded-[5rem] border border-white/10 shadow-[0_0_100px_-20px_rgba(99,102,241,0.2)] group overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-10 leading-tight">Forge Your <br className="md:hidden"/> Future Now.</h2>
                    <p className="text-xl text-slate-500 mb-16 max-w-xl mx-auto font-medium">Join the elite stratum of developers and analysts using Verimind to overclock their output.</p>
                    <Link to="/dashboard" className="inline-flex items-center justify-center gap-4 px-12 py-5 bg-white text-slate-930 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-110 active:scale-95 transition-all text-slate-900">
                        Initialize Matrix <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer Minimal */}
            <footer className="py-20 px-8 border-t border-white/5 text-center">
                 <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Cpu size={16} className="text-white" />
                    </div>
                    <span className="text-lg font-black tracking-tighter text-white">Verimind Suite</span>
                 </div>
                 <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 Guntass Kaur Research • All Rights Reserved</p>
            </footer>
        </div>
    );
}
