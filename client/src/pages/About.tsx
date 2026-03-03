import { Info, ShieldCheck, Cpu, Database, ArrowRight } from 'lucide-react';

export default function About() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
            <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                    <Info size={12} className="text-indigo-500" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Our Mission</span>
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">About VeriMind</h1>
                <p className="text-slate-500 font-medium font-sans">Ensuring accuracy and trust in the digital age.</p>
            </header>

            <div className="laptop-mock">
                <div className="laptop-screen overflow-y-auto">
                    <div className="p-12 md:p-20 space-y-20">
                        {/* MISSION */}
                        <section className="max-w-3xl">
                            <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-6">Our Mission</h2>
                            <p className="text-3xl font-bold text-white leading-tight mb-8">
                                To build the standard for <span className="text-indigo-400">Verified Content</span>.
                            </p>
                            <p className="text-lg text-slate-500 leading-relaxed font-medium">
                                VeriMind provides a robust verification system for AI-generated content.
                                We help teams ensure accuracy and originality in their reports by providing
                                powerful tools for analysis and generation.
                            </p>
                        </section>

                        {/* PILLARS */}
                        <div className="grid md:grid-cols-3 gap-12">
                            <div className="space-y-4">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                                    <Cpu className="text-indigo-400" size={20} />
                                </div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Factual Accuracy</h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    Every report is checked against reliable sources in real-time to ensure factual accuracy.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
                                    <ShieldCheck className="text-cyan-400" size={20} />
                                </div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Content Originality</h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    Advanced algorithms detect plagiarism and identify segments that may not be original.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                                    <Database className="text-purple-400" size={20} />
                                </div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">History Management</h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    A secure history of all your reports and generations for easy access and accountability.
                                </p>
                            </div>
                        </div>

                        {/* TECH STACK */}
                        <section className="pt-20 border-t border-white/5 flex flex-col md:flex-row gap-12 items-start">
                            <div className="shrink-0">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-indigo-500 pb-2">Features</h3>
                                <div className="space-y-2">
                                    {["React 18", "Python Flask", "Gemini 2.5 Flash", "MongoDB", "Factual Verification"].map(tech => (
                                        <div key={tech} className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                            <ArrowRight size={10} className="text-indigo-500" />
                                            {tech}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-indigo-500/5 p-8 rounded-2xl border border-indigo-500/10 backdrop-blur-xl">
                                <p className="text-sm text-slate-400 leading-relaxed italic font-medium">
                                    "Verification is a fundamental requirement of the modern digital world.
                                    VeriMind is built for professionals who value accuracy and quality."
                                </p>
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600" />
                                    <div>
                                        <div className="text-xs font-black text-white uppercase tracking-widest">Lead Architect</div>
                                        <div className="text-[10px] text-slate-500 font-bold">VeriMind Core Team</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
