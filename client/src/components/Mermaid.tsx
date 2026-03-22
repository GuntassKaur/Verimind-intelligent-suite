import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
    code: string;
    isPrint?: boolean;
}

export const Mermaid: React.FC<MermaidProps> = ({ code, isPrint }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // --- CANVA/GAMMA STYLE THEME CONFIG ---
        mermaid.initialize({
            startOnLoad: true,
            theme: 'base',
            themeVariables: {
                primaryColor: '#EEF2FF',     // Soft Indigo
                primaryTextColor: '#4F46E5', // Slate/Indigo
                primaryBorderColor: '#C7D2FE',
                lineColor: '#CBD5E1',        // Slate-300
                secondaryColor: '#FDF2F8',   // Soft Pink
                tertiaryColor: '#F5F3FF',   // Soft Purple
                fontSize: '24px',
                fontFamily: 'Outfit, Inter, sans-serif',
                nodeBorder: '2px',
                clusterBkg: '#F8FAFC',
                clusterBorder: '#E2E8F0',
                edgeLabelBackground: '#FFFFFF',
            },
            flowchart: {
                htmlLabels: true,
                curve: 'basis',
                padding: 40,
                nodeSpacing: 80,
                rankSpacing: 100,
                useMaxWidth: !isPrint,
            },
            securityLevel: 'loose'
        });

        if (ref.current) {
            ref.current.removeAttribute('data-processed');
            mermaid.contentLoaded();
        }
    }, [code, isPrint]);

    // Enhance Mermaid code with modern geometric styles if not present
    const enhancedCode = code.includes('classDef') ? code : `
        flowchart TD
        classDef default fill:#FFFFFF,stroke:#E2E8F0,stroke-width:2px,color:#64748B,rx:20,ry:20;
        classDef primary fill:#EEF2FF,stroke:#C7D2FE,stroke-width:3px,color:#4F46E5,rx:24,ry:24;
        classDef search fill:#F0F9FF,stroke:#BAE6FD,stroke-width:3px,color:#0369A1,rx:24,ry:24;
        classDef audit fill:#F5F3FF,stroke:#DDD6FE,stroke-width:3px,color:#6D28D9,rx:24,ry:24;
        classDef breach fill:#FFF1F2,stroke:#FECDD3,stroke-width:3px,color:#E11D48,rx:24,ry:24;
        ${code.replace(/flowchart (TD|LR|BT|RL)/, '')}
    `;

    return (
        <div 
            ref={ref} 
            className={`mermaid flex justify-center py-20 px-10 bg-white/20 rounded-[3rem] ${isPrint ? 'w-full scale-100' : 'w-full max-w-full overflow-hidden'}`}
        >
            {enhancedCode}
        </div>
    );
};
