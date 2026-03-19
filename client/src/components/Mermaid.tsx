import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid ONCE globally for Dark Futuristic Theme
mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    fontFamily: 'Inter, sans-serif',
    themeVariables: {
        primaryColor: '#0F172A',       /* secondary dark */
        primaryTextColor: '#f8fafc',   /* white text */
        primaryBorderColor: '#6366f1', /* indigo border */
        lineColor: '#6366f1',          /* glowing indigo lines */
        secondaryColor: '#1e293b',     /* lighter dark */
        tertiaryColor: '#111827',      /* tertiary dark */
        background: 'transparent',
        mainBkg: '#0B0F1A',            /* deep navy */
        nodeBorder: '#a855f7',         /* purple glowing edges */
        clusterBkg: 'rgba(17,24,39,0.5)',
        titleColor: '#22d3ee',         /* neon title */
        edgeLabelBackground: '#0B0F1A',
        attributeBackgroundColorEven: '#0F172A',
        attributeBackgroundColorOdd: '#111827',
    },
    flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
    mindmap:   { useMaxWidth: true },
});

// Counter to ensure unique IDs per render
let mermaidCounter = 0;

interface MermaidProps {
    code: string;
    isPrint?: boolean; // New: Support for light-mode PDF reports
}

export const Mermaid: React.FC<MermaidProps> = ({ code, isPrint }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const idRef = useRef(`mermaid-${++mermaidCounter}`);
    const [error, setError] = useState<string | null>(null);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        if (!containerRef.current || !code?.trim()) return;

        const id = idRef.current;
        setError(null);
        setRendered(false);

        // Clear previous render
        containerRef.current.innerHTML = '';

        const render = async () => {
            try {
                // Adjust theme for print (light mode) vs UI (dark mode)
                if (isPrint) {
                    mermaid.initialize({
                        startOnLoad: false,
                        theme: 'default',
                        fontFamily: 'Inter, sans-serif',
                        themeVariables: {
                            primaryColor: '#F3F4F6',
                            primaryTextColor: '#111827',
                            primaryBorderColor: '#6366f1',
                            lineColor: '#6366f1',
                            secondaryColor: '#E5E7EB',
                            tertiaryColor: '#F9FAFB',
                            mainBkg: '#FFFFFF',
                            nodeBorder: '#4F46E5',
                        }
                    });
                } else {
                    // Re-initialize to dark futuristic for normal UI
                    mermaid.initialize({
                        startOnLoad: false,
                        theme: 'base',
                        securityLevel: 'loose',
                        fontFamily: 'Inter, sans-serif',
                        themeVariables: {
                            primaryColor: '#0F172A',
                            primaryTextColor: '#f8fafc',
                            primaryBorderColor: '#6366f1',
                            lineColor: '#6366f1',
                            secondaryColor: '#1e293b',
                            tertiaryColor: '#111827',
                            background: 'transparent',
                            mainBkg: '#0B0F1A',
                            nodeBorder: '#a855f7',
                            clusterBkg: 'rgba(17,24,39,0.5)',
                            titleColor: '#22d3ee',
                        },
                        flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
                    });
                }

                // Clean the code — remove markdown fences if present
                let clean = code
                    .replace(/^```mermaid\s*/i, '')
                    .replace(/^```\s*/i, '')
                    .replace(/\s*```\s*$/i, '')
                    .trim();

                if (!clean) return;

                if (clean.startsWith('mindmap') && !clean.includes('root') && !clean.includes('(')) {
                   clean = clean.replace('mindmap', 'mindmap\n  root((Root Concept))');
                }

                const { svg } = await mermaid.render(id, clean);
                
                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;
                    // Make SVG responsive
                    const svgEl = containerRef.current.querySelector('svg');
                    if (svgEl) {
                        svgEl.removeAttribute('height');
                        svgEl.style.maxWidth = '1000px';
                        svgEl.style.height = 'auto';
                        if (!isPrint) {
                            svgEl.style.filter = 'drop-shadow(0 0 10px rgba(99,102,241,0.2))';
                        }
                    }
                    setRendered(true);
                }
            } catch (err) {
                console.error('Mermaid render error:', err);
                setError(String(err));
            }
        };

        render();
    }, [code, isPrint]);

    if (error) {
        return (
            <div className={`w-full p-6 rounded-2xl border text-sm font-bold tracking-wide ${
                isPrint ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
                <p className="font-black mb-3 text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    Diagram Extraction Failed
                </p>
                <pre className={`text-[10px] whitespace-pre-wrap overflow-x-auto p-4 rounded-xl border ${
                     isPrint ? 'bg-white text-rose-400' : 'bg-[#0B0F1A] border-rose-500/20'
                }`}>{code}</pre>
            </div>
        );
    }

    return (
        <div className={`mermaid-container w-full relative ${isPrint ? 'bg-white p-4' : ''}`}>
            {!rendered && (
                <div className={`w-full h-64 rounded-2xl border animate-pulse flex items-center justify-center text-[10px] font-black tracking-[0.3em] uppercase ${
                    isPrint ? 'bg-gray-50 border-gray-100 text-gray-400' : 'bg-[#0F172A] border-[#1F2937] text-indigo-400'
                }`}>
                    <span className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                        Generating Neural View...
                    </span>
                </div>
            )}
            <div
                ref={containerRef}
                className={`w-full flex justify-center overflow-x-auto custom-scrollbar transition-opacity duration-[800ms]
                    ${rendered ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            />
        </div>
    );
};

