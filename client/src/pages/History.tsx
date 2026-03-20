import { useEffect, useState } from 'react';
import { Clock, Database, ChevronRight, Search, LayoutDashboard, Download, Filter, ShieldAlert, Cpu, Zap, Activity, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

interface HistoryItem {
    id: string;
    timestamp: string;
    type: string;
    query: string;
    result: Record<string, any>;
}

export default function History() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const { data } = await api.get('/api/history');
                const list = data.success ? data.data : data;
                setHistory(Array.isArray(list) ? list : []);
            } catch (e) {
                console.error("Archive access failed:", e);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();

        window.dispatchEvent(new CustomEvent('typing_update', { 
            detail: { wpm: 0, suggestions: ["Search by keyword", "Filter by type", "Export archive"] } 
        }));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!searchQuery.trim()) setFilteredHistory(history);
            else {
                const q = searchQuery.toLowerCase();
                setFilteredHistory(history.filter(item => 
                    item.query?.toLowerCase().includes(q) || 
                    item.type?.toLowerCase().includes(q)
                ));
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, history]);

    return (
        <div className="workspace-center-content">
            {/* HEADER AREA: SEARCH & FILTER */}
            <section className="input-top-area no-print">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                             <Database size={24} />
                        </div>
                        <div>
                             <h2 className="text-xl font-black text-white uppercase tracking-widest">Neural Archive</h2>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Memory Node v5.0</span>
                        </div>
                     </div>
                     <div className="flex gap-4 w-full md:w-auto">
                          <div className="relative flex-1 md:w-80">
                               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                               <input 
                                 type="text" 
                                 placeholder="Search semantic cluster..." 
                                 value={searchQuery}
                                 onChange={(e) => setSearchQuery(e.target.value)}
                                 className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-800"
                               />
                          </div>
                     </div>
                </div>

                <div className="tool-grid-wrapper mt-4">
                      {['All', 'Analysis', 'Generation', 'Visuals'].map(cat => (
                          <button key={cat} className={`modern-tool-btn ${cat === 'All' ? 'active' : ''}`}>
                             <span>{cat}</span>
                          </button>
                      ))}
                </div>
            </section>

            {/* RESULTS: HISTORY LIST */}
            <section className="output-bottom-area">
                <AnimatePresence mode="wait">
                    {loading ? (
                         <div key="load" className="space-y-6 max-w-5xl mx-auto">
                              {[1,2,3].map(i => <div key={i} className="shimmer h-32 rounded-3xl" />)}
                         </div>
                    ) : filteredHistory.length === 0 ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 opacity-20">
                             <Database size={64} className="text-slate-600 mb-6" />
                             <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Archive node restricted or empty</p>
                        </motion.div>
                    ) : (
                        <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-5xl mx-auto pb-20">
                             {filteredHistory.map((item, i) => (
                                  <motion.div 
                                    key={item.id} 
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    transition={{ delay: i * 0.05 }}
                                    className="modern-card p-0 overflow-hidden group hover:border-indigo-500/30 transition-all"
                                  >
                                      <div className="p-8 flex items-center gap-8 relative">
                                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                                              {item.type?.toLowerCase().includes('gen') ? <Zap size={20} className="text-indigo-400" /> : <Activity size={20} className="text-blue-400" />}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                               <div className="flex items-center gap-4 mb-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-60 group-hover:opacity-100 transition-opacity">{item.type}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-800" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{new Date(item.timestamp).toLocaleDateString()}</span>
                                               </div>
                                               <h3 className="text-xl font-black text-white uppercase tracking-tighter truncate group-hover:text-indigo-100 transition-colors uppercase italic">{item.query || "Process Unit"}</h3>
                                          </div>
                                          <div className="hidden md:flex items-center gap-6 pr-4">
                                               <div className="text-right">
                                                   <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest block">Status</span>
                                                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mt-1">
                                                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                       Archived
                                                   </span>
                                               </div>
                                               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-700 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                                                   <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                                               </div>
                                          </div>
                                      </div>
                                  </motion.div>
                             ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Guest Notice */}
            <AnimatePresence>
                {!localStorage.getItem('user_name') && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6 no-print">
                         <div className="modern-card bg-amber-500/5 border-amber-500/20 backdrop-blur-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                                     <ShieldAlert className="text-amber-500" size={20} />
                                 </div>
                                 <div className="text-center sm:text-left">
                                     <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Ephemeral Session</h3>
                                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">History is temporary. Login to persist documentation.</p>
                                 </div>
                             </div>
                             <button onClick={() => window.location.href='/login'} className="px-6 py-2.5 bg-amber-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all">Login Sync</button>
                         </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
