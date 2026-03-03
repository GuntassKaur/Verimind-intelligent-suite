import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Sparkles, ShieldCheck, Search, User, Keyboard, History, ArrowRight, ShieldAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ModuleCard = ({ icon: Icon, title, desc, href, delay }: { icon: LucideIcon, title: string, desc: string, href: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="group relative"
    >
        <Link href={href}>
            <div className="glass-card p-8 h-full cursor-pointer hover:border-indigo-500/30 transition-all hover:bg-white/[0.03] flex flex-col">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                    <Icon className="text-indigo-400" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6 flex-grow">{desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest group-hover:gap-3 transition-all">
                    Open Tool <ArrowRight size={14} />
                </div>
            </div>
        </Link>
    </motion.div>
);

export default function Landing() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* HERO SECTION */}
            <section className="relative pt-44 pb-32 px-6">
                <div className="max-w-[1400px] mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/10 mb-8">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em]">Verification Tools</span>
                        </div>

                        <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tight mb-8 leading-[0.95] text-white">
                            The Professional Standard for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-cyan-400">Content Integrity.</span>
                        </h1>

                        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                            VeriMind provides advanced auditing for all types of manuscripts.
                            Identify inconsistencies, verify originality, and refine your writing.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/analyze">
                                <button className="premium-btn-primary px-10 py-4 flex items-center gap-3">
                                    <ShieldAlert size={20} />
                                    Start Analysis
                                </button>
                            </Link>
                            <Link href="/typing">
                                <button className="premium-btn-ghost px-10 py-4 flex items-center gap-3">
                                    <Keyboard size={20} />
                                    Typing Practice
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* MODULES GRID */}
            <section className="py-32 bg-black/20 border-y border-white/5">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] block mb-4">Platform Overview</span>
                            <h2 className="text-4xl font-black text-white">Dashboard</h2>
                        </div>
                        <p className="max-w-md text-slate-500 font-medium">
                            A comprehensive suite of auditing tools designed to maintain the highest standard of accuracy.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ModuleCard
                            icon={Sparkles}
                            title="Generator"
                            desc="Research tool for high-fidelity content generation with built-in factual constraints."
                            href="/generate"
                            delay={0.1}
                        />
                        <ModuleCard
                            icon={ShieldCheck}
                            title="Analyzer"
                            desc="Audit your content for consistency, errors, and factual accuracy."
                            href="/analyze"
                            delay={0.2}
                        />
                        <ModuleCard
                            icon={Search}
                            title="Plagiarism Checker"
                            desc="Advanced similarity scanner detecting non-original patterns and markers."
                            href="/plagiarism"
                            delay={0.4}
                        />
                        <ModuleCard
                            icon={User}
                            title="Humanizer"
                            desc="Readability editor for stylizing content to meet professional writing standards."
                            href="/humanize"
                            delay={0.5}
                        />
                        <ModuleCard
                            icon={Keyboard}
                            title="Typing Practice"
                            desc="Practice environment for measuring and improving your typing speed and accuracy."
                            href="/typing"
                            delay={0.6}
                        />
                        <ModuleCard
                            icon={History}
                            title="History"
                            desc="Centralized log for all verified reports and past audit sessions."
                            href="/history"
                            delay={0.7}
                        />
                    </div>
                </div>
            </section>

            {/* STATS / TRUST */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
                    <div>
                        <div className="text-4xl font-black text-white mb-2">99.9%</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accuracy Rate</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-indigo-500 mb-2">Verification</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Multi-Step Audit Engine</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white mb-2">&lt; 2s</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Latency</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

