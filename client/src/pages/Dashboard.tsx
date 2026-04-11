import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Sparkles,
    ShieldCheck,
    Keyboard,
    ArrowRight,
    Zap,
    BookOpen,
    Layout
} from 'lucide-react';

export default function UserDashboard() {
    return (
        <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
            {/* Header */}
            <header className="space-y-4">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-500/10 text-xs font-bold text-purple-400 border border-purple-500/20"
                >
                    <Zap size={14} /> Ready to help
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                    Welcome back, <span className="text-gradient">Student</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Choose a tool to start your productive session. Everything you need in one place.
                </p>
            </header>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <DashboardCard 
                    title="Smart Writing" 
                    desc="Improve text, fix grammar, and summarize instantly." 
                    icon={Sparkles} 
                    path="/write" 
                    color="from-purple-500" 
                />
                <DashboardCard 
                    title="Truth & Plagiarism" 
                    desc="Combine fact-checking and plagiarism detection in one step." 
                    icon={ShieldCheck} 
                    path="/check" 
                    color="from-emerald-500" 
                />
                <DashboardCard 
                    title="Typing Lab" 
                    desc="Master your typing speed with real-time feedback." 
                    icon={Keyboard} 
                    path="/typing" 
                    color="from-blue-500" 
                />
            </div>

            {/* Quick Tips / Placeholder for future stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
                <div className="glass-card p-8 flex items-start gap-6">
                    <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-2">Pro Tip: 1-Click Improvement</h4>
                        <p className="text-slate-400 text-sm">Use the "Improve" button in the Write Assistant to instantly rewrite paragraphs for better clarity.</p>
                    </div>
                </div>
                <div className="glass-card p-8 flex items-start gap-6">
                    <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400">
                        <Layout size={24} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-2">Clarity Score</h4>
                        <p className="text-slate-400 text-sm">Always check your Clarity Score. A score above 80 means your text is easy for anyone to understand.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardCard({ title, desc, icon: Icon, path, color }: { title: string, desc: string, icon: any, path: string, color: string }) {
    return (
        <Link to={path} className="glass-card p-10 group relative overflow-hidden flex flex-col h-full hover:scale-[1.02]">
            <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${color} to-transparent blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity`} />
            
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-purple-600 transition-all duration-500">
                <Icon size={32} className="text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-slate-400 leading-relaxed font-medium mb-12 flex-grow">{desc}</p>
            
            <div className="flex items-center gap-2 text-sm font-bold text-purple-400 group-hover:translate-x-2 transition-transform">
                Open Tool <ArrowRight size={18} />
            </div>
        </Link>
    );
}

