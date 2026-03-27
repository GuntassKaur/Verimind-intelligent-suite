import { motion } from 'framer-motion';
import { 
    Info, 
    Zap, 
    ShieldCheck, 
    Cpu,
    ArrowRight,
    MessageSquare,
    Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6 space-y-32 pb-40">
            {/* Mission Section */}
            <section className="text-center space-y-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest"
                >
                    <Info size={14} /> Our Mission
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
                    Intelligence for the <br />
                    <span className="text-gradient">Modern Era.</span>
                </h1>
                <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                    Verimind is a purpose-driven AI platform built to simplify how humans interact with machine intelligence. 
                    We focus on clarity, reliability, and professional-grade tools.
                </p>
            </section>

            {/* Core Values */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                        <ShieldCheck size={24} className="text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white">Trust & Security</h3>
                    <p className="text-slate-500 leading-relaxed font-medium">
                        Your data security is our top priority. Every query and response is handled with industrial-grade encryption 
                        and privacy protocols to ensure your information stays yours.
                    </p>
                </div>
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                    <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                        <Zap size={24} className="text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white">Neural Speed</h3>
                    <p className="text-slate-500 leading-relaxed font-medium">
                        We optimize for latency. Our multi-agent architecture ensures that you get high-quality, 
                        structured responses in milliseconds, not seconds.
                    </p>
                </div>
            </section>

            {/* Features Spotlight */}
            <section className="space-y-16">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-white mb-4">Core Ecosystem</h2>
                    <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">What makes Verimind unique</p>
                </div>

                <div className="space-y-6">
                    {[
                        { title: "Live AI Assistant", desc: "Real-time, context-aware conversational interface with voice support.", icon: Zap },
                        { title: "Structured Chat History", desc: "A clean, persistent archive of all your interactions for later retrieval.", icon: MessageSquare },
                        { title: "Analytics Engine", desc: "Deep insights into your AI usage patterns and performance metrics.", icon: Cpu },
                        { title: "Global Intelligence", desc: "Access to world-class knowledge across any domain or language.", icon: Globe }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-8 p-8 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-3xl transition-all group">
                             <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                 <item.icon size={22} className="text-slate-400 group-hover:text-white" />
                             </div>
                             <div>
                                 <h4 className="text-xl font-black text-white mb-1">{item.title}</h4>
                                 <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                             </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="text-center pt-20">
                <div className="p-16 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-[4rem] space-y-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Ready to experience <br /> the future?</h2>
                    <Link to="/register" className="premium-btn-primary px-16 py-7 rounded-[2rem] flex items-center justify-center gap-4 group mx-auto w-fit shadow-2xl shadow-indigo-600/30">
                        <span className="text-[13px] font-black uppercase tracking-widest">Join Verimind</span>
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
