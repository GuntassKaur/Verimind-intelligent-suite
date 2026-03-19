import { useEffect, useState } from 'react';
import { Clock, Database, ChevronRight, Search, LayoutDashboard, Download, Filter, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

interface HistoryItem {
    id: string;
    timestamp: string;
    type: string;
    query: string;
    result: Record<string, unknown>;
}

export default function History() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);

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

    // Debounced Search Filter
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!searchQuery.trim()) {
                setFilteredHistory(history);
            } else {
                const q = searchQuery.toLowerCase();
                setFilteredHistory(history.filter(item => 
                    item.query.toLowerCase().includes(q) || 
                    item.type.toLowerCase().includes(q)
                ));
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, history]);

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'analysis': return <LayoutDashboard size={14} className="text-secondary" />;
            case 'generation': return <Database size={14} className="text-indigo-400" />;
            default: return <Database size={14} className="text-slate-400" />;
        }
    };

    return (
        <div className="tool-container pb-20">
            <header className="mb-8 md:mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                        <Database size={12} className="text-indigo-500" />
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Archive</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">History</h1>
                    <p className="text-slate-500 font-medium text-sm md:text-base">Access your past reports and generations.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative group flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                        <input 
                            type="text"
                            placeholder="Search archive..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <Filter size={14} />
                            Filter
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">
                            <Download size={14} />
                            Export
                        </button>
                    </div>
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
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass-panel p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                                <div className="flex-grow space-y-4">
                                    <div className="flex gap-4">
                                        <div className="shimmer h-5 w-24 rounded-full opacity-30" />
                                        <div className="shimmer h-5 w-32 rounded-full opacity-20" />
                                    </div>
                                    <div className="shimmer h-8 w-3/4 rounded-xl" />
                                    <div className="shimmer h-4 w-full rounded-full opacity-10" />
                                </div>
                                <div className="shimmer h-12 w-32 rounded-2xl shrink-0 opacity-20" />
                            </div>
                        ))}
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-24 md:py-40 glass-panel flex flex-col items-center justify-center text-center px-6 bg-white/[0.01]"
                    >
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 md:mb-8 border border-white/5 shadow-inner">
                            <Search className="text-slate-800" size={40} />
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-white mb-2 uppercase tracking-tight">{searchQuery ? 'No results found' : 'Archive is Empty'}</h3>
                        <p className="text-slate-500 text-xs md:text-sm font-medium italic max-w-sm">
                            {searchQuery ? `No records match "${searchQuery}"` : 'Initiate a process to generate persistent documentation.'}
                        </p>
                    </motion.div>
                ) : (
                    filteredHistory.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-panel group hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all cursor-pointer overflow-hidden p-0"
                        >
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 md:items-center relative">
                                {/* Highlight line */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-60 transition-opacity" />

                                <div className="flex-grow min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4">
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/5 text-[10px] font-black text-indigo-400 uppercase tracking-widest group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                                            {getTypeIcon(item.type)}
                                            {item.type}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest border-l border-white/5 pl-4">
                                            <Clock size={12} className="opacity-50" />
                                            {new Date(item.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        </div>
                                    </div>
                                    <h3 className="text-lg md:text-2xl font-black text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors tracking-tight leading-tight">
                                        {item.query}
                                    </h3>
                                    <p className="text-xs md:text-sm text-slate-500 line-clamp-2 md:line-clamp-1 italic font-medium opacity-60 leading-relaxed max-w-4xl">
                                        {JSON.stringify(item.result)}
                                    </p>
                                </div>

                                <div className="flex flex-row md:flex-col lg:flex-row items-center justify-between md:justify-center lg:justify-end gap-6 md:gap-4 lg:gap-12 shrink-0 md:pl-0 lg:pl-10 md:border-l-0 lg:border-l border-white/5">
                                    <div className="flex items-center gap-6 md:gap-10">
                                        <div className="text-center group-hover:scale-105 transition-transform duration-300">
                                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">State</div>
                                            <div className="text-[10px] md:text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                Archived
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/10 text-slate-700 group-hover:text-indigo-400 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5 transition-all">
                                            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
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

