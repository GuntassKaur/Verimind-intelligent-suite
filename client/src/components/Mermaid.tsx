import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize with a cleaner default theme for maximum readability
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark', // Changed to dark for the premium theme
    securityLevel: 'loose',
    fontFamily: 'Inter, sans-serif'
});

interface MermaidProps {
    code: string;
    isPrint?: boolean;
}

export const Mermaid: React.FC<MermaidProps> = ({ code }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');

    useEffect(() => {
        let isMounted = true;
        const renderDiagram = async () => {
            if (!code) return;
            try {
                // Strip out markdown formatting if API returned it
                let cleanCode = code.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();
                
                // Ensure flowchart is added only if it clearly lacks any standard Mermaid starting keyword
                if (!/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap|journey)/i.test(cleanCode)) {
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
                     setSvg(`<div class="text-rose-500 font-bold p-6 bg-rose-50/5 border border-rose-500/20 rounded-3xl">Neural Map Error: Invalid flowchart syntax detected. Spectrum synchronization aborted.</div>`);
                }
            }
        };
        renderDiagram();
        
        return () => { isMounted = false; };
    }, [code]);

    return (
        <div 
            className="w-full max-w-full overflow-x-auto overflow-y-hidden custom-scrollbar bg-[#0f172a]/40 rounded-[2.5rem] border border-white/5 p-8 md:p-12 mb-8 shadow-2xl"
            style={{ paddingLeft: '24px', paddingRight: '24px' }}
        >
            <div 
                ref={ref} 
                style={{ margin: 'auto', display: 'flex', justifyContent: 'center', width: 'fit-content', minWidth: '100%' }}
                className="mermaid-container [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:min-w-[400px] flex justify-center"
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        </div>
    );
};
