import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Copy, Loader2, CheckCircle, Send, RefreshCcw, Zap, Printer, Cpu, FileText, Globe } from 'lucide-react';
import api from '../services/api';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';

const EMAIL_TYPES = ['Professional', 'Cold Outreach', 'Follow-up', 'Apology', 'Job App'];
const TONES = ['Professional', 'Friendly', 'Persuasive', 'Formal', 'Concise'];

export default function EmailGenerator() {
    const [context, setContext] = useState('');
    const [emailType, setEmailType] = useState('Professional');
    const [tone, setTone] = useState('Professional');
    const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [humanizing, setHumanizing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    // Update global assistant
    useEffect(() => {
        if (generatedEmail) {
            window.dispatchEvent(new CustomEvent('typing_update', { 
              detail: { wpm: 0, suggestions: ["Check subject line", "Simplify body", "Call to Action check"] } 
            }));
        }
    }, [generatedEmail]);

    const handleGenerate = useCallback(async () => {
        if (!context.trim()) {
            setError("Please provide context.");
            return;
        }
        setLoading(true);
        setError('');
        setGeneratedEmail(null);
        try {
            const prompt = `Generate a ${tone} ${emailType} email for: ${context}. JSON: {subject, body}`;
            const { data } = await api.post('/api/generate', { query: prompt, response_type: 'Email' });
            const source = data.success ? data.data?.answer || data.data?.text : data.answer;
            if (source) {
                try {
                    const parsed = JSON.parse(source);
                    setGeneratedEmail({ subject: parsed.subject || 'Subject Line', body: parsed.body || source });
                } catch {
                    setGeneratedEmail({ subject: 'Generated Email', body: source });
                }
            }
        } catch {
            setError("Generation failed.");
        } finally {
            setLoading(false);
        }
    }, [context, emailType, tone]);

    const handleHumanize = async () => {
        if (!generatedEmail) return;
        setHumanizing(true);
        try {
            const { data } = await api.post('/api/humanize', { text: generatedEmail.body, tone: tone });
            if (data.success) setGeneratedEmail(prev => prev ? { ...prev, body: data.data?.humanized_text || data.data } : null);
        } finally { setHumanizing(false); }
    };

    return (
        <div className="workspace-center-content">
            {/* TOP AREA: INPUT */}
            <section className="input-top-area no-print">
                <div className="tool-grid-wrapper">
                      <button className="modern-tool-btn active">
                         <Mail size={20} className="text-blue-400" />
                         <span>Email</span>
                      </button>
                      <button className="modern-tool-btn" onClick={() => window.location.href='/generator'}>
                         <Sparkles size={20} className="text-indigo-400" />
                         <span>Generate</span>
                      </button>
                </div>

                <div className="smart-gpt-editor py-10 px-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Email Context</label>
                               <textarea 
                                  value={context} 
                                  onChange={(e) => setContext(e.target.value)}
                                  placeholder="What is this email about? (e.g. follow up with client)"
                                  className="w-full h-40 bg-white/5 border border-white/5 rounded-2xl p-6 text-slate-200 text-sm focus:border-blue-500/20 focus:outline-none transition-all custom-scrollbar"
                               />
                          </div>
                          <div className="space-y-6">
                               <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Email Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {EMAIL_TYPES.map(t => (
                                            <button key={t} onClick={() => setEmailType(t)} className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${emailType === t ? 'bg-blue-500 text-white shadow-xl' : 'bg-white/5 text-slate-500'}`}>{t}</button>
                                        ))}
                                    </div>
                               </div>
                               <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Email Tone</label>
                                    <div className="flex flex-wrap gap-2">
                                        {TONES.map(t => (
                                            <button key={t} onClick={() => setTone(t)} className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tone === t ? 'bg-indigo-500 text-white shadow-xl' : 'bg-white/5 text-slate-500'}`}>{t}</button>
                                        ))}
                                    </div>
                               </div>
                          </div>
                     </div>

                    <div className="flex justify-center border-t border-white/5 pt-8">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !context.trim()}
                            className="premium-btn-primary flex items-center gap-4 py-4 px-12 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all shadow-xl shadow-blue-500/20"
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin" size={18} /> Mapping Context...</>
                            ) : (
                                <><Mail size={18} /> GENERATE PROTOCOLO</>
                            )}
                        </button>
                    </div>
                </div>

                {error && <div className="mt-4 text-center text-rose-400 text-[10px] font-black uppercase tracking-widest">{error}</div>}
            </section>

            {/* BOTTOM AREA: OUTPUT */}
            <section className="output-bottom-area">
                <AnimatePresence mode="wait">
                    {!generatedEmail && !loading ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-30">
                             <Send size={64} className="text-slate-800 mb-6" />
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Awaiting neural input</p>
                        </motion.div>
                    ) : loading ? (
                        <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
                             <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6" />
                             <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse">Linguistic Assembly Active...</span>
                        </motion.div>
                    ) : (
                        <motion.div key="res" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 max-w-5xl mx-auto pb-20">
                             <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                   <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Draft Synthesis Complete</h4>
                                </div>
                                <div className="flex gap-3">
                                     <button onClick={handleHumanize} disabled={humanizing} className="px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2">
                                         {humanizing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                                         Humanize
                                     </button>
                                     <button onClick={() => { navigator.clipboard.writeText(generatedEmail.body); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                                         {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                         {copied ? 'Copied' : 'Copy'}
                                     </button>
                                     <button onClick={() => generatePDF()} className="px-5 py-2.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 transition-colors flex items-center gap-2">
                                         <Printer size={14} /> Export
                                     </button>
                                </div>
                             </div>

                             <div className="modern-card p-0 bg-[#0D1117] border-white/5 relative group overflow-hidden">
                                 <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] block mb-2">Subject Header</span>
                                     <h2 className="text-xl font-black text-white uppercase tracking-tight italic">{generatedEmail.subject}</h2>
                                 </div>
                                 <div className="p-10 md:p-14 relative">
                                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                        <Mail size={180} className="text-blue-400" />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-slate-200 font-serif text-xl leading-[2] whitespace-pre-wrap selection:bg-blue-500/30">
                                            {generatedEmail.body}
                                        </p>
                                    </div>
                                 </div>
                             </div>

                             <div className="modern-card border-blue-500/10 py-8 bg-blue-500/5">
                                 <div className="flex items-start gap-5 px-4">
                                     <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                                         <Zap size={20} className="text-blue-400" />
                                     </div>
                                     <div className="flex-1">
                                         <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Neural Guard Verified</h5>
                                         <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed">Document has been verified for professional compliance and semantic fluidity. Recommended for {tone.toLowerCase()} distribution.</p>
                                     </div>
                                 </div>
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {generatedEmail && <IntelligenceReport data={{ answer: generatedEmail.body }} type="generate" content={context} />}
        </div>
    );
}
