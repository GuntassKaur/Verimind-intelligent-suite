import { motion } from 'framer-motion';
import { Globe, Search, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

export default function Research() {
    return (
        <div className="tool-container pb-20">
            <header className="mb-8 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 md:mb-6"
                >
                    <Globe size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Deep Scan Active</span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Research Assistant</h1>
                <p className="text-slate-400 font-medium text-base md:text-lg max-w-2xl">
                    Automated intelligence gathering and verification engine for complex topics.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-6 md:p-8 bg-[#0d1117]/40">
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 text-indigo-400 shrink-0">
                                <Search size={20} className="md:w-6 md:h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">Intelligence Query</h2>
                                <p className="text-slate-500 text-[10px] md:text-xs font-medium">Define your research objective</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <textarea
                                className="custom-editor min-h-[120px] md:min-h-[150px] w-full"
                                placeholder="Describe what you want to research or verify in detail..."
                            />
                            <div className="flex justify-end">
                                <button className="premium-btn-primary w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 flex items-center justify-center gap-2">
                                    <Sparkles size={18} />
                                    <span className="text-[10px] md:text-xs">START DEEP SCAN</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResearchFeatureCard
                            icon={Globe}
                            title="Live Web Context"
                            desc="Real-time data scraping from academic and news sources."
                        />
                        <ResearchFeatureCard
                            icon={BookOpen}
                            title="Citation Audit"
                            desc="Verify claims against primary source documents."
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 bg-indigo-500/[0.03] border-indigo-500/10 h-full">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Recent Reports</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:border-indigo-500/30 transition-all cursor-pointer">
                                    <h4 className="text-xs font-bold text-slate-200 mb-1">Quantum Computing Ethics</h4>
                                    <p className="text-[10px] text-slate-500">2 hours ago · 14 sources verified</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ResearchFeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) {
    return (
        <div className="glass-card p-6 bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all group">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500/10 transition-colors">
                <Icon size={18} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h4 className="text-sm font-black text-white uppercase mb-2">{title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
        </div>
    );
}
