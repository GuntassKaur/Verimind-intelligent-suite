import React from 'react';
import { motion } from 'framer-motion';
import { 
    Sparkles, Lightbulb, Zap, 
    CheckCircle2, TrendingUp, Info, 
    Wand2, ShieldCheck, FileText, Globe 
} from 'lucide-react';

interface AppAssistantPanelProps {
  wpm?: number;
  suggestions?: string[];
  tips?: string[];
}

export const AppAssistantPanel: React.FC<AppAssistantPanelProps> = ({ 
  wpm = 0, 
  suggestions = ["Refine structural tone", "Enhance factual density", "Sync logic across nodes"], 
  tips = ["Active voice resonates faster", "Verification IDs ensure protocol trust", "Keep paragraphs under 350 characters"] 
}) => {
  const [tipIndex, setTipIndex] = React.useState(0);
  React.useEffect(() => {
    setTipIndex(Math.floor(Math.random() * tips.length));
  }, [tips.length]);

  return (
    <aside className="insights-side-panel no-print hidden xl:flex flex-col gap-10">
      {/* ─── Header ─── */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/10 rotate-3 hover:rotate-0 transition-all">
          <Sparkles className="text-indigo-400" size={22} />
        </div>
        <div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">Neural Insights</h3>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1 opacity-60">Synchronized Protocol</p>
        </div>
      </div>

      {/* ─── Typing Insight ─── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
            <Zap size={14} className="text-amber-400 animate-pulse" /> Velocity
          </span>
          <div className="flex gap-1">
             {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-1 h-1 rounded-full ${wpm > 40 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
             ))}
          </div>
        </div>
        <div className="modern-card p-6 bg-white/[0.01] border-white/5 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="flex items-end gap-3 mb-3 relative z-10">
             <span className="text-4xl font-black text-white tracking-tighter italic">{wpm}</span>
             <span className="text-[9px] font-black text-slate-600 mb-2 uppercase tracking-widest leading-none">WPM</span>
           </div>
           <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mb-3 relative z-10">
              <motion.div 
                className="bg-indigo-500 h-full" 
                animate={{ width: `${Math.min(wpm, 100)}%` }}
                transition={{ type: 'spring', stiffness: 50 }}
              />
           </div>
           <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed relative z-10">
             {wpm < 30 ? "Establishing baseline cadence..." : wpm < 60 ? "Balanced throughput detected." : "Elite cognitive synchronization active."}
           </p>
        </div>
      </div>

      {/* ─── Quick Actions (NEW) ─── */}
      <div className="space-y-5">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 px-1">
          <Wand2 size={14} className="text-purple-400" /> Strategic Commands
        </h4>
        <div className="grid grid-cols-2 gap-3">
            {[
                { icon: ShieldCheck, label: 'Audit', color: 'text-blue-400' },
                { icon: FileText, label: 'Draft', color: 'text-indigo-400' },
                { icon: Globe, label: 'Verify', color: 'text-emerald-400' },
                { icon: Zap, label: 'Pulse', color: 'text-amber-400' }
            ].map((btn, i) => (
                <button key={i} className="flex flex-col items-center justify-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:scale-[1.05] transition-all group">
                    <btn.icon size={16} className={`${btn.color} mb-2 group-hover:scale-110 transition-transform`} />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">{btn.label}</span>
                </button>
            ))}
        </div>
      </div>

      {/* ─── Smart Suggestions ─── */}
      <div className="space-y-5">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 px-1">
          <Lightbulb size={14} className="text-indigo-400" /> Optimization
        </h4>
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/10 group-hover:border-indigo-500/30">
                <CheckCircle2 size={12} className="text-indigo-400" />
              </div>
              <span className="text-[10px] text-slate-400 font-bold leading-tight group-hover:text-slate-100 transition-colors">{s}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Pro Tip Card ─── */}
      <div className="mt-auto pt-8 border-t border-white/5">
        <div className="p-8 bg-[#0D1117] border border-indigo-500/10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform">
              <TrendingUp size={80} className="text-indigo-400" />
           </div>
           <h5 className="text-[9px] font-black text-white uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
             <Info size={14} className="text-indigo-400" /> Strategic Protocol
           </h5>
           <p className="text-[11px] text-slate-400 leading-relaxed font-semibold italic relative z-10 selection:bg-indigo-500/30">
             "{tips[tipIndex]}"
           </p>
           <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-indigo-500/30" />
        </div>
      </div>
    </aside>
  );
};
