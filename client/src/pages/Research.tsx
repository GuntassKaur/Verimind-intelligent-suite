import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, BookOpen, ArrowRight, Sparkles, Cpu, Activity, Zap, History, Database, Network } from 'lucide-react';
import api from '../services/api';

const RESEARCH_NODES = [
    { icon: Globe, title: 'Web Context', desc: 'Real-time academic & news scraping' },
    { icon: BookOpen, title: 'Citation Audit', desc: 'Verify primary source documents' },
    { icon: Database, title: 'Neural Archive', desc: 'Access global verification sets' }
];

export default function Research() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Update global assistant
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('typing_update', { 
            detail: { wpm: 0, suggestions: ["Scan Web", "Analyze Journals", "Extract Citations"], tips: ["Research Lab Active", "Neural Scan Ready"] } 
        }));
    }, []);

    const handleResearch = () => {
        if (!query.trim()) return;
        setLoading(true);
        setTimeout(() => setLoading(false), 2000); // Simulate
    };

    return (
        <div className="workspace-center-content">
            {/* TOP AREA: INPUT */}
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper">
                      <button className="modern-tool-btn active">
                         <Globe size={20} className="text-indigo-400" />
                         <span>Research</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/workspace'}>
                         <Database size={20} className="text-blue-400" />
                         <span>Archive</span>
                      </button>
                </div>

                <div className="smart-gpt-editor">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 px-4 opacity-50">
                        <div className="flex items-center gap-2">
                             <Search size={14} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Deep Inquiry Lab v3.0</span>
                        </div>
                    </div>
                    
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Define your research objective or verify a complex topic..."
                        className="custom-scrollbar"
                    />

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleResearch}
                            disabled={loading || !query.trim()}
                            className="premium-btn-primary flex items-center gap-4 py-4 px-12 rounded-2xl group transition-all"
                        >
                            {loading ? (
                                <><Activity className="animate-spin" size={18} /> Gathering Context...</>
                            ) : (
                                <><Zap size={18} className="text-white" /> INITIATE DEEP SCAN</>
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* BOTTOM AREA: NODES */}
            <section className="output-bottom-area">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                      {RESEARCH_NODES.map((node, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: i * 0.1 }}
                            className="modern-card p-10 flex flex-col items-center text-center group hover:border-indigo-500/30 transition-all"
                          >
                               <div className="w-16 h-16 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center mb-8 group-hover:bg-indigo-500/10 group-hover:scale-110 transition-all">
                                    <node.icon size={32} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                               </div>
                               <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic">{node.title}</h3>
                               <p className="text-sm text-slate-500 font-medium italic opacity-70 leading-relaxed">{node.desc}</p>
                          </motion.div>
                      ))}
                 </div>

                 <div className="mt-12 max-w-6xl mx-auto">
                      <div className="modern-card bg-white/[0.01] border-white/5 p-10">
                           <div className="flex items-center gap-4 mb-8">
                                <History size={20} className="text-slate-600" />
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Research Logs</h4>
                           </div>
                           <div className="space-y-4">
                                {[1,2].map(i => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-all cursor-pointer group">
                                         <div className="flex items-center gap-6">
                                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                                                  <Network size={20} className="text-slate-700 group-hover:text-indigo-400" />
                                              </div>
                                              <div>
                                                   <h5 className="text-[11px] font-black text-white uppercase tracking-widest italic group-hover:text-indigo-100 transition-colors">Quantum Ethics Analysis #{i}</h5>
                                                   <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Neural Scan Complete</span>
                                              </div>
                                         </div>
                                         <ArrowRight size={16} className="text-slate-800 group-hover:text-indigo-500 translate-x-0 group-hover:translate-x-2 transition-all" />
                                    </div>
                                ))}
                           </div>
                      </div>
                 </div>
            </section>
        </div>
    );
}
