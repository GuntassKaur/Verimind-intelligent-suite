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
    Keyboard,
    Play,
    Sparkles
} from 'lucide-react';

export default function Landing() {
    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
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
        <div className="relative min-h-screen bg-[#0b0f1a] text-[#f8fafc] overflow-hidden selection:bg-purple-500/30">
            {/* Animated Background Mesh */}
            <div className="bg-mesh-container">
                <div className="bg-mesh" />
            </div>

            {/* Glowing Orbs */}
            <div className="glowing-orb glow-purple w-[600px] h-[600px] -top-48 -left-48" />
            <div className="glowing-orb glow-blue w-[500px] h-[500px] top-1/2 -right-24" />
            
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6">
                 <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={staggerContainer} 
                    className="relative z-10 max-w-5xl mx-auto text-center"
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
                        <Sparkles size={14} className="text-purple-400" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-200">The Future of AI is Here</span>
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8">
                        Automate your work.<br/>
                        <span className="text-gradient-premium">Focus on growth.</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12">
                        Verimind is a unified AI suite designed to overclock your productivity. 
                        From deep research to instant content generation, we bridge the gap between idea and execution.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                         <Link to="/dashboard" className="w-full sm:w-auto">
                             <button className="btn-premium btn-premium-primary w-full sm:w-auto px-10 py-4 text-sm uppercase tracking-widest">
                                 Get Started <ArrowRight size={18} />
                             </button>
                         </Link>
                         <Link to="/live-ai" className="w-full sm:w-auto">
                            <button className="btn-premium btn-premium-outline w-full sm:w-auto px-10 py-4 text-sm uppercase tracking-widest backdrop-blur-xl">
                                Try Demo <Play size={16} fill="currentColor" />
                            </button>
                         </Link>
                    </motion.div>
                 </motion.div>

                 {/* Interactive UI Element */}
                 <motion.div 
                    initial={{ opacity: 0, y: 100 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
                    className="w-full max-w-6xl mx-auto mt-24 relative px-6"
                 >
                     <div className="glass-card glow-border overflow-hidden p-1 bg-gradient-to-b from-white/10 to-transparent">
                         <div className="bg-[#0b0f1a]/80 backdrop-blur-3xl rounded-[22px] overflow-hidden">
                             <div className="h-12 border-b border-white/5 bg-white/5 flex items-center justify-between px-6">
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    verimind_suite_v4.0
                                </div>
                                <div className="w-12" />
                             </div>
                             <div className="p-8 aspect-video md:aspect-[21/9] transition-all duration-700 bg-mesh opacity-40">
                                 {/* Visual Placeholder */}
                             </div>
                         </div>
                     </div>
                 </motion.div>
            </section>

            {/* INTEGRATED SUITE SECTION */}
            <section id="features" className="py-32 px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">The Neural <span className="text-purple-500">Suite.</span></h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Precision tools for the modern digital era.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <Link key={i} to={f.path}>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card glow-border p-10 h-full flex flex-col group relative"
                                >
                                    <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/20 group-hover:bg-purple-500 transition-colors duration-500">
                                        <f.icon size={24} className="text-purple-400 group-hover:text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 tracking-tight">{f.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm mb-12 flex-1">{f.desc}</p>
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-purple-400 group-hover:text-purple-300 transition-all">
                                        Launch Module <ArrowRight size={14} />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-32 px-8">
                <div className="max-w-5xl mx-auto glass-card p-12 md:p-24 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">Ready to <span className="text-gradient-premium">Elevate?</span></h2>
                    <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto font-medium">Join thousands of professionals leveraging Verimind to outpace the competition.</p>
                    <Link to="/dashboard" className="inline-flex items-center justify-center gap-4 px-12 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-110 transition-all">
                        Get Started Now <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-8 border-t border-white/5 text-center bg-[#0b0f1a]">
                 <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Cpu size={16} className="text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight">Verimind</span>
                 </div>
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">© 2026 Verimind Intelligent Suite • All Rights Reserved</p>
            </footer>
        </div>
    );
}
