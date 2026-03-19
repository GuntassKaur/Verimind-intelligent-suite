import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    Keyboard,
    ShieldAlert,
    Zap,
    ChevronRight,
    Cpu
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Logo } from '../components/Logo';

const FeatureCard = ({ icon: Icon, title, desc, href, delay }: { icon: LucideIcon, title: string, desc: string, href: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="group relative"
    >
        <Link to={href}>
            <div className="glass-panel h-full cursor-pointer hover:border-indigo-500/30 transition-all hover:bg-white/[0.03] flex flex-col p-6 md:p-8 group">
                <div className="w-12 h-12 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all shadow-inner">
                    <Icon className="text-slate-400 group-hover:text-indigo-400 transition-colors" size={24} />
                </div>
                <h3 className="text-xl font-black mb-3 text-white tracking-tight">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8 flex-grow">{desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400/60 uppercase tracking-widest group-hover:text-indigo-400 group-hover:gap-3 transition-all">
                    Launch Tool <ChevronRight size={14} />
                </div>
            </div>
        </Link>
    </motion.div>
);

export default function Landing() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* HERO SECTION */}
            <section className="relative pt-28 md:pt-44 pb-32 px-6 overflow-hidden">
                {/* Advanced Animated Background */}
                <div className="absolute top-0 left-0 w-full h-full -z-20 bg-[#020617]" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                <div className="max-w-[1400px] mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-12 shadow-2xl shadow-indigo-500/10 backdrop-blur-md"
                        >
                            <Logo variant="icon" className="w-5 h-5 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Neural Intelligence Protocol v5.2</span>
                        </motion.div>

                        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[8rem] font-black tracking-tighter mb-10 leading-[0.95] text-white">
                            Verify. Analyze. <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-purple-400 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                                Master Content.
                            </span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-14 md:mb-20 leading-relaxed font-sans font-medium px-4 opacity-80">
                            VeriMind seamlessly integrates neural verification into your creative workflow. 
                            From factual auditing to linguistic optimization—ensure absolute precision in every syllable.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <Link to="/workspace">
                                <button className="premium-btn-primary px-16 py-6 flex items-center gap-4 text-sm tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_rgba(79,70,229,0.3)]">
                                    <Sparkles size={22} />
                                    OPEN CORE LAB
                                </button>
                            </Link>
                            <Link to="/typing">
                                <button className="px-12 py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] flex items-center gap-4 text-[11px] font-black text-white uppercase tracking-[0.3em] transition-all backdrop-blur-xl">
                                    <Keyboard size={22} className="text-slate-400" />
                                    TYPING LAB
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SUITE PREVIEW GRID */}
            <section className="py-32 relative">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
                        <div className="relative">
                            <div className="absolute -left-8 top-0 bottom-0 w-2 bg-indigo-500 rounded-full blur-sm" />
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] block mb-6">INTELLIGENCE SUITE</span>
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">The Core <br /> Engines.</h2>
                        </div>
                        <div className="max-w-md p-10 bg-white/[0.02] border-l-4 border-indigo-500 rounded-2xl hidden md:block backdrop-blur-3xl">
                            <p className="text-slate-400 font-medium italic leading-relaxed text-sm">
                                "Our mission is to bridge the gap between AI generation and human trust through rigorous neural auditing."
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                        <FeatureCard
                            icon={Zap}
                            title="Neural Generator"
                            desc="Produce high-fidelity, structured content with advanced semantic grounding."
                            href="/workspace"
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={ShieldAlert}
                            title="Claim Auditor"
                            desc="Atomic-level verification of factual claims with cross-data-source synchronization."
                            href="/workspace"
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Cpu}
                            title="Visual Mapper"
                            desc="Convert unstructured documents into high-resolution knowledge architecture."
                            href="/visualizer"
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>


            {/* TRUSTED STATS */}
            <section className="py-24 md:py-40 border-t border-white/5 bg-gradient-to-b from-transparent to-[#0a0e1a]/50">
                <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center group border-b border-white/5 md:border-none pb-8 md:pb-0">
                        <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 group-hover:scale-105 transition-transform tracking-tight">Multi-Layered</div>
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Verification Process</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-center group border-b border-white/5 md:border-none pb-8 md:pb-0">
                        <div className="text-3xl md:text-4xl lg:text-5xl font-black text-indigo-500 mb-4 group-hover:scale-105 transition-transform tracking-tight">Real-Time</div>
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Adaptive Analysis</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-center group">
                        <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 group-hover:scale-105 transition-transform tracking-tight">Scalable</div>
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Content Capacity</div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}


