import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputProps {
    onTranscription: (text: string) => void;
    placeholder?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription }) => {
    const [isListening, setIsListening] = useState(false);
    const [supported, setSupported] = useState(true);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSupported(false);
            return;
        }

        const recognizer = new SpeechRecognition();
        recognizer.continuous = false;
        recognizer.interimResults = true;
        recognizer.lang = 'en-US';

        recognizer.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((result: any) => result[0])
                .map((result: any) => result.transcript)
                .join('');

            if (event.results[0].isFinal) {
                onTranscription(transcript);
                setIsListening(false);
            }
        };

        recognizer.onerror = () => {
            setIsListening(false);
        };

        recognizer.onend = () => {
            setIsListening(false);
        };

        setRecognition(recognizer);
    }, [onTranscription]);

    const toggleListening = () => {
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    if (!supported) return null;

    return (
        <div className="relative inline-block">
            <button
                onClick={toggleListening}
                className={`p-2 rounded-lg transition-all flex items-center gap-2 ${isListening
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5 hover:bg-white/10'
                    }`}
                title={isListening ? 'Stop Listening' : 'Start Voice Input'}
            >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                <AnimatePresence>
                    {isListening && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="text-[10px] font-black uppercase tracking-widest overflow-hidden whitespace-nowrap"
                        >
                            Listening...
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>
        </div>
    );
};
