import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MonitorPlay, 
    Sparkles, 
    Download, 
    ChevronRight, 
    FileText,
    Loader2,
    Copy
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Slide {
    id: number;
    title: string;
    content: string[];
}

export default function PPTGenerator() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [slides, setSlides] = useState<Slide[] | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const generatePPT = useCallback(async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setSlides(null);

        // Simulated AI Generation for professional slides
        setTimeout(() => {
            setSlides([
                { 
                    id: 1, 
                    title: `Introduction to ${topic}`, 
                    content: [
                        "Foundational principles of the concept.",
                        "Current industrial landscape and adoption rates.",
                        "Objective of the proposed analysis node."
                    ] 
                },
                { 
                    id: 2, 
                    title: "Core Methodology", 
                    content: [
                        "Data-driven neural synchronization.",
                        "Algorithmic flux for peak efficiency.",
                        "Recursive optimization protocols."
                    ] 
                },
                { 
                    id: 3, 
                    title: "Anticipated Benchmarks", 
                    content: [
                        "Projected efficiency gain: ~45%.",
                        "Resource allocation optimization.",
                        "Future roadmap for neural expansion."
                    ] 
                }
            ]);
            setLoading(false);
            setCurrentSlide(0);
        }, 800);
    }, [topic]);

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <header className="mb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-8 ${
                        isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                    }`}
                >
                    <MonitorPlay size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Presentation Engine</span>
                </motion.div>
                <h1 className={`text-4xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Synthetic <span className="text-emerald-500 italic">Slides</span>.
                </h1>
                <p className="text-slate-500 font-medium text-lg max-w-2xl italic leading-relaxed">
                    "Transform raw knowledge nodes into high-stakes presentation matrices with unified neural logic."
                </p>
            </header>

            {/* Input UI */}
            <div className={`p-1 rounded-[3rem] border transition-all duration-500 bg-gradient-to-b ${isDark ? 'from-white/10 to-transparent border-white/5' : 'from-slate-200 to-transparent border-slate-100 shadow-xl'}`}>
                <div className={`p-8 md:p-12 rounded-[2.8rem] ${isDark ? 'bg-[#1E293B]' : 'bg-white'}`}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                         <div className="flex-1 w-full space-y-4">
                              <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Target Topic</label>
                              <input 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Quantum Neural Networking Architecture..."
                                className={`w-full p-6 text-xl font-bold rounded-2xl outline-none transition-all ${isDark ? 'bg-white/5 text-white border-white/5 focus:border-emerald-500/50' : 'bg-slate-50 text-slate-800 border-slate-200 shadow-sm focus:border-emerald-500/30'}`}
                              />
                         </div>
                         <button
                            onClick={generatePPT}
                            disabled={loading || !topic.trim()}
                            className={`px-12 py-7 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center gap-4 h-fit self-end ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.05] premium-btn-primary shadow-2xl shadow-emerald-500/20'
                            }`}
                         >
                             {loading ? <Loader2 size={18} className="animate-spin text-white" /> : <Sparkles size={18} className="text-white" />}
                             Manifest Deck
                         </button>
                    </div>
                </div>
            </div>

            {/* Results Deck */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center justify-center space-y-8">
                         <div className="relative w-24 h-24">
                              <div className="absolute inset-0 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                   <MonitorPlay size={32} className="text-emerald-400 animate-pulse" />
                              </div>
                         </div>
                         <div className="text-center">
                              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-2">Generating Synthetic Slides</h4>
                              <p className="text-slate-500 italic text-sm">Synthesizing topic nodes into logical deck matrices...</p>
                         </div>
                    </motion.div>
                ) : slides ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="space-y-12 pb-20"
                    >
                        {/* Slide View Shell */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                             {/* Navigation Sidebar (Vertical Rail) */}
                             <div className="space-y-4">
                                  {slides.map((s, i) => (
                                      <button 
                                        key={s.id}
                                        onClick={() => setCurrentSlide(i)}
                                        className={`w-full p-5 rounded-2xl border transition-all text-left group flex items-center justify-between
                                            ${currentSlide === i 
                                                ? (isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700')
                                                : (isDark ? 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200')
                                            }`}
                                      >
                                          <div className="flex items-center gap-3">
                                               <span className="text-[10px] font-black opacity-30">{i + 1}</span>
                                               <span className="text-xs font-bold leading-tight">{s.title.substring(0, 20)}...</span>
                                          </div>
                                          <ChevronRight size={14} className={currentSlide === i ? 'opacity-100' : 'opacity-0'} />
                                      </button>
                                  ))}
                                  
                                  <div className="pt-8 flex flex-col gap-4">
                                       <button className={`w-full py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isDark ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                            <Download size={14} /> Export PPT
                                       </button>
                                  </div>
                             </div>

                             {/* Main Slide Card */}
                             <div className="lg:col-span-3">
                                  <AnimatePresence mode="wait">
                                      <motion.div 
                                        key={currentSlide}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className={`aspect-video rounded-[3rem] p-16 md:p-24 border flex flex-col justify-center relative shadow-2xl ${isDark ? 'bg-[#1E293B] border-white/5' : 'bg-white border-slate-100'}`}
                                      >
                                           <div className="absolute top-12 left-16 flex items-center gap-4 text-emerald-500">
                                                <div className="w-8 h-[2px] bg-emerald-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{currentSlide + 1} / {slides.length}</span>
                                           </div>
                                           
                                           <h2 className={`text-4xl md:text-5xl font-black mb-12 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {slides[currentSlide].title}
                                           </h2>
                                           
                                           <ul className="space-y-6">
                                                {slides[currentSlide].content.map((point, pi) => (
                                                    <li key={pi} className="flex items-start gap-4">
                                                         <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                         <p className={`text-lg md:text-xl font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                              {point}
                                                         </p>
                                                    </li>
                                                ))}
                                           </ul>
                                            
                                           {/* Visual Flair */}
                                           <div className={`absolute bottom-12 right-12 w-32 h-32 blur-3xl rounded-full ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'}`} />
                                      </motion.div>
                                  </AnimatePresence>
                                  
                                  <div className="mt-12 flex items-center justify-between px-10">
                                       <div className="flex gap-4">
                                            <button className={`p-4 rounded-xl transition-all ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}><Copy size={18} /></button>
                                            <button className={`p-4 rounded-xl transition-all ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}><FileText size={18} /></button>
                                       </div>
                                       <div className="flex gap-4">
                                            <button 
                                                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                                                className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                                            >
                                                Back
                                            </button>
                                            <button 
                                                onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                                                className={`px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${isDark ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                                            >
                                                Next Node
                                            </button>
                                       </div>
                                  </div>
                             </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="py-20 flex flex-col items-center text-center opacity-30">
                        <div className="w-20 h-20 rounded-[2rem] border border-dashed border-slate-400 flex items-center justify-center mb-6">
                            <MonitorPlay size={32} />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-2">Awaiting Metadata</h3>
                        <p className="text-xs font-medium italic">Deck matrices materialize here after topic ingestion.</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
