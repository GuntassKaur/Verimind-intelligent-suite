import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mic, 
    MicOff, 
    X, 
    Loader2, 
    Sparkles, 
    Square, 
    RotateCcw,
    Bookmark,
    BookmarkCheck,
    Zap,
    Scale
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { AIAvatar } from '../components/AIAvatar';
import FloatingParticles from '../components/FloatingParticles';

export default function LiveAI() {
    const { theme } = useTheme();
    const navigate = useNavigate();

    // State
    const [messages, setMessages] = useState<any[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
    const [currentSpokenWordIndex, setCurrentSpokenWordIndex] = useState(-1);
    const [audioLevel, setAudioLevel] = useState(0);
    const [streamingContent, setStreamingContent] = useState('');
    const [prefs, setPrefs] = useState({
        language: 'English',
        interest: 'General',
        mode: 'Standard'
    });
    const [simplifyMode, setSimplifyMode] = useState(false);
    const [pinnedMessages, setPinnedMessages] = useState<string[]>([]);
    const [showPrefs, setShowPrefs] = useState(false);

    // Refs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesis>(window.speechSynthesis);
    const textBuffer = useRef('');
    const spokenBuffer = useRef('');
    const abortControllerRef = useRef<AbortController | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingContent, transcript]);

    useEffect(() => {
        const checkAuth = () => {
            if (!localStorage.getItem('user_name')) {
                navigate('/login?redirect=/live-ai');
            }
        };
        checkAuth();
    }, [navigate]);

    // Initialize Speech Recognition
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US'; // Or maybe 'hi-IN' if we want Hinglish detection

            let finalTranscript = '';
            let silenceTimer: ReturnType<typeof setTimeout> | null = null;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                
                const currentText = finalTranscript + interimTranscript;
                setTranscript(currentText);
                
                // Reset silence timer on every new result
                if (silenceTimer) clearTimeout(silenceTimer);
                
                // If user stops talking for 1s, auto-send (made even faster)
                silenceTimer = setTimeout(() => {
                    if (currentText.trim()) {
                        recognition.stop();
                        handleUserQuery(currentText.trim());
                        finalTranscript = '';
                        setTranscript('');
                    }
                }, 1000);
            };

            recognition.onend = () => {
                setIsListening(false);
                if (status === 'listening' && !transcript.trim()) {
                     // restarting if it stopped without getting query
                     recognition.start();
                     setIsListening(true);
                }
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
                setStatus('idle');
            };

            recognitionRef.current = recognition;
        } else {
            console.error("Speech Recognition API not supported in this browser.");
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            synthesisRef.current.cancel();
        };
    }, []);

    // Function to speak chunks of text
    const speakChunk = (text: string) => {
        if (!text.trim()) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to get a natural voice (Google UK English Female or similar)
        const voices = synthesisRef.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google UK English Female')) || 
                               voices.find(v => v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Female')) || 
                               voices[0];
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        utterance.rate = 1.1; // Slightly fast for responsive feel
        utterance.pitch = 1.0;
        
        utterance.onstart = () => {
             setStatus('speaking');
        };
        
        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                 const textBeforeCurrentChunk = spokenBuffer.current.trim();
                 const offsetInCurrentChunk = text.substring(0, event.charIndex).trim();
                 
                 const wordCountBefore = textBeforeCurrentChunk ? textBeforeCurrentChunk.split(/\s+/).length : 0;
                 const wordCountInCurrent = offsetInCurrentChunk ? offsetInCurrentChunk.split(/\s+/).length : 0;
                 
                 setCurrentSpokenWordIndex(wordCountBefore + wordCountInCurrent);
            }
        };

        utterance.onend = () => {
            spokenBuffer.current += text + " ";
            // Check if queue is empty and stream is done
            if (!synthesisRef.current.pending && status !== 'thinking') {
                // If we finished speaking everything, go back to listening
                if (textBuffer.current.trim() === spokenBuffer.current.trim()) {
                    setStatus('listening');
                    startListening();
                }
            }
        };
        
        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
        };

        synthesisRef.current.speak(utterance);
    };

    const handleUserQuery = async (query: string, isRetry = false) => {
        if (isPaused) return;
        
        setStatus('thinking');
        setStreamingContent('');
        textBuffer.current = '';
        spokenBuffer.current = '';
        setCurrentSpokenWordIndex(-1);
        synthesisRef.current.cancel(); 
        
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        // Add user message to history
        if (!isRetry) {
            const userMsg = { id: Date.now().toString(), role: 'user', content: query, timestamp: Date.now() };
            setMessages(prev => [...prev, userMsg]);
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Build context from previous messages
        const historyContext = messages.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
        const enrichedQuery = historyContext ? `Previous context:\n${historyContext}\n\nUser: ${query}` : query;

        try {
            const response = await fetch(`${apiUrl}/api/ai/assistant-stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: enrichedQuery, 
                    wpm: 0,
                    prefs: {
                        ...prefs,
                        mode: simplifyMode ? 'Simple (ELI5)' : prefs.mode
                    }
                }),
                signal: abortControllerRef.current.signal,
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`Status: ${response.status}`);
            if (!response.body) throw new Error('No stream');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let tempSentenceBuffer = "";
            let lineBuffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                lineBuffer += chunk;
                
                const lines = lineBuffer.split('\n');
                lineBuffer = lines.pop() || ""; // Keep incomplete line in buffer
                
                for (const line of lines) {
                    const cleanLine = line.trim();
                    if (cleanLine.startsWith('data: ')) {
                        const dataStr = cleanLine.replace('data: ', '').trim();
                        if (dataStr === '[DONE]') break;
                        
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.chunk) {
                                textBuffer.current += data.chunk;
                                tempSentenceBuffer += data.chunk;
                                setStreamingContent(textBuffer.current);
                                
                                if (/[.!?\n]/.test(data.chunk)) {
                                    const pauseStr = tempSentenceBuffer.trim();
                                    if (pauseStr) speakChunk(pauseStr);
                                    tempSentenceBuffer = "";
                                }
                            }
                        } catch (e) {
                            console.warn("Partial JSON ignored:", dataStr);
                        }
                    }
                }
            }
            
            // Final check of lineBuffer for any remaining data
            if (lineBuffer.startsWith('data: ')) {
                try {
                     const dataStr = lineBuffer.replace('data: ', '').trim();
                     const data = JSON.parse(dataStr);
                     if (data.chunk) {
                        textBuffer.current += data.chunk;
                        setStreamingContent(textBuffer.current);
                     }
                } catch (_) {}
            }
            
            if (tempSentenceBuffer.trim()) speakChunk(tempSentenceBuffer.trim());

            // Finalize message in history
            const assistantMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: textBuffer.current, timestamp: Date.now() };
            setMessages(prev => [...prev, assistantMsg]);
            setStreamingContent('');

        } catch (error) {
            console.error('LiveAI error:', error);
            if (!isRetry) {
                handleUserQuery(query, true); // Automatic one-time retry
            } else {
                const fallback = "Neural link unstable. I’m having trouble responding right now, please try again.";
                const errorMsg = { id: 'err-' + Date.now(), role: 'assistant', content: fallback, timestamp: Date.now() };
                setMessages(prev => [...prev, errorMsg]);
                setStatus('speaking');
                speakChunk(fallback);
            }
        }
    };

    const startListening = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                setStatus('listening');
                synthesisRef.current.cancel(); // Mute AI if user taps mic
            } catch (_) {
                // Ignore already started errors
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            setStatus('idle');
        }
    };

    const toggleListening = () => {
        if (isListening || status === 'listening') {
            stopListening();
        } else {
            setTranscript('');
            startListening();
        }
    };

    // Audio Analysis Logic
    useEffect(() => {
        if (status === 'listening' && isListening) {
            const startAnalysing = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const analyser = audioContext.createAnalyser();
                    const source = audioContext.createMediaStreamSource(stream);
                    
                    analyser.fftSize = 256;
                    source.connect(analyser);
                    
                    audioContextRef.current = audioContext;
                    analyserRef.current = analyser;
                    
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);
                    
                    const updateLevel = () => {
                        if (!analyserRef.current) return;
                        analyserRef.current.getByteFrequencyData(dataArray);
                        
                        let sum = 0;
                        for (let i = 0; i < bufferLength; i++) {
                            sum += dataArray[i];
                        }
                        const average = sum / bufferLength;
                        setAudioLevel(average / 128); // Normalize to 0-1 range roughly
                        
                        animationFrameRef.current = requestAnimationFrame(updateLevel);
                    };
                    
                    updateLevel();
                } catch (err) {
                    console.error("Error accessing microphone for visualizer:", err);
                }
            };
            
            startAnalysing();
        } else {
            // Cleanup
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
            audioContextRef.current = null;
            analyserRef.current = null;
            setAudioLevel(0);
        }
        
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, [status, isListening]);
    
    // Auto-start on mount with greeting
    useEffect(() => {
        const greeting = "Hey 👋 I’m your Verimind AI assistant. Ask me anything — I’m listening.";
        const introMsg = { id: 'intro', role: 'assistant', content: greeting, timestamp: Date.now() };
        setMessages([introMsg]);
        textBuffer.current = greeting;
        setStatus('speaking');
        
        setTimeout(() => {
            speakChunk(greeting);
        }, 800);
    }, []);

    const words = streamingContent.split(' ');

    return (
        <div className={`fixed inset-0 z-[1000] flex flex-col ${theme === 'dark' ? 'bg-[#0A0514] text-white' : 'bg-slate-900 text-white'}`}>
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <FloatingParticles count={40} />
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600/30 rounded-xl flex items-center justify-center border border-indigo-500/30">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Verimind Live</h1>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'listening' ? 'bg-red-400' : 'bg-indigo-400'}`}></span>
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'listening' ? 'bg-red-500' : 'bg-indigo-500'}`}></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {status === 'idle' && 'Standby'}
                                {status === 'listening' && 'Listening...'}
                                {status === 'thinking' && 'Processing Neural Link...'}
                                {status === 'speaking' && 'Synthesizing Audio...'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setShowPrefs(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        <Scale className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Intelligence Prefs</span>
                    </button>
                    <button 
                        onClick={() => {
                            stopListening();
                            synthesisRef.current.cancel();
                            if (abortControllerRef.current) abortControllerRef.current.abort();
                            navigate('/');
                        }}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                        <X className="w-6 h-6 text-slate-300" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col items-center relative z-10 w-full max-w-5xl mx-auto px-4">
                
                {/* Visualizer / Avatar Area (Fixed) */}
                <div className="pt-8 pb-4 w-full flex flex-col items-center">
                    <AIAvatar status={status} audioLevel={audioLevel} />
                    
                    {/* Controls Row */}
                    <div className="flex items-center gap-6 mt-8">
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className={`p-4 rounded-full border transition-all ${
                                isPaused 
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-500' 
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                            }`}
                        >
                            {isPaused ? <Sparkles className="w-5 h-5" /> : <Loader2 className="w-5 h-5" />}
                        </button>

                        <motion.button
                            onClick={toggleListening}
                            disabled={isPaused}
                            animate={{
                                scale: status === 'listening' ? [1, 1.1, 1] : 1,
                                boxShadow: status === 'listening' 
                                    ? ['0 0 10px rgba(239,68,68,0.3)', '0 0 25px rgba(239,68,68,0.6)', '0 0 10px rgba(239,68,68,0.3)']
                                    : '0 0 10px rgba(255,255,255,0.05)'
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors border ${
                                status === 'listening' 
                                ? 'bg-red-500/20 border-red-500 text-red-500' 
                                : isPaused ? 'opacity-30' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                            }`}
                        >
                            {status === 'listening' ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
                        </motion.button>

                        <button
                            onClick={() => {
                                stopListening();
                                synthesisRef.current.cancel();
                                if (abortControllerRef.current) abortControllerRef.current.abort();
                                setMessages([]);
                                setStatus('idle');
                            }}
                            className="flex items-center gap-2 px-6 py-4 rounded-full bg-red-500/10 border border-red-500/30 text-rose-500 hover:bg-red-500/20 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg"
                        >
                            <Square className="w-4 h-4 fill-current" /> 
                            <span>Reset Trace</span>
                        </button>
                    </div>

                    {/* Hybrid Text Input Bar */}
                    <div className="w-full max-w-2xl mt-12 relative group">
                        <input 
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && inputValue.trim()) {
                                    handleUserQuery(inputValue.trim());
                                    setInputValue('');
                                    stopListening(); // Mute mic if user types
                                }
                            }}
                            placeholder="Type or speak to interact with Verimind..."
                            className="w-full py-6 px-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 group-hover:border-white/20 focus:border-indigo-500/50 outline-none text-lg font-light transition-all placeholder:text-slate-700 shadow-2xl backdrop-blur-md"
                        />
                        <button 
                            onClick={() => {
                                if (inputValue.trim()) {
                                    handleUserQuery(inputValue.trim());
                                    setInputValue('');
                                    stopListening();
                                }
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
                        >
                            <Zap className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Chat Area */}
                <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-4 space-y-6 pb-20 mt-4">
                    <AnimatePresence mode="popLayout">
                        {messages.map(msg => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: msg.role === 'user' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} w-full`}
                        >
                            <div className={`max-w-[85%] rounded-3xl p-5 md:p-6 shadow-2xl ${
                                msg.role === 'user' 
                                    ? 'bg-white/5 border border-white/10 rounded-tl-none' 
                                    : 'bg-indigo-600/20 border border-indigo-500/20 rounded-tr-none text-right'
                            }`}>
                                <p className={`text-lg md:text-xl font-light leading-relaxed ${msg.role === 'user' ? 'text-slate-300' : 'text-white'}`}>
                                    {msg.content}
                                </p>
                                {msg.id.toString().startsWith('err-') && (
                                    <button 
                                        onClick={() => {
                                             const lastUserMsg = messages.filter(m => m.role === 'user').pop();
                                             if (lastUserMsg) handleUserQuery(lastUserMsg.content, true);
                                        }}
                                        className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 text-[9px] font-black uppercase tracking-wider transition-colors"
                                    >
                                        <RotateCcw className="w-3 h-3" /> Retry Neural Link
                                    </button>
                                )}
                                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest opacity-30">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>

                                {msg.role === 'assistant' && !msg.id.toString().startsWith('err-') && (
                                    <div className="mt-6 flex flex-wrap items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => {
                                                const isPinned = pinnedMessages.includes(msg.id);
                                                setPinnedMessages(prev => isPinned ? prev.filter(id => id !== msg.id) : [...prev, msg.id]);
                                            }}
                                            className={`p-2 rounded-lg border transition-all ${pinnedMessages.includes(msg.id) ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                                            title="Pin insight"
                                        >
                                            {pinnedMessages.includes(msg.id) ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                                        </button>
                                        <button onClick={() => handleUserQuery(`Summarize this: ${msg.content}`)} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">Summarize</button>
                                        <button onClick={() => handleUserQuery(`Give me examples for: ${msg.content}`)} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">Examples</button>
                                        <button onClick={() => handleUserQuery(`Deep dive into this: ${msg.content}`)} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">Deep Dive</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>

                    {/* Active Streaming Content / Thinking Indicator */}
                    {(status === 'thinking' || streamingContent) && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-end w-full"
                        >
                            <div className="max-w-[85%] rounded-3xl p-5 md:p-6 bg-indigo-600/30 border border-indigo-400/30 rounded-tr-none shadow-2xl">
                                {status === 'thinking' && !streamingContent ? (
                                    <div className="flex items-center gap-3 text-indigo-400 p-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-xs font-black uppercase tracking-widest">AI is thinking...</span>
                                    </div>
                                ) : (
                                    <p className="text-xl md:text-2xl font-light leading-relaxed text-right text-white">
                                        {words.map((word, idx) => (
                                            <span 
                                                key={idx} 
                                                className={`inline-block mr-2 mb-1 ${
                                                    idx <= currentSpokenWordIndex 
                                                        ? 'text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                                                        : 'text-white/30'
                                                }`}
                                            >
                                                {word}
                                            </span>
                                        ))}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* Intelligence Preferences Modal */}
            <AnimatePresence>
                {showPrefs && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-md bg-[#120D1D] border border-white/10 p-10 rounded-[3rem] shadow-3xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-white italic tracking-tight">Intelligence Config</h3>
                                <button onClick={() => setShowPrefs(false)} className="p-2 rounded-full hover:bg-white/5 text-slate-500"><X /></button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 block mb-4">Linguistic Focus</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['English', 'Hinglish', 'Hindi'].map(lang => (
                                            <button 
                                                key={lang}
                                                onClick={() => setPrefs(prev => ({ ...prev, language: lang }))}
                                                className={`px-4 py-3 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all ${prefs.language === lang ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-500'}`}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 block mb-4">Neural Bias</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['General', 'Coding', 'Business', 'Creative'].map(interest => (
                                            <button 
                                                key={interest}
                                                onClick={() => setPrefs(prev => ({ ...prev, interest: interest }))}
                                                className={`px-4 py-3 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all ${prefs.interest === interest ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-500'}`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <button 
                                        onClick={() => setSimplifyMode(!simplifyMode)}
                                        className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all ${simplifyMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/5'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${simplifyMode ? 'bg-amber-500 text-white' : 'bg-white/5 text-slate-500'}`}>
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className={`text-xs font-black uppercase tracking-widest ${simplifyMode ? 'text-amber-500' : 'text-slate-300'}`}>ELI5 Mode</p>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Explain like I'm 5</p>
                                            </div>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full relative transition-colors ${simplifyMode ? 'bg-amber-500' : 'bg-slate-700'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${simplifyMode ? 'right-1' : 'left-1'}`} />
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <button onClick={() => setShowPrefs(false)} className="w-full mt-10 py-5 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all">Save Protocols</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
