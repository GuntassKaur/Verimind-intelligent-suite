import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

const Landing = lazy(() => import('./pages/Landing'));
const UserDashboard = lazy(() => import('./pages/Dashboard'));
const WriteAssistant = lazy(() => import('./pages/WriteAssistant'));
const TruthChecker = lazy(() => import('./pages/TruthChecker'));
const Humanizer = lazy(() => import('./pages/Humanizer'));
const TypingLab = lazy(() => import('./pages/TypingLab'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Settings = lazy(() => import('./pages/Settings'));

export default function App() {
    return (
        <ThemeProvider>
            <Suspense fallback={
                <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050510]">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 blur-3xl bg-purple-500/20 animate-pulse rounded-full" />
                        <span className="text-4xl font-black text-purple-500 animate-pulse">VM</span>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl border bg-white/5 border-white/10">
                        <Loader2 className="animate-spin text-purple-400" size={16} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Initializing Neural Matrix...</span>
                    </div>
                </div>
            }>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Landing />} />
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/write" element={<WriteAssistant />} />
                        <Route path="/check" element={<TruthChecker />} />
                        <Route path="/humanize" element={<Humanizer />} />
                        <Route path="/typing" element={<TypingLab />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </Suspense>
        </ThemeProvider>
    );
}

