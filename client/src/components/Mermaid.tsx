import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize with a cleaner default theme for maximum readability
mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose'
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
                     setSvg(`<div class="text-rose-500 font-bold p-4 bg-rose-50 border border-rose-200 rounded-xl">Error rendering visual map. Invalid flowchart syntax from AI.</div>`);
                }
            }
        };
        renderDiagram();
        
        return () => { isMounted = false; };
    }, [code]);

    return (
        <div 
            ref={ref} 
            className={`w-full overflow-auto flex justify-center py-6 [&_svg]:min-w-[600px] [&_svg]:h-auto`}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};
