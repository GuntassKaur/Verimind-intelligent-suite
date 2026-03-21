import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Zap, 
    ShieldAlert, 
    Network, 
    Cpu, 
    ArrowRight, 
    Globe, 
    Activity, 
    ShieldCheck, 
    Wand2,
    CheckCircle2
} from 'lucide-react';

export default function Landing() {
    return (
        <div className="space-y-32 pb-32 overflow-hidden">
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-20">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/10 rounded-full blur-[120px] opacity-30 animate-pulse" />
                     <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] opacity-20" />
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 mb-10 group hover:border-indigo-500/40 transition-all cursor-default shadow-xl">
                        <Activity size={16} className="text-indigo-400 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Next-Generation AI Integrity Engine</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter mb-10 leading-[0.9]">
                        VERIMIND <br />
                        <span className="text-indigo-400 underline decoration-indigo-500/20 underline-offset-8">INTELLIGENT</span> SUITE
                    </h1>

                    <p className="text-lg md:text-2xl text-slate-400 font-serif italic mb-12 leading-relaxed opacity-80 max-w-3xl mx-auto selection:bg-indigo-500/30">
                        Synthesizing truth in a world of biological and artificial noise. Audit claims, verify originality, and visualize complex logic through the Neural Intelligence Studio.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/register" className="premium-btn-primary px-12 py-6 rounded-2xl flex items-center justify-center gap-4 group shadow-2xl shadow-indigo-600/30">
                            <Zap size={20} className="group-hover:rotate-45" />
                            <span className="text-xs font-black uppercase tracking-[0.3em]">Initialize Studio</span>
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <Link to="/about" className="px-12 py-6 bg-white/5 border border-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all">Protocol Specification</Link>
                    </div>
                </motion.div>
            </section>

            {/* CORE MODULES */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-10">
                    <div className="max-w-2xl">
                        <h2 className="text-[10px] font-black text-indigo-500 underline decoration-indigo-500/30 underline-offset-4 uppercase tracking-[0.5em] mb-6">Manifested Capabilities</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-tight">THE TRUTH ENGINE <span className="text-slate-600">&</span> SYNTHESIS CORE</h3>
                    </div>
                    <div className="flex items-center gap-8 opacity-40">
                         <Globe size={40} className="text-slate-700" />
                         <Cpu size={40} className="text-slate-700" />
                         <CheckCircle2 size={40} className="text-slate-700" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: 'Truth Analyzer', icon: ShieldAlert, desc: 'Audit claims and establish credibility markers through neural cross-referencing.', color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/10' },
                        { title: 'Plagiarism Audit', icon: ShieldCheck, desc: 'Deep-spectrum originality verification to identify artificial markers and overlap.', color: 'text-rose-400', bg: 'bg-rose-500/5', border: 'border-rose-500/10' },
                        { title: 'Neural Visualizer', icon: Network, desc: 'Transform complex linguistic data into structured logic nodes and visual manifests.', color: 'text-cyan-400', bg: 'bg-cyan-500/5', border: 'border-cyan-500/10' },
                        { title: 'Signal Masking', icon: Wand2, desc: 'Naturalize AI-generated content to bypass biological markers and enhance cadence.', color: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/10' },
                        { title: 'Advanced Synthesis', icon: Zap, desc: 'High-fidelity content production with integrated SEO and readability optimization.', color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' },
                        { title: 'Activity Streams', icon: Activity, desc: 'Synchronized temporal logs of every synthesis and audit conducted within the suite.', color: 'text-indigo-400', bg: 'bg-indigo-500/5', border: 'border-indigo-500/10' },
                    ].map((feature, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 20 }} 
                          whileInView={{ opacity: 1, y: 0 }} 
                          viewport={{ once: true }} 
                          transition={{ delay: i * 0.1 }}
                          className={`modern-card p-12 group transition-all hover:-translate-y-2 ${feature.border} ${feature.bg}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${feature.border} mb-10 transition-transform group-hover:scale-110`}>
                                <feature.icon size={26} className={feature.color} />
                            </div>
                            <h4 className="text-2xl font-black text-white italic mb-6 tracking-tight">{feature.title}</h4>
                            <p className="text-xs font-semibold text-slate-500 leading-relaxed uppercase tracking-widest">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="max-w-5xl mx-auto px-6">
                <div className="modern-card p-20 bg-gradient-to-br from-indigo-500/20 via-black to-black border-indigo-500/10 text-center relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 p-10 opacity-5 pointer-events-none">
                         <ShieldCheck size={200} className="text-indigo-400" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter mb-8 leading-tight">READY TO ESTABLISH <br /> NEURAL CLARITY?</h2>
                    <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-12">Initialize your credentials and join the collective stream.</p>
                    <Link to="/register" className="inline-flex premium-btn-primary px-16 py-6 rounded-2xl gap-4 items-center shadow-2xl shadow-indigo-500/40 group">
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Initialize Identity</span>
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
