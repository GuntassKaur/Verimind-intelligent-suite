import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
        primaryColor: '#EEF2FF',
        primaryTextColor: '#4F46E5',
        primaryBorderColor: '#C7D2FE',
        lineColor: '#CBD5E1',
        secondaryColor: '#FDF2F8',
        tertiaryColor: '#F5F3FF',
        fontSize: '16px',
        fontFamily: 'Inter, sans-serif',
    },
    securityLevel: 'loose'
});

interface MermaidProps {
    code: string;
    isPrint?: boolean;
}

export const Mermaid: React.FC<MermaidProps> = ({ code, isPrint }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');

    useEffect(() => {
        let isMounted = true;
        const renderDiagram = async () => {
            if (!code) return;
            try {
                // Strip out markdown formatting if API returned it
                let cleanCode = code.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();
                
                // If the code doesn't start with flowchart/graph keywords, prepend simple flowchart
                if (!/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph)/.test(cleanCode)) {
                    cleanCode = `flowchart TD\n` + cleanCode;
                }

                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, cleanCode);
                
                if (isMounted) {
                    setSvg(svg);
                }
            } catch (error) {
                console.error('Mermaid rendering error:', error);
                if (isMounted) {
                    setSvg(`<div class="text-rose-500 font-bold p-4 bg-rose-50 border border-rose-200 rounded-xl">Error rendering visual map from AI output.</div>`);
                }
            }
        };
        renderDiagram();
        
        return () => { isMounted = false; };
    }, [code]);

    return (
        <div 
            ref={ref} 
            className={`w-full overflow-x-auto flex justify-center items-center py-6 ${isPrint ? '' : 'max-h-[600px]'}`}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};
