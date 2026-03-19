import { motion } from 'framer-motion';
import { Info, ShieldCheck, Cpu, Database, Zap, Globe, Github } from 'lucide-react';

export default function About() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12 pt-24 md:pt-32 min-h-screen">
            <header className="mb-12 md:mb-16">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 md:mb-6"
                >
                    <Info size={14} className="text-indigo-500" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Our Mission</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4"
                >
                    About VeriMind
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-base md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed"
                >
                    Architecting the future of trust and accuracy in the age of generative intelligence.
                </motion.p>
            </header>

            <div className="laptop-mock mb-20">
                <div className="laptop-screen overflow-y-auto custom-scrollbar">
                    <div className="p-10 md:p-24 space-y-32">
                        {/* MISSION */}
                        <section className="max-w-4xl relative">
                            <div className="absolute -left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-transparent opacity-20 hidden md:block" />
                            <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-6 md:mb-8">The Objective</h2>
                            <p className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-8 md:mb-10 tracking-tight">
                                Establishing the global standard for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Verified Content</span>.
                            </p>
                            <p className="text-base md:text-xl text-slate-400 leading-relaxed font-medium">
                                VeriMind provides a robust verification system for AI-generated content.
                                We empower researchers, writers, and developers to ensure absolute accuracy
                                and originality through a sophisticated multi-layered analysis engine.
                            </p>
                        </section>

                        {/* PILLARS */}
                        <div className="grid md:grid-cols-3 gap-10">
                            {[
                                {
                                    icon: <Cpu className="text-indigo-400" size={24} />,
                                    title: "Factual Accuracy",
                                    desc: "Every report is cross-referenced against high-fidelity knowledge sources in real-time to eliminate hallucinations.",
                                    color: "bg-indigo-500/10 border-indigo-500/20"
                                },
                                {
                                    icon: <ShieldCheck className="text-emerald-400" size={24} />,
                                    title: "Content Integrity",
                                    desc: "Advanced forensic algorithms detect non-original patterns and identify potential plagiarism with surgical precision.",
                                    color: "bg-emerald-500/10 border-emerald-500/20"
                                },
                                {
                                    icon: <Database className="text-purple-400" size={24} />,
                                    title: "System History",
                                    desc: "Secure, encrypted archives of every generation and verification process for enterprise-grade accountability.",
                                    color: "bg-purple-500/10 border-purple-500/20"
                                }
                            ].map((pillar, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`glass-panel p-10 space-y-6 group hover:bg-white/[0.04] transition-all border-white/5`}
                                >
                                    <div className={`w-14 h-14 ${pillar.color} rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform`}>
                                        {pillar.icon}
                                    </div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-wider">{pillar.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                        {pillar.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* TECH STACK & QUOTE */}
                        <section className="pt-16 md:pt-24 border-t border-white/5 flex flex-col lg:flex-row gap-12 md:gap-16 items-start">
                            <div className="shrink-0 w-full lg:w-72">
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 md:mb-8 flex items-center gap-3">
                                    <Zap size={14} className="text-indigo-500" />
                                    Core Intelligence
                                </h3>
                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                    {[
                                        "GPT-4o Integration",
                                        "Linguistic Forensics",
                                        "Semantic Cross-Check",
                                        "Distributed Neural Processing",
                                        "Zero-Hallucination Logic"
                                    ].map(tech => (
                                        <div key={tech} className="flex items-center gap-3 text-xs font-black text-white/50 hover:text-indigo-400 transition-colors cursor-default group">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-30 group-hover:opacity-100 transition-opacity" />
                                            {tech}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 glass-panel p-8 md:p-14 bg-indigo-500/[0.02] border-indigo-500/10 backdrop-blur-3xl relative overflow-hidden group">
                                <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/10 transition-colors" />

                                <p className="text-lg md:text-2xl text-slate-300 leading-relaxed italic font-medium relative z-10 mb-8 md:mb-10 break-words">
                                    "Accuracy is the only currency that matters in a world flooded with generated noise.
                                    VeriMind is our contribution to a more truthful digital landscape."
                                </p>

                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20" />
                                    <div>
                                        <div className="text-xs md:text-sm font-black text-white uppercase tracking-widest">Engineering Lead</div>
                                        <div className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">VeriMind Intelligence Labs</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* CALL TO ACTION */}
            <section className="text-center mb-32">
                <h2 className="text-3xl font-black text-white mb-8 tracking-tight uppercase">Ready to verify?</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button className="premium-btn-primary px-10 py-4 flex items-center gap-3">
                        <Globe size={18} />
                        <span className="uppercase tracking-widest font-black text-xs">Explore Workspace</span>
                    </button>
                    <button className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center gap-3 transition-all text-white group">
                        <Github size={18} className="text-slate-400 group-hover:text-white" />
                        <span className="uppercase tracking-widest font-black text-xs">Architecture Logs</span>
                    </button>
                </div>
            </section>
        </div>
    );
}
