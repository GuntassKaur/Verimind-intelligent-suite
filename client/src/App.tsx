import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

const Landing = lazy(() => import('./pages/Landing'));
const LiveAI = lazy(() => import('./pages/LiveAI'));
const UserDashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Settings = lazy(() => import('./pages/Settings'));
const TruthAudit = lazy(() => import('./pages/TruthAudit'));
const Plagiarism = lazy(() => import('./pages/Plagiarism'));
const Humanizer = lazy(() => import('./pages/Humanizer'));
const Visualizer = lazy(() => import('./pages/Visualizer'));
const Workspace = lazy(() => import('./pages/Workspace'));
const Comparison = lazy(() => import('./pages/Comparison'));
const PPTGenerator = lazy(() => import('./pages/PPTGenerator'));
const TypingLab = lazy(() => import('./pages/TypingLab'));
const NeuralForge = lazy(() => import('./pages/NeuralForge'));
const NeuralSpark = lazy(() => import('./pages/NeuralSpark'));

export default function App() {
    return (
        <ThemeProvider>
            <Suspense fallback={
                <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0B0F19]">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 blur-3xl bg-indigo-500/20 animate-pulse rounded-full" />
                        <span className="text-4xl font-black text-indigo-500 animate-pulse">VM</span>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl border bg-white/5 border-white/10">
                        <Loader2 className="animate-spin text-indigo-400" size={16} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Neural Link Initializing...</span>
                    </div>
                </div>
            }>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Landing />} />
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/live-ai" element={<LiveAI />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/audit" element={<TruthAudit />} />
                        <Route path="/plagiarism" element={<Plagiarism />} />
                        <Route path="/typing-lab" element={<TypingLab />} />
                        <Route path="/ppt" element={<PPTGenerator />} />
                        <Route path="/visualizer" element={<Visualizer />} />
                        <Route path="/workspace" element={<Workspace />} />
                        <Route path="/humanizer" element={<Humanizer />} />
                        <Route path="/comparison" element={<Comparison />} />
                        <Route path="/forge" element={<NeuralForge />} />
                        <Route path="/spark" element={<NeuralSpark />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </Suspense>
        </ThemeProvider>
    );
}
