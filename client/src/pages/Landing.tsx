import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    ShieldCheck, 
    Sparkles, 
    Zap, 
    ArrowRight, 
    Activity, 
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
            <nav className="fixed top-0 w-full z-50 px-10 py-8 flex items-center justify-between pointer-events-none">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-4 pointer-events-auto cursor-pointer group">
                    <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Logo variant="icon" className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-slate-900 leading-none italic">VeriMind</span>
                </motion.div>
                
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-10 bg-white/70 backdrop-blur-3xl px-12 py-4 rounded-full border border-white shadow-xl pointer-events-auto">
                    {['Network', 'Security', 'Synthesis', 'Audit'].map((item) => (
                        <a key={item} href={`#${item}`} className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 transition-colors italic">{item}</a>
                    ))}
                </motion.div>

                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-6 pointer-events-auto">
                    <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors px-6">Recall Session</Link>
                    <Link to="/register" className="premium-btn-primary px-8 py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest bg-indigo-600 hover:bg-slate-900 shadow-indigo-100 italic transition-all">Establish Identity</Link>
                </motion.div>
            </nav>

            {/* ═══════════════════════════════════════════════
               HERO SECTION - CANVA BALANCED
               ═══════════════════════════════════════════════ */}
            <header className="relative pt-48 pb-32 flex flex-col items-center justify-center text-center px-6">
                 {/* Mesh Gradient Background */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[120vh] bg-mesh opacity-30 -z-10 blur-[120px]" />
                 
                 <motion.div style={{ opacity, scale }}>
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-4 bg-indigo-50 border border-indigo-100 px-8 py-3 rounded-full mb-12 shadow-sm"
                    >
                         <Sparkles size={18} className="text-indigo-500" />
                         <span className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-700 italic">Neural Intelligence Manifest v5.9</span>
                    </motion.div>

                    <h1 className="text-[9vw] lg:text-[7vw] font-black text-slate-900 tracking-tighter leading-[0.8] mb-12 italic">
                        Produce with <span className="text-gradient">Power</span>.<br />
                        Audit with <span className="text-gradient">Truth</span>.
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed mb-16 px-6">
                        VeriMind is the world's first daylight-balanced AI suite for forensic research, structural content generation, and logical truth verification.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                         <Link to="/workspace" className="premium-btn-primary px-16 py-7 rounded-[2.5rem] flex items-center gap-6 text-[13px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200">
                             <Zap size={22} />
                             <span>Start Producing</span>
                             <ArrowRight size={20} />
                         </Link>
                         <button className="px-12 py-7 rounded-[2.5rem] border border-slate-200 bg-white text-slate-900 font-bold hover:bg-slate-50 transition-all text-sm flex items-center gap-4 shadow-xl">
                              <Logo variant="icon" className="w-6 h-6 text-indigo-500" />
                              See the Audit Flow
                         </button>
                    </div>

                    <div className="mt-32 flex flex-wrap justify-center items-center gap-20 grayscale opacity-20 pointer-events-none">
                         <Logo className="h-10 opacity-30" />
                         <div className="flex items-center gap-4 font-black tracking-tighter text-3xl"><Cpu size={30} /> NEURAL CORE</div>
                         <div className="flex items-center gap-4 font-black tracking-tighter text-3xl"><ShieldCheck size={30} /> TRUTH SCAN</div>
                         <div className="flex items-center gap-4 font-black tracking-tighter text-3xl"><Network size={30} /> BRAIN MAP</div>
                    </div>
                 </motion.div>

                 {/* Premium Mockup/Visual */}
                 <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="mt-40 w-full max-w-6xl mx-auto relative group"
                 >
                      <div className="absolute inset-0 bg-indigo-500/20 blur-[150px] rounded-full scale-110 opacity-30 group-hover:opacity-100 transition-opacity" />
                      <div className="modern-card bg-white border-none p-1 shadow-3xl rounded-[3rem] overflow-hidden">
                           <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="flex gap-2">
                                     <div className="w-3 h-3 bg-rose-400 rounded-full" />
                                     <div className="w-3 h-3 bg-amber-400 rounded-full" />
                                     <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                                </div>
                                <div className="mx-auto w-1/2 h-6 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-300">verimind.ai/workspace/node-alpha</div>
                           </div>
                           <div className="bg-white aspect-[16/10] flex items-center justify-center px-20">
                                <div className="w-full h-full flex flex-col gap-10 py-20 animate-pulse">
                                     <div className="w-2/3 h-12 bg-slate-50 rounded-2xl" />
                                     <div className="w-full h-64 bg-slate-50 rounded-3xl" />
                                     <div className="flex gap-8">
                                          <div className="w-1/3 h-40 bg-indigo-50/50 rounded-3xl border border-indigo-100" />
                                          <div className="w-1/3 h-40 bg-indigo-50/50 rounded-3xl border border-indigo-100" />
                                          <div className="w-1/3 h-40 bg-indigo-50/50 rounded-3xl border border-indigo-100" />
                                     </div>
                                </div>
                           </div>
                      </div>
                 </motion.div>
            </header>

            {/* ═══════════════════════════════════════════════
               FEATURES SECTION
               ═══════════════════════════════════════════════ */}
            <section className="py-40 px-10 relative">
                 <div className="max-w-7xl mx-auto">
                      <div className="text-center mb-40">
                           <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-8 italic">The Ultimate AI <span className="text-gradient">Prism</span>.</h2>
                           <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">One unified workspace for the entire content lifecycle—from neural generation to executive truth auditing.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                           {features.map((f, i) => (
                               <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="modern-card items-start p-16 bg-white border-none shadow-lux group"
                               >
                                    <div className={`w-24 h-24 bg-${f.color}-50 rounded-[2.5rem] border border-${f.color}-100 flex items-center justify-center mb-12 group-hover:scale-110 transition-transform`}>
                                         <f.icon size={40} className={`text-${f.color}-500`} />
                                    </div>
                                    <h4 className="text-3xl font-black text-slate-800 tracking-tight italic mb-6">{f.title}</h4>
                                    <p className="text-slate-500 font-medium leading-relaxed mb-10">{f.desc}</p>
                                    <Link to="/workspace" className={`flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-${f.color}-500 group-hover:gap-6 transition-all`}>
                                         Activate Module <ArrowRight size={18} />
                                    </Link>
                               </motion.div>
                           ))}
                      </div>
                 </div>
            </section>

            {/* ═══════════════════════════════════════════════
               TRUST FOOTER
               ═══════════════════════════════════════════════ */}
            <footer className="py-32 bg-slate-900 overflow-hidden relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150vh] bg-indigo-500/10 blur-[180px] -z-10" />
                 
                 <div className="max-w-7xl mx-auto px-10 text-center">
                      <div className="flex flex-col items-center gap-12 mb-32">
                           <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                                <Logo variant="icon" className="w-12 h-12 text-white" />
                           </div>
                           <h3 className="text-5xl font-black text-white tracking-tighter italic">Join the Truth <span className="text-indigo-400">Revolution</span>.</h3>
                           <Link to="/register" className="premium-btn-primary px-20 py-8 rounded-[3rem] text-sm shadow-indigo-500/20">Synthesize Your Account</Link>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-20 py-20 border-t border-white/5 text-left">
                           <div className="col-span-1">
                                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 mb-10 block italic">Modules</span>
                                <ul className="space-y-6">
                                     {['Linguistic Lab', 'Spectral Audit', 'Visualizer', 'Truth Engine'].map(l=>(
                                         <li key={l}><a href="#" className="text-sm font-bold text-white/30 hover:text-indigo-400 transition-colors uppercase tracking-widest">{l}</a></li>
                                     ))}
                                </ul>
                           </div>
                           <div className="col-span-1">
                                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 mb-10 block italic">Protocol</span>
                                <ul className="space-y-6">
                                     {['Privacy', 'Security', 'Safety', 'Docs'].map(l=>(
                                         <li key={l}><a href="#" className="text-sm font-bold text-white/30 hover:text-indigo-400 transition-colors uppercase tracking-widest">{l}</a></li>
                                     ))}
                                </ul>
                           </div>
                           <div className="col-span-2 hidden md:block">
                                <div className="p-16 bg-white/5 rounded-[3rem] border border-white/5 backdrop-blur-3xl">
                                     <h5 className="text-white font-black text-2xl tracking-tight mb-4">Neural Subscription</h5>
                                     <p className="text-white/40 font-medium text-sm mb-10">Get real-time updates on active AI models and truth verification protocols.</p>
                                     <div className="flex gap-4">
                                          <input type="text" placeholder="Neural-Link@mail.com" className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-8 py-5 text-sm font-bold text-white outline-none focus:border-indigo-500/50" />
                                          <button className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all">Join</button>
                                     </div>
                                </div>
                           </div>
                      </div>

                      <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">© 2026 VERIMIND INTELLIGENT SUITE. ALL NEURAL RIGHTS RESERVED.</p>
                           <div className="flex gap-10 opacity-30">
                                <Star className="text-white" size={16} />
                                <Users className="text-white" size={16} />
                                <Activity className="text-white" size={16} />
                           </div>
                      </div>
                 </div>
            </footer>
        </div>
    );
}
