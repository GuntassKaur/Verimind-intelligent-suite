import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare,
    Trash2, 
    Search, 
    User,
    Bot,
    Zap,
    ArrowUpRight,
    Loader2,
    Bookmark,
    BookmarkCheck,
    Calendar,
    Pin
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
    const [pinnedIds, setPinnedIds] = useState<string[]>([]);

    useEffect(() => {
        const savedPins = localStorage.getItem('verimind_pinned_ids');
        if (savedPins) setPinnedIds(JSON.parse(savedPins));
    }, []);

    const togglePin = (id: string) => {
        const newPins = pinnedIds.includes(id) 
            ? pinnedIds.filter(pid => pid !== id) 
            : [...pinnedIds, id];
        setPinnedIds(newPins);
        localStorage.setItem('verimind_pinned_ids', JSON.stringify(newPins));
    };

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
        (typeof item.result === 'string' && item.result.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const groupedHistory = filteredHistory.reduce((groups: any, item) => {
        const date = new Date(item.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (!groups[date]) groups[date] = [];
        groups[date].push(item);
        return groups;
    }, {});

    const pinnedItems = history.filter(item => pinnedIds.includes(item._id));

    return (
        <div className="workspace-center-content">
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper mb-10">
                       <button className="modern-tool-btn active">
                          <MessageSquare size={20} className="text-indigo-400" />
                          <span>Chat History</span>
                       </button>
                       <button className="modern-tool-btn" onClick={() => window.location.href='/live-ai'}>
                          <Zap size={20} className="text-indigo-400" />
                          <span>Live AI</span>
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
                 ) : (
                      <div className="space-y-16">
                           {/* Pinned Section */}
                           {pinnedItems.length > 0 && !searchTerm && (
                               <div className="space-y-6">
                                   <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 w-fit">
                                       <Pin size={14} className="text-indigo-400" />
                                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Pinned Insights</span>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                       {pinnedItems.map(item => (
                                           <motion.div 
                                               key={`pinned-${item._id}`}
                                               layoutId={item._id}
                                               className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] hover:border-indigo-500/30 transition-all cursor-pointer group"
                                               onClick={() => {
                                                   // Quick view logic
                                               }}
                                           >
                                               <div className="flex items-start justify-between mb-4">
                                                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{item.type}</span>
                                                   <button onClick={(e) => { e.stopPropagation(); togglePin(item._id); }} className="text-indigo-400"><BookmarkCheck size={16} /></button>
                                               </div>
                                               <p className="text-sm text-slate-300 font-medium line-clamp-3 mb-4 italic">"{item.content}"</p>
                                               <p className="text-xs text-indigo-100/50 line-clamp-2">{(typeof item.result === 'string' ? item.result : 'Protocol analysis data available.')}</p>
                                           </motion.div>
                                       ))}
                                   </div>
                               </div>
                           )}

                           {/* Main History grouped by Sessions */}
                           {Object.entries(groupedHistory).map(([date, items]: [string, any]) => (
                               <div key={date} className="space-y-8">
                                   <div className="flex items-center gap-4 opacity-40 sticky top-0 bg-[#0f172a] py-6 z-10 border-b border-white/5 mx-[-2rem] px-[2rem]">
                                       <Calendar size={14} className="text-indigo-400" />
                                       <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">{date}</h3>
                                   </div>

                                   <div className="space-y-12 pl-4 border-l border-white/5">
                                        <AnimatePresence>
                                            {items.map((item: any) => (
                                                <motion.div 
                                                    key={item._id} 
                                                    initial={{ opacity: 0, x: -10 }} 
                                                    animate={{ opacity: 1, x: 0 }} 
                                                    className="space-y-4"
                                                >
                                                    {/* User Message */}
                                                    <div className="flex justify-start">
                                                        <div className="flex flex-col max-w-[80%]">
                                                            <div className="flex items-center gap-2 mb-2 px-2">
                                                                <User size={12} className="text-indigo-400" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">You</span>
                                                            </div>
                                                            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl rounded-tl-none shadow-xl">
                                                                <p className="text-sm font-medium text-slate-300 italic">"{item.content}"</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* AI Response */}
                                                    <div className="flex justify-end relative group">
                                                        <div className="flex flex-col max-w-[85%] items-end">
                                                            <div className="flex items-center gap-2 mb-2 px-2">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 text-right">Verimind Protocol</span>
                                                                <Bot size={12} className="text-indigo-400" />
                                                            </div>
                                                            <div className="bg-gradient-to-br from-indigo-500/[0.08] to-purple-500/[0.08] border border-white/10 p-8 rounded-[2.5rem] rounded-tr-none shadow-2xl relative w-full">
                                                                <div className="absolute -top-3 -left-3 bg-indigo-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                                                                    {item.type}
                                                                </div>
                                                                <p className="text-base text-white leading-relaxed whitespace-pre-wrap font-light">
                                                                    {typeof item.result === 'string' ? item.result : JSON.stringify(item.result, null, 2)}
                                                                </p>
                                                                
                                                                <div className="mt-8 flex flex-wrap gap-2 md:opacity-0 group-hover:opacity-100 transition-all">
                                                                    <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">Regenerate</button>
                                                                    <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">Summarize</button>
                                                                    <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">Deep Dive</button>
                                                                </div>

                                                                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                                                    <div className="flex items-center gap-4">
                                                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                                                            {new Date(item.createdAt).toLocaleTimeString()}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <button onClick={() => togglePin(item._id)} className={`p-2 rounded-lg border transition-all ${pinnedIds.includes(item._id) ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}>
                                                                            {pinnedIds.includes(item._id) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                                                                        </button>
                                                                        <button onClick={() => deleteItem(item._id)} className="p-2 border border-rose-500/20 bg-rose-500/5 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-all"><Trash2 size={14} /></button>
                                                                        <button className="p-2 border border-white/10 bg-white/5 text-slate-400 rounded-lg hover:text-white transition-all"><ArrowUpRight size={14} /></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                   </div>
                               </div>
                           ))}

                           {filteredHistory.length === 0 && (
                               <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                                    <MessageSquare size={64} className="text-slate-800 mb-8 grayscale" />
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">No streams found for this search manifest</p>
                               </div>
                           )}
                      </div>
                 )}
            </section>

        </div>
    );
}
