import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    Keyboard,
    ShieldAlert,
    Zap,
    ChevronRight,
    Cpu,
    Network,
    FileText,
    BrainCircuit
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Logo } from '../components/Logo';

const FeatureCard = ({ icon: Icon, title, desc, href, delay, color }: { icon: LucideIcon, title: string, desc: string, href: string, delay: number, color: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="group relative h-full"
    >
        <Link to={href} className="block h-full">
            <div className={`modern-card h-full flex flex-col p-10 border-white/5 bg-white/[0.02] backdrop-blur-3xl hover:border-${color}-500/30 transition-all group overflow-hidden`}>
                <div className={`absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity text-${color}-400`}>
                     <Icon size={200} />
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                    <Icon className={`text-${color}-400 transition-colors`} size={28} />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tighter group-hover:text-white transition-colors">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium mb-12 flex-grow opacity-80">{desc}</p>
                <div className={`flex items-center gap-3 text-[10px] font-black text-${color}-400 uppercase tracking-[0.3em] group-hover:gap-5 transition-all`}>
                    Initialize Module <ChevronRight size={14} />
                </div>
            </div>
        </Link>
    </motion.div>
);

export default function Landing() {
    return (
        <div className="flex flex-col min-h-screen bg-[#0B0F1A] overflow-x-hidden">
            {/* AMBIENT BACKGROUND LAYER */}
            <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
                 <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse" />
                 <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
                 <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '4s' }} />
                 <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            </div>

            {/* HERO SECTION */}
            <section className="relative px-6 pt-32 md:pt-48 pb-40 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-12 backdrop-blur-2xl shadow-2xl">
                             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Integrated Intelligence Lab v5.2</span>
                        </div>

                        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-12">
                            Rewrite the <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-purple-400 drop-shadow-[0_0_40px_rgba(99,102,241,0.3)]">AI Narrative.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium opacity-80 px-4">
                            VeriMind seamlessly integrates neural verification into your creative workflow. 
                            From factual auditing to linguistic optimization—ensure absolute precision in every syllable.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <Link to="/workspace">
                                <button className="premium-btn-primary px-16 py-7 flex items-center gap-4 text-sm tracking-widest hover:scale-105 transition-all shadow-[0_30px_60px_-15px_rgba(79,70,229,0.5)]">
                                    <Sparkles size={22} className="text-white" />
                                    LAUNCH CORE STUDIO
                                </button>
                            </Link>
                            <Link to="/analyzer">
                                <button className="px-14 py-7 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 text-[11px] font-black text-white uppercase tracking-[0.3em] hover:bg-white/10 transition-all backdrop-blur-3xl group">
                                    <Cpu size={22} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                    START ANALYZER
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* PREVIEW SECTION */}
            <section className="py-24 relative px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
                         <div className="relative">
                            <div className="absolute -left-8 top-0 bottom-0 w-2 bg-indigo-500 rounded-full blur-sm opacity-50" />
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">Modular <br /> Architecture.</h2>
                         </div>
                         <div className="p-10 bg-white/[0.02] border-l-4 border-indigo-500 rounded-3xl backdrop-blur-3xl hidden md:block max-w-md">
                             <p className="text-slate-400 font-medium italic text-lg leading-relaxed px-4">
                                "Bridging the semantic gap between machine generation and human trust."
                             </p>
                         </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                        <FeatureCard
                            icon={Network}
                            title="Neural Mapper"
                            desc="Convert unstructured linguistic data into high-resolution knowledge architecture."
                            href="/visualizer"
                            delay={0.1}
                            color="cyan"
                        />
                        <FeatureCard
                            icon={BrainCircuit}
                            title="Claim Auditor"
                            desc="Precision verification of factual claims with multi-layer neural audit protocols."
                            href="/analyzer"
                            delay={0.2}
                            color="indigo"
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Synthesis Engine"
                            desc="Produce high-fidelity research summaries with verified semantic grounding."
                            href="/generator"
                            delay={0.3}
                            color="amber"
                        />
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-40 border-t border-white/5 bg-gradient-to-b from-transparent to-black/20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                         <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-12 uppercase italic">The future of content is <span className="text-indigo-500 italic">verified.</span></h2>
                         <Link to="/register">
                             <button className="px-16 py-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.4em] transition-all shadow-[0_0_50px_rgba(99,102,241,0.4)]">Initialize Account</button>
                         </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
