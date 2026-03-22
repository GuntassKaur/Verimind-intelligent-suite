import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    History as HistoryIcon, 
    Trash2, 
    Search, 
    FileText, 
    Clock, 
    Zap,
    Cpu,
    ArrowUpRight,
    Activity,
    Loader2
} from 'lucide-react';
import api from '../services/api';

interface HistoryItem {
    _id: string;
    type: string;
    content: string;
    result: unknown;
    createdAt: string;
}

export default function History() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/history');
            if (data.success) {
                setHistory(data.history);
            }
        } catch (err) {
            console.error('Temporal link failed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const deleteItem = async (id: string) => {
         try {
             await api.delete(`/api/history/${id}`);
             setHistory(prev => prev.filter(item => item._id !== id));
         } catch (err) {
             console.error('Erasure protocol failed:', err);
         }
    };

    const filteredHistory = history.filter(item => 
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="workspace-center-content">
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper mb-10">
                      <button className="modern-tool-btn active">
                         <HistoryIcon size={20} className="text-indigo-400" />
                         <span>Temporal Logs</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/workspace'}>
                         <Cpu size={20} className="text-indigo-400" />
                         <span>Studio Main</span>
                      </button>
                </div>

                <div className="smart-gpt-editor bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6 px-4 opacity-40">
                         <div className="flex items-center gap-3">
                             <Search size={16} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Audit Search</span>
                         </div>
                    </div>

                    <div className="relative group mb-10">
                         <Search className="absolute left-6 top-6 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={24} />
                         <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Recall specific temporal coordinates..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-20 pr-10 py-6 text-xl font-serif italic text-white outline-none focus:border-indigo-500/30 transition-all placeholder:text-slate-800"
                         />
                    </div>
                </div>
            </section>

            <section className="output-bottom-area pb-20">
                 {loading ? (
                      <div className="flex flex-col items-center justify-center py-20 opacity-30">
                           <Loader2 className="animate-spin text-indigo-400 mb-8" size={64} />
                           <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Recalling Streams...</p>
                      </div>
                 ) : filteredHistory.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                           <HistoryIcon size={64} className="text-slate-800 mb-8 grayscale" />
                           <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">Temporal Void</p>
                      </div>
                 ) : (
                      <div className="space-y-8">
                           <AnimatePresence>
                               {filteredHistory.map((item, i) => (
                                   <motion.div 
                                      key={item._id} 
                                      initial={{ opacity: 0, y: 20 }} 
                                      animate={{ opacity: 1, y: 0 }} 
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      transition={{ delay: i * 0.05 }}
                                      className="modern-card p-10 bg-white/[0.01] border-white/5 group hover:bg-white/[0.02] transition-colors"
                                   >
                                       <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-6 mb-8">
                                                 <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                                     <Zap size={20} className="text-indigo-400" />
                                                 </div>
                                                 <div>
                                                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 block">{item.type} manifest</span>
                                                      <h4 className="text-xl text-white font-serif italic leading-none">{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                                                 </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                 <button onClick={() => deleteItem(item._id)} className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/20 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                                 <button className="p-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:text-white transition-all"><ArrowUpRight size={16} /></button>
                                            </div>
                                       </div>

                                       <div className="relative p-8 bg-black/20 rounded-2xl border border-white/5 mb-8">
                                            <div className="flex items-center gap-3 mb-6 opacity-40">
                                                 <FileText size={14} className="text-slate-600" />
                                                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Archived Content Abstract</span>
                                            </div>
                                            <p className="text-[14px] text-slate-400 font-medium italic leading-relaxed line-clamp-3">"{item.content}"</p>
                                       </div>

                                       <div className="flex items-center justify-between pointer-events-none">
                                            <div className="flex items-center gap-6 opacity-30">
                                                 <Clock size={14} className="text-slate-600" />
                                                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{new Date(item.createdAt).toLocaleTimeString()} SYNCHRONIZED</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                 <Activity size={12} className="text-indigo-400 animate-pulse" />
                                                 <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Temporal Protocol Z-1</span>
                                            </div>
                                       </div>
                                   </motion.div>
                               ))}
                           </AnimatePresence>
                      </div>
                 )}
            </section>
        </div>
    );
}
