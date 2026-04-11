import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    ArrowRight,
    ShieldCheck,
    Keyboard,
    Sparkles,
    CheckCircle,
    Zap
} from 'lucide-react';

export default function Landing() {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="relative min-h-screen bg-transparent">
            {/* HER0 SECTION */}
            <section className="relative pt-32 pb-20 px-6">
                 <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    className="max-w-5xl mx-auto text-center relative z-10"
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 mb-8">
                        <Sparkles size={14} className="text-purple-400" />
                        <span className="text-xs font-semibold text-purple-300 uppercase tracking-widest">Simplifying Student Life</span>
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="text-5xl md:text-8xl font-black tracking-tight mb-8">
                        Your AI <span className="text-gradient">Study Assistant</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium mb-12">
                        Write better papers, check facts instantly, and master your typing speed. 
                        The all-in-one suite for students and developers.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                         <Link to="/write" className="w-full sm:w-auto">
                             <button className="btn-primary w-full sm:w-auto px-10 py-4 text-lg">
                                 Start Now <ArrowRight size={20} />
                             </button>
                         </Link>
                         <div className="flex items-center gap-4 text-slate-400 text-sm">
                             <span className="flex items-center gap-1"><CheckCircle size={16} className="text-emerald-500" /> Fast</span>
                             <span className="flex items-center gap-1"><CheckCircle size={16} className="text-emerald-500" /> Simple</span>
                             <span className="flex items-center gap-1"><CheckCircle size={16} className="text-emerald-500" /> Free</span>
                         </div>
                    </motion.div>
                 </motion.div>

                 {/* Feature Cards Preview */}
                 <div className="max-w-7xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
                    {[
                        { title: "Smart Writing", desc: "Improve grammar, fix tone, and summarize in seconds.", icon: Zap, color: "text-amber-400", path: "/write" },
                        { title: "Truth & Plagiarism", desc: "Verify facts and check for plagiarism in one click.", icon: ShieldCheck, color: "text-emerald-400", path: "/check" },
                        { title: "Focus Typing", desc: "Improve your WPM with real-time feedback.", icon: Keyboard, color: "text-blue-400", path: "/typing" }
                    ].map((feature, i) => (
                        <Link key={i} to={feature.path}>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="glass-card p-8 group h-full"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        </Link>
                    ))}
                 </div>
            </section>

            {/* Why VeriMind? */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-16">Built for Clarity.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold text-purple-400">No More Confusion</h4>
                            <p className="text-slate-400">We removed the complex "AI-speak". Everything is simple, clean, and does exactly what it says.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold text-indigo-400">Student Focused</h4>
                            <p className="text-slate-400">Features specifically designed for research, assignments, and coding productivity.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-white/5 text-center">
                 <p className="text-slate-500 text-sm font-medium">© 2026 VeriMind • Simple. High-Value. Productive.</p>
            </footer>
        </div>
    );
}

