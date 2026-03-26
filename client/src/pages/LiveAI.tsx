import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Activity, X, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function LiveAI() {
    const { theme } = useTheme();
    const navigate = useNavigate();
    
    // State
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
    const [currentSpokenWordIndex, setCurrentSpokenWordIndex] = useState(-1);
    
    // Refs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesis>(window.speechSynthesis);
    const textBuffer = useRef('');
    const spokenBuffer = useRef('');
    const abortControllerRef = useRef<AbortController | null>(null);

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
                
                // If user stops talking for 2 seconds, auto-send
                silenceTimer = setTimeout(() => {
                    if (currentText.trim()) {
                        recognition.stop();
                        handleUserQuery(currentText.trim());
                        finalTranscript = '';
                        setTranscript('');
                    }
                }, 2000);
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
                 // Calculate roughly which word we are currently at in the chunk
                 // To implement word-by-word highlight, we'd need more complex logic mapping the utterance bounds to the full text
                 // For now, we update an index based on spoken buffer length
                 const wordsSoFar = (spokenBuffer.current + event.charIndex).split(' ').length;
                 setCurrentSpokenWordIndex(wordsSoFar);
            }
        };

        utterance.onend = () => {
            spokenBuffer.current += text + " ";
            // Check if queue is empty and stream is done
            if (!synthesisRef.current.pending && status !== 'thinking') {
                setStatus('listening');
                startListening();
            }
        };
        
        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
        };

        synthesisRef.current.speak(utterance);
    };

    const handleUserQuery = async (query: string) => {
        setStatus('thinking');
        setAiResponse('');
        textBuffer.current = '';
        spokenBuffer.current = '';
        setCurrentSpokenWordIndex(-1);
        synthesisRef.current.cancel(); // Stop any current speech
        
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch('/api/ai/assistant-stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: query, wpm: 0 }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            let tempSentenceBuffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '').trim();
                        if (dataStr === '[DONE]') break;
                        
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.chunk) {
                                textBuffer.current += data.chunk;
                                tempSentenceBuffer += data.chunk;
                                
                                setAiResponse(textBuffer.current);
                                
                                // Speak when a natural pause is reached
                                if (/[.!?\n]/.test(data.chunk)) {
                                    const naturalPauseStr = tempSentenceBuffer.trim();
                                    if (naturalPauseStr) {
                                        speakChunk(naturalPauseStr);
                                    }
                                    tempSentenceBuffer = "";
                                }
                            }
                        } catch (_) {
                            // parse error for incomplete JSON chunk
                        }
                    }
                }
            }
            
            // Speak any remaining text
            if (tempSentenceBuffer.trim()) {
                speakChunk(tempSentenceBuffer.trim());
            }

        } catch (error) {
            console.error('Error fetching live response:', error);
            setStatus('idle');
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
    
    // Auto-start on mount
    useEffect(() => {
        startListening();
    }, []);

    const words = aiResponse.split(' ');

    return (
        <div className={`fixed inset-0 z-[1000] flex flex-col ${theme === 'dark' ? 'bg-[#0A0514] text-white' : 'bg-slate-900 text-white'}`}>
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

            {/* Main Center Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full max-w-4xl mx-auto p-8">
                
                {/* Visualizer / Avatar Area */}
                <div className="relative mb-16 flex items-center justify-center h-64">
                    {/* Glowing outer rings */}
                    <motion.div 
                        animate={{ 
                            scale: status === 'speaking' ? [1, 1.2, 1] : status === 'listening' ? [1, 1.05, 1] : 1,
                            opacity: status === 'speaking' ? [0.5, 0.8, 0.5] : 0.3
                        }}
                        transition={{ 
                            duration: status === 'speaking' ? 1.5 : 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 border-2 border-indigo-500/30 rounded-full"
                    />
                    
                    <motion.div 
                        animate={{ 
                            scale: status === 'speaking' ? [1, 1.5, 1] : status === 'listening' ? [1, 1.1, 1] : 1,
                        }}
                        transition={{ 
                            duration: status === 'speaking' ? 1 : 2.5, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-4 border border-purple-500/20 rounded-full"
                    />

                    {/* Central Orb / Button */}
                    <button
                        onClick={toggleListening}
                        className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(79,70,229,0.3)] transition-all overflow-hidden ${
                            status === 'listening' 
                            ? 'bg-red-500/20 border-2 border-red-500 shadow-[0_0_60px_rgba(239,68,68,0.4)]' 
                            : status === 'speaking'
                            ? 'bg-indigo-600/20 border-2 border-indigo-400 shadow-[0_0_60px_rgba(129,140,248,0.4)]'
                            : 'bg-white/5 border border-white/10'
                        }`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-tr ${status === 'listening' ? 'from-red-600/20 to-orange-500/20' : 'from-indigo-600/20 to-purple-600/20'} animate-[spin_4s_linear_infinite]`} />
                        
                        {status === 'thinking' ? (
                            <Loader2 className="w-12 h-12 text-indigo-400 animate-spin relative z-10" />
                        ) : status === 'speaking' ? (
                            <Activity className="w-12 h-12 text-indigo-400 relative z-10" />
                        ) : status === 'listening' ? (
                            <Mic className="w-12 h-12 text-red-500 relative z-10" />
                        ) : (
                            <MicOff className="w-12 h-12 text-slate-500 relative z-10" />
                        )}
                    </button>
                    
                    {/* Live Waveform placeholder for speaking */}
                    {status === 'speaking' && (
                        <div className="absolute top-1/2 left-[calc(50%+80px)] -translate-y-1/2 flex items-end gap-1 h-12">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={`r-${i}`}
                                    animate={{ height: ['20%', '100%', '20%'] }}
                                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                    className="w-1.5 bg-indigo-500/80 rounded-full"
                                />
                            ))}
                        </div>
                    )}
                    {status === 'speaking' && (
                        <div className="absolute top-1/2 right-[calc(50%+80px)] -translate-y-1/2 flex items-end gap-1 h-12">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={`l-${i}`}
                                    animate={{ height: ['20%', '100%', '20%'] }}
                                    transition={{ duration: 0.8, repeat: Infinity, delay: (4-i) * 0.1 }}
                                    className="w-1.5 bg-indigo-500/80 rounded-full"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Subtitles Area */}
                <div className="w-full text-center space-y-6">
                    {/* User Transcript */}
                    <AnimatePresence>
                        {(transcript || status === 'listening') && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="min-h-[60px]"
                            >
                                <p className="text-xl md:text-2xl font-medium text-slate-300">
                                    {transcript || <span className="text-slate-600 animate-pulse italic">Listening...</span>}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* AI Response Text (Live Captions) */}
                    <AnimatePresence>
                        {(aiResponse || status === 'thinking') && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl max-h-[40vh] overflow-y-auto"
                            >
                                {status === 'thinking' && !aiResponse ? (
                                    <div className="flex items-center justify-center gap-3 text-indigo-400">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="font-bold tracking-widest text-sm uppercase">Synthesizing Logic...</span>
                                    </div>
                                ) : (
                                    <p className="text-lg md:text-3xl font-light leading-relaxed text-left max-w-3xl mx-auto shadow-sm">
                                        {words.map((word, idx) => (
                                            <span 
                                                key={idx} 
                                                className={`transition-colors duration-200 inline-block mr-2 mb-2 ${
                                                    idx <= currentSpokenWordIndex 
                                                        ? 'text-white font-normal' 
                                                        : 'text-slate-500 font-light'
                                                }`}
                                            >
                                                {word}
                                            </span>
                                        ))}
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Controls / Status */}
            <div className="relative z-10 p-6 flex justify-center pb-12">
                 <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                     {status === 'listening' ? 'Speak naturally. Pauses are detected automatically.' : 'Verimind Autonomous Mode'}
                 </p>
            </div>
        </div>
    );
}
