import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    ShieldCheck, 
    Zap,
    ArrowRight,
    Cpu,
    PenTool,
    Globe
} from 'lucide-react';
import { Logo } from '../components/Logo';
import FloatingParticles from '../components/FloatingParticles';

export default function Landing() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

    const features = [
        { 
            title: "Truth Audit", 
            desc: "Advanced neural verification for hallucination detection and claim credibility at atomic scale.", 
            icon: ShieldCheck, 
            color: "indigo" 
        },
        { 
            title: "Multi-AI Synapse", 
            desc: "Compare outputs from GPT-4, Claude 3.5, and Gemini side-by-side to eliminate bias.", 
            icon: Zap, 
            color: "amber" 
        },
        { 
            title: "Writing DNA", 
            desc: "Forensic linguistic analysis to detect AI vs Human authorship with high-precision scoring.", 
            icon: PenTool, 
            color: "emerald" 
        }
    ];

    return (
        <div className="min-h-screen bg-[#05070a] text-slate-300 overflow-x-hidden selection:bg-indigo-500/30 font-sans relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-50">
                <FloatingParticles count={50} />
            </div>
            {/* ═══════════════════════════════════════════════
               PREMIUM NAVIGATION
               ═══════════════════════════════════════════════ */}
            <nav className="fixed top-0 w-full z-50 px-4 md:px-10 py-6 md:py-10 flex items-center justify-between pointer-events-none">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-4 pointer-events-auto cursor-pointer group">
                    <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] group-hover:scale-110 transition-transform">
                        <Logo variant="icon" className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white leading-none">VeriMind</span>
                </motion.div>
                
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-10 bg-white/5 backdrop-blur-3xl px-12 py-4 rounded-full border border-white/5 shadow-2xl pointer-events-auto">
                    {['Intelligence', 'Protocols', 'Enterprise', 'Vault'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-indigo-400 transition-colors">{item}</a>
                    ))}
                </motion.div>

                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-6 pointer-events-auto">
                    <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors px-6">Login</Link>
                    <Link to="/register" className="premium-btn-primary px-8 py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-2xl shadow-indigo-500/10">Establish Identity</Link>
                </motion.div>
            </nav>

            {/* ═══════════════════════════════════════════════
               HERO SECTION
               ═══════════════════════════════════════════════ */}
            <header className="relative pt-40 md:pt-60 pb-20 md:pb-40 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                 {/* Neural Grid Background */}
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[120vh] bg-indigo-600/10 blur-[180px] -z-10 rounded-full" />
                 
                 <motion.div style={{ opacity, scale }} className="relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-3 rounded-full mb-12 shadow-2xl"
                    >
                         <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Neural Intelligence Manifest v6.0.4</span>
                    </motion.div>

                    <h1 className="text-[12vw] md:text-[9vw] lg:text-[7.5vw] font-black text-white tracking-tighter leading-[0.85] mb-12">
                        Produce <span className="text-gradient">Power</span>.<br />
                        Audit <span className="text-gradient">Reality</span>.
                    </h1>

                    <p className="max-w-xl md:max-w-3xl mx-auto text-xl md:text-2xl text-slate-400 font-medium leading-relaxed mb-16 px-4">
                        The world’s most advanced AI Content Intelligence Platform for forensic research, 
                        structural synthesis, and multi-neural truth verification.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10">
                         <Link to="/workspace" className="premium-btn-primary w-full sm:w-auto px-16 py-7 rounded-[2.5rem] flex items-center justify-center gap-6 text-[13px] uppercase tracking-[0.25em] shadow-2xl shadow-indigo-600/20">
                             <Zap size={20} />
                             <span>Initialize Neural Suite</span>
                             <ArrowRight size={18} />
                         </Link>
                         <button className="w-full sm:w-auto px-12 py-7 rounded-[2.5rem] border border-white/5 bg-white/5 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all text-[11px] flex items-center justify-center gap-4 backdrop-blur-3xl shadow-2xl">
                              <ShieldCheck size={20} className="text-indigo-400" />
                              Inspect Neural Protocols
                         </button>
                    </div>

                    <div className="mt-32 flex flex-wrap justify-center items-center gap-20 opacity-20 pointer-events-none">
                         <div className="flex items-center gap-4 font-black tracking-tighter text-2xl"><Globe size={20} /> GLOBAL CLUSTER</div>
                         <div className="flex items-center gap-4 font-black tracking-tighter text-2xl"><Cpu size={20} /> NEURAL CORE</div>
                         <div className="flex items-center gap-4 font-black tracking-tighter text-2xl"><ShieldCheck size={20} /> TRUTH SCAN</div>
                    </div>
                 </motion.div>
            </header>

            {/* ═══════════════════════════════════════════════
               FEATURES SECTION
               ═══════════════════════════════════════════════ */}
            <section className="py-20 md:py-60 px-6 md:px-10 relative">
                 <div className="max-w-7xl mx-auto">
                      <div className="text-center mb-40">
                           <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight">The Cognitive <span className="text-gradient">Prism</span>.</h2>
                           <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed italic">"One unified intelligence suite for the entire content lifecycle—from deep synthesis to forensic truth interrogation."</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                           {features.map((f, i) => (
                               <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.15 }}
                                    viewport={{ once: true }}
                                    className={`p-10 md:p-16 border rounded-[3.5rem] relative overflow-hidden group transition-all duration-700 bg-white/[0.03] border-white/5 hover:bg-white/[0.05] hover:border-white/10`}
                               >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
                                    
                                    <div className={`w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center mb-10 group-hover:bg-indigo-600 transition-colors`}>
                                         <f.icon size={30} className="text-indigo-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-6">{f.title}</h4>
                                    <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed mb-10">{f.desc}</p>
                                    <Link to="/workspace" className={`flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:gap-6 transition-all`}>
                                         Deploy Module <ArrowRight size={16} />
                                    </Link>
                               </motion.div>
                           ))}
                      </div>
                 </div>
            </section>

            {/* ═══════════════════════════════════════════════
               EXECUTIVE STATS
               ═══════════════════════════════════════════════ */}
            <section className="py-20 md:py-40 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {[
                        { val: '2B+', label: 'Claims Audited' },
                        { val: '99.9%', label: 'Neural Uptime' },
                        { val: '14ms', label: 'Latency Burst' },
                        { val: 'Top 1%', label: 'Forensic Bench' }
                    ].map((s, i) => (
                        <div key={i}>
                            <h5 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">{s.val}</h5>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
               TRUST FOOTER
               ═══════════════════════════════════════════════ */}
            <footer className="py-40 bg-black overflow-hidden relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150vh] bg-indigo-600/5 blur-[200px] -z-10 rounded-full" />
                 
                 <div className="max-w-7xl mx-auto px-10 text-center">
                      <div className="flex flex-col items-center gap-12 mb-40">
                           <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(79,70,229,0.5)]">
                                <Logo variant="icon" className="w-12 h-12 text-white" />
                           </div>
                           <h3 className="text-4xl md:text-7xl font-black text-white tracking-tighter">Enter the <span className="text-indigo-500">Intelligence</span> Flow.</h3>
                           <Link to="/register" className="premium-btn-primary px-20 py-8 rounded-[3rem] text-sm shadow-2xl shadow-indigo-600/20">Synthesize Identity</Link>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-20 py-20 border-t border-white/5 text-left">
                           <div className="col-span-1">
                                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-700 mb-10 block">Workspace</span>
                                <ul className="space-y-6">
                                     {['Neural Lab', 'Spectral Audit', 'Visualizer', 'Synapse Compare'].map(l=>(
                                         <li key={l}><a href="#" className="text-xs font-black text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">{l}</a></li>
                                     ))}
                                </ul>
                           </div>
                           <div className="col-span-1">
                                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-700 mb-10 block">Protocol</span>
                                <ul className="space-y-6">
                                     {['Neural Security', 'Privacy Shield', 'Safety Core', 'Manuals'].map(l=>(
                                         <li key={l}><a href="#" className="text-xs font-black text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">{l}</a></li>
                                     ))}
                                </ul>
                           </div>
                           <div className="col-span-2 hidden md:block">
                                <div className="p-16 bg-white/[0.02] rounded-[3.5rem] border border-white/5 backdrop-blur-3xl">
                                     <h5 className="text-white font-black text-2xl tracking-tighter mb-4 italic">Neural Dispatch</h5>
                                     <p className="text-slate-500 font-medium text-sm mb-12">Get forensic updates on active AI models and truth verification audits.</p>
                                     <div className="flex gap-4">
                                          <input type="text" placeholder="neural-link@verimind.ai" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm font-bold text-white outline-none focus:border-indigo-500/50" />
                                          <button className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all">Join</button>
                                     </div>
                                </div>
                           </div>
                      </div>

                      <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                           <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.5em] text-center md:text-left">© 2026 VERIMIND INTELLIGENT SUITE. ALL NEURAL RIGHTS RESERVED.</p>
                           <div className="flex gap-10 opacity-30 grayscale invert">
                                <Logo className="h-8" />
                           </div>
                      </div>
                 </div>
            </footer>
        </div>
    );
}
