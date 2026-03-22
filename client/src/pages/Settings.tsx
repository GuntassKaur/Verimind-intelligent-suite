import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Shield, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 pb-32">
            <header>
                <h1 className={`text-4xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Workspace Settings</h1>
                <p className="text-slate-500 font-medium italic">"Customize your intelligence environment."</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Theme Setting */}
                <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#1E293B] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-xl tablet:shadow-soft'}`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-2xl ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                            <SettingsIcon size={24} />
                        </div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Appearance</h3>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 border border-white/5 transition-colors">
                        <div className="flex flex-col">
                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Dark Mode Engineering</span>
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Toggle primary system theme</span>
                        </div>
                        <button 
                            onClick={toggleTheme}
                             className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                            <motion.div 
                                animate={{ x: isDark ? 24 : 4 }}
                                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md"
                            />
                        </button>
                    </div>
                </div>

                {/* Account Security Placeholder */}
                <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#1E293B] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'}`}>
                     <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-2xl ${isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                            <Shield size={24} />
                        </div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Security Vault</h3>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-widest leading-loose">Biometric authentication and DNA verification modules are currently in early testing phase.</p>
                </div>
            </div>
        </div>
    );
}
