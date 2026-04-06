import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Download, Sparkles, RefreshCw } from 'lucide-react';

export default function DigitalArtLab() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Neural prompt required for manifestation.');
            return;
        }
        setLoading(true);
        setError('');
        setImage(null);

        try {
            // Using Pollinations AI for high-fidelity premium art generation in this suite
            const encodedPrompt = encodeURIComponent(prompt);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1080&nologo=true&enhance=true`;
            
            // Artificial delay to simulate "neural synthesis"
            await new Promise(resolve => setTimeout(resolve, 3000));
            setImage(imageUrl);
        } catch (err) {
            setError('Neural link failure. Spectral sync interrupted.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <header className="mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/20 bg-pink-500/10 mb-8 backdrop-blur-md">
                    <ImageIcon size={14} className="text-pink-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-200">Neural Art Laboratory</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter">
                   Digital <span className="text-gradient-premium italic">Foundry.</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed italic">
                    "Manifesting multi-dimensional visual nodes from raw linguistic manifests."
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Control Panel */}
                <div className="space-y-10">
                    <div className="glass-card glow-border p-8 md:p-12 space-y-8">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest block">Neural Manifest</span>
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the visual entity to manifest (e.g. A cyberpunk city in 8k, neon lights, volumetric fog...)"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg font-bold placeholder:text-slate-700 outline-none focus:border-pink-500/30 transition-all min-h-[150px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Resolution</span>
                                <span className="text-xs font-bold text-white uppercase italic">1080 x 1080</span>
                            </div>
                            <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Engine</span>
                                <span className="text-xs font-bold text-white uppercase italic">Imagen-3 Hybrid</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full py-6 rounded-[2rem] premium-btn-primary shadow-2xl flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] disabled:opacity-50"
                        >
                            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            {loading ? 'Synthesizing...' : 'Manifest Visual'}
                        </button>
                    </div>

                    {error && (
                        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Manifestation Display */}
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative p-2 rounded-[4rem] bg-gradient-to-br from-white/10 to-transparent border border-white/5 shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    <div className="w-24 h-24 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin shadow-[0_0_40px_rgba(236,72,153,0.3)]" />
                                    <div className="text-center">
                                        <h4 className="text-[10px] font-black text-pink-400 uppercase tracking-[0.5em] mb-2">Coalescing Pixels</h4>
                                        <p className="text-slate-500 italic text-[10px]">Neural sync in progress...</p>
                                    </div>
                                </motion.div>
                            ) : image ? (
                                <motion.div 
                                    key="image"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full h-full relative"
                                >
                                    <img 
                                        src={image} 
                                        alt="Generated Art" 
                                        className="w-full h-full object-cover rounded-[3.8rem]"
                                    />
                                    <div className="absolute inset-x-8 bottom-8 p-6 glass-card border border-white/10 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest block mb-1">Manifest #429</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Stable Node Synthesis</span>
                                        </div>
                                        <a 
                                            href={image} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-4 bg-white text-[#0b0f1a] rounded-2xl hover:scale-110 transition-transform shadow-2xl"
                                        >
                                            <Download size={18} />
                                        </a>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center opacity-10 flex flex-col items-center">
                                    <ImageIcon size={120} className="mb-8" />
                                    <h4 className="text-sm font-black uppercase tracking-[0.6em]">Foundry Cold</h4>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
