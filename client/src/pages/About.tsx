import { motion } from 'framer-motion';
import { 
    Info, 
    ShieldAlert, 
    Cpu, 
    Activity, 
    ShieldCheck, 
    Cloud,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="space-y-32 pb-32 overflow-hidden px-4">
            {/* INTRO SECTION */}
            <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center pt-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 mb-10 shadow-xl">
                        <Info size={16} className="text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">VeriMind Protocol Specification</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-10 leading-[0.9]">
                        SYNTHTETIC <br />
                        <span className="text-indigo-400">INTELLIGENCE</span> <br />
                        ESTABLISHED.
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 font-serif italic mb-12 leading-relaxed opacity-80 max-w-3xl mx-auto selection:bg-indigo-500/30">
                        A centralized neural studio designed for the professional audit and synthesis of truth. We bridge the gap between biological intuition and artificial logic.
                    </p>
                </motion.div>
            </section>

            {/* PROTOCOL BREAKDOWN */}
            <section className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <div className="modern-card p-12 bg-white/[0.01] border-white/5 relative overflow-hidden group hover:bg-white/[0.02] transition-all">
                             <div className="absolute top-0 right-0 p-8 opacity-5">
                                 <ShieldAlert size={120} className="text-indigo-400" />
                             </div>
                             <h3 className="text-2xl font-black text-white italic mb-8 tracking-tight">The Neural Auditor</h3>
                             <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-6 underline decoration-indigo-500/10">PROTOCOL: ANALYSIS_Z4</p>
                             <p className="text-xs font-semibold text-slate-500 leading-relaxed uppercase tracking-widest">VeriMind Auditor utilizes multi-layer entropy analysis to identify factual discrepancies and artificial markers within any linguistic stream. Our engine provides a high-fidelity confidence score (0-100%) for every claim audited.</p>
                        </div>

                        <div className="modern-card p-12 bg-white/[0.01] border-white/5 relative overflow-hidden group hover:bg-white/[0.02] transition-all">
                             <div className="absolute top-0 right-0 p-8 opacity-5">
                                 <Cpu size={120} className="text-emerald-400" />
                             </div>
                             <h3 className="text-2xl font-black text-white italic mb-8 tracking-tight">Synthesis Studio</h3>
                             <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-6 underline decoration-emerald-500/10">PROTOCOL: GENERATE_V9</p>
                             <p className="text-xs font-semibold text-slate-500 leading-relaxed uppercase tracking-widest">Our Synthesis engine allows for the production of sophisticated, long-form content with integrated SEO and readability optimization. Every manifest produced is archived for temporal audit.</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                         <div className="flex flex-col gap-8">
                             {[
                                 { icon: CheckCircle, label: 'High-Fidelity Neural Output', color: 'text-indigo-400' },
                                 { icon: Clock, label: 'Temporal Activity Archiving', color: 'text-blue-400' },
                                 { icon: ShieldCheck, label: 'Anti-Detection Signal Masking', color: 'text-purple-400' },
                                 { icon: Cloud, label: 'Cloud-Based Studio Synchronization', color: 'text-cyan-400' },
                             ].map((item, i) => (
                                 <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: 20 }} 
                                    whileInView={{ opacity: 1, x: 0 }} 
                                    viewport={{ once: true }} 
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-6 group"
                                 >
                                     <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors`}>
                                         <item.icon size={20} className={item.color} />
                                     </div>
                                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] group-hover:text-white transition-colors">{item.label}</span>
                                 </motion.div>
                             ))}
                         </div>
                    </div>
                </div>
            </section>

            {/* TEAM / SPECS SECTION */}
            <section className="max-w-5xl mx-auto">
                 <div className="modern-card p-20 bg-black/40 border-white/5 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                         <Activity size={400} className="text-slate-800 -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" />
                    </div>
                    <div className="relative z-10">
                         <h2 className="text-4xl font-black text-white italic tracking-tighter mb-8 italic uppercase leading-none">ESTABLISH CLARITY ACROSS <br /> THE COLLECTIVE STREAM.</h2>
                         <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-12 italic">VeriMind is not just a tool; it is a higher-order neural protocol.</p>
                         <Link to="/register" className="premium-btn-primary px-16 py-6 rounded-2xl flex items-center justify-center gap-4 group mx-auto w-fit shadow-2xl shadow-indigo-600/30">
                            <span className="text-xs font-black uppercase tracking-[0.3em]">Initialize Identity</span>
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                 </div>
            </section>
        </div>
    );
}

function Clock({ size, className }: { size?: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}
