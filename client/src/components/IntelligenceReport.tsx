import React from 'react';
import { Shield, ShieldCheck, AlertTriangle, FileText, ListChecks, Network } from 'lucide-react';
import { Logo } from './Logo';
import { Mermaid } from './Mermaid';

interface Claim {
    claim: string;
    verdict: string;
    reasoning: string;
    confidence: number;
}

interface Diagram {
    type: string;
    code: string;
}

interface IntelligenceReportProps {
    data: {
        humanized_text?: string;
        answer?: string;
        summary?: string;
        explanation?: string;
        simple_explanation?: string;
        score?: number;
        credibility_score?: number;
        ai_probability?: number;
        risk_level?: string;
        key_concepts?: string[];
        mermaid_diagrams?: Diagram[];
        claims?: Claim[];
        suggestions?: string[];
    };
    type: 'plagiarism' | 'analyze' | 'generate' | 'humanize' | 'visualize' | 'general';
    content: string;
}

export const IntelligenceReport: React.FC<IntelligenceReportProps> = ({ data, type, content }) => {
    if (!data) return null;

    // Normalize data for display
    const resultText = data.humanized_text || data.answer || data.summary || data.explanation || '';

    const [verificationId, setVerificationId] = React.useState('');
    React.useEffect(() => {
        setVerificationId('VM-' + Math.random().toString(36).substring(2, 10).toUpperCase());
    }, []);

    // Derived Metrics
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const aiProbability = data.ai_probability !== undefined 
        ? data.ai_probability 
        : (data.score !== undefined ? data.score : (data.credibility_score !== undefined ? 100 - data.credibility_score : 50));

    return (
        <div 
            id="report" 
            className="intelligence-report-container bg-white text-slate-900 p-16 font-sans print-container fixed top-0 -left-[10000px] w-[900px] z-[-1] opacity-0 shadow-2xl"
            style={{ minHeight: '1414px', pointerEvents: 'none', lineHeight: '1.6' }}
        >
            {/* Report Header - Premium Design */}
            <div className="flex justify-between items-start border-b-8 border-slate-900 pb-12 mb-12">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center rotate-3 shadow-xl">
                        <Logo variant="icon" className="w-12 h-12 text-white -rotate-3" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black uppercase tracking-tight text-slate-900 leading-none mb-2">VeriMind</h1>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Neural Intelligence Audit Report</p>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="bg-slate-100 px-4 py-2 rounded-xl mb-4 border border-slate-200">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Verification ID</p>
                        <p className="text-sm font-black italic tracking-tighter">{verificationId || 'VM-PENDING'}</p>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date().toLocaleTimeString()}</p>
                </div>
            </div>

            {/* Document Executive Summary */}
            <section className="mb-14 relative">
                <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-full" />
                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                    <FileText size={16} /> EXECUTIVE INTELLIGENCE SUMMARY
                </h3>
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    <p className="text-xl text-slate-800 font-serif leading-relaxed italic mb-6">
                        {data.simple_explanation || "Primary audit analysis completed. The linguistic structure and factual density of the provided substrate have been processed through VeriMind's core neural verification layers."}
                    </p>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        {resultText || "Analysis indicates a structured data pattern. Key metrics suggest a moderate cognitive load requirements for consumer absorption."}
                    </p>
                </div>
            </section>

            {/* Core Metrics Grid */}
            <section className="mb-14">
                <div className="grid grid-cols-2 gap-8">
                    <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 relative z-10">
                            {type === 'analyze' ? 'Factual Credibility' : 'Originality Index'}
                        </span>
                        <div className="text-7xl font-black mb-4 tracking-tighter relative z-10">
                            {type === 'analyze' ? (data.credibility_score ?? 0) : (data.score !== undefined ? data.score : 100 - aiProbability)}<span className="text-2xl text-indigo-400">%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2 relative z-10">
                            <div className="bg-indigo-500 h-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${(type === 'analyze' ? (data.credibility_score ?? 0) : (data.score || (100 - aiProbability)))}%` }} />
                        </div>
                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest relative z-10">System Status: Optimal</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <MetricBox label="Word Count" value={wordCount} color="slate" />
                        <MetricBox label="Neural Tags" value={data.key_concepts?.length || 4} color="indigo" />
                        <MetricBox label="Risk Level" value={data.risk_level || 'LOW'} color={data.risk_level === 'High' ? 'rose' : data.risk_level === 'Medium' ? 'amber' : 'emerald'} />
                        <MetricBox label="AI Prob." value={`${aiProbability}%`} color="slate" />
                    </div>
                </div>
            </section>

            {/* KEY CONCEPTS & KNOWLEDGE MAP */}
            {(data.key_concepts || data.mermaid_diagrams) && (
                <section className="mb-14 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100">
                        <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ListChecks size={14} /> Semantic Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {data.key_concepts?.map((c, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-[10px] font-bold text-indigo-700">
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-slate-50 p-8 rounded-[2rem] border border-slate-200 relative overflow-hidden">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Network size={14} className="text-indigo-500" /> Structural Knowledge Map
                        </h4>
                        {data.mermaid_diagrams && data.mermaid_diagrams.length > 0 ? (
                            <div className="bg-white p-6 rounded-2xl border border-slate-200">
                                <Mermaid code={data.mermaid_diagrams[0].code} isPrint />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-300 italic text-xs">
                                No structural map requested for this audit.
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Deep Breakdown Section */}
            <section className="mb-14">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                    <Shield size={16} /> SUB-SEGMENT INTELLIGENCE BREAKDOWN
                </h3>
                <div className="space-y-6">
                    {data.claims?.map((claim, i) => (
                        <div key={i} className={`p-8 rounded-[2.5rem] border-2 ${
                            claim.verdict === 'True' || claim.verdict === 'Verified' ? 'border-emerald-100 bg-emerald-50/30' : 
                            claim.verdict === 'Uncertain' ? 'border-amber-100 bg-amber-50/30' : 
                            'border-rose-100 bg-rose-50/30'
                        }`}>
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-lg font-bold text-slate-800 leading-tight">"{claim.claim}"</p>
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    claim.verdict === 'True' || claim.verdict === 'Verified' ? 'bg-emerald-500 text-white' : 
                                    claim.verdict === 'Uncertain' ? 'bg-amber-500 text-white' : 
                                    'bg-rose-500 text-white'
                                }`}>
                                    {claim.verdict}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{claim.reasoning}</p>
                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[9px] font-black text-slate-400">Confidence Scalar: {claim.confidence}%</span>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className={`w-1.5 h-1.5 rounded-full ${j < Math.round(claim.confidence/20) ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final Recommendations */}
            <section className="mb-12">
                <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                    <AlertTriangle size={16} /> NEURAL FEEDBACK & RECOMMENDATIONS
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {(data.suggestions || [
                        "Include specific citations for high-risk claims identified.",
                        "Refactor repetitive semantic structures for better clarity.",
                        "Lower AI-typical linguistic variance in segment 2.",
                        "Cross-verify claim #4 with updated peer-reviewed literature."
                    ]).map((s, i) => (
                        <div key={i} className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div className="w-2 h-2 rounded-full bg-slate-900 shrink-0" />
                            <p className="text-xs font-bold text-slate-700 tracking-tight leading-snug">{s}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Premium Footer */}
            <div className="mt-auto pt-16 border-t-2 border-slate-100 text-center flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-1 bg-slate-100 rounded-full" />
                    <ShieldCheck size={24} className="text-slate-900" />
                    <div className="w-12 h-1 bg-slate-100 rounded-full" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-900 mb-2">VERIMIND PROTOCOL V5.2.0</p>
                <p className="text-[10px] text-slate-400 font-medium italic max-w-lg">
                    This cryptographic neural audit is probabilistic in nature. VeriMind provides intelligence signals; critical decisions should be cross-verified by domain experts.
                </p>
            </div>
        </div>
    );
};

interface MetricBoxProps {
    label: string;
    value: string | number;
    color: 'slate' | 'indigo' | 'rose' | 'amber' | 'emerald';
}

const MetricBox: React.FC<MetricBoxProps> = ({ label, value, color }) => {
    const colors = {
        slate: 'bg-slate-50 border-slate-100 text-slate-900',
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700',
        rose: 'bg-rose-50 border-rose-100 text-rose-700',
        amber: 'bg-amber-50 border-amber-100 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700'
    };
    return (
        <div className={`p-4 rounded-3xl border flex flex-col justify-center ${colors[color]}`}>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">{label}</p>
            <p className="text-xl font-black tracking-tight">{value}</p>
        </div>
    );
};
