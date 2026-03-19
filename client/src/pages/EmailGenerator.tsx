import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Sparkles,
    Copy,
    Loader2,
    CheckCircle,
    Send,
    RefreshCcw,
    Zap,
    Printer
} from 'lucide-react';
import api from '../services/api';
import { IntelligenceReport } from '../components/IntelligenceReport';
import { generatePDF } from '../utils/pdfExport';

const EMAIL_TYPES = [
    { id: 'Professional', label: 'Professional' },
    { id: 'Cold Outreach', label: 'Cold Outreach' },
    { id: 'Follow-up', label: 'Follow-up' },
    { id: 'Apology', label: 'Apology' },
    { id: 'Job Application', label: 'Job Application' }
];

const TONES = [
    { id: 'Professional', label: 'Professional' },
    { id: 'Friendly', label: 'Friendly' },
    { id: 'Persuasive', label: 'Persuasive' },
    { id: 'Formal', label: 'Formal' },
    { id: 'Concise', label: 'Concise' }
];

export default function EmailGenerator() {
    const [context, setContext] = useState('');
    const [emailType, setEmailType] = useState('Professional');
    const [tone, setTone] = useState('Professional');
    const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [humanizing, setHumanizing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = useCallback(async () => {
        if (!context.trim()) {
            setError("Please provide some context for the email.");
            return;
        }

        setLoading(true);
        setError('');
        setGeneratedEmail(null);

        try {
            const prompt = `Generate a ${tone} ${emailType} email based on this context: ${context}. Return the response in JSON format with "subject" and "body" fields.`;

            const { data } = await api.post('/api/generate', {
                query: prompt,
                response_type: 'Email'
            });

            if (data.answer) {
                try {
                    const parsed = JSON.parse(data.answer);
                    setGeneratedEmail({
                        subject: parsed.subject || 'No Subject',
                        body: parsed.body || data.answer
                    });
                } catch {
                    setGeneratedEmail({
                        subject: 'Re: ' + context.slice(0, 30) + '...',
                        body: data.answer
                    });
                }
            }
        } catch {
            setError("Failed to generate email. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [context, emailType, tone]);

    const handleHumanize = useCallback(async () => {
        if (!generatedEmail) return;

        setHumanizing(true);
        try {
            const { data } = await api.post('/api/humanize', {
                text: generatedEmail.body,
                tone: tone
            });

            if (data.humanized_text) {
                setGeneratedEmail(prev => prev ? { ...prev, body: data.humanized_text } : null);
            }
        } catch {
            setError("Humanization failed.");
        } finally {
            setHumanizing(false);
        }
    }, [generatedEmail, tone]);

    const handleCopy = () => {
        if (!generatedEmail) return;
        const textToCopy = `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-container">
            <header className="mb-8 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 md:mb-6"
                >
                    <Mail size={14} className="text-blue-400" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Writing Suite</span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Email Generator</h1>
                <p className="text-slate-400 font-medium text-base md:text-lg max-w-2xl">Create professional, high-impact emails with AI-driven personalization and human-like refinement.</p>
            </header>

            <div className="laptop-mock">
                <div className="laptop-screen overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px] md:h-[800px] divide-y md:divide-y-0 md:divide-x divide-white/5">
                        {/* INPUT PANE */}
                        <div className="p-6 md:p-10 flex flex-col bg-[#0d1117]/30 overflow-y-auto">
                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Email Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {EMAIL_TYPES.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setEmailType(t.id)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${emailType === t.id
                                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                                                    }`}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Desired Tone</label>
                                    <div className="flex flex-wrap gap-2">
                                        {TONES.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setTone(t.id)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tone === t.id
                                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                                                    }`}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Context & Goal</label>
                                    <textarea
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                        placeholder="E.g., Following up with Joe from Acme Corp about the partnership proposal we discussed yesterday..."
                                        className="custom-editor flex-1 min-h-[150px] mb-6"
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !context.trim()}
                                    className="premium-btn-primary w-full flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={20} /> GENERATE EMAIL</>}
                                </button>
                            </div>
                        </div>

                        {/* OUTPUT PANE */}
                        <div className="p-6 md:p-10 bg-black/40 flex flex-col overflow-y-auto">
                            <AnimatePresence mode="wait">
                                {!generatedEmail && !loading ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center text-center py-20"
                                    >
                                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5">
                                            <Send size={48} className="text-slate-700" />
                                        </div>
                                        <p className="text-slate-500 font-medium italic text-sm">Generated response will appear here.</p>
                                    </motion.div>
                                ) : loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col space-y-6"
                                    >
                                        <div className="glass-panel space-y-4">
                                            <div className="skeleton-text w-1/4" />
                                            <div className="skeleton-text w-full h-8" />
                                        </div>
                                        <div className="glass-panel flex-1 space-y-4">
                                            <div className="skeleton-text w-full" />
                                            <div className="skeleton-text w-full" />
                                            <div className="skeleton-text w-5/6" />
                                            <div className="skeleton-text w-2/3" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-widest w-fit">
                                                Generated Draft
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={generatePDF}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 mr-2"
                                                >
                                                    <Printer size={14} /> Download PDF
                                                </button>
                                                <button
                                                    onClick={handleHumanize}
                                                    disabled={humanizing}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500 border border-indigo-500/20 hover:border-indigo-500 text-indigo-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    {humanizing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                                                    <span className="whitespace-nowrap">Human Rewrite</span>
                                                </button>
                                                <button
                                                    onClick={handleCopy}
                                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                                                >
                                                    {copied ? <CheckCircle size={18} className="text-emerald-400" /> : <Copy size={18} className="text-slate-400 group-hover:text-white" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="glass-panel p-6 bg-white/[0.02] border-white/5">
                                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Subject</label>
                                                <div className="text-white font-bold text-sm md:text-base">{generatedEmail?.subject}</div>
                                            </div>
                                            <div className="glass-panel p-6 flex-1 bg-white/[0.02] border-white/5 font-sans leading-relaxed text-slate-200 text-base md:text-lg whitespace-pre-wrap">
                                                {generatedEmail?.body}
                                            </div>
                                        </div>

                                        <div className="mt-8 p-6 bg-blue-500/[0.03] border border-blue-500/10 rounded-2xl flex items-start gap-4">
                                            <Sparkles size={18} className="text-blue-400 mt-0.5 shrink-0" />
                                            <p className="text-[11px] text-slate-400 font-medium italic leading-relaxed">
                                                Email quality optimized for {tone.toLowerCase()} reception. Use the Human Rewrite tool for an even more natural, rhythmic flow.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden Print Report */}
            {generatedEmail && <IntelligenceReport data={{ answer: generatedEmail.body }} type="generate" content={context} />}
        </div>
    );
}
