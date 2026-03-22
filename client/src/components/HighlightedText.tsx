import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Highlight {
  text: string;
  score: number;
  explanation: string;
  risk: 'Low' | 'Medium' | 'High';
}

interface HighlightedTextProps {
  text: string;
  highlights: Highlight[];
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ text, highlights }) => {
  // Simple heuristic to split text into sentences if highlights aren't exact matches
  // In a real app, the backend would return start/end offsets.
  
  const renderContent = () => {
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];

    highlights.forEach((highlight, idx) => {
      const startIndex = text.indexOf(highlight.text, lastIndex);
      
      if (startIndex !== -1) {
        // Add plain text before highlight
        if (startIndex > lastIndex) {
          elements.push(text.substring(lastIndex, startIndex));
        }

        // Add highlighted span
        elements.push(
          <HighlightSpan key={idx} highlight={highlight} />
        );

        lastIndex = startIndex + highlight.text.length;
      }
    });

    // Add remaining plain text
    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return elements.length > 0 ? elements : [text];
  };

  return (
    <div className="leading-relaxed text-sm md:text-base font-medium whitespace-pre-wrap">
      {renderContent()}
    </div>
  );
};

const HighlightSpan = ({ highlight }: { highlight: Highlight }) => {
  const [hovered, setHovered] = React.useState(false);

  const colors = {
    Low: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400',
    Medium: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400',
    High: 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400',
  };

  return (
    <span 
      className={`relative inline border-b-2 cursor-help transition-all duration-300 ${colors[highlight.risk]}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {highlight.text}
      
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-2">
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                    highlight.risk === 'Low' ? 'bg-emerald-500 text-white' : 
                    highlight.risk === 'Medium' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                    {highlight.risk} RISK
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{highlight.score}% confidence</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium italic">
                "{highlight.explanation}"
            </p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white dark:border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};
