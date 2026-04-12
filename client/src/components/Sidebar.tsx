import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShieldCheck, 
    Brain, 
    Keyboard, 
    Sparkles,
    Network
} from 'lucide-react';

export const Sidebar = () => {
    const navItems = [
        { path: '/dashboard', label: 'Command Hub', icon: LayoutDashboard },
        { path: '/write', label: 'Smart Writing', icon: Sparkles },
        { path: '/check', label: 'Truth & Plagiarism', icon: ShieldCheck },
        { path: '/humanize', label: 'AI Humanizer', icon: Brain },
        { path: '/typing', label: 'Typing Lab', icon: Keyboard },
        { path: '/settings', label: 'Settings', icon: Network },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0b0f1a] border-r border-white/5 flex flex-col pt-24 z-[90] hidden lg:flex font-main">
            <div className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="px-4 mb-6">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Neural Modules</span>
                </div>
                {navItems.map((item) => (
                    <NavLink 
                        key={item.path} 
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group
                            ${isActive 
                                ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]' 
                                : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                            }
                        `}
                    >
                        <item.icon size={18} className="transition-transform group-hover:scale-110" />
                        <span className="text-xs font-bold tracking-wide uppercase">{item.label}</span>
                    </NavLink>
                ))}
            </div>
            
            <div className="p-6">
                <div className="glass-card p-4 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                         <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Status</span>
                    </div>
                    <div className="text-xs font-bold text-slate-200">Optimal Connection</div>
                </div>
            </div>
        </aside>
    );
};
