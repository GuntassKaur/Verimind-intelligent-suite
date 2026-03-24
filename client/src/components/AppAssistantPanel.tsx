import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send,
    Loader2,
    Cpu,
    Activity,
    BrainCircuit
} from 'lucide-react';


interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface AppAssistantPanelProps {
    wpm?: number;
    editorContent?: string;
    isDark?: boolean;
}

export const AppAssistantPanel: React.FC<AppAssistantPanelProps> = ({ 
    wpm = 0, 
    editorContent = "",
    isDark = true 
}) => {
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: '1', 
            text: "Hello, Analyst. I am your Neural Intelligence Assistant. How can I optimize your current manuscript?", 
            sender: 'ai', 
            timestamp: new Date() 
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        const aiMsgId = (Date.now() + 1).toString();
        const initialAiMsg: Message = {
            id: aiMsgId,
            text: '',
            sender: 'ai',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, initialAiMsg]);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/assistant-stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: currentInput,
                    context: editorContent,
                    wpm: wpm
                }),
            });

            if (!response.ok) throw new Error('Neural link failed.');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error('Stream logic failed.');

            let streamedText = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '');
                        if (dataStr === '[DONE]') break;
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.chunk) {
                                streamedText += data.chunk;
                                setMessages(prev => prev.map(m => 
                                    m.id === aiMsgId ? { ...m, text: streamedText } : m
                                ));
                            }
                        } catch { /* partial chunk */ }
                    }
                }
            }
        } catch {
             setMessages(prev => prev.map(m => 
                m.id === aiMsgId ? { ...m, text: "Neural interrupt detected. Please re-synchronize protocol." } : m
             ));
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside className={`fixed top-24 bottom-6 right-6 w-96 rounded-[3rem] border transition-all duration-500 overflow-hidden flex flex-col z-40 shadow-2xl ${
            isDark ? 'bg-[#0f172a]/80 border-white/5 backdrop-blur-2xl' : 'bg-white/80 border-slate-200 shadow-clean backdrop-blur-2xl'
        }`}>
            {/* Header */}
            <header className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-lg rotate-3 group-hover:rotate-0 transition-all">
                        <Cpu className="text-indigo-400" size={20} />
                    </div>
                    <div>
                        <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-white' : 'text-slate-900'}`}>Synaptic Assistant</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Live Intelligence Link</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active</span>
                </div>
            </header>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`max-w-[85%] p-5 rounded-[2rem] text-[11px] font-bold leading-relaxed transition-all ${
                                m.sender === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/10' 
                                : isDark ? 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none' : 'bg-slate-50 text-slate-700 border border-slate-200 rounded-tl-none'
                            }`}>
                                {m.text}
                            </div>
                            <span className="text-[9px] text-slate-600 mt-2 font-black uppercase tracking-widest px-2">
                                {m.sender === 'ai' ? 'Neural Link' : 'Analyst'} • {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </motion.div>
                    ))}
                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 px-2">
                            <Loader2 className="animate-spin text-indigo-500" size={14} />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Synthesizing Insight...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Stats Bar (Minified) */}
            <div className={`px-8 py-4 flex items-center justify-between border-t border-b border-white/5 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                    <Activity size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-white">{wpm} <span className="text-slate-500">WPM</span></span>
                </div>
                <div className="flex items-center gap-3">
                    <BrainCircuit size={14} className="text-purple-400" />
                    <span className="text-[10px] font-black text-white">{editorContent.split(/\s+/).length} <span className="text-slate-500">WORDS</span></span>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-8">
                <div className={`relative flex items-center p-1.5 rounded-[2.5rem] border transition-all ${
                    isDark ? 'bg-[#1E293B] border-white/5 focus-within:border-indigo-500/50' : 'bg-white border-slate-200 focus-within:border-indigo-500/50 shadow-inner'
                }`}>
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Command assistant..."
                        className="bg-transparent border-none outline-none flex-1 px-6 py-3 text-[11px] font-bold text-white placeholder:text-slate-600"
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={loading || !input.trim()}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            input.trim() ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 opacity-50'
                        }`}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
};
