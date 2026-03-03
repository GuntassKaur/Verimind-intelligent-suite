import { useEffect, useState } from 'react';
import { Clock, Database, ChevronRight, Search, LayoutDashboard, Download, Filter, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

interface HistoryItem {
    id: string;
    timestamp: string;
    type: string;
    query: string;
    result: any;
}

export default function History() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const { data } = await api.get('/history');
                setHistory(data);
            } catch (e) {
                console.error("Archive access failed:", e);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, []);

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'analysis': return <LayoutDashboard size={14} className="text-secondary" />;
            case 'generation': return <Database size={14} className="text-indigo-400" />;
            default: return <Database size={14} className="text-slate-400" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 pt-32 min-h-screen">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                        <Database size={12} className="text-indigo-500" />
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Archive</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">History</h1>
                    <p className="text-slate-500 font-medium">Access your past reports and generations.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        <Filter size={14} />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 transition-all">
                        <Download size={14} />
                        Export Data
                    </button>
                </div>
            </header>

            {/* Guest Notice */}
            <div className="mb-10 p-6 glass-card bg-amber-500/5 border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0">
                        <ShieldAlert className="text-amber-500" size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-tight">Temporary Guest Session</h3>
                        <p className="text-xs text-slate-500 font-medium italic">History is temporary for guests and will be cleared when you leave.</p>
                    </div>
                </div>
                <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest">
                    Login to Save Permanently
                </button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-50">
                        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Loading History...</p>
                    </div>
                ) : history.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 glass-card flex flex-col items-center justify-center text-center px-6"
                    >
                        <Search className="text-slate-700 mb-6" size={64} />
                        <h3 className="text-lg font-bold text-white mb-2">History is Empty</h3>
                        <p className="text-slate-500 font-medium italic max-w-sm">No items found in your history yet.</p>
                    </motion.div>
                ) : (
                    history.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="glass-card group hover:border-indigo-500/30 transition-all cursor-pointer overflow-hidden"
                        >
                            <div className="p-6 flex flex-col md:flex-row gap-6 md:items-center">
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            {getTypeIcon(item.type)}
                                            {item.type}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                            <Clock size={10} />
                                            {new Date(item.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        </div>
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-1 line-clamp-1 group-hover:text-indigo-400 transition-colors tracking-tight">
                                        "{item.query}"
                                    </h3>
                                    <p className="text-[12px] text-slate-500 line-clamp-2 md:line-clamp-1 italic font-mono opacity-60 leading-relaxed font-medium">
                                        {JSON.stringify(item.result)}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-10 shrink-0 md:pl-8 md:border-l border-white/5">
                                    <div className="flex items-center gap-8">
                                        <div className="text-center group-hover:scale-110 transition-transform">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</div>
                                            <div className="text-xs font-black text-emerald-400 uppercase tracking-widest">Saved</div>
                                        </div>
                                        <div className="hidden lg:block">
                                            <ChevronRight className="text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

