import { useState } from 'react';
import { CheckCircle, XCircle, ChevronDown, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

interface ClaimProps {
    claim: {
        text: string;
        status: 'TRUE' | 'FALSE' | 'UNVERIFIED';
        trust_score: number;
        explanation: string;
        correction?: string;
    };
    index: number;
}

export const ClaimCard = ({ claim, index }: ClaimProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'TRUE':
                return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle, label: 'Verified Claim' };
            case 'FALSE':
                return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: XCircle, label: 'Factual Discrepancy' };
            default:
                return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle, label: 'Speculative / Ambiguous' };
        }
    };

    const config = getStatusConfig(claim.status);
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={clsx(
                "w-full rounded-2xl border transition-all duration-300 overflow-hidden",
                "bg-slate-900/40 backdrop-blur-md",
                config.border,
                isExpanded ? "ring-1 ring-white/10 shadow-2xl" : "hover:bg-slate-900/60"
            )}
        >
            <div
                className="p-6 cursor-pointer flex items-start justify-between gap-6"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start gap-4 flex-1">
                    <div className={clsx("p-2.5 rounded-xl", config.bg)}>
                        <Icon className={config.color} size={22} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className={clsx("text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border", config.color, config.border, config.bg)}>
                                {config.label}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">Confidence {claim.trust_score}%</span>
                        </div>
                        <h4 className="text-slate-100 font-semibold leading-relaxed text-[15px]">{claim.text}</h4>
                    </div>
                </div>
                <div className={clsx("mt-1 transition-transform duration-300", isExpanded ? "rotate-180" : "")}>
                    <ChevronDown size={20} className="text-slate-600" />
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-black/20"
                    >
                        <div className="px-6 pb-6 pt-2 ml-14">
                            <div className="h-px bg-white/5 w-full mb-6" />
                            <div className="space-y-6">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 block mb-3">Analysis Details</span>
                                    <p className="text-slate-400 leading-relaxed text-sm italic pr-4">
                                        "{claim.explanation}"
                                    </p>
                                </div>
                                {claim.correction && (
                                    <div className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/50" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 block mb-2">Factual Correction</span>
                                        <p className="text-slate-200 text-sm font-medium leading-relaxed">
                                            {claim.correction}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
