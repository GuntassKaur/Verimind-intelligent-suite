import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Zap,
    Cpu,
    ArrowRight,
    Star,
    BarChart3,
    Network,
    ShieldCheck,
    Bot
} from 'lucide-react';

export default function Landing() {
    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const features = [
        { title: "Real-Time Processing", desc: "Experience ultra-low latency inference with our edge-optimized AI architecture, deployed globally.", icon: Zap },
        { title: "Contextual Memory", desc: "VeriMind remembers past interactions, providing accurate, long-term contextual analysis.", icon: Network },
        { title: "Enterprise Security", desc: "Bank-grade encryption end-to-end. Your data is absolutely never used to train our base models.", icon: ShieldCheck },
        { title: "Advanced Analytics", desc: "Deep dive into execution paths and logic graphs for complete AI transparency.", icon: BarChart3 },
        { title: "Autonomous Agents", desc: "Deploy intelligent agents that run complex multi-step workflows entirely in the background.", icon: Bot },
        { title: "Seamless SDK Integrations", desc: "Connect perfectly with your existing pipelines via our high-throughput REST API.", icon: Cpu }
    ];

    return (
        <div className="bg-[#0B0F19] text-[#F8FAFC] overflow-x-hidden font-sans relative -mt-24 pt-24 min-h-screen">
            {/* Soft Indigo / Purple Ambient Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/5 to-transparent blur-[100px] pointer-events-none -z-10" />
            
            {/* HERO SECTION */}
            <header className="relative pt-20 pb-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                 <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
                    
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 mb-8 mt-4 hover:bg-indigo-500/20 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span className="text-sm font-medium text-indigo-300">VeriMind Core v2.0 is Live</span>
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[5rem] font-bold tracking-tight text-white leading-[1.1] mb-6 max-w-4xl mx-auto">
                        AI That Thinks. <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Not Just Responds.</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-10">
                        A real-time intelligent system for secure decision-making, in-depth analysis, and enterprise-scale automation.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                         <Link to="/live-ai" className="w-full sm:w-auto">
                             <button className="w-full px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center gap-2 text-base font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02] active:scale-95">
                                 Start Live AI Demo <ArrowRight size={18} />
                             </button>
                         </Link>
                         <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-base font-medium text-white hover:bg-white/10 transition-all active:scale-95">
                              View Documentation
                         </button>
                    </motion.div>
                 </motion.div>

                 {/* Premium Glassmorphism Dashboard Preview */}
                 <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="w-full max-w-5xl mx-auto mt-20 relative px-4 perspective-1000">
                     <div className="w-full aspect-[16/9] bg-[#111827]/80 border border-white/10 rounded-2xl shadow-[0_30px_100px_-20px_rgba(99,102,241,0.3)] backdrop-blur-2xl overflow-hidden relative flex flex-col transform">
                         <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                             <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                             <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                             <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                         </div>
                         <div className="flex-1 p-6 sm:p-10 flex gap-6">
                             {/* Mock UI */}
                             <div className="w-1/4 h-full hidden lg:flex flex-col gap-4">
                                <div className="h-8 w-2/3 bg-white/5 rounded-md" />
                                <div className="h-8 w-full bg-white/5 rounded-md" />
                                <div className="h-8 w-4/5 bg-white/5 rounded-md" />
                                <div className="h-8 w-5/6 bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-md" />
                                <div className="h-8 w-full bg-white/5 rounded-md" />
                             </div>
                             <div className="flex-1 flex flex-col gap-6">
                                <div className="h-40 w-full bg-gradient-to-br from-indigo-500/10 to-transparent rounded-xl border border-white/5 flex flex-col justify-end p-6">
                                     <div className="h-4 w-1/3 bg-indigo-400/50 rounded" />
                                     <div className="h-8 w-1/2 bg-white/10 rounded mt-3" />
                                </div>
                                <div className="flex gap-6 flex-1">
                                    <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col gap-3">
                                        <div className="h-24 bg-white/[0.02] rounded-lg" />
                                        <div className="h-4 w-full bg-white/[0.02] rounded" />
                                        <div className="h-4 w-2/3 bg-white/[0.02] rounded" />
                                    </div>
                                    <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-4 hidden md:flex flex-col gap-3">
                                        <div className="h-24 bg-white/[0.02] rounded-lg" />
                                        <div className="h-4 w-full bg-white/[0.02] rounded" />
                                        <div className="h-4 w-4/5 bg-white/[0.02] rounded" />
                                    </div>
                                </div>
                             </div>
                         </div>
                     </div>
                 </motion.div>
            </header>

            {/* FEATURES SECTION (Premium Saas Cards) */}
            <section id="features" className="py-24 px-6 relative z-10 border-t border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Uncompromising Performance</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to automate reasoning and scale your intelligent workflows instantly.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-white/10 transition-all hover:-translate-y-1 shadow-sm"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 rounded-xl flex items-center justify-center mb-6 border border-white/5">
                                    <f.icon size={22} className="text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                                <p className="text-slate-400 leading-relaxed font-medium text-sm">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-12 text-center">Trusted By Engineering Leaders</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { quote: "VeriMind completely redefined how our engineering team handles automated testing and architectural reviews.", author: "Sarah Jenkins", role: "CTO, TechFlow" },
                            { quote: "The Live AI feature is unparalleled. It feels less like using a software tool and more like conversing with a colleague.", author: "David Chen", role: "Director of Product, Nexus" },
                            { quote: "We've reduced our data analysis time by 80%. The precision and lack of hallucination is exactly what we need.", author: "Elena Rodriguez", role: "Lead Analyst" }
                        ].map((t, i) => (
                            <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col h-full hover:bg-white/[0.04] transition-colors">
                                <div className="flex gap-1 mb-6 text-amber-400">
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <p className="text-slate-300 text-lg mb-6 flex-1">"{t.quote}"</p>
                                <div>
                                    <h4 className="font-semibold text-white">{t.author}</h4>
                                    <p className="text-sm text-slate-500">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 relative overflow-hidden border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center relative z-10 bg-gradient-to-br from-indigo-500/10 to-transparent p-12 rounded-3xl border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">Scale Your Intelligence Today</h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">Join thousands of professionals using VeriMind to confidently accomplish their most complex tasks.</p>
                    <Link to="/live-ai" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-1">
                        Sign Up For Free <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
