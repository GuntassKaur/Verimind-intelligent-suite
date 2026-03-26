import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { AIAvatar } from '../components/AIAvatar';
import FloatingParticles from '../components/FloatingParticles';

export default function LiveAI() {
    const { theme } = useTheme();
    const navigate = useNavigate();
    
    // State
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
    const [currentSpokenWordIndex, setCurrentSpokenWordIndex] = useState(-1);
    const [audioLevel, setAudioLevel] = useState(0);
    
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
                
                // If user stops talking for 1.5 seconds, auto-send (made faster)
                silenceTimer = setTimeout(() => {
                    if (currentText.trim()) {
                        recognition.stop();
                        handleUserQuery(currentText.trim());
                        finalTranscript = '';
                        setTranscript('');
                    }
                }, 1500);
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
        const greeting = "Hey 👋 I’m your Verimind AI assistant. Ask me anything — from coding to stock market insights.";
        setAiResponse(greeting);
        textBuffer.current = greeting;
        setStatus('speaking');
        
        // Small delay to ensure voices are loaded
        setTimeout(() => {
            speakChunk(greeting);
        }, 500);
    }, []);

    const words = aiResponse.split(' ');

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
                <div className="relative mb-8 flex flex-col items-center justify-center">
                    <AIAvatar status={status} audioLevel={audioLevel} />
                    
                    {/* Small Mic Button under Robot */}
                    <motion.button
                        onClick={toggleListening}
                        animate={{
                            scale: status === 'listening' ? [1, 1.1, 1] : 1,
                            boxShadow: status === 'listening' 
                                ? ['0 0 10px rgba(239,68,68,0.3)', '0 0 25px rgba(239,68,68,0.6)', '0 0 10px rgba(239,68,68,0.3)']
                                : '0 0 10px rgba(255,255,255,0.05)'
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`mt-10 relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors border ${
                            status === 'listening' 
                            ? 'bg-red-500/20 border-red-500 text-red-500' 
                            : status === 'speaking' || status === 'thinking'
                            ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                    >
                        {status === 'listening' ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                        {status === 'listening' && (
                             <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#0A0514] rounded-full animate-ping" />
                        )}
                    </motion.button>
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
                                    <p className="text-xl md:text-4xl font-light leading-relaxed text-center max-w-4xl mx-auto">
                                        {words.map((word, idx) => (
                                            <motion.span 
                                                key={idx} 
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`transition-colors duration-300 inline-block mr-3 mb-2 ${
                                                    idx <= currentSpokenWordIndex 
                                                        ? 'text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                                                        : 'text-white/30 font-light'
                                                }`}
                                            >
                                                {word}
                                            </motion.span>
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
