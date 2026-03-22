import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    ShieldCheck, 
    Sparkles, 
    Zap, 
    ArrowRight, 
    Network, 
    Cpu, 
    Star,
    Users,
    PenTool
} from 'lucide-react';
import { Logo } from '../components/Logo';

export default function Landing() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const features = [
        { 
            title: "Smart Produce", 
            desc: "Generate high-fidelity research nodes and content structures with neural precision.", 
            icon: PenTool, 
            color: "indigo" 
        },
        { 
            title: "Truth Engine", 
            desc: "Forensic claim verification against global knowledge manifests with real-time audit.", 
            icon: ShieldCheck, 
            color: "blue" 
        },
        { 
            title: "Network Visualizer", 
            desc: "Transform complex logic into beautiful knowledge maps and structural flows.", 
            icon: Network, 
            color: "purple" 
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 overflow-x-hidden selection:bg-indigo-100">
            {/* ═══════════════════════════════════════════════
               PREMIUM NAVIGATION
               ═══════════════════════════════════════════════ */}
            <nav className="fixed top-0 w-full z-50 px-4 md:px-10 py-4 md:py-8 flex items-center justify-between pointer-events-none">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-2 md:gap-4 pointer-events-auto cursor-pointer group">
                    <div className="w-10 h-10 md:w-11 md:h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Logo variant="icon" className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 leading-none italic">VeriMind</span>
                </motion.div>
                
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-10 bg-white/70 backdrop-blur-3xl px-12 py-4 rounded-full border border-white shadow-xl pointer-events-auto">
                    {['Network', 'Security', 'Synthesis', 'Audit'].map((item) => (
                        <a key={item} href={`#${item}`} className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 transition-colors italic">{item}</a>
                    ))}
                </motion.div>

                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-2 md:gap-6 pointer-events-auto">
                    <Link to="/login" className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors px-2 md:px-6">Login</Link>
                    <Link to="/register" className="premium-btn-primary px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] uppercase font-black tracking-widest bg-indigo-600 hover:bg-slate-900 shadow-indigo-100 italic transition-all">Sign Up</Link>
                </motion.div>
            </nav>

            {/* ═══════════════════════════════════════════════
               HERO SECTION - CANVA BALANCED
               ═══════════════════════════════════════════════ */}
            <header className="relative pt-32 md:pt-48 pb-20 md:pb-32 flex flex-col items-center justify-center text-center px-4 md:px-6">
                 {/* Mesh Gradient Background */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[120vh] bg-mesh opacity-30 -z-10 blur-[120px]" />
                 
                 <motion.div style={{ opacity, scale }}>
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 md:gap-4 bg-indigo-50 border border-indigo-100 px-6 md:px-8 py-2 md:py-3 rounded-full mb-8 md:mb-12 shadow-sm"
                    >
                         <Sparkles size={16} className="text-indigo-500" />
                         <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-indigo-700 italic">Neural Intelligence Manifest v5.9</span>
                    </motion.div>

                    <h1 className="text-[12vw] md:text-[9vw] lg:text-[7vw] font-black text-slate-900 tracking-tighter leading-[0.9] md:leading-[0.8] mb-8 md:mb-12 italic">
                        Produce with <span className="text-gradient">Power</span>.<br />
                        Audit with <span className="text-gradient">Truth</span>.
                    </h1>

                    <p className="max-w-xl md:max-w-2xl mx-auto text-lg md:text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed mb-10 md:mb-16 px-4">
                        VeriMind is the world's first daylight-balanced AI suite for forensic research, structural content generation, and logical truth verification.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
                         <Link to="/workspace" className="premium-btn-primary w-full sm:w-auto px-10 md:px-16 py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center gap-4 md:gap-6 text-xs md:text-[13px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200">
                             <Zap size={20} />
                             <span>Start Producing</span>
                             <ArrowRight size={18} />
                         </Link>
                         <button className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] border border-slate-200 bg-white text-slate-900 font-bold hover:bg-slate-50 transition-all text-xs md:text-sm flex items-center justify-center gap-3 md:gap-4 shadow-xl">
                              <Logo variant="icon" className="w-5 h-5 text-indigo-500" />
                              See the Audit Flow
                         </button>
                    </div>

                    <div className="mt-20 md:mt-32 flex flex-wrap justify-center items-center gap-8 md:gap-20 grayscale opacity-20 pointer-events-none">
                         <Logo className="h-8 md:h-10 opacity-30" />
                         <div className="flex items-center gap-2 md:gap-4 font-black tracking-tighter text-xl md:text-3xl"><Cpu size={24} /> NEURAL CORE</div>
                         <div className="flex items-center gap-2 md:gap-4 font-black tracking-tighter text-xl md:text-3xl"><ShieldCheck size={24} /> TRUTH SCAN</div>
                    </div>
                 </motion.div>

                 {/* Premium Mockup/Visual */}
                 <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="mt-24 md:mt-40 w-full max-w-6xl mx-auto relative group px-2 md:px-0"
                 >
                      <div className="absolute inset-0 bg-indigo-500/20 blur-[150px] rounded-full scale-110 opacity-30 group-hover:opacity-100 transition-opacity" />
                      <div className="modern-card bg-white border-none p-1 shadow-3xl rounded-[2rem] md:rounded-[3rem] overflow-hidden">
                           <div className="bg-slate-50 p-3 md:p-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="flex gap-2">
                                     <div className="w-2.5 h-2.5 bg-rose-400 rounded-full" />
                                     <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
                                     <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                                </div>
                                <div className="mx-auto w-3/4 md:w-1/2 h-5 md:h-6 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-[8px] md:text-[10px] font-bold text-slate-300">verimind.ai/workspace/node-alpha</div>
                           </div>
                           <div className="bg-white aspect-video md:aspect-[16/10] flex items-center justify-center px-4 md:px-20">
                                <div className="w-full h-full flex flex-col gap-6 md:gap-10 py-10 md:py-20 animate-pulse">
                                     <div className="w-2/3 h-8 md:h-12 bg-slate-50 rounded-xl" />
                                     <div className="w-full h-32 md:h-64 bg-slate-50 rounded-2xl" />
                                     <div className="flex gap-4 md:gap-8 overflow-hidden">
                                          <div className="shrink-0 w-1/2 md:w-1/3 h-24 md:h-40 bg-indigo-50/50 rounded-2xl border border-indigo-100" />
                                          <div className="shrink-0 w-1/2 md:w-1/3 h-24 md:h-40 bg-indigo-50/50 rounded-2xl border border-indigo-100" />
                                     </div>
                                </div>
                           </div>
                      </div>
                 </motion.div>
            </header>

            {/* ═══════════════════════════════════════════════
               FEATURES SECTION
               ═══════════════════════════════════════════════ */}
            <section className="py-20 md:py-40 px-6 md:px-10 relative">
                 <div className="max-w-7xl mx-auto">
                      <div className="text-center mb-20 md:mb-40">
                           <h2 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tighter mb-6 md:mb-8 italic">The Ultimate AI <span className="text-gradient">Prism</span>.</h2>
                           <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">One unified workspace for the entire content lifecycle—from neural generation to executive truth auditing.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                           {features.map((f, i) => (
                               <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="modern-card items-start p-8 md:p-16 bg-white border-none shadow-lux group rounded-3xl"
                               >
                                    <div className={`w-16 h-16 md:w-24 md:h-24 bg-${f.color}-50 rounded-[1.5rem] md:rounded-[2.5rem] border border-${f.color}-100 flex items-center justify-center mb-8 md:mb-12 group-hover:scale-110 transition-transform`}>
                                         <f.icon size={32} className={`text-${f.color}-500 md:w-10 md:h-10`} />
                                    </div>
                                    <h4 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight italic mb-4 md:mb-6">{f.title}</h4>
                                    <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed mb-8 md:mb-10">{f.desc}</p>
                                    <Link to="/workspace" className={`flex items-center gap-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-${f.color}-500 group-hover:gap-6 transition-all`}>
                                         Activate Module <ArrowRight size={16} />
                                    </Link>
                               </motion.div>
                           ))}
                      </div>
                 </div>
            </section>

            {/* ═══════════════════════════════════════════════
               TRUST FOOTER
               ═══════════════════════════════════════════════ */}
            <footer className="py-20 md:py-32 bg-slate-900 overflow-hidden relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150vh] bg-indigo-500/10 blur-[180px] -z-10" />
                 
                 <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
                      <div className="flex flex-col items-center gap-8 md:gap-12 mb-20 md:mb-32">
                           <div className="w-20 h-20 md:w-24 md:h-24 bg-indigo-600 rounded-3xl md:rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                                <Logo variant="icon" className="w-10 h-10 md:w-12 md:h-12 text-white" />
                           </div>
                           <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic">Join the Truth <span className="text-indigo-400">Revolution</span>.</h3>
                           <Link to="/register" className="premium-btn-primary w-full sm:w-auto px-12 md:px-20 py-6 md:py-8 rounded-2xl md:rounded-[3rem] text-xs md:text-sm shadow-indigo-500/20">Synthesize Your Account</Link>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-20 py-12 md:py-20 border-t border-white/5 text-left">
                           <div className="col-span-1">
                                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-white/40 mb-8 md:mb-10 block italic">Modules</span>
                                <ul className="space-y-4 md:space-y-6">
                                     {['Linguistic Lab', 'Spectral Audit', 'Visualizer', 'Truth Engine'].map(l=>(
                                         <li key={l}><a href="#" className="text-xs md:text-sm font-bold text-white/30 hover:text-indigo-400 transition-colors uppercase tracking-widest">{l}</a></li>
                                     ))}
                                </ul>
                           </div>
                           <div className="col-span-1 border-white/5">
                                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-white/40 mb-8 md:mb-10 block italic">Protocol</span>
                                <ul className="space-y-4 md:space-y-6">
                                     {['Privacy', 'Security', 'Safety', 'Docs'].map(l=>(
                                         <li key={l}><a href="#" className="text-xs md:text-sm font-bold text-white/30 hover:text-indigo-400 transition-colors uppercase tracking-widest">{l}</a></li>
                                     ))}
                                </ul>
                           </div>
                           <div className="col-span-2 hidden md:block">
                                <div className="p-10 lg:p-16 bg-white/5 rounded-[2rem] lg:rounded-[3rem] border border-white/5 backdrop-blur-3xl">
                                     <h5 className="text-white font-black text-xl lg:text-2xl tracking-tight mb-4">Neural Subscription</h5>
                                     <p className="text-white/40 font-medium text-xs lg:text-sm mb-10">Get real-time updates on active AI models and truth verification protocols.</p>
                                     <div className="flex flex-col lg:flex-row gap-4">
                                          <input type="text" placeholder="Neural-Link@mail.com" className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-6 py-4 lg:px-8 lg:py-5 text-sm font-bold text-white outline-none focus:border-indigo-500/50" />
                                          <button className="px-10 py-4 lg:py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all">Join</button>
                                     </div>
                                </div>
                           </div>
                      </div>

                      <div className="pt-10 md:pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                           <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.3em] md:tracking-[0.4em] italic text-center md:text-left">© 2026 VERIMIND INTELLIGENT SUITE. ALL NEURAL RIGHTS RESERVED.</p>
                           <div className="flex gap-10 opacity-30">
                                <Star className="text-white" size={16} />
                                <Users className="text-white" size={16} />
                           </div>
                      </div>
                 </div>
            </footer>
        </div>
    );
}
