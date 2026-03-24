import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, 
    Loader2, 
    CheckCircle2,
    Copy,
    Terminal,
    Sparkles,
    Printer,
    Activity
} from 'lucide-react';

import { generatePDF } from '../utils/pdfExport';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { UniversalEditor } from '../components/UniversalEditor';
import { useTheme } from '../contexts/ThemeContext';

export default function Generate() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (result) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { 
                 wpm: 0, 
                 suggestions: ["Refine semantic resonance", "Synthesize additional nodes", "Check logical consistency"] 
              } 
            }));
        }
    }, [result]);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Neural prompt required for synthesis.');
            return;
        }
        setLoading(true);
        setError('');
        setResult(''); // Initialize as empty string for streaming

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/generate-stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) throw new Error('Neural link failed.');
            
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            
            if (!reader) throw new Error('Stream logic failed.');

            let currentText = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '');
                        if (dataStr === '[DONE]') break;
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.chunk) {
                                currentText += data.chunk;
                                setResult(currentText);
                            }
                        } catch (e) { /* partial chunk */ }
                    }
                }
            }
        } catch { // stream errors handled gracefully
             setError('System interrupt in Synthesis module. Neural link failed.');
        } finally {
            setLoading(false);
        }
    }, [prompt]);

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <header className="mb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-8 ${
                        isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-100 text-amber-600'
                    }`}
                >
                    <Zap size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Deep Synthesis Engine</span>
                </motion.div>
                <h1 className={`text-4xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Nexus <span className="text-amber-500 italic">Synthesis</span>.
                </h1>
                <p className="text-slate-500 font-medium text-lg max-w-2xl italic leading-relaxed">
                    "Initialize prompt for broad-spectrum intelligence synthesis. Manifest complex logic nodes with neural precision."
                </p>
            </header>

            {/* Input Workspace */}
            <div className={`p-1 rounded-[3rem] border transition-all duration-500 bg-gradient-to-b ${isDark ? 'from-white/10 to-transparent border-white/5' : 'from-slate-200 to-transparent border-slate-100 shadow-xl'}`}>
                <div className={`p-6 rounded-[2.8rem] ${isDark ? 'bg-[#1E293B]' : 'bg-white'}`}>
                    <UniversalEditor 
                        value={prompt}
                        onChange={setPrompt}
                        placeholder="Define the neural logic for synthesis..."
                        minHeight="150px"
                        maxHeight="350px"
                        isDark={isDark}
                    />
                    <div className="mt-8 flex items-center justify-between">
                         <div className="flex gap-4">
                              <span className={`text-[9px] font-black uppercase tracking-widest text-slate-500 italic`}>Spectrum Status: Optimal</span>
                         </div>
                         <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className={`px-12 py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-4 ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.05] premium-btn-primary shadow-2xl shadow-amber-500/20'
                            }`}
                         >
                             {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                             {loading ? 'Synthesizing...' : 'Manifest Logic'}
                         </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-700'} flex items-center gap-4 text-xs font-bold shadow-lg`}>
                    <Terminal size={18} />
                    {error}
                </div>
            )}

            {/* Output Perspective */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center justify-center space-y-10">
                         <div className="relative w-32 h-32">
                              <div className="absolute inset-0 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-[spin_1.5s_linear_infinite]" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                   <Zap size={48} className="text-amber-400 animate-pulse" />
                              </div>
                         </div>
                         <div className="text-center">
                              <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.5em] mb-3">Analyzing Neural Manifests</h4>
                              <p className="text-slate-500 italic text-sm">Structuring linguistic nodes for high-fidelity output...</p>
                         </div>
                    </motion.div>
                ) : result ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="space-y-12 pb-20"
                    >
                        <div className={`p-10 rounded-[3.5rem] border relative overflow-hidden flex flex-col ${isDark ? 'bg-[#1E293B] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-clean'}`}>
                             <header className="flex items-center justify-between mb-12 border-b border-white/5 pb-8 relative z-10">
                                  <div className="flex items-center gap-4">
                                       <div className={`p-4 rounded-2xl ${isDark ? 'bg-amber-500/10 text-amber-400 border border-white/5' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                            <CheckCircle2 size={24} />
                                       </div>
                                       <div>
                                            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Synthesized Result</h3>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Spectrum Model: GPT-4o Enhanced</p>
                                       </div>
                                  </div>
                                  <div className="flex gap-4">
                                       <button 
                                            onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} 
                                            className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-slate-300 hover:text-white border border-white/5' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}
                                       >
                                           <Copy size={14} className="inline mr-2" />
                                           {copied ? 'Captured' : 'Copy'}
                                       </button>
                                       <button onClick={() => generatePDF()} className="p-3.5 bg-amber-600 text-white rounded-2xl shadow-xl shadow-amber-600/20 transition-transform hover:scale-110">
                                            <Printer size={18} />
                                       </button>
                                  </div>
                             </header>

                             <div className="flex-1 relative z-10 p-4">
                                  <div className={`prose prose-invert max-w-none prose-p:text-xl md:prose-p:text-3xl prose-p:font-bold prose-p:leading-[1.6] ${isDark ? 'prose-p:text-slate-200' : 'prose-p:text-slate-800'}`}>
                                      {result.split('\n').map((para, i) => (
                                          <p key={i} className="mb-10 text-3xl font-bold last:mb-0">
                                               "{para}"
                                          </p>
                                      ))}
                                  </div>
                             </div>

                             <footer className={`mt-12 pt-8 border-t border-white/5 flex items-center justify-between opacity-50 relative z-10`}>
                                  <div className="flex items-center gap-3">
                                       <Activity size={12} className="text-amber-500" />
                                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Neural Sovereignty Verified</span>
                                  </div>
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Latency: 1.2s</span>
                             </footer>
                        </div>
                    </motion.div>
                ) : (
                    <div className="py-24 flex flex-col items-center text-center opacity-30">
                        <div className="w-24 h-24 rounded-[2.5rem] border border-dashed border-slate-400 flex items-center justify-center mb-8">
                            <Zap size={40} />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-3">Awaiting Synthesis</h3>
                        <p className="text-xs font-medium italic">Logic manifests appear here after neural initialization.</p>
                    </div>
                )}
            </AnimatePresence>

            {result && <IntelligenceReport data={{ answer: result }} type="general" content={prompt} />}
        </div>
    );
}
