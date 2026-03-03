import React, { useState } from 'react';
import { FileText, Globe, Loader2, Check, AlertCircle, Sparkles } from 'lucide-react';
import api from '../services/api';

interface SmartProcessingToolbarProps {
    onTextExtracted: (text: string) => void;
}

export const SmartProcessingToolbar: React.FC<SmartProcessingToolbarProps> = ({ onTextExtracted }) => {
    const [url, setUrl] = useState('');
    const [isUrlInputVisible, setIsUrlInputVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleUrlProcess = async () => {
        if (!url) return;
        setLoading(true);
        setStatus('idle');
        try {
            const { data } = await api.post('/api/process/url', { url });
            if (data.text) {
                onTextExtracted(data.text);
                setStatus('success');
                setTimeout(() => setStatus('idle'), 2000);
            }
        } catch (err: any) {
            console.error("URL processing error:", err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setStatus('idle');
        try {
            const { data } = await api.post('/api/process/pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (data.text) {
                onTextExtracted(data.text);
                setStatus('success');
                setTimeout(() => setStatus('idle'), 2000);
            }
        } catch (err) {
            console.error("PDF processing error:", err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setStatus('idle');
        try {
            const { data } = await api.post('/api/process/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (data.text) {
                onTextExtracted(data.text);
                setStatus('success');
                setTimeout(() => setStatus('idle'), 2000);
            }
        } catch (err) {
            console.error("Image processing error:", err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                {/* URL BUTTON */}
                <button
                    onClick={() => setIsUrlInputVisible(!isUrlInputVisible)}
                    className={`p-2 rounded-lg transition-all border ${isUrlInputVisible
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    title="Extract from URL"
                >
                    <Globe size={18} />
                </button>

                {/* PDF BUTTON */}
                <label className="p-2 rounded-lg transition-all bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer" title="Extract from PDF">
                    <FileText size={18} />
                    <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={loading} />
                </label>

                {/* IMAGE BUTTON */}
                <label className="p-2 rounded-lg transition-all bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer" title="Extract from Image">
                    <Sparkles size={18} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={loading} />
                </label>

                {loading && <Loader2 size={16} className="text-indigo-400 animate-spin" />}
                {status === 'success' && <Check size={16} className="text-emerald-400" />}
                {status === 'error' && <AlertCircle size={16} className="text-rose-400" />}
            </div>

            {isUrlInputVisible && (
                <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/5 animate-in slide-in-from-top-1">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste URL here..."
                        className="bg-transparent border-none outline-none text-[11px] text-white px-2 py-1 flex-1 font-medium"
                    />
                    <button
                        onClick={handleUrlProcess}
                        disabled={loading || !url}
                        className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
                    >
                        Extract
                    </button>
                </div>
            )}
        </div>
    );
};
